import { NextRequest, NextResponse } from 'next/server'

// Configuração
const WINDOW_MS = 60_000
const LIMIT = 10 // máx. 10 requisições por janela/cliente
const RL_SECRET = process.env.RL_SECRET || ''

function sign(data: string){
  if(!RL_SECRET) return data
  const enc = new TextEncoder()
  const key = enc.encode(RL_SECRET)
  // HMAC-SHA256 manual não disponível no edge runtime sem crypto.subtle -> usar btoa simplificado
  // ATENÇÃO: assinatura fraca; suficiente para proteção leve sem segredos sensíveis
  let hash = 0
  for(let i=0;i<data.length;i++){ hash = ((hash<<5)-hash) + data.charCodeAt(i) }
  for(let i=0;i<key.length;i++){ hash = ((hash<<5)-hash) + key[i] }
  return data + '.' + (hash>>>0)
}

function verify(payload: string){
  if(!RL_SECRET) return true
  const lastDot = payload.lastIndexOf('.')
  if(lastDot<0) return false
  const base = payload.slice(0,lastDot)
  return sign(base) === payload
}

export const config = {
  matcher: ['/api/:path*']
}

export function middleware(req: NextRequest){
  const url = new URL(req.url)
  const pathname = url.pathname
  const method = req.method.toUpperCase()

  // Só limitar POST dos endpoints de formulário
  const shouldLimit = method === 'POST' && (
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/distribuidores') ||
    pathname.startsWith('/api/contato')
  )
  if(!shouldLimit) return NextResponse.next()

  const ip = req.ip || req.headers.get('x-forwarded-for') || '0.0.0.0'
  const key = `rl_${pathname}_${ip}`

  const cookie = req.cookies.get(key)?.value
  let count = 0
  let start = Date.now()

  if(cookie && verify(cookie)){
    const parts = cookie.split('.')
    try{
      const payload = JSON.parse(atob(parts[0]))
      count = Number(payload.c)||0
      start = Number(payload.s)||Date.now()
    }catch(_){/* no-op */}
  }

  const now = Date.now()
  if(now - start > WINDOW_MS){
    count = 0
    start = now
  }
  count += 1

  if(count > LIMIT){
    return new NextResponse(JSON.stringify({ error: 'rate_limited', retry_after_ms: WINDOW_MS - (now - start) }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const payload = btoa(JSON.stringify({ c: count, s: start }))
  const signed = sign(payload)
  const res = NextResponse.next()
  res.cookies.set(key, signed, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  res.headers.set('X-RateLimit-Limit', String(LIMIT))
  res.headers.set('X-RateLimit-Remaining', String(Math.max(0, LIMIT - count)))
  res.headers.set('X-RateLimit-Reset', String(start + WINDOW_MS))
  return res
}

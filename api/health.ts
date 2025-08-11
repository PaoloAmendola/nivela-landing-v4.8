import { withSentry } from './_sentry'
import { createClient } from '@supabase/supabase-js'

async function handler(req, res){
  const startedAt = Date.now()
  try {
    const url = process.env.SUPABASE_URL as string
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE as string
    if (!url || !serviceRole) {
      return res.status(500).json({ ok: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env' })
    }

    const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })

    // HEAD count queries → sem retorno de dados sensíveis
    const leads = await supabase.from('leads').select('id', { count: 'exact', head: true })
    const dist = await supabase.from('distribuidores').select('id', { count: 'exact', head: true })

    const elapsed = Date.now() - startedAt
    return res.status(200).json({
      ok: true,
      env: {
        SUPABASE_URL: !!url,
        SUPABASE_SERVICE_ROLE: !!serviceRole
      },
      db: {
        leads_count_available: leads?.count ?? null,
        distribuidores_count_available: dist?.count ?? null,
        leads_error: leads.error?.message ?? null,
        distribuidores_error: dist.error?.message ?? null
      },
      system: {
        node: process.version,
        elapsed_ms: elapsed,
        now: new Date().toISOString()
      }
    })
  } catch (e:any) {
    return res.status(500).json({ ok: false, error: e?.message || 'healthcheck failed' })
  }
}

export default withSentry(handler)

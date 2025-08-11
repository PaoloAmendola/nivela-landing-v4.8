import { withSentry } from './_sentry'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE as string,
  { auth: { persistSession: false } }
)

async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
  try {
    const { nome, email, mensagem, telefone } = req.body || {}
    if (!nome || !email) return res.status(400).json({ error: 'Campos obrigatórios: nome, email' })
    const payload = {
      nome: String(nome).trim(),
      email: String(email).toLowerCase().trim(),
      telefone: telefone ? String(telefone).trim() : null,
      tipo: 'contato',
      origem: 'contato-form'
    }
    const { data, error } = await supabase.from('leads').insert(payload).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ok: true, contato: data })
  } catch (e:any) {
    return res.status(500).json({ error: e.message || 'Erro interno' })
  }
}

export default withSentry(handler)

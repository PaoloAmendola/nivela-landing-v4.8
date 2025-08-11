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
    const { nome_responsavel, email, telefone, cidade, estado, site, instagram, observacoes, origem } = req.body || {}
    if (!nome_responsavel || !email) return res.status(400).json({ error: 'Campos obrigatórios: nome_responsavel, email' })
    const payload = {
      nome_responsavel: String(nome_responsavel).trim(),
      email: String(email).toLowerCase().trim(),
      telefone: telefone ? String(telefone).trim() : null,
      cidade: cidade ? String(cidade).trim() : null,
      estado: estado ? String(estado).trim() : null,
      site: site ? String(site).trim() : null,
      instagram: instagram ? String(instagram).trim() : null,
      observacoes: observacoes ? String(observacoes).trim() : null,
      origem: origem ?? 'landing-nivela'
    }
    const { data, error } = await supabase.from('distribuidores').insert(payload).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ok: true, distribuidor: data })
  } catch (e:any) {
    return res.status(500).json({ error: e.message || 'Erro interno' })
  }
}

export default withSentry(handler)

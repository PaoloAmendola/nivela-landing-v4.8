
const BASE = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '') ?? ''
const PUBLIC_PREFIX = '/storage/v1/object/public'
function joinUrl(...parts: string[]) {
  return parts.map(p => String(p ?? '').trim()).filter(Boolean).join('/').replace(/\/{2,}/g, '/').replace(':/','://')
}
export function storageUrl(bucket: string, path: string) {
  const base = BASE.replace(/\/+$/, '')
  const cleanBucket = String(bucket||'').replace(/\/+/, '').trim()
  const cleanPath = String(path||'').replace(/^\/+/, '').trim()
  return joinUrl(base, PUBLIC_PREFIX, cleanBucket, cleanPath)
}

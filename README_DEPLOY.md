
# NIVELA Landing v4 – Deploy Rápido

## 1) Variáveis de ambiente
- Vercel (Production):
  - SUPABASE_URL = https://wsjrasprpcwkwmcbfdpv.supabase.co
  - SUPABASE_SERVICE_ROLE = <preencher no painel>

- Replit (.env.local):
  - VITE_SUPABASE_URL = https://wsjrasprpcwkwmcbfdpv.supabase.co
  - VITE_SUPABASE_ANON_KEY = <sua anon>

## 2) Instalar e rodar
npm install
npm run build
npm run preview

## 3) Deploy Vercel
- vercel.json já define:
  - buildCommand: npm run build
  - outputDirectory: dist
  - functions.api/**/*: nodejs20.x
  - headers (CSP)

## 4) Testes
curl -i https://SEUAPP.vercel.app/api/ping
curl -i -X POST https://SEUAPP.vercel.app/api/leads -H "Content-Type: application/json" -d '{"nome":"Teste","email":"t@t.com"}'
curl -i -X POST https://SEUAPP.vercel.app/api/distribuidores -H "Content-Type: application/json" -d '{"nome_responsavel":"Ana","email":"ana@ex.com"}'


# Env (Vercel / Replit)

## Vercel (Production)
SUPABASE_URL=https://wsjrasprpcwkwmcbfdpv.supabase.co
SUPABASE_SERVICE_ROLE=<COLOQUE_AQUI_NO_PAINEL_DA_VERCEL>

## Replit / Front (.env.local)
VITE_SUPABASE_URL=https://wsjrasprpcwkwmcbfdpv.supabase.co
VITE_SUPABASE_ANON_KEY=<SUA_ANON_KEY>


# Observabilidade / Sentry
# Front (Vite)
VITE_SENTRY_DSN=<opcional: DSN do projeto Sentry para o front>
VITE_SENTRY_ENV=production

# Server (APIs)
SENTRY_SERVER_DSN=<opcional: DSN do projeto Sentry para server>
SENTRY_ENV=production

# Rate limit leve (Edge Middleware)
RL_SECRET=<uma string aleatória para assinar o cookie de rate limit>

# Sentry + Rate Limit

## Sentry
- **Front (Vite/React):** defina `VITE_SENTRY_DSN` e `VITE_SENTRY_ENV`. Inicialização em `src/sentry.client.ts` (importado em `src/main.tsx`).
- **APIs (Vercel Functions):** defina `SENTRY_SERVER_DSN` (ou `SENTRY_DSN`) e `SENTRY_ENV`. Wrapper em `api/_sentry.ts` e aplicado automaticamente a todos os handlers.

## Rate Limit (leve – Edge Middleware)
- Middleware em `middleware.ts` limita **POST** em `/api/leads`, `/api/distribuidores`, `/api/contato` a **10 req/min por IP**.
- Armazenamento via **cookie assinado** (`RL_SECRET`) — proteção leve, sem persistência externa.
- Cabeçalhos de controle: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- Ajuste `LIMIT`/`WINDOW_MS` conforme necessidade.

## CSP
CSP atual libera Supabase, GTM/GA4 e Sentry (ingest/cdn). Se adicionar outras ferramentas, ajuste `vercel.json`.

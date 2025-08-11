import * as Sentry from "@sentry/node"

export function withSentry(handler: Function){
  return async function(req, res){
    try{
      const dsn = process.env.SENTRY_SERVER_DSN || process.env.SENTRY_DSN || ""
      if (dsn && !Sentry.isInitialized()) {
        Sentry.init({
          dsn,
          environment: process.env.SENTRY_ENV || "production",
          tracesSampleRate: 0.1,
        })
      }
      return await handler(req, res)
    } catch (err:any){
      try {
        Sentry.captureException(err)
        await Sentry.flush(1500)
      } catch(_e){ /* no-op */ }
      res.status(500).json({ error: err?.message || 'Erro interno' })
    }
  }
}

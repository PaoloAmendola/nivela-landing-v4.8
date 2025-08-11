import * as Sentry from "@sentry/browser"

const DSN = import.meta.env.VITE_SENTRY_DSN || ""
if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.VITE_SENTRY_ENV || "production",
    tracesSampleRate: 0.15,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.1,
    integrations: [Sentry.browserTracingIntegration()]
  })
  // opcional: log inicial
  Sentry.setTag('app', 'nivela-landing')
}

import { withSentry } from './_sentry'
function handler(req,res){ return res.status(200).json({ ok: true, ts: Date.now() }) }

export default withSentry(handler)

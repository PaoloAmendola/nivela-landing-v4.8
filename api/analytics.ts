import { withSentry } from './_sentry'
async function handler(req,res){ if(req.method!=='POST') return res.status(405).json({error:'Method Not Allowed'}); return res.status(200).json({ok:true,received:true}) }

export default withSentry(handler)

import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json())

const TOKEN = process.env.BOT_TOKEN
const MAX_AGE = 60 * 60

function verifyInitData(initData) {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null
  params.delete('hash')

  const checkString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secret = crypto.createHmac('sha256', 'WebAppData').update(TOKEN).digest()
  const calc = crypto.createHmac('sha256', secret).update(checkString).digest('hex')

  const a = Buffer.from(calc)
  const b = Buffer.from(hash)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  const age = Math.floor(Date.now() / 1000) - Number(params.get('auth_date'))
  if (age > MAX_AGE) return null

  return JSON.parse(params.get('user'))
}

function auth(req, res, next) {
  const user = verifyInitData(req.get('x-init-data') || '')
  if (!user) return res.status(401).json({ error: 'initData yaroqsiz' })
  req.user = user
  next()
}

app.get('/api/me', auth, (req, res) => res.json({ user: req.user }))

app.post('/api/notify', auth, async (req, res) => {
  const text = String(req.body.text || '').slice(0, 500)
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: req.user.id, text }),
  })
  res.status(r.ok ? 200 : 502).json({ ok: r.ok })
})

app.listen(process.env.PORT, () => console.log('Server ishlayapti: ' + process.env.PORT))
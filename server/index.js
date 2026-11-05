
import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-init-data')

  if (req.method === 'OPTIONS') return res.sendStatus(204)

  next()
})

const TOKEN = process.env.BOT_TOKEN
const MAX_AGE = 60 * 60

const WEB_APP_URL =
  process.env.WEB_APP_URL || 'https://odatlarapp.vercel.app/'

// Telegram initData tekshirish
function verifyInitData(initData) {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')

  if (!hash) return null

  params.delete('hash')

  const checkString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(TOKEN)
    .digest()

  const calc = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')

  const a = Buffer.from(calc)
  const b = Buffer.from(hash)

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null
  }

  const age = Math.floor(Date.now() / 1000) -
    Number(params.get('auth_date'))

  if (age > MAX_AGE || age < 0) return null

  return JSON.parse(params.get('user'))
}

// Auth middleware
function auth(req, res, next) {
  const user = verifyInitData(req.get('x-init-data') || '')

  if (!user) {
    console.log('initData yaroqsiz')
    return res.status(401).json({ error: 'initData yaroqsiz' })
  }

  req.user = user
  next()
}

// Telegram API
async function callApi(method, body) {
  const r = await fetch(
    `https://api.telegram.org/bot${TOKEN}/${method}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  return r.json()
}

// DOIMIY MENU BUTTON
async function setMenuButton() {
  const data = await callApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'Открыть',
      web_app: {
        url: WEB_APP_URL,
      },
    },
  })

  if (data.ok) {
    console.log('Menu Button muvaffaqiyatli o‘rnatildi!')
  } else {
    console.log('Menu Button xatosi:', data.description)
  }
}

// Health check
app.get('/healthz', (req, res) => {
  res.send('ok')
})

// User ma'lumotlari
app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user })
})

// Botga xabar yuborish
app.post('/api/notify', auth, async (req, res) => {
  const text = String(req.body.text || '').slice(0, 500)

  console.log('notify keldi, user:', req.user.id)

  const data = await callApi('sendMessage', {
    chat_id: req.user.id,
    text,
  })

  console.log('Telegram javobi:', data.ok, data.description || '')

  res.status(data.ok ? 200 : 502).json({ ok: data.ok })
})

// /start komandasi
async function handleMessage(msg) {
  const text = msg.text || ''

  if (text.startsWith('/start')) {
    const name = msg.from.first_name

    await callApi('sendMessage', {
      chat_id: msg.chat.id,

      text: `Salom, ${name}! 👋

Kichik odatlar katta natija beradi. Har kuni belgilab bor, seriyani uzma! 🔥`,

      // ESKI TUGMA SAQLANADI
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🌱 Ilovani ochish',
              web_app: {
                url: WEB_APP_URL,
              },
            },
          ],
        ],
      },
    })
  }
}

// Telegram polling
let offset = 0

async function poll() {
  while (true) {
    try {
      const res = await callApi('getUpdates', {
        offset,
        timeout: 30,
      })

      if (!res.ok) {
        console.log('Telegram xatosi:', res.description)

        await new Promise((r) => setTimeout(r, 5000))
        continue
      }

      for (const u of res.result || []) {
        offset = u.update_id + 1

        if (u.message) {
          await handleMessage(u.message)
        }
      }
    } catch (e) {
      console.log('Poll xatosi:', e.message)

      await new Promise((r) => setTimeout(r, 3000))
    }
  }
}

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log('Server ishlayapti:', PORT)

  // Doimiy ko‘k tugmani o‘rnatish
  await setMenuButton()

  // Botni ishga tushirish
  poll()
})

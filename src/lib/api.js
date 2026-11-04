import { tg, inTelegram } from './telegram'

const API = 'https://odatlar-server.onrender.com'

export function notify(text) {
  if (!inTelegram) return
  fetch(`${API}/api/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-init-data': tg.initData },
    body: JSON.stringify({ text }),
  })
}
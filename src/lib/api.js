import { tg, inTelegram } from './telegram'

const API = 'https://odatlar-server.onrender.com'

export async function notify(text) {
  if (!inTelegram) return
  try {
    const r = await fetch(`${API}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-init-data': tg.initData },
      body: JSON.stringify({ text }),
    })
    if (!r.ok) tg.showAlert('Server javobi: ' + r.status)
  } catch (e) {
    tg.showAlert('Ulanish xatosi: ' + e.message)
  }
}
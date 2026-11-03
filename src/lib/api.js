import { tg, inTelegram } from './telegram'

export function notify(text) {
  if (!inTelegram) return
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-init-data': tg.initData },
    body: JSON.stringify({ text }),
  })
}
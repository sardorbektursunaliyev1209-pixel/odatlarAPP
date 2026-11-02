import { tg, inTelegram } from './telegram'

const useCloud = () => inTelegram && tg.isVersionAtLeast('6.9')

export function loadJSON(key, fallback) {
  return new Promise((resolve) => {
    if (useCloud()) {
      tg.CloudStorage.getItem(key, (err, val) => {
        if (err || !val) return resolve(fallback)
        try { resolve(JSON.parse(val)) } catch { resolve(fallback) }
      })
    } else {
      const v = localStorage.getItem(key)
      resolve(v ? JSON.parse(v) : fallback)
    }
  })
}

export function saveJSON(key, value) {
  const s = JSON.stringify(value)
  if (useCloud()) tg.CloudStorage.setItem(key, s)
  else localStorage.setItem(key, s)
}
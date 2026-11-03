export const tg = window.Telegram.WebApp
export const inTelegram = Boolean(tg.initData)

let hapticOn = true
export const setHaptic = (v) => { hapticOn = v }

export const haptic = {
  impact: (s = 'light') => hapticOn && inTelegram && tg.HapticFeedback.impactOccurred(s),
  notify: (s = 'success') => hapticOn && inTelegram && tg.HapticFeedback.notificationOccurred(s),
  select: () => hapticOn && inTelegram && tg.HapticFeedback.selectionChanged(),
}

export function initTelegram() {
  tg.ready()
  tg.expand()
  if (tg.isVersionAtLeast('7.7')) tg.disableVerticalSwipes()
  if (inTelegram) {
    tg.setHeaderColor('secondary_bg_color')
    tg.setBackgroundColor('bg_color')
  }
}

export function getUser() {
  return tg.initDataUnsafe.user?.first_name ?? 'Mehmon'
}

export function confirmDialog(message) {
  return new Promise((resolve) => {
    if (inTelegram) tg.showConfirm(message, resolve)
    else resolve(window.confirm(message))
  })
}
export function openLink(url) {
  if (inTelegram) tg.openLink(url)
  else window.open(url, '_blank')
}

export function openTelegramLink(url) {
  if (inTelegram) tg.openTelegramLink(url)
  else window.open(url, '_blank')
}
export const canAddToHome = inTelegram && tg.isVersionAtLeast('8.0')

export function addToHome() {
  if (canAddToHome) tg.addToHomeScreen()
}
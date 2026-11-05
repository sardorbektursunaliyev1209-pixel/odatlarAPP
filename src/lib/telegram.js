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
    if (tg.isVersionAtLeast('7.10')) tg.setBottomBarColor('bg_color')
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
export function onThemeChange(cb) {
  if (!inTelegram) return () => {}
  tg.onEvent('themeChanged', cb)
  return () => tg.offEvent('themeChanged', cb)
}

export function alertDialog(message) {
  return new Promise((resolve) => {
    if (inTelegram) tg.showAlert(message, resolve)
    else { window.alert(message); resolve() }
  })
}

export function popupDialog({ title, message, buttons }) {
  return new Promise((resolve) => {
    if (inTelegram) tg.showPopup({ title, message, buttons }, (id) => resolve(id))
    else resolve(window.confirm(message) ? buttons[0].id : null)
  })
}
// --- Ovoz effektlari uchun qo'shimcha ---
let soundOn = true
export const setSound = (v) => { soundOn = v }

export const playClickSound = () => {
    if (!soundOn) return
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
        console.error("Ovoz chiqarishda xatolik:", e);
    }
};
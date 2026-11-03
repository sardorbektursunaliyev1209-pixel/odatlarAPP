# Odatlar: Telegram Mini App (odatlar trekeri)

Kunlik odatlarni belgilab, seriyani (streak) kuzatadigan Telegram Mini App.
React + Vite + Tailwind, backend: Node.js (Express).

- Bot: https://t.me/mening_odatlarim_bot
- Mini App: https://t.me/mening_odatlarim_bot/habits
- Frontend: https://odatlarapp.vercel.app/

## Ekranlar
1. Bosh ekran: bugungi progress, odatlar ro'yxati
2. Yangi odat qo'shish (forma)
3. Odat detali (hafta, seriya)
4. Sozlamalar (vibratsiya, havolalar)

## Ishga tushirish
```bash
npm install
npm run dev
```

Server (`initData` tekshiruvi va bot xabari):
```bash
cd server
npm install
node index.js
```
`server/.env` fayli:
```
BOT_TOKEN=bot_tokeni
PORT=3001
```
`.env` repoga qo'shilmagan. Bot tokeni faqat serverda turadi.
Holat: server hozircha lokal ishga tushiriladi, internetga joylanmagan.

## Ishlatilgan Telegram API metodlari
| Metod | Fayl |
|---|---|
| `ready()`, `expand()`, `isVersionAtLeast()`, `disableVerticalSwipes()` | `src/lib/telegram.js` |
| `setHeaderColor()`, `setBackgroundColor()` | `src/lib/telegram.js` |
| `MainButton` (setParams, show, hide, showProgress, onClick, offClick) | `src/components/Bar.jsx` |
| `SecondaryButton` (position: left) | `src/components/Bar.jsx` |
| `BackButton`, `SettingsButton` | `src/App.jsx` |
| `HapticFeedback` (impact, notification, selection) | `src/lib/telegram.js` |
| Vibratsiyani o'chirish switch'i | `src/screens/Settings.jsx` |
| `showConfirm` | `src/lib/telegram.js`, `src/screens/Detail.jsx` |
| `enableClosingConfirmation()` | `src/screens/AddHabit.jsx` |
| `themeParams` CSS o'zgaruvchilari | `src/index.css` |
| `initDataUnsafe.user` (ism) | `src/lib/telegram.js` |
| `initData` (HMAC-SHA256, `auth_date`) | `server/index.js` |
| `openLink` | `src/lib/telegram.js`, `src/screens/Settings.jsx` |
| `openTelegramLink` | `src/lib/telegram.js`, `src/screens/Settings.jsx` |
| `addToHomeScreen` | `src/lib/telegram.js`, `src/screens/Settings.jsx` |

## Saqlash joylari
- **CloudStorage:** odatlar ro'yxati va sozlamalar, qurilmalar o'rtasida sinxron (`src/lib/storage.js`).
- **localStorage:** Telegramdan tashqarida (brauzerda) ishlaganda zaxira.
- DeviceStorage va SecureStorage ishlatilmagan.

## Xavfsizlik
- `initData` serverda HMAC-SHA256 bilan tekshiriladi, `auth_date` 1 soatdan eski bo'lsa rad etiladi.
- Bot tokeni klient kodida yo'q, faqat `server/.env` da.
import {
  haptic,
  openLink,
  openTelegramLink,
  canAddToHome,
  addToHome,
  playClickSound,
  setSound, // <-- Ovoz sozlamasini boshqarish uchun
} from "../lib/telegram";

export default function Settings({ settings, onChange }) {
  return (
    <div>
      {/* Vibratsiya sozlamasi */}
      <div className="flex items-center justify-between border-b border-black/10 py-3">
        <div>
          <div className="font-medium">Vibratsiya</div>
          <div className="hint text-sm">Haptic javob</div>
        </div>
        <button
          onClick={() => {
            onChange({ ...settings, vibration: !settings.vibration });
            haptic.impact("medium");
          }}
          aria-label="Vibratsiya"
          className={`relative h-6 w-11 rounded-full ${settings.vibration ? "bg-green-500" : "bg-gray-400"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${settings.vibration ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>

      {/* Ovoz (Sound) sozlamasi */}
      <div className="flex items-center justify-between border-b border-black/10 py-3">
        <div>
          <div className="font-medium">Ovoz effektlari</div>
          <div className="hint text-sm">Tugma bosilganda ovoz chiqarish</div>
        </div>
        <button
          onClick={() => {
            const newSoundState = !settings.sound;
            onChange({ ...settings, sound: newSoundState });
            setSound(newSoundState); // telegram.js dagi ovoz holatini yangilaymiz
            playClickSound();
            haptic.impact("medium");
          }}
          aria-label="Ovoz"
          className={`relative h-6 w-11 rounded-full ${settings.sound ? "bg-green-500" : "bg-gray-400"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${settings.sound ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>

      <div className="py-3">
        <div className="font-medium">Sinxronizatsiya</div>
        <div className="hint text-sm">Odatlar CloudStorage'da saqlanadi</div>
      </div>

      <button
        onClick={() => {
          playClickSound();
          haptic.impact("light");
          openLink("https://myportfolio7701.netlify.app/#home");
        }}
        className="btn mt-4 h-11 w-full rounded-xl font-medium"
      >
        Dasturchi sayti
      </button>

      <button
        onClick={() => {
          playClickSound();
          haptic.impact("light");
          openTelegramLink("https://t.me/mening_odatlarim_bot");
        }}
        className="btn-out mt-2 h-11 w-full rounded-xl font-medium"
      >
        Botni ochish
      </button>

      {canAddToHome && (
        <button
          onClick={() => {
            playClickSound();
            haptic.impact("light");
            addToHome();
          }}
          className="btn-out mt-2 h-11 w-full rounded-xl font-medium"
        >
          Bosh ekranga qo'shish
        </button>
      )}
    </div>
  );
}
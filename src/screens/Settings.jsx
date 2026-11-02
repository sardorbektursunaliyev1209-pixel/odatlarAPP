import { haptic } from '../lib/telegram'

export default function Settings({ settings, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-black/10 py-3">
        <div>
          <div className="font-medium">Vibratsiya</div>
          <div className="hint text-sm">Haptic javob</div>
        </div>
        <button
          onClick={() => { onChange({ ...settings, vibration: !settings.vibration }); haptic.impact('medium') }}
          aria-label="Vibratsiya"
          className={`relative h-6 w-11 rounded-full ${settings.vibration ? 'bg-green-500' : 'bg-gray-400'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${settings.vibration ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>
      <div className="py-3">
        <div className="font-medium">Sinxronizatsiya</div>
        <div className="hint text-sm">Odatlar CloudStorage'da saqlanadi</div>
      </div>
    </div>
  )
}

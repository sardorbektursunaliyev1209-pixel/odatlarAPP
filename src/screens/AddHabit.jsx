import { useEffect, useState } from 'react'
import Bar from '../components/Bar'
import { ICON_KEYS, getIcon, getIconColor } from '../lib/habits'
import { haptic, tg, inTelegram, alertDialog, playClickSound } from '../lib/telegram'

export default function AddHabit({ habits, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICON_KEYS[0])
  const valid = name.trim().length >= 2

  useEffect(() => {
    if (!inTelegram || !name) return
    tg.enableClosingConfirmation()
    return () => tg.disableClosingConfirmation()
  }, [name])

  function save() {
    if (!valid) return haptic.notify('error')

    const exists = habits.some(
      (h) => h.name.toLowerCase() === name.trim().toLowerCase()
    )
    if (exists) {
      haptic.notify('warning')
      return alertDialog('Bu nomli odat allaqachon bor')
    }

    playClickSound() // Saqlash tugmasi bosilganda ovoz chiqarish
    onSave({ id: Date.now(), name: name.trim(), icon, days: [] })
  }

  return (
    <div>
      <label className="hint text-sm">Nomi</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Masalan: Meditatsiya"
        className="card mt-1 h-11 w-full px-3 outline-none"
      />
      {name && !valid && <div className="mt-1 text-xs text-red-500">Kamida 2 ta belgi kiriting</div>}

      <div className="hint mt-5 text-sm">Belgi</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {ICON_KEYS.map((key) => {
          const Icon = getIcon(key)
          return (
            <button
              key={key}
              onClick={() => { 
                setIcon(key); 
                haptic.select(); 
                playClickSound(); // Belgi tanlanganda ham ovoz chiqishi uchun
              }}
              aria-label={key}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${getIconColor(key)} ${
                key === icon ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Icon />
            </button>
          )
        })}
      </div>

      <Bar
        main={{ text: 'Saqlash', disabled: !valid, onClick: save }}
        secondary={{ text: 'Bekor qilish', onClick: () => { playClickSound(); onCancel(); } }}
      />
    </div>
  )
}
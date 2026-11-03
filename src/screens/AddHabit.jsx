import { useEffect, useState } from 'react'
import Bar from '../components/Bar'
import { ICONS } from '../lib/habits'
import { haptic, tg, inTelegram, alertDialog } from '../lib/telegram'

export default function AddHabit({ habits, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
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
        {ICONS.map((i) => (
          <button
            key={i}
            onClick={() => { setIcon(i); haptic.select() }}
            className={`card h-11 w-11 text-xl ${i === icon ? 'ring-2 ring-blue-500' : ''}`}
          >
            {i}
          </button>
        ))}
      </div>

      <Bar
        main={{ text: 'Saqlash', disabled: !valid, onClick: save }}
        secondary={{ text: 'Bekor qilish', onClick: onCancel }}
      />
    </div>
  )
}
import Bar from '../components/Bar'
import { dateKey, lastDays, streak, weekPercent } from '../lib/habits'
import { confirmDialog, haptic } from '../lib/telegram'

const DN = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']

export default function Detail({ habit, onToggle, onDelete }) {
  if (!habit) return null
  const doneToday = habit.days.includes(dateKey())

  async function remove() {
    if (await confirmDialog("Odat o'chirilsinmi?")) {
      haptic.notify('warning')
      onDelete(habit.id)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{habit.icon}</span>
        <div className="text-lg font-medium">{habit.name}</div>
      </div>

      <div className="my-5 flex justify-between">
        {lastDays(7).map((d) => {
          const ok = habit.days.includes(dateKey(d))
          return (
            <div key={dateKey(d)} className="hint text-center text-xs">
              {DN[d.getDay()]}
              <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-white ${ok ? 'bg-green-500' : 'card'}`}>
                {ok ? '✓' : ''}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <div className="card flex-1 p-3 text-center"><b className="block text-xl">{streak(habit)}</b><span className="hint text-xs">Seriya</span></div>
        <div className="card flex-1 p-3 text-center"><b className="block text-xl">{weekPercent(habit)}%</b><span className="hint text-xs">Hafta</span></div>
      </div>

      <Bar
        main={{ text: doneToday ? 'Bekor qilish' : 'Bajarildi', onClick: () => onToggle(habit.id) }}
        secondary={{ text: "O'chirish", onClick: remove }}
      />
    </div>
  )
}   
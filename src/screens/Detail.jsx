import Bar from '../components/Bar'
import { dateKey, lastDays, streak, weekPercent, getIcon, getIconColor } from '../lib/habits'
import { confirmDialog, popupDialog, haptic } from '../lib/telegram'

const DN = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']

export default function Detail({ habit, onToggle, onDelete }) {
  if (!habit) return null
  const doneToday = habit.days.includes(dateKey())
  const Icon = getIcon(habit.icon)

  async function remove() {
    if (await confirmDialog("Odat o'chirilsinmi?")) {
      haptic.notify('warning')
      onDelete(habit.id)
    }
  }

  async function actions() {
    haptic.impact('light')
    const buttons = []
    if (doneToday) buttons.push({ id: 'reset', type: 'default', text: 'Bugungi belgini olib tashlash' })
    buttons.push({ id: 'delete', type: 'destructive', text: "Odatni o'chirish" })
    buttons.push({ id: 'cancel', type: 'cancel' })

    const choice = await popupDialog({ title: habit.name, message: 'Nima qilamiz?', buttons })
    if (choice === 'reset') onToggle(habit.id)
    if (choice === 'delete') remove()
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${getIconColor(habit.icon)}`}>
          <Icon />
        </span>
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
        secondary={{ text: 'Amallar', onClick: actions }}
      />
    </div>
  )
}
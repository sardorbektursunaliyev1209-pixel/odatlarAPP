import { FaFire } from 'react-icons/fa'
import { dateKey, streak, getIcon, getIconColor } from '../lib/habits'

export default function HabitCard({ habit, onToggle, onOpen }) {
  const done = habit.days.includes(dateKey())
  const Icon = getIcon(habit.icon)
  return (
    <div className="card mb-2 flex items-center gap-3 p-3">
      <button onClick={() => onOpen(habit.id)} className="flex flex-1 items-center gap-3 text-left">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${getIconColor(habit.icon)}`}>
          <Icon />
        </span>
        <span>
          <span className="block text-sm font-medium">{habit.name}</span>
          <span className="hint flex items-center gap-1 text-xs">
            <FaFire className="text-orange-500" /> {streak(habit)} kunlik seriya
          </span>
        </span>
      </button>
      <button
        onClick={() => onToggle(habit.id)}
        aria-label="Bajarildi"
        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-white ${
          done ? 'border-green-500 bg-green-500' : 'hint border-current'
        }`}
      >
        {done ? '✓' : ''}
      </button>
    </div>
  )
}
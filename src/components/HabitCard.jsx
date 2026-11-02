import { dateKey, streak } from '../lib/habits'

export default function HabitCard({ habit, onToggle, onOpen }) {
  const done = habit.days.includes(dateKey())
  return (
    <div className="card mb-2 flex items-center gap-3 p-3">
      <button onClick={() => onOpen(habit.id)} className="flex flex-1 items-center gap-3 text-left">
        <span className="text-2xl">{habit.icon}</span>
        <span>
          <span className="block text-sm font-medium">{habit.name}</span>
          <span className="hint text-xs">🔥 {streak(habit)} kunlik seriya</span>
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
import Bar from '../components/Bar'
import ProgressRing from '../components/ProgressRing'
import HabitCard from '../components/HabitCard'
import { getUser } from '../lib/telegram'
import { dateKey } from '../lib/habits'

export default function Home({ habits, onToggle, onOpen, onAdd }) {
  const done = habits.filter((h) => h.days.includes(dateKey())).length
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <ProgressRing done={done} total={habits.length} />
        <div>
          <div className="text-lg font-medium">Salom, {getUser()}</div>
          <div className="hint text-sm">
            {habits.length && done === habits.length
              ? 'Bugungi odatlar bajarildi'
              : `Bugun ${habits.length - done} ta odat qoldi`}
          </div>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-4xl">🌱</div>
          <div className="mt-2 font-medium">Birinchi odatingizni qo'shing</div>
          <div className="hint text-sm">Kichikdan boshlang, har kuni.</div>
        </div>
      ) : (
        habits.map((h) => <HabitCard key={h.id} habit={h} onToggle={onToggle} onOpen={onOpen} />)
      )}

      <Bar main={{ text: 'Yangi odat', onClick: onAdd }} />
    </div>
  )
}
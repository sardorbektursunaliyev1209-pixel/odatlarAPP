export const ICONS = ['🏃', '📚', '💧', '🌙', '🏋️', '🌿']

export function dateKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function lastDays(n = 7) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}

export function streak(habit) {
  let count = 0
  const d = new Date()
  if (!habit.days.includes(dateKey(d))) d.setDate(d.getDate() - 1)
  while (habit.days.includes(dateKey(d))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

export function weekPercent(habit) {
  const done = lastDays(7).filter((d) => habit.days.includes(dateKey(d))).length
  return Math.round((done / 7) * 100)
}
import { FaRunning, FaBook, FaTint, FaMoon, FaDumbbell, FaLeaf } from 'react-icons/fa'

export const ICON_KEYS = ['run', 'book', 'water', 'moon', 'gym', 'leaf']

const ICON_MAP = {
  run: FaRunning,
  book: FaBook,
  water: FaTint,
  moon: FaMoon,
  gym: FaDumbbell,
  leaf: FaLeaf,
}

const ICON_COLORS = {
  run: 'bg-orange-500/15 text-orange-600',
  book: 'bg-blue-500/15 text-blue-600',
  water: 'bg-cyan-500/15 text-cyan-600',
  moon: 'bg-purple-500/15 text-purple-600',
  gym: 'bg-red-500/15 text-red-600',
  leaf: 'bg-green-500/15 text-green-600',
}

// eski odatlarda emoji saqlangan, ularni ham tanib olamiz
const LEGACY = { '🏃': 'run', '📚': 'book', '💧': 'water', '🌙': 'moon', '🏋️': 'gym', '🌿': 'leaf' }

function resolveKey(name) {
  return ICON_MAP[name] ? name : LEGACY[name] || 'leaf'
}

export function getIcon(name) {
  return ICON_MAP[resolveKey(name)]
}

export function getIconColor(name) {
  return ICON_COLORS[resolveKey(name)]
}

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
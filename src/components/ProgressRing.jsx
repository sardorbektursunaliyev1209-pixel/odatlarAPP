export default function ProgressRing({ done, total }) {
  const c = 2 * Math.PI * 26
  const p = total ? done / total : 0
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--tg-theme-secondary-bg-color, #eee)" strokeWidth="7" />
      <circle
        cx="32" cy="32" r="26" fill="none" stroke="#34c759" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="500" fill="currentColor">
        {done}/{total}
      </text>
    </svg>
  )
}
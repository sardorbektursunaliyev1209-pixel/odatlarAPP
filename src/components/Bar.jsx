import { useEffect } from 'react'
import { tg, inTelegram } from '../lib/telegram'

export default function Bar({ main, secondary }) {
  useEffect(() => {
    if (!inTelegram) return
    const mb = tg.MainButton
    if (!main) { mb.hide(); return }
    mb.setParams({ text: main.text, is_visible: true, is_active: !main.disabled })
    main.loading ? mb.showProgress() : mb.hideProgress()
    mb.onClick(main.onClick)
    return () => mb.offClick(main.onClick)
  }, [main?.text, main?.disabled, main?.loading, main?.onClick])

  useEffect(() => {
    if (!inTelegram || !tg.isVersionAtLeast('7.10')) return
    const sb = tg.SecondaryButton
    if (!secondary) { sb.hide(); return }
    sb.setParams({ text: secondary.text, is_visible: true, position: 'left' })
    sb.onClick(secondary.onClick)
    return () => sb.offClick(secondary.onClick)
  }, [secondary?.text, secondary?.onClick])

  if (inTelegram) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-3" style={{ background: 'var(--tg-theme-bg-color, #fff)' }}>
      {secondary && (
        <button onClick={secondary.onClick} className="btn-out h-11 flex-[0_0_40%] rounded-xl font-medium">
          {secondary.text}
        </button>
      )}
      {main && (
        <button
          onClick={main.onClick}
          disabled={main.disabled}
          className="btn h-11 flex-1 rounded-xl font-medium disabled:opacity-40"
        >
          {main.loading ? '...' : main.text}
        </button>
      )}
    </div>
  )
}
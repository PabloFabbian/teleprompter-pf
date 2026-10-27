import { useEffect, useRef } from 'react'
import { m } from 'framer-motion'

const LINE = 1.45
const LINES = 3
const FADE = 'linear-gradient(to bottom, transparent, #000 16%, #000 78%, transparent)'

export default function Prompter({ text, speed, size, width, playing, resetKey, onEnd }) {
  const view = useRef(null)
  const roll = useRef(null)
  const y = useRef(0)
  const speedRef = useRef(speed)
  const endRef = useRef(onEnd)
  speedRef.current = speed
  endRef.current = onEnd

  const limit = () => Math.max(0, roll.current.scrollHeight - view.current.clientHeight)
  const move = (value) => {
    y.current = Math.min(limit(), Math.max(0, value))
    roll.current.style.transform = `translate3d(0, ${-y.current}px, 0)`
  }

  useEffect(() => {
    move(0)
  }, [resetKey])

  useEffect(() => {
    move(y.current)
  }, [text, size, width])

  useEffect(() => {
    const el = view.current
    const onWheel = (e) => {
      e.preventDefault()
      move(y.current + e.deltaY)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    if (!playing) return
    if (y.current > 0 && y.current >= limit()) move(0)
    let id
    let last = performance.now()
    const tick = (t) => {
      const dt = Math.max(0, Math.min(t - last, 100))
      last = t
      move(y.current + (speedRef.current * dt) / 1000)
      if (y.current >= limit()) return endRef.current()
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [playing])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center">
      <m.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="pointer-events-auto relative rounded-b-[2rem] bg-[var(--tab)] px-8 py-6 text-[var(--tab-fg)] shadow-2xl shadow-black/30"
        style={{ width: `min(${width}px, 100vw)` }}
      >
        <span
          className={`absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors ${
            playing ? 'bg-emerald-400' : 'bg-current opacity-30'
          }`}
        />
        <div ref={view} className="overflow-hidden" style={{ height: size * LINE * LINES, WebkitMaskImage: FADE, maskImage: FADE }}>
          <div
            ref={roll}
            className="text-center font-medium will-change-transform"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: size,
              lineHeight: LINE,
              paddingTop: size * 0.5,
              paddingBottom: size * LINE * 2,
            }}
          >
            {text.split('\n').map((line, i) => (
              <p key={i} className="m-0">
                {line || '\u00a0'}
              </p>
            ))}
          </div>
        </div>
      </m.div>
    </div>
  )
}

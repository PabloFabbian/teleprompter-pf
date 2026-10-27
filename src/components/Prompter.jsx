import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'

const LINE = 1.45
const LINES = 3
const PAD_TOP = 20
const PAD_BOTTOM = 24
const RADIUS = 26
const EAR = 18
const BOTTOM_ROUND = `0 0 ${RADIUS}px ${RADIUS}px`
const FADE = 'linear-gradient(to bottom, transparent, #000 16%, #000 78%, transparent)'

function Ear({ side }) {
  const left = side === 'left'
  return (
    <span
      aria-hidden
      className="absolute top-0"
      style={{
        [left ? 'right' : 'left']: '100%',
        width: EAR,
        height: EAR,
        background: `radial-gradient(circle at ${left ? '0' : '100%'} 100%, transparent ${EAR - 0.5}px, var(--tab) ${EAR}px)`,
      }}
    />
  )
}

export default function Prompter({ text, speed, size, width, playing, resetKey, onEnd }) {
  const view = useRef(null)
  const roll = useRef(null)
  const y = useRef(0)
  const speedRef = useRef(speed)
  const endRef = useRef(onEnd)
  const [vw, setVw] = useState(() => window.innerWidth)
  speedRef.current = speed
  endRef.current = onEnd

  const limit = () => Math.max(0, roll.current.scrollHeight - view.current.clientHeight)
  const move = (value) => {
    y.current = Math.min(limit(), Math.max(0, value))
    roll.current.style.transform = `translate3d(0, ${-y.current}px, 0)`
  }

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])

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

  const w = Math.min(width, vw - EAR * 2 - 8)
  const h = size * LINE * LINES + PAD_TOP + PAD_BOTTOM

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center">
      <m.div
        className="pointer-events-auto relative"
        initial={{ width: 200, height: 36 }}
        animate={{ width: w, height: h }}
        transition={{ type: 'spring', stiffness: 170, damping: 24 }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: 'var(--tab)',
            borderRadius: BOTTOM_ROUND,
            filter: 'drop-shadow(0 14px 24px rgb(0 0 30 / 0.35))',
          }}
        >
          <Ear side="left" />
          <Ear side="right" />
        </div>
        <div className="absolute inset-0 overflow-hidden text-[var(--tab-fg)]" style={{ borderRadius: BOTTOM_ROUND }}>
          <span
            className={`absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors ${playing ? 'bg-emerald-400' : 'bg-current opacity-30'
              }`}
          />
          <m.div
            className="absolute left-1/2 top-0 -translate-x-1/2 px-8"
            style={{ width: w, paddingTop: PAD_TOP }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div
              ref={view}
              className="overflow-hidden"
              style={{ height: size * LINE * LINES, WebkitMaskImage: FADE, maskImage: FADE }}
            >
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
      </m.div>
    </div>
  )
}

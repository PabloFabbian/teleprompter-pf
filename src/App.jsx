import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import Prompter from './components/Prompter.jsx'
import Controls from './components/Controls.jsx'
import Waves from './components/Waves.jsx'

const KEY = 'pf-teleprompter'
const SAMPLE =
  'Escribí o pegá tu guion en el panel de abajo.\nEl texto se desplaza acá, justo debajo de la cámara.\nAjustá la velocidad y el tamaño, elegí el tema y apretá Espacio para empezar.'

function load() {
  const base = { text: SAMPLE, speed: 45, size: 34, width: 640, theme: 'light' }
  try {
    return { ...base, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return base
  }
}

export default function App() {
  const [settings, setSettings] = useState(load)
  const [playing, setPlaying] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const set = useCallback((key, value) => setSettings((s) => ({ ...s, [key]: value })), [])
  const nudge = useCallback(
    (d) => setSettings((s) => ({ ...s, speed: Math.min(200, Math.max(10, s.speed + d)) })),
    []
  )
  const toggle = useCallback(() => setPlaying((p) => !p), [])
  const stop = useCallback(() => setPlaying(false), [])
  const reset = useCallback(() => {
    setPlaying(false)
    setResetKey((k) => k + 1)
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {}
  }, [settings])

  useEffect(() => {
    const typing = (e) => e.target.matches('textarea')
    const onKeyDown = (e) => {
      if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return
      const onRange = e.target.matches('input[type=range]')
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if (e.code === 'ArrowUp' && !onRange) {
        e.preventDefault()
        nudge(5)
      } else if (e.code === 'ArrowDown' && !onRange) {
        e.preventDefault()
        nudge(-5)
      } else if (e.key.toLowerCase() === 'r') {
        reset()
      }
    }
    const onKeyUp = (e) => {
      if (e.code === 'Space' && !typing(e)) e.preventDefault()
    }
    addEventListener('keydown', onKeyDown)
    addEventListener('keyup', onKeyUp)
    return () => {
      removeEventListener('keydown', onKeyDown)
      removeEventListener('keyup', onKeyUp)
    }
  }, [toggle, nudge, reset])

  return (
    <LazyMotion features={domAnimation} strict>
      <Waves />
      <Prompter
        text={settings.text}
        speed={settings.speed}
        size={settings.size}
        width={settings.width}
        playing={playing}
        resetKey={resetKey}
        onEnd={stop}
      />
      <main
        className="relative z-10 mx-auto flex w-[min(94vw,60rem)] flex-col pb-10"
        style={{ paddingTop: settings.size * 4.35 + 76 }}
      >
        <header className="pb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Teleprompter</h1>
          <p className="mt-1 text-white/80">Leé tu guion mirando a la cámara.</p>
        </header>
        <m.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
          className="rounded-[2rem] border border-[var(--card-line)] bg-[var(--card)] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl md:p-6"
        >
          <Controls settings={settings} set={set} playing={playing} onToggle={toggle} onReset={reset} />
        </m.section>
      </main>
    </LazyMotion>
  )
}

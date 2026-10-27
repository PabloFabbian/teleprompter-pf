import { useEffect, useState } from 'react'
import { m } from 'framer-motion'

const SLIDERS = [
  ['speed', 'Velocidad', 10, 200, 5, 'px/s'],
  ['size', 'Tamaño del texto', 20, 80, 2, 'px'],
  ['width', 'Ancho de la pestaña', 320, 1100, 20, 'px'],
]

const ghost =
  'rounded-full bg-white/15 px-4 py-3 text-sm font-semibold ring-1 ring-white/25 transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white'

function Slider({ id, label, min, max, step, unit, value, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm font-medium">
        <label htmlFor={id}>{label}</label>
        <output className="tabular-nums text-white/80">
          {value} {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function Theme({ value, onChange }) {
  return (
    <div className="relative grid grid-cols-2 rounded-full bg-white/15 p-1 ring-1 ring-white/25" role="group" aria-label="Tema">
      <m.span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white"
        animate={{ x: value === 'dark' ? '100%' : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      />
      {[
        ['light', 'Día'],
        ['dark', 'Oscuro'],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`relative z-10 rounded-full py-2 text-sm font-semibold transition-colors ${
            value === id ? 'text-[var(--accent-fg)]' : ''
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function Controls({ settings, set, playing, onToggle, onReset }) {
  const [full, setFull] = useState(false)

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFull = () => {
    const task = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen()
    task?.catch(() => {})
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_19rem]">
      <label className="flex min-h-[34vh] flex-col gap-2 text-sm font-medium">
        Guion
        <textarea
          value={settings.text}
          onChange={(e) => set('text', e.target.value)}
          spellCheck={false}
          className="min-h-0 flex-1 resize-none rounded-2xl bg-[var(--field)] p-4 text-base leading-relaxed text-[var(--field-fg)] outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white"
        />
      </label>
      <div className="flex flex-col gap-5">
        <m.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onToggle}
          className="rounded-full bg-[var(--accent)] py-4 text-lg font-semibold text-[var(--accent-fg)] shadow-lg shadow-black/20"
        >
          {playing ? 'Pausar' : 'Iniciar'}
        </m.button>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onReset} className={ghost}>
            Reiniciar
          </button>
          <button type="button" onClick={toggleFull} className={ghost}>
            {full ? 'Salir' : 'Pantalla completa'}
          </button>
        </div>
        <Theme value={settings.theme} onChange={(v) => set('theme', v)} />
        {SLIDERS.map(([key, label, min, max, step, unit]) => (
          <Slider
            key={key}
            id={key}
            label={label}
            min={min}
            max={max}
            step={step}
            unit={unit}
            value={settings[key]}
            onChange={(v) => set(key, v)}
          />
        ))}
        <p className="text-xs leading-relaxed text-white/75">
          Espacio inicia o pausa. Flecha arriba y abajo cambian la velocidad. R reinicia. La rueda del mouse mueve el texto.
        </p>
      </div>
    </div>
  )
}

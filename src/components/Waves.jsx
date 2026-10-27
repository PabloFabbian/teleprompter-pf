const LAYERS = [
  { height: '100%', opacity: 0.16, duration: 28, reverse: false },
  { height: '74%', opacity: 0.22, duration: 20, reverse: true },
  { height: '50%', opacity: 0.3, duration: 14, reverse: false },
]

export default function Waves() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[44vh] overflow-hidden">
      <div className="grid-floor" />
      {LAYERS.map((layer, i) => (
        <svg
          key={i}
          className="wave"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          style={{
            height: layer.height,
            animationDuration: `${layer.duration}s`,
            animationDirection: layer.reverse ? 'reverse' : 'normal',
          }}
        >
          <path
            d="M0 170C360 70 1080 270 1440 170S2520 270 2880 170V320H0Z"
            style={{ fill: `rgb(var(--wave) / ${layer.opacity})` }}
          />
        </svg>
      ))}
    </div>
  )
}

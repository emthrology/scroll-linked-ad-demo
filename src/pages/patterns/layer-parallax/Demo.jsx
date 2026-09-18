import { useEffect, useRef, useState } from 'react'
import { createLayerParallax } from '../../../patterns/layer-parallax.js'
import '../../../patterns/layer-parallax.css'
import { useReducedMotion } from '../../../hooks/useReducedMotion.js'

// [이름, 범례 이름, depth, SVG 도형]
const parallaxLayers = [
  // depth 6: 섹션이 지나가는 동안 태양은 화면에 거의 머물고, 산이 그 위로 올라와 해가 지는 것처럼 보인다.
  ['sun', '태양', 6, <><circle cx="720" cy="360" r="190" fill="#fff4c2" opacity=".28" /><circle cx="720" cy="360" r="112" fill="#f6e27f" /><circle className="sun-sunset" cx="720" cy="360" r="112" fill="#f26b3a" /></>],
  ['far', '원경 산', 0.8, <path d="M0 560 220 380l170 110 250-230 260 200 300-160v600H0Z" fill="#8fa37a" />],
  ['mid', '중경 산', 0.45, <path d="M0 680 260 500l210 120 260-170 470 250v200H0Z" fill="#547166" />],
  ['near', '근경 산', 0.1, <path d="M0 800 340 610l220 150 280-120 360 170v90H0Z" fill="#10211d" />],
]

// 낮 → 황금빛 → 석양. keyframe offset은 scroll progress와 같다.
const sunsetEffects = [
  ['.sky-golden', [{ opacity: 0 }, { opacity: 0, offset: 0.3 }, { opacity: 1, offset: 0.45 }, { opacity: 1 }]],
  ['.sky-sunset', [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1, offset: 0.62 }, { opacity: 1 }]],
  ['.sun-sunset', [{ opacity: 0 }, { opacity: 0, offset: 0.38 }, { opacity: 1, offset: 0.58 }, { opacity: 1 }]],
  ['.dusk-tint', [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1, offset: 0.72 }, { opacity: 1 }]],
  ['.parallax-copy', [{ color: '#10211d' }, { color: '#10211d', offset: 0.48 }, { color: '#fff1e0', offset: 0.56 }, { color: '#fff1e0' }]],
  ['.parallax-legend', [{ color: '#10211d' }, { color: '#10211d', offset: 0.48 }, { color: '#fff1e0', offset: 0.56 }, { color: '#fff1e0' }]],
]

// 섹션이 화면을 지나는 동안(H + h) 레이어는 섹션 기준으로 2 × depth × shift × h만큼 되밀린다.
// 따라서 화면 속도(스크롤 대비) = 1 - 2 × depth × shift × h / (H + h).
function useScreenSpeeds(sectionRef) {
  const [speeds, setSpeeds] = useState([])

  useEffect(() => {
    const section = sectionRef.current
    const measure = () => {
      const shift = parseFloat(getComputedStyle(section).getPropertyValue('--parallax-shift')) || 0
      const height = section.getBoundingClientRect().height
      setSpeeds(parallaxLayers.map(([, , depth]) => 1 - (2 * depth * shift * height) / (window.innerHeight + height)))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [sectionRef])

  return speeds
}

export function LayerParallaxDemo() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [engine, setEngine] = useState('auto')
  const [motion, setMotion] = useState({ engine: '', progress: 0 })
  const speeds = useScreenSpeeds(sectionRef)

  useEffect(() => {
    if (reducedMotion) return undefined
    const section = sectionRef.current
    const controller = createLayerParallax({
      container: section,
      layers: section.querySelectorAll('.layer-parallax-layer'),
      engine,
      onUpdate: ({ progress }) => setMotion(previous => ({ ...previous, progress })),
    })
    sunsetEffects.forEach(([selector, keyframes]) => controller.animate(section.querySelector(selector), keyframes))
    setMotion(previous => ({ ...previous, engine: controller.engine }))
    return controller.destroy
  }, [engine, reducedMotion])

  const engineLabel = motion.engine === 'timeline' ? 'VIEWTIMELINE' : 'RAF'
  return <section className="layer-parallax parallax-demo" ref={sectionRef} aria-label="레이어 패럴랙스 데모">
    <div className="parallax-sky sky-day" /><div className="parallax-sky sky-golden" /><div className="parallax-sky sky-sunset" />
    {parallaxLayers.map(([name, , depth, shape]) => <div aria-hidden="true" className={`layer-parallax-layer parallax-${name}`} key={name} style={{ '--depth': depth }}>
      <svg preserveAspectRatio="xMidYMax slice" viewBox="0 0 1200 900">{shape}</svg>
    </div>)}
    <div className="parallax-sky dusk-tint" />
    <div className="parallax-copy"><span>04 / LAYER PARALLAX</span><h2>깊이는<br />속도의 차이다.</h2></div>
    <dl className="parallax-legend" aria-label="레이어별 depth와 스크롤 대비 화면 속도">
      <div className="parallax-legend-head"><dt>LAYER</dt><dd>DEPTH</dd><dd>SPEED</dd></div>
      {parallaxLayers.map(([name, label, depth], index) => <div key={name}>
        <dt>{label}</dt><dd>{depth}</dd><dd>{speeds[index] === undefined ? '–' : `${Math.round(speeds[index] * 100)}%`}</dd>
      </div>)}
    </dl>
    <div className="parallax-controls">
      <div className="implementation-tabs" role="tablist" aria-label="패럴랙스 엔진 선택">
        {[['auto', '브라우저 엔진 (auto)'], ['raf', 'rAF 대체']].map(([value, label]) => <button aria-selected={engine === value} className={engine === value ? 'is-selected' : ''} key={value} onClick={() => setEngine(value)} role="tab" type="button">{label}</button>)}
      </div>
      <span className="parallax-meter" aria-live="polite">{reducedMotion ? 'STATIC' : `${engineLabel} ${Math.round(motion.progress * 100)}%`}</span>
    </div>
  </section>
}

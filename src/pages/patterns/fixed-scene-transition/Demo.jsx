import { useEffect, useRef, useState } from 'react'
import { createFixedSceneTransition } from '../../../patterns/fixed-scene-transition.js'
import { useReducedMotion } from '../../../hooks/useReducedMotion.js'

export function FixedSceneDemo() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [motion, setMotion] = useState({ progress: 0, stage: 0 })
  const stages = [
    ['01', 'SIGNAL', '관점을 먼저 고정한다.', '한 문장과 한 방향으로 시선을 모읍니다.'],
    ['02', 'FOCUS', '장면의 중심을 좁힌다.', '한 가지 물성과 핵심 기능을 크게 드러냅니다.'],
    ['03', 'CONTROL', '제어의 폭을 펼친다.', '수치와 도구를 순서대로 연결해 이해를 완성합니다.'],
  ]

  useEffect(() => {
    if (reducedMotion) return undefined
    const controller = createFixedSceneTransition({
      container: sectionRef.current,
      sceneCount: stages.length,
      onUpdate: setMotion,
    })
    return controller.destroy
  }, [reducedMotion])

  const fade = (start, end) => Math.min(1, Math.max(0, (motion.progress - start) / (end - start)))
  const opacityFor = index => {
    if (index === 0) return 1 - fade(.27, .34)
    if (index === 1) return fade(.34, .41) * (1 - fade(.59, .66))
    return fade(.66, .73)
  }

  return <section className={`fixed-scene-demo${reducedMotion ? ' is-reduced' : ''}`} ref={sectionRef} aria-label="고정 장면 전환 데모">
    <div className="fixed-scene-sticky">
      <div className="fixed-orb fixed-orb-one" /><div className="fixed-orb fixed-orb-two" />
      {stages.map(([number, label, title, description], index) => <article className="fixed-stage" key={label} style={{ opacity: reducedMotion ? 1 : opacityFor(index), transform: reducedMotion ? 'none' : `translateY(${(1 - opacityFor(index)) * 24}px)` }}>
        <span>{number} / {label}</span><h2>{title}</h2><p>{description}</p>
      </article>)}
      <div className="fixed-scene-meter" aria-live="polite"><span>{reducedMotion ? 'STATIC FLOW' : `SCENE ${String(motion.stage + 1).padStart(2, '0')}`}</span><span>{Math.round(motion.progress * 100)}%</span></div>
    </div>
  </section>
}

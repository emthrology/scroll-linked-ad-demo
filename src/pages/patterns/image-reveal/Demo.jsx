import { useEffect, useRef, useState } from 'react'
import { createImageReveal } from '../../../patterns/image-reveal.js'
import { useReducedMotion } from '../../../hooks/useReducedMotion.js'

export function ImageRevealDemo() {
  const revealRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (reducedMotion) return undefined
    return createImageReveal({ container: revealRef.current, onUpdate: ({ progress: value }) => setProgress(value) }).destroy
  }, [reducedMotion])

  return <section className={`image-reveal-demo${reducedMotion ? ' is-reduced' : ''}`} ref={revealRef} aria-label="이미지 리빌 데모">
    <div className="image-reveal-sticky">
      <div className="reveal-copy"><span>01 / IMAGE REVEAL</span><h2>장면은<br />천천히 열린다.</h2><p>스크롤 위치가 이미지의 노출 폭을 결정합니다.</p></div>
      <div className="reveal-frame"><img alt="녹색 언덕과 해가 있는 추상 풍경" src="/atlas-reveal.svg" /><span className="reveal-progress">{Math.round((reducedMotion ? 1 : progress) * 100)}%</span></div>
    </div>
  </section>
}

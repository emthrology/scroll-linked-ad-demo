import { useEffect, useRef, useState } from 'react'
import { createInnerSceneScroll } from '../../../patterns/inner-scene-scroll.js'

function SceneCard({ metrics, isActive, adRef, innerRef }) {
  return (
    <div className="ad-card">
      <div className="ad-window" ref={adRef}>
        <div className="ad-inner" ref={innerRef}>
          <AdContents />
        </div>
      </div>
      <div className="ad-status" aria-live="polite">
        <span>{isActive ? 'SCROLL LINKED' : 'OUTSIDE RANGE'}</span>
        <span>{Math.round(metrics.progress * 100)}%</span>
      </div>
    </div>
  )
}

function AdContents() {
  return <>
    <div className="ad-hero">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="ad-kicker">A NEW PERSPECTIVE</div>
      <p className="ad-brand">AD<br />PREVIEW</p>
      <div className="hero-copy"><span>DISCOVER SOMETHING NEW</span><h2>당신의 일상에<br />새로운 장면을</h2></div>
    </div>
    <div className="ad-detail">
      <span className="detail-label">MORE TO DISCOVER</span>
      <h3>익숙한 일상에<br />새로운 발견</h3><div className="detail-line" />
      <p>작은 관심에서 시작되는 변화.<br />당신만의 다음 장면을 만나보세요.</p>
      <div className="detail-stats"><div><strong>NEW</strong><span>COLLECTION</span></div><div><strong>NOW</strong><span>EXPLORE MORE</span></div></div>
    </div>
    <div className="ad-footer"><span>ADVERTISEMENT PREVIEW</span><span>SCROLL TO EXPLORE</span></div>
  </>
}

function MetricsPanel({ metrics }) {
  return <div className="metrics-panel">
    <p className="metrics-label">LIVE MOTION DATA</p>
    <div className="metric-row"><span>document progress</span><strong>{Math.round(metrics.progress * 100)}%</strong></div>
    <div className="metric-track"><span style={{ width: `${metrics.progress * 100}%` }} /></div>
    <div className="metric-row"><span>inner translateY</span><strong>-{Math.round(metrics.offset)}px</strong></div>
    <p className="metrics-hint">광고 카드가 화면을 통과하는 동안<br />내부 콘텐츠가 같은 진행률로 이동합니다.</p>
  </div>
}

export function ReactScene() {
  const adRef = useRef(null)
  const innerRef = useRef(null)
  const [metrics, setMetrics] = useState({ progress: 0, offset: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const controller = createInnerSceneScroll({
      ad: adRef.current,
      inner: innerRef.current,
      onUpdate: ({ progress, offset }) => {
        setMetrics(previous => previous.progress === progress && previous.offset === offset
          ? previous
          : { progress, offset })
      },
      onActiveChange: setIsActive,
    })

    return controller.destroy
  }, [])

  return (
    <div className="ad-section"><SceneCard adRef={adRef} innerRef={innerRef} isActive={isActive} metrics={metrics} /><MetricsPanel metrics={metrics} /></div>
  )
}

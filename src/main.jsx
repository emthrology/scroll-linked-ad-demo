import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createInnerSceneScroll } from './inner-scene-scroll.js'
import './styles.css'

const principleSteps = [
  ['01', '페이지 스크롤 감지', 'document 스크롤을 passive 이벤트로 받고, requestAnimationFrame으로 다음 화면 갱신 시점에 한 번만 계산합니다.'],
  ['02', '화면 중앙에서 진행률 계산', 'IntersectionObserver로 화면 위·아래 20%를 제외한 영역의 진입과 이탈을 감지합니다. 광고 상단이 화면의 80% 지점에 닿으면 0, 광고 하단이 20% 지점을 통과하면 1입니다. 영역 안에서는 getBoundingClientRect()로 연속적인 진행률을 계산합니다.'],
  ['03', '내부 콘텐츠 위치 이동', '내부 콘텐츠 높이에서 광고 창 높이를 뺀 이동 가능 거리에 진행률을 곱합니다. 그만큼 translateY로 위로 이동시키고, 창 밖의 내용은 overflow: hidden으로 가립니다.'],
  ['04', '역스크롤로 되감기', '위로 스크롤하면 진행률과 이동량도 함께 줄어듭니다. 시간에 따라 재생되는 애니메이션이 아니라 스크롤 위치에 따라 장면이 결정됩니다.'],
]

const implementationSnippets = {
  react: `useEffect(() => {
  const controller = createInnerSceneScroll({
    ad: adRef.current,
    inner: innerRef.current,
    onUpdate: setMetrics,
  })

  return controller.destroy
}, [])`,
  plain: `const controller = createInnerSceneScroll({
  ad: document.querySelector('.ad-window'),
  inner: document.querySelector('.ad-inner'),
  onUpdate: ({ progress, offset }) => {
    progressLabel.textContent = Math.round(progress * 100) + '%'
    inner.style.transform = \`translateY(-\${offset}px)\`
  },
})

// 페이지를 떠날 때 정리합니다.
controller.destroy()`,
  vue: `onMounted(() => {
  controller = createInnerSceneScroll({
    ad: ad.value,
    inner: inner.value,
    onUpdate: values => { metrics.value = values },
  })
})

onBeforeUnmount(() => controller?.destroy())`,
}

const patterns = [
  { slug: 'inner-scene-scroll', name: '내부 장면 이동', status: 'In progress', summary: '카드 안쪽 장면을 document scroll 위치에 맞춰 이동합니다.', constraint: '내부 스크롤 없이 clip 필요', available: true },
  { name: '고정 장면 전환', status: 'Next', summary: '고정된 장면에서 스크롤 구간마다 콘텐츠의 초점을 바꿉니다.', constraint: 'sticky 높이와 모바일 재배치', available: false },
  { name: '이미지 리빌', status: 'Research', summary: '스크롤 진행률로 이미지의 노출 영역을 점진적으로 엽니다.', constraint: '이미지 비율과 reduced motion', available: false },
  { name: '레이어 패럴랙스', status: 'Research', summary: '깊이가 다른 레이어를 서로 다른 속도로 이동합니다.', constraint: '저사양 기기 GPU 비용', available: false },
]

function useRoute() {
  const getRoute = () => window.location.hash === '#/patterns/inner-scene-scroll' ? 'detail' : 'index'
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}

function SiteHeader() {
  return <header className="site-header"><a href="#/">SCROLL MOTION ATLAS</a><span>INTERACTION PATTERN LIBRARY</span></header>
}

function PatternIndex() {
  return <main className="index-page">
    <SiteHeader />
    <section className="index-hero">
      <p className="eyebrow">SCROLL INTERACTION PATTERNS</p>
      <h1>움직임을<br /><em>찾고,</em> 이해하고,<br />다시 쓴다.</h1>
      <p>보이는 효과를 기준으로 패턴을 탐색합니다. 구현된 항목은 실제 체험과 연결 코드를 함께 확인할 수 있습니다.</p>
    </section>
    <section className="pattern-index" aria-label="스크롤 인터랙션 패턴 목록">
      {patterns.map((pattern, index) => {
        const content = <>
          <div className="pattern-card-top"><span>0{index + 1}</span><span className={`status status-${pattern.status.toLowerCase().replace(' ', '-')}`}>{pattern.status}</span></div>
          <h2>{pattern.name}</h2><p>{pattern.summary}</p><small>{pattern.constraint}</small>
          <span className="pattern-link">{pattern.available ? '체험 페이지 열기 ↗' : '준비 중'}</span>
        </>
        return pattern.available
          ? <a className="pattern-card is-available" href={`#/patterns/${pattern.slug}`} key={pattern.name}>{content}</a>
          : <article className="pattern-card" key={pattern.name}>{content}</article>
      })}
    </section>
    <footer className="index-footer"><span>01 / INTERNAL SCENE SCROLL</span><span>MORE PATTERNS IN PROGRESS</span></footer>
  </main>
}

function ScrollLinkedAd() {
  const [implementation, setImplementation] = useState('react')

  return (
    <section className="demo-section" aria-label="구현 방식별 스크롤 연동 광고 데모">
      <div className="demo-heading">
        <p className="eyebrow">ONE LIVE DEMO, THREE ADAPTERS</p>
        <h2>움직임은 하나,<br />연결 방식은 셋.</h2>
        <p>광고는 React 기준 구현으로 한 번만 실행합니다. 아래 탭에서 같은 scroll-driven 계약을 각 환경에 연결하는 코드만 비교하세요.</p>
      </div>
      <div className="implementation-tabs" role="tablist" aria-label="구현 방식 선택">
        {['react', 'plain', 'vue'].map(name => (
          <button
            aria-controls="implementation-stage"
            aria-selected={implementation === name}
            className={implementation === name ? 'is-selected' : ''}
            key={name}
            onClick={() => setImplementation(name)}
            role="tab"
            type="button"
          >
            {name === 'plain' ? 'Plain JS' : name[0].toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>
      <div className="implementation-code" id="implementation-stage" role="tabpanel">
        <div className="code-heading"><span>{implementation === 'plain' ? 'PLAIN JAVASCRIPT' : implementation.toUpperCase()}</span><span>ADAPTER EXAMPLE</span></div>
        <pre><code>{implementationSnippets[implementation]}</code></pre>
      </div>
      <ReactScene />
    </section>
  )
}

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

function ReactScene() {
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

function PatternDetail() {
  return (
    <main>
      <SiteHeader />
      <section className="intro-spacer intro-top">
        <a className="back-link" href="#/">← 모든 패턴</a>
        <div className="topbar"><span>SCROLL LAB / 001</span><span>INTERACTION STUDY</span></div>
        <div className="intro-content">
          <p className="eyebrow">A SMALL STUDY IN MOTION</p>
          <h1>스크롤이<br /><em>장면을</em> 바꾸는 방식</h1>
          <p className="intro-description">페이지의 움직임과 광고 안쪽의 움직임이<br />하나의 흐름으로 이어지는 인터랙션 데모입니다.</p>
          <div className="scroll-cue"><span />아래로 스크롤해 보세요</div>
        </div>
      </section>

      <ScrollLinkedAd />

      <section className="intro-spacer intro-bottom">
        <div className="bottom-heading"><span>HOW IT WORKS</span><h2>스크롤을<br />장면의 위치로.</h2></div>
        <div className="feature-list">
          {principleSteps.map(([number, title, description]) => (
            <div className="feature-row" key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p></div>
          ))}
          <div className="principle-formula">
            <p>H = 화면 높이 · top = 광고 창의 화면 내 상단 위치 · h = 광고 창 높이</p>
            <pre><code>{`progress = clamp((0.8 * H - top) / (0.6 * H + h), 0, 1)
maxMove = Math.max(0, inner.scrollHeight - ad.clientHeight)
translateY = -progress * maxMove`}</code></pre>
          </div>
        </div>
        <div className="footer-note"><span>SCROLL-LINKED MOTION</span><span>REVERSE TO REWIND</span></div>
      </section>
    </main>
  )
}

function App() {
  return useRoute() === 'detail' ? <PatternDetail /> : <PatternIndex />
}

createRoot(document.getElementById('root')).render(<App />)

import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createInnerSceneScroll } from './inner-scene-scroll.js'
import { createFixedSceneTransition } from './fixed-scene-transition.js'
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

const fixedSceneSnippets = {
  react: `useEffect(() => {
  const controller = createFixedSceneTransition({
    container: sectionRef.current,
    sceneCount: 3,
    onUpdate: setMotion,
  })

  return controller.destroy
}, [])`,
  plain: `const controller = createFixedSceneTransition({
  container: document.querySelector('.fixed-scene-demo'),
  sceneCount: 3,
  onUpdate: ({ progress, stage }) => {
    meter.textContent = \`SCENE 0\${stage + 1} / \${Math.round(progress * 100)}%\`
  },
})

controller.destroy()`,
  vue: `onMounted(() => {
  controller = createFixedSceneTransition({
    container: section.value,
    sceneCount: 3,
    onUpdate: values => { motion.value = values },
  })
})

onBeforeUnmount(() => controller?.destroy())`,
}

const patterns = [
  { slug: 'inner-scene-scroll', name: '내부 장면 이동', status: 'In progress', summary: '카드 안쪽 장면을 document scroll 위치에 맞춰 이동합니다.', constraint: '내부 스크롤 없이 clip 필요', available: true },
  { slug: 'fixed-scene-transition', name: '고정 장면 전환', status: 'In progress', summary: '고정된 장면에서 스크롤 구간마다 콘텐츠의 초점을 바꿉니다.', constraint: 'sticky 높이와 모바일 재배치', available: true },
  { name: '이미지 리빌', status: 'Research', summary: '스크롤 진행률로 이미지의 노출 영역을 점진적으로 엽니다.', constraint: '이미지 비율과 reduced motion', available: false },
  { name: '레이어 패럴랙스', status: 'Research', summary: '깊이가 다른 레이어를 서로 다른 속도로 이동합니다.', constraint: '저사양 기기 GPU 비용', available: false },
]

function useRoute() {
  const getRoute = () => ({
    '#/patterns/inner-scene-scroll': 'inner-scene-scroll',
    '#/patterns/fixed-scene-transition': 'fixed-scene-transition',
  }[window.location.hash] || 'index')
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

function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

function FixedSceneDemo() {
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

  const transition = motion.progress * (stages.length - 1)
  const opacityFor = index => {
    if (index === 0) return Math.max(0, 1 - transition)
    if (index === stages.length - 1) return Math.min(1, Math.max(0, transition - (index - 1)))
    return Math.min(1, Math.max(0, Math.min(transition - (index - 1), index + 1 - transition)))
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

function FixedSceneCode() {
  const [implementation, setImplementation] = useState('react')

  return <section className="fixed-code-section" aria-label="고정 장면 전환 구현 방식">
    <div className="demo-heading"><p className="eyebrow">IMPLEMENTATION ADAPTERS</p><h2>고정은 하나,<br />연결은 셋.</h2><p>실제 데모는 React 기준 구현으로 한 번만 실행합니다. 탭에서는 같은 고정 장면 계약을 각 환경에 연결하는 코드만 비교합니다.</p></div>
    <div className="implementation-tabs" role="tablist" aria-label="고정 장면 전환 구현 방식 선택">
      {['react', 'plain', 'vue'].map(name => <button aria-controls="fixed-implementation-stage" aria-selected={implementation === name} className={implementation === name ? 'is-selected' : ''} key={name} onClick={() => setImplementation(name)} role="tab" type="button">{name === 'plain' ? 'Plain JS' : name[0].toUpperCase() + name.slice(1)}</button>)}
    </div>
    <div className="implementation-code" id="fixed-implementation-stage" role="tabpanel"><div className="code-heading"><span>{implementation === 'plain' ? 'PLAIN JAVASCRIPT' : implementation.toUpperCase()}</span><span>ADAPTER EXAMPLE</span></div><pre><code>{fixedSceneSnippets[implementation]}</code></pre></div>
  </section>
}

function InnerSceneDetail() {
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

function FixedSceneDetail() {
  return <main>
    <SiteHeader />
    <section className="intro-spacer fixed-intro">
      <a className="back-link" href="#/">← 모든 패턴</a>
      <div className="topbar"><span>SCROLL LAB / 002</span><span>INTERACTION STUDY</span></div>
      <div className="intro-content"><p className="eyebrow">A PRODUCT STORY IN THREE SCENES</p><h1>스크롤로<br /><em>시선을</em> 고정하는 법</h1><p className="intro-description">긴 document scroll 구간 안에서 장면은 화면에 머물고, 메시지의 중심만 단계별로 바뀝니다.</p><div className="scroll-cue"><span />아래로 스크롤해 보세요</div></div>
    </section>
    <FixedSceneCode />
    <FixedSceneDemo />
    <section className="intro-spacer fixed-how">
      <div className="bottom-heading"><span>HOW IT WORKS</span><h2>고정하고,<br />전환한다.</h2></div>
      <div className="feature-list">
        <div className="feature-row"><span>01</span><strong>시작 경계</strong><p>섹션 상단이 viewport 상단에 닿으면 고정 장면을 시작합니다.</p></div>
        <div className="feature-row"><span>02</span><strong>세 구간 진행률</strong><p>섹션의 300vh 높이에서 남는 200vh를 0~1 progress로 변환하고, 이를 세 장면의 교차 전환에 사용합니다.</p></div>
        <div className="feature-row"><span>03</span><strong>역스크롤</strong><p>진행률을 다시 계산하므로 위로 스크롤하면 앞 장면으로 같은 위치만큼 되감깁니다.</p></div>
        <div className="feature-row"><span>04</span><strong>reduced motion</strong><p>동작 감소 환경에서는 sticky와 장면 전환을 해제하고 세 메시지를 정적 세로 흐름으로 노출합니다.</p></div>
        <div className="principle-formula"><p>H = 화면 높이 · top = 고정 섹션의 화면 내 상단 위치 · h = 고정 섹션 높이</p><pre><code>{['progress = clamp(-top / (h - H), 0, 1)', 'stage = floor(progress * sceneCount)', 'scene opacity = progress 구간별 교차 전환'].join('\n')}</code></pre></div>
      </div>
      <div className="footer-note"><span>STICKY SCENE TRANSITION</span><span>REVERSE TO REWIND</span></div>
    </section>
  </main>
}

function App() {
  const route = useRoute()
  if (route === 'inner-scene-scroll') return <InnerSceneDetail />
  if (route === 'fixed-scene-transition') return <FixedSceneDetail />
  return <PatternIndex />
}

createRoot(document.getElementById('root')).render(<App />)

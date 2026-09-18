import { SiteHeader } from '../../../components/SiteHeader.jsx'
import { ImplementationCode } from '../../../components/ImplementationCode.jsx'
import { ReactScene } from './Demo.jsx'
import { innerSceneSnippets } from './snippets.js'
import './styles.css'

const principleSteps = [
  ['01', '페이지 스크롤 감지', 'document 스크롤을 passive 이벤트로 받고, requestAnimationFrame으로 다음 화면 갱신 시점에 한 번만 계산합니다.'],
  ['02', '화면 중앙에서 진행률 계산', 'IntersectionObserver로 화면 위·아래 20%를 제외한 영역의 진입과 이탈을 감지합니다. 광고 상단이 화면의 80% 지점에 닿으면 0, 광고 하단이 20% 지점을 통과하면 1입니다. 영역 안에서는 getBoundingClientRect()로 연속적인 진행률을 계산합니다.'],
  ['03', '내부 콘텐츠 위치 이동', '내부 콘텐츠 높이에서 광고 창 높이를 뺀 이동 가능 거리에 진행률을 곱합니다. 그만큼 translateY로 위로 이동시키고, 창 밖의 내용은 overflow: hidden으로 가립니다.'],
  ['04', '역스크롤로 되감기', '위로 스크롤하면 진행률과 이동량도 함께 줄어듭니다. 시간에 따라 재생되는 애니메이션이 아니라 스크롤 위치에 따라 장면이 결정됩니다.'],
]

function ScrollLinkedAd() {
  return (
    <section className="demo-section" aria-label="구현 방식별 스크롤 연동 광고 데모">
      <div className="demo-heading">
        <p className="eyebrow">ONE LIVE DEMO, THREE ADAPTERS</p>
        <h2>움직임은 하나,<br />연결 방식은 셋.</h2>
      </div>
      <ImplementationCode id="implementation-stage" label="구현 방식 선택" snippets={innerSceneSnippets} />
      <ReactScene />
    </section>
  )
}

export function InnerSceneDetail() {
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

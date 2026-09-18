import { SiteHeader } from '../../../components/SiteHeader.jsx'
import { ImplementationCode } from '../../../components/ImplementationCode.jsx'
import { FixedSceneDemo } from './Demo.jsx'
import { fixedSceneSnippets } from './snippets.js'
import './styles.css'

function FixedSceneCode() {
  return <section className="fixed-code-section" aria-label="고정 장면 전환 구현 방식">
    <div className="demo-heading"><p className="eyebrow">IMPLEMENTATION ADAPTERS</p><h2>고정은 하나,<br />연결은 셋.</h2></div>
    <ImplementationCode id="fixed-implementation-stage" label="고정 장면 전환 구현 방식 선택" snippets={fixedSceneSnippets} />
  </section>
}

export function FixedSceneDetail() {
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
        <div className="feature-row"><span>02</span><strong>세 구간 진행률</strong><p>섹션의 400vh 높이에서 남는 300vh를 0~1 progress로 변환합니다. 이전 장면이 완전히 사라진 뒤 다음 장면을 보여주고, 마지막 장면은 단독으로 유지합니다.</p></div>
        <div className="feature-row"><span>03</span><strong>역스크롤</strong><p>진행률을 다시 계산하므로 위로 스크롤하면 앞 장면으로 같은 위치만큼 되감깁니다.</p></div>
        <div className="feature-row"><span>04</span><strong>reduced motion</strong><p>동작 감소 환경에서는 sticky와 장면 전환을 해제하고 세 메시지를 정적 세로 흐름으로 노출합니다.</p></div>
        <div className="principle-formula"><p>H = 화면 높이 · top = 고정 섹션의 화면 내 상단 위치 · h = 고정 섹션 높이</p><pre><code>{['progress = clamp(-top / (h - H), 0, 1)', 'stage = floor(progress * sceneCount)', 'scene opacity = progress 구간별 교차 전환'].join('\n')}</code></pre></div>
      </div>
      <div className="footer-note"><span>STICKY SCENE TRANSITION</span><span>REVERSE TO REWIND</span></div>
    </section>
  </main>
}

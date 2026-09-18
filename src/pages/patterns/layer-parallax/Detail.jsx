import { SiteHeader } from '../../../components/SiteHeader.jsx'
import { ImplementationCode } from '../../../components/ImplementationCode.jsx'
import { LayerParallaxDemo } from './Demo.jsx'
import { layerParallaxSnippets } from './snippets.js'
import './styles.css'

export function LayerParallaxDetail() {
  return <main><SiteHeader />
    <section className="intro-spacer fixed-intro"><a className="back-link" href="#/">← 모든 패턴</a><div className="topbar"><span>SCROLL LAB / 004</span><span>INTERACTION STUDY</span></div><div className="intro-content"><p className="eyebrow">DEPTH FROM SPEED</p><h1>스크롤로<br /><em>깊이를</em> 만드는 법</h1><p className="intro-description">깊이가 다른 레이어가 같은 스크롤 구간을 서로 다른 거리만큼 이동하며 공간감을 만듭니다. JS API 하나로 제공하며, 지원 브라우저에서는 브라우저가 합성 스레드에서 직접 움직입니다.</p></div></section>
    <section className="fixed-code-section"><div className="demo-heading"><p className="eyebrow">IMPLEMENTATION ADAPTERS</p><h2>API는 하나,<br />엔진은 둘.</h2></div><ImplementationCode id="layer-parallax-code" label="레이어 패럴랙스 구현 방식 선택" snippets={layerParallaxSnippets} /></section>
    <LayerParallaxDemo />
    <section className="intro-spacer fixed-how"><div className="bottom-heading"><span>HOW IT WORKS</span><h2>멀수록,<br />느리게.</h2></div><div className="feature-list">
      <div className="feature-row"><span>01</span><strong>시작·종료 경계</strong><p>섹션 상단이 viewport 하단에 닿으면 0, 섹션 하단이 viewport 상단을 지나면 1입니다. ViewTimeline의 기본 cover 범위와 같습니다.</p></div>
      <div className="feature-row"><span>02</span><strong>깊이별 이동량</strong><p>각 레이어는 (progress − 0.5) × 2 × depth × 최대 이동량만큼 translate3d로 움직입니다. 섹션이 화면 중앙에 올 때 설계한 구도로 정렬됩니다.</p></div>
      <div className="feature-row"><span>03</span><strong>되감기와 폴백</strong><p>역스크롤은 같은 계산으로 되감깁니다. 좁은 화면에서는 최대 이동량을 절반으로 줄이고, reduced motion에서는 레이어와 하늘색을 낮의 정렬된 구도로 고정합니다.</p></div>
      <div className="feature-row"><span>04</span><strong>두 엔진</strong><p>ViewTimeline을 지원하면(Chrome 115+, Safari 26+) 브라우저가 합성 스레드에서 레이어를 움직이고, 아니면 rAF가 같은 keyframe의 currentTime을 옮깁니다. 메인 스레드에 100ms 작업이 반복될 때 rAF는 최대 약 19px 뒤처지고, 브라우저 엔진은 1px 이내를 유지했습니다.</p></div>
      <div className="principle-formula"><p>H = 화면 높이 · top = 섹션의 화면 내 상단 위치 · h = 섹션 높이 · shift = 최대 이동 비율</p><pre><code>{['progress = clamp((H - top) / (H + h), 0, 1)', 'y = (progress - 0.5) * 2 * depth * shift * h'].join('\n')}</code></pre></div>
    </div><div className="footer-note"><span>LAYER PARALLAX</span><span>REVERSE TO REWIND</span></div></section>
  </main>
}

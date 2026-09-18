import { SiteHeader } from '../../../components/SiteHeader.jsx'
import { ImplementationCode } from '../../../components/ImplementationCode.jsx'
import { ImageRevealDemo } from './Demo.jsx'
import { imageRevealSnippets } from './snippets.js'
import './styles.css'

export function ImageRevealDetail() {
  return <main><SiteHeader /><section className="intro-spacer fixed-intro"><a className="back-link" href="#/">← 모든 패턴</a><div className="topbar"><span>SCROLL LAB / 003</span><span>INTERACTION STUDY</span></div><div className="intro-content"><p className="eyebrow">A FRAME ENTERS IN MOTION</p><h1>스크롤로<br /><em>이미지를</em> 여는 법</h1><p className="intro-description">한 장의 이미지를 scroll progress에 맞춰 잘라 보이며, 장면의 초점을 천천히 드러냅니다.</p></div></section><section className="fixed-code-section"><div className="demo-heading"><p className="eyebrow">IMPLEMENTATION ADAPTERS</p><h2>노출은 하나,<br />연결은 셋.</h2></div><ImplementationCode id="image-reveal-code" label="이미지 리빌 구현 방식 선택" snippets={imageRevealSnippets} /></section><ImageRevealDemo /><section className="intro-spacer fixed-how"><div className="bottom-heading"><span>HOW IT WORKS</span><h2>잘라서,<br />드러낸다.</h2></div><div className="feature-list"><div className="feature-row"><span>01</span><strong>시작·종료 경계</strong><p>섹션 상단이 viewport 80%에 닿으면 열리기 시작하고, 섹션 하단이 viewport 하단에 닿아 고정이 풀리는 순간 100%가 됩니다.</p></div><div className="feature-row"><span>02</span><strong>clip-path 출력</strong><p>0~1 progress를 이미지의 왼쪽 inset에 연결해 0%에서 100%까지 노출합니다.</p></div><div className="feature-row"><span>03</span><strong>되감기와 폴백</strong><p>역스크롤에서는 같은 위치로 닫히며, 좁은 화면과 reduced motion에서는 이미지를 정적으로 모두 보여줍니다.</p></div></div></section></main>
}

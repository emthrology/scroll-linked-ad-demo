import { SiteHeader } from '../components/SiteHeader.jsx'
import { patterns } from '../content/patterns.js'
import './PatternIndex.css'

export function PatternIndex() {
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

export function DetailIntro({ lab, eyebrow, title, description, className = 'fixed-intro', scrollCue = false }) {
  return (
    <section className={`intro-spacer ${className}`}>
      <a className="back-link" href="#/">← 모든 패턴</a>
      <div className="topbar"><span>SCROLL LAB / {lab}</span><span>INTERACTION STUDY</span></div>
      <div className="intro-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="intro-description">{description}</p>
        {scrollCue && <div className="scroll-cue"><span />아래로 스크롤해 보세요</div>}
      </div>
    </section>
  )
}

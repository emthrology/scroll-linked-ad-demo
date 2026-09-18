// rows: [제목, 설명] 목록. 번호는 순서대로 01부터 붙는다.
export function HowItWorks({ heading, rows, formula, footer, className = 'fixed-how' }) {
  return (
    <section className={`intro-spacer ${className}`}>
      <div className="bottom-heading"><span>HOW IT WORKS</span><h2>{heading}</h2></div>
      <div className="feature-list">
        {rows.map(([title, description], index) => {
          const number = String(index + 1).padStart(2, '0')
          return <div className="feature-row" key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p></div>
        })}
        {formula && <div className="principle-formula"><p>{formula.legend}</p><pre><code>{formula.code}</code></pre></div>}
      </div>
      {footer && <div className="footer-note"><span>{footer}</span><span>REVERSE TO REWIND</span></div>}
    </section>
  )
}

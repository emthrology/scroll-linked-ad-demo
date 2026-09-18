import { useState } from 'react'

export function ImplementationCode({ id, label, snippets }) {
  const [implementation, setImplementation] = useState('react')
  const [isVisible, setIsVisible] = useState(false)

  return <>
    <div className="code-disclosure">
      <button aria-controls={isVisible ? id : undefined} aria-expanded={isVisible} className="code-toggle" onClick={() => setIsVisible(visible => !visible)} type="button">
        {isVisible ? '코드 숨기기 −' : '코드 보기 +'}
      </button>
    </div>
    {isVisible && <>
      <div className="implementation-tabs" role="tablist" aria-label={label}>
        {['react', 'plain', 'vue'].map(name => <button aria-controls={id} aria-selected={implementation === name} className={implementation === name ? 'is-selected' : ''} key={name} onClick={() => setImplementation(name)} role="tab" type="button">{name === 'plain' ? 'Plain JS' : name[0].toUpperCase() + name.slice(1)}</button>)}
      </div>
      <div className="implementation-code" id={id} role="tabpanel"><div className="code-heading"><span>{implementation === 'plain' ? 'PLAIN JAVASCRIPT' : implementation.toUpperCase()}</span><span>ADAPTER EXAMPLE</span></div><pre><code>{snippets[implementation]}</code></pre></div>
    </>}
  </>
}

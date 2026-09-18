import { ImplementationCode } from './ImplementationCode.jsx'

export function CodeSection({ id, heading, label, snippets, ariaLabel }) {
  return (
    <section className="fixed-code-section" aria-label={ariaLabel}>
      <div className="demo-heading"><p className="eyebrow">IMPLEMENTATION ADAPTERS</p><h2>{heading}</h2></div>
      <ImplementationCode id={id} label={label} snippets={snippets} />
    </section>
  )
}

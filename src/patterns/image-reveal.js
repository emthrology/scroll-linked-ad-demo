function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function createImageReveal({ container, startAt = 0.8, onUpdate }) {
  if (!container) throw new Error('container 요소가 필요합니다.')
  let frameId = 0
  const update = () => {
    frameId = 0
    const rect = container.getBoundingClientRect()
    const start = window.innerHeight * startAt
    const end = window.innerHeight - rect.height
    const progress = clamp((start - rect.top) / (start - end), 0, 1)
    container.style.setProperty('--reveal-progress', progress)
    onUpdate?.({ progress })
  }
  const requestUpdate = () => { if (!frameId) frameId = requestAnimationFrame(update) }
  update()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  return { destroy() { window.removeEventListener('scroll', requestUpdate); window.removeEventListener('resize', requestUpdate); if (frameId) cancelAnimationFrame(frameId) } }
}

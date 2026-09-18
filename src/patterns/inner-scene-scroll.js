function clamp(value, min, max) { return Math.min(max, Math.max(min, value)) }
export function createInnerSceneScroll({ ad, inner, startAt = 0.8, endAt = 0.2, onUpdate, onActiveChange }) {
  if (!ad || !inner) throw new Error('ad와 inner 요소가 필요합니다.')
  let frameId = 0; let observer
  const update = () => { frameId = 0; const rect = ad.getBoundingClientRect(); const start = window.innerHeight * startAt; const end = window.innerHeight * endAt - rect.height; const progress = clamp((start - rect.top) / (start - end), 0, 1); const maxMove = Math.max(0, inner.scrollHeight - ad.clientHeight); const offset = progress * maxMove; inner.style.transform = `translateY(${-offset}px)`; onUpdate?.({ progress, offset, maxMove }) }
  const requestUpdate = () => { if (!frameId) frameId = requestAnimationFrame(update) }
  const observeActiveRange = () => { observer?.disconnect(); observer = new IntersectionObserver(([entry]) => { inner.style.willChange = entry.isIntersecting ? 'transform' : 'auto'; onActiveChange?.(entry.isIntersecting); requestUpdate() }, { rootMargin: `-${window.innerHeight * endAt}px 0px -${window.innerHeight * (1 - startAt)}px 0px`, threshold: 0 }); observer.observe(ad) }
  const onResize = () => { observeActiveRange(); requestUpdate() }
  update(); observeActiveRange(); window.addEventListener('scroll', requestUpdate, { passive: true }); window.addEventListener('resize', onResize)
  return { destroy() { window.removeEventListener('scroll', requestUpdate); window.removeEventListener('resize', onResize); observer?.disconnect(); inner.style.willChange = 'auto'; if (frameId) cancelAnimationFrame(frameId) } }
}

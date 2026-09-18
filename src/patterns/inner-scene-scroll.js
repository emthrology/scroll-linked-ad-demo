import { progressBetween, subscribeScrollFrame } from './core.js'

export function createInnerSceneScroll({ ad, inner, startAt = 0.8, endAt = 0.2, onUpdate, onActiveChange }) {
  if (!ad || !inner) throw new Error('ad와 inner 요소가 필요합니다.')
  let observer

  const update = () => {
    const rect = ad.getBoundingClientRect()
    const progress = progressBetween(rect.top, window.innerHeight * startAt, window.innerHeight * endAt - rect.height)
    const maxMove = Math.max(0, inner.scrollHeight - ad.clientHeight)
    const offset = progress * maxMove
    inner.style.transform = `translateY(${-offset}px)`
    onUpdate?.({ progress, offset, maxMove })
  }

  // 진행 구간 안에서만 will-change를 켠다.
  const observeActiveRange = () => {
    observer?.disconnect()
    observer = new IntersectionObserver(([entry]) => {
      inner.style.willChange = entry.isIntersecting ? 'transform' : 'auto'
      onActiveChange?.(entry.isIntersecting)
      frame.request()
    }, {
      rootMargin: `-${window.innerHeight * endAt}px 0px -${window.innerHeight * (1 - startAt)}px 0px`,
      threshold: 0,
    })
    observer.observe(ad)
  }

  const frame = subscribeScrollFrame(update, { onResize: observeActiveRange })
  update()
  observeActiveRange()

  return {
    destroy() {
      frame.stop()
      observer?.disconnect()
      inner.style.willChange = 'auto'
    },
  }
}

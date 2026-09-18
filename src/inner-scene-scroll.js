function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * document 스크롤 진행률을 카드 내부 콘텐츠의 translateY에 연결한다.
 * React, Vue 등은 이 함수를 호출하고 lifecycle 종료 시 destroy()를 실행한다.
 */
export function createInnerSceneScroll({
  ad,
  inner,
  startAt = 0.8,
  endAt = 0.2,
  onUpdate,
  onActiveChange,
}) {
  if (!ad || !inner) {
    throw new Error('ad와 inner 요소가 필요합니다.')
  }

  let frameId = 0
  let observer

  const update = () => {
    frameId = 0

    const rect = ad.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const start = viewportHeight * startAt
    const end = viewportHeight * endAt - rect.height
    const progress = clamp((start - rect.top) / (start - end), 0, 1)
    const maxMove = Math.max(0, inner.scrollHeight - ad.clientHeight)
    const offset = progress * maxMove

    inner.style.transform = `translateY(${-offset}px)`
    onUpdate?.({ progress, offset, maxMove })
  }

  const requestUpdate = () => {
    if (!frameId) frameId = requestAnimationFrame(update)
  }

  const observeActiveRange = () => {
    observer?.disconnect()

    const topInset = window.innerHeight * endAt
    const bottomInset = window.innerHeight * (1 - startAt)

    observer = new IntersectionObserver(([entry]) => {
      const isActive = entry.isIntersecting
      inner.style.willChange = isActive ? 'transform' : 'auto'
      onActiveChange?.(isActive)
      requestUpdate()
    }, {
      rootMargin: `-${topInset}px 0px -${bottomInset}px 0px`,
      threshold: 0,
    })

    observer.observe(ad)
  }

  const onResize = () => {
    observeActiveRange()
    requestUpdate()
  }

  update()
  observeActiveRange()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', onResize)

  return {
    destroy() {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
      inner.style.willChange = 'auto'
      if (frameId) cancelAnimationFrame(frameId)
    },
  }
}

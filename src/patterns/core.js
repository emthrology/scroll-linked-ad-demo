export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// 요소 상단(top)이 startTop에서 endTop으로 이동하는 동안의 진행률을 0~1로 계산한다.
// 기준선은 모두 viewport 상단 기준 px이다.
export function progressBetween(top, startTop, endTop) {
  return clamp((startTop - top) / Math.max(1, startTop - endTop), 0, 1)
}

// scroll·resize를 rAF 한 번으로 묶어 update를 호출한다.
export function subscribeScrollFrame(update, { onResize = null } = {}) {
  let frameId = 0
  const run = () => {
    frameId = 0
    update()
  }
  const request = () => {
    if (!frameId) frameId = requestAnimationFrame(run)
  }
  const handleResize = () => {
    onResize?.()
    request()
  }
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', handleResize)
  return {
    request,
    stop() {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', handleResize)
      if (frameId) cancelAnimationFrame(frameId)
    },
  }
}

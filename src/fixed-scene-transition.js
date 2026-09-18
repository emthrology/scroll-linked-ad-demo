function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * document scroll을 sticky 장면의 0~1 progress로 변환한다.
 * container는 viewport보다 높아야 하며 destroy()로 리스너를 정리한다.
 */
export function createFixedSceneTransition({ container, sceneCount, onUpdate }) {
  if (!container || sceneCount < 2) throw new Error('container와 두 개 이상의 장면이 필요합니다.')

  let frameId = 0

  const update = () => {
    frameId = 0
    const rect = container.getBoundingClientRect()
    const travel = Math.max(1, rect.height - window.innerHeight)
    const progress = clamp(-rect.top / travel, 0, 1)
    const stage = Math.min(sceneCount - 1, Math.floor(progress * sceneCount))

    container.style.setProperty('--fixed-progress', progress)
    onUpdate?.({ progress, stage })
  }

  const requestUpdate = () => {
    if (!frameId) frameId = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)

  return {
    destroy() {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frameId) cancelAnimationFrame(frameId)
    },
  }
}

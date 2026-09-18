import { progressBetween, subscribeScrollFrame } from './core.js'

export function createFixedSceneTransition({ container, sceneCount, onUpdate }) {
  if (!container || sceneCount < 2) throw new Error('container와 두 개 이상의 장면이 필요합니다.')

  // 섹션 상단이 viewport 상단에 닿으면 시작하고, sticky travel(섹션 높이 - viewport 높이)을 모두 지나면 끝난다.
  const update = () => {
    const rect = container.getBoundingClientRect()
    const progress = progressBetween(rect.top, 0, window.innerHeight - rect.height)
    const stage = Math.min(sceneCount - 1, Math.floor(progress * sceneCount))
    container.style.setProperty('--fixed-progress', progress)
    onUpdate?.({ progress, stage })
  }

  const frame = subscribeScrollFrame(update)
  update()

  return { destroy: frame.stop }
}

import { progressBetween, subscribeScrollFrame } from './core.js'

export function createImageReveal({ container, startAt = 0.8, onUpdate }) {
  if (!container) throw new Error('container 요소가 필요합니다.')

  // 섹션 상단이 viewport startAt 지점에 닿으면 시작하고, 섹션 하단이 viewport 하단에 닿아 sticky가 풀리면 끝난다.
  const update = () => {
    const rect = container.getBoundingClientRect()
    const progress = progressBetween(rect.top, window.innerHeight * startAt, window.innerHeight - rect.height)
    container.style.setProperty('--reveal-progress', progress)
    onUpdate?.({ progress })
  }

  const frame = subscribeScrollFrame(update)
  update()

  return { destroy: frame.stop }
}

import { progressBetween } from './core.js'

function readNumber(element, name) {
  return parseFloat(getComputedStyle(element).getPropertyValue(name)) || 0
}

// timeline: 브라우저가 ViewTimeline으로 합성 스레드에서 진행한다.
// raf: 같은 keyframe을 멈춘 animation에 걸고 scroll progress로 currentTime을 옮긴다.
const DURATION = 1000
const DEFAULT_SHIFT = 0.15

// shift: depth 1 레이어의 최대 이동량(섹션 높이 대비). 지정하지 않으면 container의
// --parallax-shift를 읽어 미디어 쿼리(좁은 화면·reduced motion) 조정을 따른다.
export function createLayerParallax({ container, layers, shift, engine = 'auto', onUpdate }) {
  if (!container || !layers?.length) throw new Error('container와 layer 요소가 필요합니다.')
  const activeEngine = engine === 'raf' || !('ViewTimeline' in window) ? 'raf' : 'timeline'
  const timeline = activeEngine === 'timeline' ? new ViewTimeline({ subject: container, axis: 'block' }) : null
  const animations = []
  let frameId = 0

  const resolveShift = () => {
    if (shift !== undefined) return shift
    const value = getComputedStyle(container).getPropertyValue('--parallax-shift').trim()
    return value === '' ? DEFAULT_SHIFT : parseFloat(value) || 0
  }
  // 이동해도 가장자리가 드러나지 않도록 레이어를 위아래로 depth × shift만큼 늘린다.
  // 투명한 오브젝트 레이어는 data-parallax-overscan="none"으로 늘리지 않는다.
  const applyOverscan = (layer, depth, currentShift) => {
    const overscan = layer.dataset.parallaxOverscan === 'none' ? 0 : Math.abs(depth) * currentShift
    layer.style.setProperty('--parallax-overscan', overscan)
  }
  const layerKeyframes = (layer, currentShift) => {
    const depth = readNumber(layer, '--depth')
    applyOverscan(layer, depth, currentShift)
    const distance = depth * currentShift * container.getBoundingClientRect().height
    return [{ transform: `translate3d(0, ${-distance}px, 0)` }, { transform: `translate3d(0, ${distance}px, 0)` }]
  }
  const attach = (element, keyframes) => {
    const animation = element.animate(keyframes, timeline ? { timeline, fill: 'both', easing: 'linear' } : { duration: DURATION, fill: 'both', easing: 'linear' })
    if (!timeline) animation.pause()
    animations.push(animation)
    return animation
  }
  const readProgress = () => {
    if (!timeline) {
      const rect = container.getBoundingClientRect()
      return progressBetween(rect.top, window.innerHeight, -rect.height)
    }
    return animations[0]?.effect.getComputedTiming().progress ?? 0
  }
  const update = () => {
    frameId = 0
    const progress = readProgress()
    if (!timeline) animations.forEach(animation => { animation.currentTime = progress * DURATION })
    onUpdate?.({ progress })
  }
  const requestUpdate = () => { if (!frameId) frameId = requestAnimationFrame(update) }
  const initialShift = resolveShift()
  const layerAnimations = [...layers].map(layer => attach(layer, layerKeyframes(layer, initialShift)))
  // 생성 시점에 스타일시트가 아직 적용되지 않았을 수 있으므로, container 크기가 바뀔 때마다 이동 거리를 다시 계산한다.
  const resizeObserver = new ResizeObserver(() => {
    const currentShift = resolveShift()
    layerAnimations.forEach((animation, index) => animation.effect.setKeyframes(layerKeyframes(layers[index], currentShift)))
    requestUpdate()
  })
  const listensToScroll = !timeline || onUpdate
  update()
  if (listensToScroll) window.addEventListener('scroll', requestUpdate, { passive: true })
  resizeObserver.observe(container)

  return {
    engine: activeEngine,
    // 같은 progress에 부가 효과(색·opacity 등)를 연결한다. keyframe offset은 progress와 같다.
    animate(element, keyframes) {
      const animation = attach(element, keyframes)
      update()
      return animation
    },
    destroy() {
      if (listensToScroll) window.removeEventListener('scroll', requestUpdate)
      resizeObserver.disconnect()
      if (frameId) cancelAnimationFrame(frameId)
      animations.forEach(animation => animation.cancel())
      layers.forEach(layer => layer.style.removeProperty('--parallax-overscan'))
    },
  }
}

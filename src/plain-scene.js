import { createInnerSceneScroll } from './inner-scene-scroll.js'

const content = `
  <div class="ad-hero"><div class="hero-orb hero-orb-one"></div><div class="hero-orb hero-orb-two"></div><div class="ad-kicker">A NEW PERSPECTIVE</div><p class="ad-brand">AD<br>PREVIEW</p><div class="hero-copy"><span>DISCOVER SOMETHING NEW</span><h2>당신의 일상에<br>새로운 장면을</h2></div></div>
  <div class="ad-detail"><span class="detail-label">MORE TO DISCOVER</span><h3>익숙한 일상에<br>새로운 발견</h3><div class="detail-line"></div><p>작은 관심에서 시작되는 변화.<br>당신만의 다음 장면을 만나보세요.</p><div class="detail-stats"><div><strong>NEW</strong><span>COLLECTION</span></div><div><strong>NOW</strong><span>EXPLORE MORE</span></div></div></div>
  <div class="ad-footer"><span>ADVERTISEMENT PREVIEW</span><span>SCROLL TO EXPLORE</span></div>`

export function mountPlainScene(host) {
  host.innerHTML = `<div class="ad-section"><div class="ad-card"><div class="ad-window"><div class="ad-inner">${content}</div></div><div class="ad-status" aria-live="polite"><span data-active>OUTSIDE RANGE</span><span data-progress>0%</span></div></div><div class="metrics-panel"><p class="metrics-label">LIVE MOTION DATA</p><div class="metric-row"><span>document progress</span><strong data-metric-progress>0%</strong></div><div class="metric-track"><span data-track></span></div><div class="metric-row"><span>inner translateY</span><strong data-offset>-0px</strong></div><p class="metrics-hint">광고 카드가 화면을 통과하는 동안<br>내부 콘텐츠가 같은 진행률로 이동합니다.</p></div></div>`
  const ad = host.querySelector('.ad-window')
  const inner = host.querySelector('.ad-inner')
  const progress = host.querySelector('[data-progress]')
  const metricProgress = host.querySelector('[data-metric-progress]')
  const offset = host.querySelector('[data-offset]')
  const track = host.querySelector('[data-track]')
  const active = host.querySelector('[data-active]')
  const controller = createInnerSceneScroll({
    ad, inner,
    onUpdate: ({ progress: value, offset: move }) => {
      const percentage = `${Math.round(value * 100)}%`
      progress.textContent = percentage; metricProgress.textContent = percentage
      offset.textContent = `-${Math.round(move)}px`; track.style.width = percentage
    },
    onActiveChange: value => { active.textContent = value ? 'SCROLL LINKED' : 'OUTSIDE RANGE' },
  })
  return () => { controller.destroy(); host.replaceChildren() }
}

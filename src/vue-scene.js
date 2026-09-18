import { createApp, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { createInnerSceneScroll } from './inner-scene-scroll.js'

const text = (tag, props, children) => h(tag, props, children)
const contents = () => [
  text('div', { class: 'ad-hero' }, [text('div', { class: 'hero-orb hero-orb-one' }), text('div', { class: 'hero-orb hero-orb-two' }), text('div', { class: 'ad-kicker' }, 'A NEW PERSPECTIVE'), text('p', { class: 'ad-brand' }, ['AD', text('br'), 'PREVIEW']), text('div', { class: 'hero-copy' }, [text('span', null, 'DISCOVER SOMETHING NEW'), text('h2', null, ['당신의 일상에', text('br'), '새로운 장면을'])])]),
  text('div', { class: 'ad-detail' }, [text('span', { class: 'detail-label' }, 'MORE TO DISCOVER'), text('h3', null, ['익숙한 일상에', text('br'), '새로운 발견']), text('div', { class: 'detail-line' }), text('p', null, ['작은 관심에서 시작되는 변화.', text('br'), '당신만의 다음 장면을 만나보세요.']), text('div', { class: 'detail-stats' }, [text('div', null, [text('strong', null, 'NEW'), text('span', null, 'COLLECTION')]), text('div', null, [text('strong', null, 'NOW'), text('span', null, 'EXPLORE MORE')])])]),
  text('div', { class: 'ad-footer' }, [text('span', null, 'ADVERTISEMENT PREVIEW'), text('span', null, 'SCROLL TO EXPLORE')]),
]

const VueScene = {
  setup() {
    const ad = ref(null); const inner = ref(null); const progress = ref(0); const offset = ref(0); const active = ref(false)
    let controller
    onMounted(() => { controller = createInnerSceneScroll({ ad: ad.value, inner: inner.value, onUpdate: values => { progress.value = values.progress; offset.value = values.offset }, onActiveChange: value => { active.value = value } }) })
    onBeforeUnmount(() => controller?.destroy())
    return () => text('div', { class: 'ad-section' }, [
      text('div', { class: 'ad-card' }, [text('div', { class: 'ad-window', ref: ad }, [text('div', { class: 'ad-inner', ref: inner }, contents())]), text('div', { class: 'ad-status', 'aria-live': 'polite' }, [text('span', null, active.value ? 'SCROLL LINKED' : 'OUTSIDE RANGE'), text('span', null, `${Math.round(progress.value * 100)}%`)])]),
      text('div', { class: 'metrics-panel' }, [text('p', { class: 'metrics-label' }, 'LIVE MOTION DATA'), text('div', { class: 'metric-row' }, [text('span', null, 'document progress'), text('strong', null, `${Math.round(progress.value * 100)}%`)]), text('div', { class: 'metric-track' }, [text('span', { style: { width: `${progress.value * 100}%` } })]), text('div', { class: 'metric-row' }, [text('span', null, 'inner translateY'), text('strong', null, `-${Math.round(offset.value)}px`)]), text('p', { class: 'metrics-hint' }, ['광고 카드가 화면을 통과하는 동안', text('br'), '내부 콘텐츠가 같은 진행률로 이동합니다.'])]),
    ])
  },
}

export function mountVueScene(host) {
  const app = createApp(VueScene)
  app.mount(host)
  return () => app.unmount()
}

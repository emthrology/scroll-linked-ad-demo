export const layerParallaxSnippets = {
  react: `import { createLayerParallax } from './patterns/layer-parallax.js'
import './patterns/layer-parallax.css'

useEffect(() => {
  if (reducedMotion) return undefined
  const section = sectionRef.current
  const controller = createLayerParallax({
    container: section,
    layers: section.querySelectorAll('.layer-parallax-layer'),
    // shift: 0.15, // 지정하면 CSS --parallax-shift(좁은 화면 절반)보다 우선합니다.
    onUpdate: ({ progress }) => setProgress(progress),
  })

  // 같은 progress에 하늘색 전환을 연결합니다. offset = progress
  controller.animate(section.querySelector('.sky-sunset'), [
    { opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1, offset: 0.62 }, { opacity: 1 },
  ])
  return controller.destroy
}, [reducedMotion])

return <section className="layer-parallax" ref={sectionRef}>
  <div className="sky-sunset" />
  {/* 투명한 오브젝트는 여유 영역을 만들지 않습니다. */}
  <div className="layer-parallax-layer" data-parallax-overscan="none" style={{ '--depth': 6 }}>
    <svg className="layer-parallax-art" viewBox="0 0 1200 900">{sun}</svg>
  </div>
  <div className="layer-parallax-layer" style={{ '--depth': 2 }}>
    <svg className="layer-parallax-art" viewBox="0 0 1200 900">{farMountain}</svg>
  </div>
</section>`,
  plain: `<section class="layer-parallax">
  <div class="sky-sunset"></div>
  <div class="layer-parallax-layer" data-parallax-overscan="none" style="--depth: 6">
    <svg class="layer-parallax-art" viewBox="0 0 1200 900"><!-- 태양 --></svg>
  </div>
  <div class="layer-parallax-layer" style="--depth: 2">
    <svg class="layer-parallax-art" viewBox="0 0 1200 900"><!-- 원경 산 --></svg>
  </div>
</section>

<script type="module">
import { createLayerParallax } from './patterns/layer-parallax.js'

const section = document.querySelector('.layer-parallax')
const controller = createLayerParallax({
  container: section,
  layers: section.querySelectorAll('.layer-parallax-layer'),
  onUpdate: ({ progress }) => { meter.textContent = Math.round(progress * 100) + '%' },
})

controller.animate(section.querySelector('.sky-sunset'), [
  { opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1, offset: 0.62 }, { opacity: 1 },
])

// 페이지를 떠날 때 정리합니다.
// controller.destroy()
</script>`,
  vue: `<template>
  <section ref="section" class="layer-parallax">
    <div class="sky-sunset" />
    <div class="layer-parallax-layer" data-parallax-overscan="none" style="--depth: 6">
      <svg class="layer-parallax-art" viewBox="0 0 1200 900"><!-- 태양 --></svg>
    </div>
    <div class="layer-parallax-layer" style="--depth: 2">
      <svg class="layer-parallax-art" viewBox="0 0 1200 900"><!-- 원경 산 --></svg>
    </div>
  </section>
</template>

<script setup>
onMounted(() => {
  controller = createLayerParallax({
    container: section.value,
    layers: section.value.querySelectorAll('.layer-parallax-layer'),
    onUpdate: values => { progress.value = values.progress },
  })
  controller.animate(section.value.querySelector('.sky-sunset'), [
    { opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1, offset: 0.62 }, { opacity: 1 },
  ])
})

onBeforeUnmount(() => controller?.destroy())
</script>`,
}

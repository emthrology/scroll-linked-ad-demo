export const fixedSceneSnippets = {
  react: `import { createFixedSceneTransition } from './patterns/fixed-scene-transition.js'

useEffect(() => {
  if (reducedMotion) return undefined
  const controller = createFixedSceneTransition({
    container: sectionRef.current,
    sceneCount: 3,
    onUpdate: setMotion, // { progress, stage }. container에 --fixed-progress도 지정됩니다.
  })
  return controller.destroy
}, [reducedMotion])

// 장면 전환은 progress 구간으로 계산합니다. 이전 장면이 사라진 뒤 다음 장면이 들어옵니다.
const fade = (start, end) => Math.min(1, Math.max(0, (motion.progress - start) / (end - start)))
const opacities = [1 - fade(0.27, 0.34), fade(0.34, 0.41) * (1 - fade(0.59, 0.66)), fade(0.66, 0.73)]

return <section className="fixed-scene-demo" ref={sectionRef}>
  <div className="fixed-scene-sticky">
    {scenes.map((scene, index) => <article className="fixed-stage" style={{ opacity: opacities[index] }}>{scene}</article>)}
  </div>
</section>

/* CSS: 400vh 구간 동안 장면을 화면에 고정 */
.fixed-scene-demo { position: relative; height: 400vh; }
.fixed-scene-sticky { position: sticky; top: 0; min-height: 100vh; display: grid; place-items: center; }
.fixed-stage { position: absolute; }`,
  plain: `<section class="fixed-scene-demo">
  <div class="fixed-scene-sticky">
    <article class="fixed-stage">…</article>
    <article class="fixed-stage">…</article>
    <article class="fixed-stage">…</article>
  </div>
</section>

<script type="module">
import { createFixedSceneTransition } from './patterns/fixed-scene-transition.js'

const stages = document.querySelectorAll('.fixed-stage')
const windows = [[null, [0.27, 0.34]], [[0.34, 0.41], [0.59, 0.66]], [[0.66, 0.73], null]]
const fade = (p, [start, end]) => Math.min(1, Math.max(0, (p - start) / (end - start)))

const controller = createFixedSceneTransition({
  container: document.querySelector('.fixed-scene-demo'),
  sceneCount: 3,
  onUpdate: ({ progress }) => stages.forEach((stage, index) => {
    const [fadeIn, fadeOut] = windows[index]
    stage.style.opacity = (fadeIn ? fade(progress, fadeIn) : 1) * (fadeOut ? 1 - fade(progress, fadeOut) : 1)
  }),
})

// 페이지를 떠날 때 정리합니다.
// controller.destroy()
</script>

<style>
.fixed-scene-demo { position: relative; height: 400vh; }
.fixed-scene-sticky { position: sticky; top: 0; min-height: 100vh; display: grid; place-items: center; }
.fixed-stage { position: absolute; }
</style>`,
  vue: `<template>
  <section ref="section" class="fixed-scene-demo">
    <div class="fixed-scene-sticky">
      <article v-for="(scene, index) in scenes" class="fixed-stage" :style="{ opacity: opacities[index] }">…</article>
    </div>
  </section>
</template>

<script setup>
const fade = (start, end) => Math.min(1, Math.max(0, (motion.value.progress - start) / (end - start)))
const opacities = computed(() => [1 - fade(0.27, 0.34), fade(0.34, 0.41) * (1 - fade(0.59, 0.66)), fade(0.66, 0.73)])

onMounted(() => {
  controller = createFixedSceneTransition({
    container: section.value,
    sceneCount: 3,
    onUpdate: values => { motion.value = values },
  })
})

onBeforeUnmount(() => controller?.destroy())
</script>`,
}

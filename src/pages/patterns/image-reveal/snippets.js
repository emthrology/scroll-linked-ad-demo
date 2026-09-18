export const imageRevealSnippets = {
  react: `import { createImageReveal } from './patterns/image-reveal.js'

useEffect(() => {
  if (reducedMotion) return undefined
  const controller = createImageReveal({
    container: revealRef.current, // container에 --reveal-progress(0~1)를 지정합니다.
    onUpdate: ({ progress }) => setProgress(progress),
  })
  return controller.destroy
}, [reducedMotion])

return <section className="image-reveal-demo" ref={revealRef}>
  <div className="image-reveal-sticky">
    <div className="reveal-frame"><img src="/atlas-reveal.svg" alt="" /></div>
  </div>
</section>

/* CSS: 노출은 clip-path가 담당합니다. 이 규칙이 없으면 이미지가 열리지 않습니다. */
.image-reveal-demo { height: 220vh; }
.image-reveal-sticky { position: sticky; top: 0; min-height: 100vh; }
.reveal-frame { clip-path: inset(0 calc((1 - var(--reveal-progress, 0)) * 100%) 0 0); }`,
  plain: `<section class="image-reveal-demo">
  <div class="image-reveal-sticky">
    <div class="reveal-frame"><img src="/atlas-reveal.svg" alt=""></div>
  </div>
</section>

<script type="module">
import { createImageReveal } from './patterns/image-reveal.js'

const controller = createImageReveal({
  container: document.querySelector('.image-reveal-demo'),
  onUpdate: ({ progress }) => { label.textContent = Math.round(progress * 100) + '%' },
})

// 페이지를 떠날 때 정리합니다.
// controller.destroy()
</script>

<style>
.image-reveal-demo { height: 220vh; }
.image-reveal-sticky { position: sticky; top: 0; min-height: 100vh; }
/* --reveal-progress를 clip-path에 연결합니다. */
.reveal-frame { clip-path: inset(0 calc((1 - var(--reveal-progress, 0)) * 100%) 0 0); }
</style>`,
  vue: `<template>
  <section ref="reveal" class="image-reveal-demo">
    <div class="image-reveal-sticky">
      <div class="reveal-frame"><img src="/atlas-reveal.svg" alt=""></div>
    </div>
  </section>
</template>

<script setup>
onMounted(() => {
  controller = createImageReveal({
    container: reveal.value,
    onUpdate: values => { progress.value = values.progress },
  })
})

onBeforeUnmount(() => controller?.destroy())
</script>

<style>
.image-reveal-demo { height: 220vh; }
.image-reveal-sticky { position: sticky; top: 0; min-height: 100vh; }
/* --reveal-progress를 clip-path에 연결합니다. */
.reveal-frame { clip-path: inset(0 calc((1 - var(--reveal-progress, 0)) * 100%) 0 0); }
</style>`,
}

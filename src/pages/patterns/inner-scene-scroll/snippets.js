export const innerSceneSnippets = {
  react: `import { createInnerSceneScroll } from './patterns/inner-scene-scroll.js'

useEffect(() => {
  const controller = createInnerSceneScroll({
    ad: windowRef.current,   // 고정 크기의 창
    inner: innerRef.current, // 창보다 긴 내부 콘텐츠. transform은 라이브러리가 적용합니다.
    onUpdate: ({ progress, offset }) => setMetrics({ progress, offset }),
    onActiveChange: setIsActive, // 80%~20% 구간 진입·이탈
  })
  return controller.destroy
}, [])

return <div className="scene-window" ref={windowRef}>
  <div className="scene-inner" ref={innerRef}>{contents}</div>
</div>

/* CSS: 창 밖은 가리고, 내부는 창보다 길게 */
.scene-window { height: min(72vh, 760px); overflow: hidden; }
.scene-inner { height: 140%; }`,
  plain: `<div class="scene-window">
  <div class="scene-inner"><!-- 창보다 긴 콘텐츠 --></div>
</div>

<script type="module">
import { createInnerSceneScroll } from './patterns/inner-scene-scroll.js'

const controller = createInnerSceneScroll({
  ad: document.querySelector('.scene-window'),
  inner: document.querySelector('.scene-inner'),
  onUpdate: ({ progress }) => { label.textContent = Math.round(progress * 100) + '%' },
})

// 페이지를 떠날 때 정리합니다.
// controller.destroy()
</script>

<style>
/* 창 밖은 가리고, 내부는 창보다 길게 */
.scene-window { height: min(72vh, 760px); overflow: hidden; }
.scene-inner { height: 140%; }
</style>`,
  vue: `<template>
  <div ref="windowEl" class="scene-window">
    <div ref="inner" class="scene-inner"><!-- 창보다 긴 콘텐츠 --></div>
  </div>
</template>

<script setup>
onMounted(() => {
  controller = createInnerSceneScroll({
    ad: windowEl.value,
    inner: inner.value,
    onUpdate: values => { metrics.value = values },
  })
})

onBeforeUnmount(() => controller?.destroy())
</script>`,
}

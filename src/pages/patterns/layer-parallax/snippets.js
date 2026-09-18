export const layerParallaxSnippets = {
  react: `useEffect(() => {
  const controller = createLayerParallax({
    container: sectionRef.current,
    layers: sectionRef.current.querySelectorAll('.layer-parallax-layer'),
    shift: 0.15, // depth 1의 최대 이동량(섹션 높이 대비). 생략하면 CSS --parallax-shift
    engine: 'auto', // ViewTimeline 지원 시 브라우저 엔진, 아니면 rAF
    onUpdate: ({ progress }) => setProgress(progress),
  })
  controller.animate(skyRef.current, [{ opacity: 0 }, { opacity: 1 }])
  return controller.destroy
}, [])`,
  plain: `const section = document.querySelector('.layer-parallax')
const controller = createLayerParallax({
  container: section,
  layers: section.querySelectorAll('.layer-parallax-layer'),
})

// 같은 progress에 하늘색 전환을 연결합니다.
controller.animate(document.querySelector('.sky-sunset'), [
  { opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1, offset: 0.75 }, { opacity: 1 },
])

controller.destroy()`,
  vue: `onMounted(() => {
  controller = createLayerParallax({
    container: section.value,
    layers: section.value.querySelectorAll('.layer-parallax-layer'),
    onUpdate: values => { progress.value = values.progress },
  })
})

onBeforeUnmount(() => controller?.destroy())`,
}

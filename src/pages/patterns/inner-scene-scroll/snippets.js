export const innerSceneSnippets = {
  react: `useEffect(() => {
  const controller = createInnerSceneScroll({
    ad: adRef.current,
    inner: innerRef.current,
    onUpdate: setMetrics,
  })

  return controller.destroy
}, [])`,
  plain: `const controller = createInnerSceneScroll({
  ad: document.querySelector('.ad-window'),
  inner: document.querySelector('.ad-inner'),
  onUpdate: ({ progress, offset }) => {
    progressLabel.textContent = Math.round(progress * 100) + '%'
    inner.style.transform = \`translateY(-\${offset}px)\`
  },
})

// 페이지를 떠날 때 정리합니다.
controller.destroy()`,
  vue: `onMounted(() => {
  controller = createInnerSceneScroll({
    ad: ad.value,
    inner: inner.value,
    onUpdate: values => { metrics.value = values },
  })
})

onBeforeUnmount(() => controller?.destroy())`,
}

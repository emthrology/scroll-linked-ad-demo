export const imageRevealSnippets = {
  react: `useEffect(() => {
  const controller = createImageReveal({
    container: revealRef.current,
    onUpdate: setProgress,
  })

  return controller.destroy
}, [])`,
  plain: `const controller = createImageReveal({
  container: document.querySelector('.image-reveal-demo'),
  onUpdate: ({ progress }) => {
    label.textContent = Math.round(progress * 100) + '%'
  },
})

controller.destroy()`,
  vue: `onMounted(() => {
  controller = createImageReveal({
    container: reveal.value,
    onUpdate: values => { progress.value = values.progress },
  })
})

onBeforeUnmount(() => controller?.destroy())`,
}

export const fixedSceneSnippets = {
  react: `useEffect(() => {
  const controller = createFixedSceneTransition({
    container: sectionRef.current,
    sceneCount: 3,
    onUpdate: setMotion,
  })

  return controller.destroy
}, [])`,
  plain: `const controller = createFixedSceneTransition({
  container: document.querySelector('.fixed-scene-demo'),
  sceneCount: 3,
  onUpdate: ({ progress, stage }) => {
    meter.textContent = \`SCENE 0\${stage + 1} / \${Math.round(progress * 100)}%\`
  },
})

controller.destroy()`,
  vue: `onMounted(() => {
  controller = createFixedSceneTransition({
    container: section.value,
    sceneCount: 3,
    onUpdate: values => { motion.value = values },
  })
})

onBeforeUnmount(() => controller?.destroy())`,
}

import { useEffect, useState } from 'react'

export function useRoute() {
  const getRoute = () => ({
    '#/patterns/inner-scene-scroll': 'inner-scene-scroll',
    '#/patterns/fixed-scene-transition': 'fixed-scene-transition',
    '#/patterns/image-reveal': 'image-reveal',
    '#/patterns/layer-parallax': 'layer-parallax',
  }[window.location.hash] || 'index')
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (route !== 'index') window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [route])

  return route
}

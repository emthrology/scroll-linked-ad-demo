import { useEffect, useState } from 'react'

// #/patterns/<slug>가 알려진 slug이면 slug를, 아니면 'index'를 돌려준다.
export function useRoute(slugs) {
  const getRoute = () => {
    const slug = window.location.hash.match(/^#\/patterns\/([\w-]+)$/)?.[1]
    return slugs.includes(slug) ? slug : 'index'
  }
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

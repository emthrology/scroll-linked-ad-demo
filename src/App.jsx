import { useRoute } from './hooks/useRoute.js'
import { PatternIndex } from './pages/PatternIndex.jsx'
import { InnerSceneDetail } from './pages/patterns/inner-scene-scroll/Detail.jsx'
import { FixedSceneDetail } from './pages/patterns/fixed-scene-transition/Detail.jsx'
import { ImageRevealDetail } from './pages/patterns/image-reveal/Detail.jsx'
import { LayerParallaxDetail } from './pages/patterns/layer-parallax/Detail.jsx'

const details = {
  'inner-scene-scroll': InnerSceneDetail,
  'fixed-scene-transition': FixedSceneDetail,
  'image-reveal': ImageRevealDetail,
  'layer-parallax': LayerParallaxDetail,
}

export function App() {
  const route = useRoute()
  const Detail = details[route]
  return Detail ? <Detail /> : <PatternIndex />
}

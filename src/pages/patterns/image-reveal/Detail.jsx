import { SiteHeader } from '../../../components/SiteHeader.jsx'
import { DetailIntro } from '../../../components/DetailIntro.jsx'
import { CodeSection } from '../../../components/CodeSection.jsx'
import { HowItWorks } from '../../../components/HowItWorks.jsx'
import { ImageRevealDemo } from './Demo.jsx'
import { imageRevealSnippets } from './snippets.js'
import './styles.css'

const howRows = [
  ['시작·종료 경계', '섹션 상단이 viewport 80%에 닿으면 열리기 시작하고, 섹션 하단이 viewport 하단에 닿아 고정이 풀리는 순간 100%가 됩니다.'],
  ['clip-path 출력', '0~1 progress를 이미지의 왼쪽 inset에 연결해 0%에서 100%까지 노출합니다.'],
  ['되감기와 폴백', '역스크롤에서는 같은 위치로 닫히며, 좁은 화면과 reduced motion에서는 이미지를 정적으로 모두 보여줍니다.'],
]

export function ImageRevealDetail() {
  return (
    <main>
      <SiteHeader />
      <DetailIntro
        lab="003"
        eyebrow="A FRAME ENTERS IN MOTION"
        title={<>스크롤로<br /><em>이미지를</em> 여는 법</>}
        description="한 장의 이미지를 scroll progress에 맞춰 잘라 보이며, 장면의 초점을 천천히 드러냅니다."
      />
      <CodeSection id="image-reveal-code" heading={<>노출은 하나,<br />연결은 셋.</>} label="이미지 리빌 구현 방식 선택" snippets={imageRevealSnippets} />
      <ImageRevealDemo />
      <HowItWorks heading={<>잘라서,<br />드러낸다.</>} rows={howRows} />
    </main>
  )
}

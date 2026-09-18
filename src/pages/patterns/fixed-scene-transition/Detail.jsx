import { SiteHeader } from '../../../components/SiteHeader.jsx'
import { DetailIntro } from '../../../components/DetailIntro.jsx'
import { CodeSection } from '../../../components/CodeSection.jsx'
import { HowItWorks } from '../../../components/HowItWorks.jsx'
import { FixedSceneDemo } from './Demo.jsx'
import { fixedSceneSnippets } from './snippets.js'
import './styles.css'

const howRows = [
  ['시작 경계', '섹션 상단이 viewport 상단에 닿으면 고정 장면을 시작합니다.'],
  ['세 구간 진행률', '섹션의 400vh 높이에서 남는 300vh를 0~1 progress로 변환합니다. 이전 장면이 완전히 사라진 뒤 다음 장면을 보여주고, 마지막 장면은 단독으로 유지합니다.'],
  ['역스크롤', '진행률을 다시 계산하므로 위로 스크롤하면 앞 장면으로 같은 위치만큼 되감깁니다.'],
  ['reduced motion', '동작 감소 환경에서는 sticky와 장면 전환을 해제하고 세 메시지를 정적 세로 흐름으로 노출합니다.'],
]

const formula = {
  legend: 'H = 화면 높이 · top = 고정 섹션의 화면 내 상단 위치 · h = 고정 섹션 높이',
  code: ['progress = clamp(-top / (h - H), 0, 1)', 'stage = floor(progress * sceneCount)', 'scene opacity = progress 구간별 교차 전환'].join('\n'),
}

export function FixedSceneDetail() {
  return (
    <main>
      <SiteHeader />
      <DetailIntro
        lab="002"
        eyebrow="A PRODUCT STORY IN THREE SCENES"
        title={<>스크롤로<br /><em>시선을</em> 고정하는 법</>}
        description="긴 document scroll 구간 안에서 장면은 화면에 머물고, 메시지의 중심만 단계별로 바뀝니다."
        scrollCue
      />
      <CodeSection id="fixed-implementation-stage" heading={<>고정은 하나,<br />연결은 셋.</>} label="고정 장면 전환 구현 방식 선택" snippets={fixedSceneSnippets} ariaLabel="고정 장면 전환 구현 방식" />
      <FixedSceneDemo />
      <HowItWorks heading={<>고정하고,<br />전환한다.</>} rows={howRows} formula={formula} footer="STICKY SCENE TRANSITION" />
    </main>
  )
}

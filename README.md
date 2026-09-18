# Scroll Motion Atlas

스크롤 기반 인터랙션을 직접 체험하고, React·Vue·Plain JavaScript 구현 원리까지 확인하는 사내 패턴 아틀라스의 첫 번째 데모다.

첫 화면은 패턴 인덱스이며, 구현된 `내부 장면 이동`과 `고정 장면 전환` 카드는 각각의 상세 체험으로 연결된다. 페이지 스크롤 진행률이 카드 내부 콘텐츠의 `translateY` 위치 또는 sticky 장면의 교차 전환을 결정하며, 내부 스크롤바는 사용하지 않는다.

## 시작하기

```bash
npm install
npm run dev
```

## 운영 문서

- [제품 방향](docs/vision.md)
- [목표 아키텍처](docs/architecture.md)
- [패턴 카탈로그](docs/pattern-catalog.md)
- [프로젝트 작업 기준](AGENTS.md)

## 현재 데모

- **내부 장면 이동** — 광고 창이 화면의 80% 지점에 진입하면 시작하고, 하단이 20% 지점을 지나면 끝난다. 프레임워크 독립 구현은 `src/inner-scene-scroll.js:1`, React 연결과 비교용 코드 예시는 `src/main.jsx`에 있다.
- **고정 장면 전환** — 300vh 구간에서 sticky 장면을 유지한 채 세 메시지를 교차 전환한다. 기준 구현은 `src/fixed-scene-transition.js:1`, 체험 페이지는 `#/patterns/fixed-scene-transition`이다.

## Plain JavaScript 사용

```js
import { createInnerSceneScroll } from './inner-scene-scroll.js'

const controller = createInnerSceneScroll({
  ad: document.querySelector('.ad-window'),
  inner: document.querySelector('.ad-inner'),
  onUpdate: ({ progress, offset }) => {
    console.log(progress, offset)
  },
})

// 화면을 제거하거나 다른 페이지로 이동하기 전에 호출한다.
controller.destroy()
```

# Scroll Motion Atlas

스크롤 기반 인터랙션을 직접 체험하고, React·Vue·Plain JavaScript 구현 원리까지 확인하는 사내 패턴 아틀라스의 첫 번째 데모다.

현재는 `내부 장면 이동` 패턴을 Plain JavaScript 기준 구현과 React·Vue 연결로 제공한다. 데모 탭은 각 구현체를 실제로 마운트하며, 페이지 스크롤 진행률이 카드 내부 콘텐츠의 `translateY` 위치를 결정한다. 내부 스크롤바는 사용하지 않는다.

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

- **내부 장면 이동** — 광고 창이 화면의 80% 지점에 진입하면 시작하고, 하단이 20% 지점을 지나면 끝난다. 프레임워크 독립 구현은 `src/inner-scene-scroll.js:1`, React 연결은 `src/main.jsx`, Plain JS 마운트는 `src/plain-scene.js`, Vue 마운트는 `src/vue-scene.js`에 있다.

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

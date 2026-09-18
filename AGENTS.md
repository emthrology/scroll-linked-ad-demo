# Scroll Motion Atlas 작업 기준

## 정체성

스크롤 인터랙션 패턴 프레임워크와 이를 체험하는 내부 사이트의 첫 React/Vite 데모다. 제품 방향은 [docs/vision.md](docs/vision.md), 목표 구조는 [docs/architecture.md](docs/architecture.md), 패턴 상태는 [docs/pattern-catalog.md](docs/pattern-catalog.md)를 단일 출처로 사용한다.

## 현재 구조

```text
src/main.jsx                       createRoot와 전역 스타일 진입점
src/App.jsx                        hash route → 페이지 연결
src/hooks/                         useRoute, useReducedMotion
src/components/                    SiteHeader, DetailIntro, CodeSection, HowItWorks, ImplementationCode
src/content/patterns.js            인덱스에 보이는 패턴 메타데이터
src/pages/PatternIndex.jsx         패턴 인덱스
src/pages/patterns/<slug>/         패턴별 Detail·Demo·snippets·styles
src/styles/base.css                전역·상세 공통 스타일
src/patterns/                      프레임워크 독립 기준 구현 (UI 코드 없음)
src/patterns/core.js               progressBetween·clamp·scroll rAF 구독 공통 유틸리티
docs/                              제품 방향·목표 구조·패턴 카탈로그
.github/                           이슈 작성 양식
```

## 불변식

- 사용자는 document scroll 하나로 장면을 조작한다. 내부 스크롤바를 만들지 않는다.
- 진행률은 0~1로 제한하고, 역스크롤에서도 같은 위치를 계산한다.
- 내부 장면 이동의 기준 경계는 광고 상단 80% 시작과 하단 20% 종료다. `src/patterns/inner-scene-scroll.js`
- 고정 장면 전환은 400vh 섹션의 sticky travel을 0~1 progress로 계산한다. `src/patterns/fixed-scene-transition.js`
- 이미지 리빌은 섹션 상단 80% 시작, sticky 고정이 풀리는 섹션 하단 100% 종료로 계산한다. `src/patterns/image-reveal.js`
- 레이어 패럴랙스의 timeline·rAF 엔진은 같은 keyframe을 공유한다. 엔진별로 이동량을 따로 계산하지 않는다. `src/patterns/layer-parallax.js`
- 진행률 경계 계산은 `src/patterns/core.js`의 `progressBetween(top, startTop, endTop)`을 쓴다. 패턴 파일에서 공식을 다시 쓰지 않는다.
- 새 패턴 상세는 `src/pages/patterns/<slug>/`에 Detail·Demo·snippets·styles를 두고, `src/App.jsx`의 `details`와 `src/content/patterns.js`에 등록한다.
- 클래스·id에 `ad-`, `ad_`, `advert`, `sponsor` 같은 광고성 이름을 쓰지 않는다. 광고 차단기(EasyList 등)가 요소를 통째로 숨긴다.
- 데모와 프레임워크 구현은 분리되지 않는다. 체험 사이트는 실제 구현체를 사용한다.
- 새 패턴은 카탈로그의 추가 기준을 충족하기 전에는 구현을 시작하지 않는다.

## 로드맵

- [x] React 내부 장면 이동 데모 — `overflow: hidden`과 `translateY`로 중첩 스크롤 없이 구현
- [x] Plain JS 내부 장면 이동 구현 — `src/patterns/inner-scene-scroll.js`가 React 연결에서도 직접 실행되는 기준 구현
- [ ] Vue 내부 장면 이동 구현
- [x] 패턴 인덱스와 상세 페이지 분리 — `#/` 인덱스와 두 패턴의 hash 상세 체험
- [x] 고정 장면 전환 패턴 — `src/patterns/fixed-scene-transition.js`와 `#/patterns/fixed-scene-transition`
- [x] 이미지 리빌 패턴 — `src/patterns/image-reveal.js`와 `#/patterns/image-reveal`
- [x] 레이어 패럴랙스 패턴 — `src/patterns/layer-parallax.js`(ViewTimeline 우선, rAF 대체)와 `#/patterns/layer-parallax`
- [ ] reduced motion 공통 정책
- 보류: 모노레포·패키지 분리 — 패턴이 3개 이상일 때 재검토

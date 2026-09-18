# Scroll Motion Atlas 작업 기준

## 정체성

스크롤 인터랙션 패턴 프레임워크와 이를 체험하는 내부 사이트의 첫 React/Vite 데모다. 제품 방향은 [docs/vision.md](docs/vision.md), 목표 구조는 [docs/architecture.md](docs/architecture.md), 패턴 상태는 [docs/pattern-catalog.md](docs/pattern-catalog.md)를 단일 출처로 사용한다.

## 현재 구조

```text
src/main.jsx                       패턴 인덱스·상세 화면과 React 데모
src/patterns/                      내부 장면 이동·고정 장면 전환·이미지 리빌 기준 구현
src/styles.css                     페이지와 데모 스타일
docs/              제품 방향·목표 구조·패턴 카탈로그
.github/           이슈 작성 양식
```

## 불변식

- 사용자는 document scroll 하나로 장면을 조작한다. 내부 스크롤바를 만들지 않는다.
- 진행률은 0~1로 제한하고, 역스크롤에서도 같은 위치를 계산한다.
- 내부 장면 이동의 기준 경계는 광고 상단 80% 시작과 하단 20% 종료다. `src/patterns/inner-scene-scroll.js`
- 고정 장면 전환은 400vh 섹션의 sticky travel을 0~1 progress로 계산한다. `src/patterns/fixed-scene-transition.js`
- 데모와 프레임워크 구현은 분리되지 않는다. 체험 사이트는 실제 구현체를 사용한다.
- 새 패턴은 카탈로그의 추가 기준을 충족하기 전에는 구현을 시작하지 않는다.

## 로드맵

- [x] React 내부 장면 이동 데모 — `overflow: hidden`과 `translateY`로 중첩 스크롤 없이 구현
- [x] Plain JS 내부 장면 이동 구현 — `src/patterns/inner-scene-scroll.js`가 React 연결에서도 직접 실행되는 기준 구현
- [ ] Vue 내부 장면 이동 구현
- [x] 패턴 인덱스와 상세 페이지 분리 — `#/` 인덱스와 두 패턴의 hash 상세 체험
- [x] 고정 장면 전환 패턴 — `src/patterns/fixed-scene-transition.js`와 `#/patterns/fixed-scene-transition`
- [ ] 이미지 리빌 패턴 — `src/patterns/image-reveal.js`와 `#/patterns/image-reveal`
- [ ] reduced motion 공통 정책
- 보류: 모노레포·패키지 분리 — 패턴이 3개 이상일 때 재검토

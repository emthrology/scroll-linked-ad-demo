# Session notes

- 2026-09-17: 빈 작업 폴더에서 React/Vite 단일 페이지 데모를 구성했다.
- 결정: 내부 스크롤 컨테이너를 직접 조작하지 않고, `getBoundingClientRect()`로 계산한 외부 진행률을 `transform: translateY()`에 매핑했다.
- 결정: `scroll`은 passive listener로 받고 `requestAnimationFrame`으로 업데이트를 합쳤다. 별도 애니메이션/상태 라이브러리는 사용하지 않았다.
- 수정: 초기 구현은 adRef가 긴 바깥 섹션에 연결되어 maxMove가 0이었다. 빌드 성공만으로 완료 판정한 것은 잘못이었다. 참조를 실제 overflow:hidden 광고 창으로 옮겼다.
- 검증: production build 통과. 1058×964 브라우저에서 maxMove=533px, 아래·위 스크롤 시 진행률 48%→77%→48%, translateY -257px→-412px→-257px로 이동과 되감기를 확인했다.
- 미검증: 참조 화면녹화는 로컬에 없어 픽셀 단위 비교를 하지 않았다. 모바일 크기의 실행 검증은 하지 않았다.
- 콘텐츠 변경: 세 번째 초록색 섹션을 스크롤 감지 → 진행률 계산 → translateY 이동 → 역스크롤 되감기의 구현 원리 설명 및 실제 계산식으로 교체했다. 변경 후 production build 통과.
- 광고 문구: 두 번째 카드의 두산/위브더제니스 브랜드 및 주거·분양 관련 문구를 제거하고 일반적인 예시 광고 문구로 교체했다.
- 구간 변경: 광고 상단이 화면 80%에 도달하면 시작, 하단이 화면 20%를 통과하면 종료. IntersectionObserver의 상하 rootMargin을 화면 높이의 -20%에 해당하는 px로 설정하고, 활성 표시와 will-change를 관리한다. 연속 진행률과 큰 스크롤 점프의 경계 보정은 scroll/rAF 계산으로 유지한다. 설명 섹션도 갱신했다.
- 구간 검증: 브라우저에서 종료 이후 100%/-533px, 역스크롤 86%/-456px, 시작 이전 0%/0px 및 Observer 활성 전환 확인. production build 통과.
- Plain JS 기준 구현: `src/inner-scene-scroll.js`에 `createInnerSceneScroll()`을 추가했다. React 데모는 이 함수의 lifecycle wrapper이며, 시작·종료 경계, rAF, IntersectionObserver, destroy 정리를 공유한다.
- 여백 변경: 두 번째 섹션의 160vh/150vh 최소 높이를 제거하고, 사용자 조정에 따라 상하 패딩을 데스크톱 32px/모바일 24px로 설정했다. 좌우 화면 간격과 카드·패널 간격은 유지한다.
- 2026-09-18: React / Plain JS / Vue 실제 마운트 탭은 시연에서 차이를 전달하지 못해 제거했다. 사용자 판단: 동일한 움직임을 중복 실행하는 탭은 코드 낭비이며, 체험 사이트에는 React 기준 구현 하나를 유지하고 탭은 프레임워크별 연결 코드 예시를 전환해 보여준다. Vue runtime 의존성과 임시 마운트 파일도 제거했다. Vue 구현은 다시 로드맵과 카탈로그에서 예정 상태다.
- 2026-09-18: 패턴 인덱스와 상세 체험을 `src/main.jsx`의 hash route로 분리했다. `#/`는 카탈로그의 4개 패턴을 보여주며 구현된 내부 장면 이동과 고정 장면 전환을 상세로 연결한다. 각 상세는 소개 → 실제 데모 → How 구조를 유지한다. 새 라우팅 라이브러리는 패턴 수와 화면 수가 적어 추가하지 않았다.
- 2026-09-18: Apple iPhone 카메라 섹션 분석을 바탕으로 고정 장면 전환을 두 번째 기준 구현으로 추가했다. `src/fixed-scene-transition.js`는 300vh container의 sticky travel을 0~1 progress로 계산하고 rAF scroll/resize listener를 destroy에서 정리한다. 처음에는 전역 `main { overflow: hidden }` 때문에 sticky가 문서와 함께 밀려나는 문제가 있었고, 전역 clip을 제거해 요소별 overflow만 유지했다. 좁은 화면과 reduced motion은 sticky/전환 없이 정적 세로 흐름으로 폴백한다.

# 패턴 카탈로그

> **결론:** 패턴은 효과 이름, 상태, 구현체, 실무 제약을 함께 관리한다. 아이디어만 있는 항목은 Research 상태로 두며, 구현 우선순위는 사내 활용 가치와 재사용성으로 판단한다.

| 패턴 | 상태 | React | Vue | Plain JS | 체험 | 적용 화면 | 주요 제약 |
|---|---|---|---|---|---|---|---|
| 내부 장면 이동 | In progress | 구현됨 | 예정 | 구현됨 | 구현됨 | 제품·브랜드 카드 | 내부 스크롤 없이 clip 필요 |
| 고정 장면 전환 | In progress | 구현됨 | 예정 | 예정 | 구현됨 | 제품 소개·기능 설명 | sticky 높이와 모바일 재배치 |
| 이미지 리빌 | In progress | 구현됨 | 예정 | 구현됨 | 구현됨 | 에디토리얼·캠페인 | 이미지 비율과 reduced motion |
| 레이어 패럴랙스 | In progress | 구현됨 | 예정 | 구현됨 | 구현됨 | 브랜드·공간 소개 | 레이어 수 × 면적 × 화면 배율²의 합성 메모리 |

## 패턴 추가 기준

다음 항목을 모두 채울 수 있을 때만 카탈로그에 추가한다.

1. 사용자가 보는 한 문장 효과 설명
2. 시작·종료 경계 정의
3. 역스크롤 동작 정의
4. 모바일과 reduced motion에서의 대안
5. 첫 적용 화면 예시

## 고정 장면 전환 계약

- **효과:** 긴 스크롤 구간에서 장면을 viewport에 고정하고, 메시지의 초점을 순서대로 전환한다.
- **시작·종료:** 섹션 상단이 viewport 상단에 닿으면 시작하며, 400vh 섹션의 남는 300vh를 모두 통과하면 종료한다. 마지막 장면은 progress 73%부터 단독으로 유지한다.
- **역스크롤:** 현재 document scroll 위치에서 progress를 다시 계산하므로, 이전 장면으로 같은 위치만큼 되감긴다.
- **모바일·reduced motion:** 좁은 화면 또는 `prefers-reduced-motion: reduce`에서는 sticky와 교차 전환을 해제하고 세 메시지를 정적 세로 흐름으로 보여준다.
- **첫 적용:** 제품 소개·기능 설명에서 한 메시지 → 핵심 물성 → 제어 도구를 순서대로 설명하는 화면.

## 이미지 리빌 계약

- **효과:** 한 장의 이미지를 scroll progress에 맞춰 왼쪽부터 연속적으로 드러낸다.
- **시작·종료:** 섹션 상단이 viewport 80%에 닿으면 시작하고, 섹션 하단이 viewport 하단에 닿아 sticky 고정이 풀릴 때 끝난다. 하단 20% 종료는 100% 노출이 화면 밖에서 일어나므로 쓰지 않는다.
- **역스크롤:** 같은 progress 계산으로 clip-path 노출폭도 같은 위치만큼 닫힌다.
- **모바일·reduced motion:** sticky와 clip-path를 해제하고 이미지를 정적으로 모두 보여준다.
- **첫 적용:** 에디토리얼·캠페인에서 문장과 대표 이미지를 순차적으로 보여주는 화면.

## 레이어 패럴랙스 계약

- **효과:** 깊이가 다른 레이어가 같은 스크롤 구간을 서로 다른 거리만큼 이동해 공간감을 만든다.
- **시작·종료:** 섹션 상단이 viewport 하단에 닿으면 0, 섹션 하단이 viewport 상단을 지나면 1이다. CSS view-timeline의 `cover` 범위와 같다.
- **출력:** 레이어마다 `translate3d(0, (progress - 0.5) × 2 × depth × shift × h, 0)`을 적용한다. `depth`는 0(페이지와 같은 속도)부터 커질수록 느려지며, 화면 높이와 섹션 높이가 같을 때 화면 속도는 `1 - depth × shift`다. depth ≈ 1 / shift이면 화면에 거의 고정되어 가장 먼 물체처럼 보인다. `shift`는 depth 1의 최대 이동량(섹션 높이 대비, 기본 0.15)이며 `createLayerParallax({ shift })` 옵션으로 지정하고, 생략하면 container의 `--parallax-shift`를 읽는다. progress 0.5에서 설계한 구도로 정렬된다.
- **역스크롤:** 같은 계산으로 되감긴다.
- **모바일·reduced motion:** 760px 이하에서는 `shift`를 0.075로 줄이고, `prefers-reduced-motion: reduce`에서는 0으로 두어 정렬된 구도로 고정한다.
- **성능 제약:** `top`·`background-position`으로 이동하지 않는다(프레임마다 layout 발생). 이동 레이어 하나가 합성 메모리를 1440×900 1x에서 약 7MB, 390×844 3x에서 약 16MB 더 쓰므로 이동 레이어는 4개 이하로 둔다.
- **구현 방식:** 라이브러리 API는 JS `createLayerParallax({ container, layers, engine: 'auto', onUpdate })` 하나다. `ViewTimeline`을 지원하면(Chrome 115+, Safari 26+) 브라우저가 합성 스레드에서 keyframe을 진행하고, 아니면 rAF가 같은 keyframe을 멈춘 animation의 `currentTime`으로 옮긴다. 메인 스레드에 100ms 작업이 반복될 때 rAF는 최대 약 19px 뒤처지고 브라우저 엔진은 1px 이내였다. 비교 수치는 #6에 기록한다.
- **여유 영역:** JS가 레이어마다 `--parallax-overscan = depth × shift`를 지정해 레이어를 위아래로 늘리므로, depth가 1을 넘어도 가장자리가 드러나지 않는다. 투명한 오브젝트(태양 등)는 `data-parallax-overscan="none"`으로 늘리지 않는다. 그림은 `.layer-parallax-art` 안에 섹션 크기로 그리고, 늘어난 영역은 도형을 viewBox 밖까지 칠해 채운다.
- **부가 효과:** `controller.animate(element, keyframes)`로 하늘색·opacity 같은 효과를 같은 progress에 연결한다. keyframe offset은 progress와 같다.
- **크기 변화:** 이동 거리는 px keyframe으로 만들고 `ResizeObserver`로 container 크기가 바뀔 때 다시 계산한다. WebKit에서는 mount 시점에 스타일시트가 아직 적용되지 않아 이동 거리가 0으로 계산된 사례가 있었다.
- **첫 적용:** 브랜드·공간 소개 화면에서 풍경이나 공간 사진을 원경·중경·근경 레이어로 나눈 hero.

## 상태 정의

- **Research**: 레퍼런스·활용 장면은 있으나 진행률과 구현 방식이 확정되지 않음
- **Next**: 구현 범위와 완료 조건이 정해짐
- **In progress**: 기준 구현 또는 문서를 작성 중
- **Done**: React·Vue·Plain JS, 체험 데모, 성능·접근성 안내까지 완료

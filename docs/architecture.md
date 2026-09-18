# Scroll Motion Atlas 목표 아키텍처

> **결론:** 프레임워크가 동작의 단일 출처이고, 체험 사이트는 그 구현을 가져와 실행한다. 같은 효과를 데모용과 배포용으로 따로 만들지 않는다.

## 현재 상태

현재는 React/Vite 체험 사이트이며, 패턴 인덱스와 내부 장면 이동 상세 화면을 hash 경로로 제공한다.

```text
src/main.jsx     패턴 인덱스·상세 라우팅과 React 데모 UI
src/inner-scene-scroll.js     내부 장면 이동 기준 구현
src/fixed-scene-transition.js 고정 장면 전환 기준 구현
src/styles.css   데모 스타일
```

## 패턴의 공통 계약

모든 패턴은 다음 정보를 명시한다.

| 항목 | 예: 내부 장면 이동 |
|---|---|
| trigger | 광고 창이 viewport의 80% 지점에 진입 |
| end | 광고 창 하단이 viewport의 20% 지점을 통과 |
| progress | 0~1로 제한한 viewport progress |
| output | `translateY`, opacity, scale 등 |
| reverse | 위로 스크롤하면 같은 계산으로 되감김 |
| fallback | reduced motion에서는 정적 최종 또는 초기 상태 |

## 확장 구조

패턴이 3개가 되면 아래 구조로 옮긴다.

```text
packages/
  core/                 progress·범위·rAF 유틸리티
  vanilla/              DOM 초기화 함수
  react/                hooks와 컴포넌트
  vue/                  composables와 컴포넌트
  patterns/             패턴별 공통 옵션과 문서 메타데이터
apps/
  experience-site/      패턴 인덱스와 실제 데모
```

## 비퇴행 규칙

- 공통 옵션의 기본값은 현재 패턴의 동작을 바꾸지 않는 값으로 둔다.
- React·Vue·Plain JS의 시작·종료 경계는 같은 입력에서 같은 0~1 progress를 계산해야 한다.
- 체험 사이트는 `packages/` 구현을 우회해 자체적인 데모 로직을 만들지 않는다.
- `prefers-reduced-motion` 동작은 각 패턴 상세에 명시한다.

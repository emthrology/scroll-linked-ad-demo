# Scroll Motion Atlas

스크롤 기반 인터랙션을 직접 체험하고, React·Vue·Plain JavaScript 구현 원리까지 확인하는 사내 패턴 아틀라스의 첫 번째 데모다.

현재는 `내부 장면 이동` 패턴을 React로 구현했다. 페이지 스크롤 진행률이 카드 내부 콘텐츠의 `translateY` 위치를 결정하며, 내부 스크롤바는 사용하지 않는다.

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

- **내부 장면 이동** — 광고 창이 화면의 80% 지점에 진입하면 시작하고, 하단이 20% 지점을 지나면 끝난다. 자세한 구현은 `src/main.jsx:15`에 있다.

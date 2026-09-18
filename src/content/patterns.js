export const patterns = [
  { slug: 'inner-scene-scroll', name: '내부 장면 이동', status: 'In progress', summary: '카드 안쪽 장면을 document scroll 위치에 맞춰 이동합니다.', constraint: '내부 스크롤 없이 clip 필요', available: true },
  { slug: 'fixed-scene-transition', name: '고정 장면 전환', status: 'In progress', summary: '고정된 장면에서 스크롤 구간마다 콘텐츠의 초점을 바꿉니다.', constraint: 'sticky 높이와 모바일 재배치', available: true },
  { slug: 'image-reveal', name: '이미지 리빌', status: 'In progress', summary: '스크롤 진행률로 이미지의 노출 영역을 점진적으로 엽니다.', constraint: '이미지 비율과 reduced motion', available: true },
  { slug: 'layer-parallax', name: '레이어 패럴랙스', status: 'In progress', summary: '깊이가 다른 레이어를 서로 다른 속도로 이동합니다.', constraint: '저사양 기기 GPU 비용', available: true },
]

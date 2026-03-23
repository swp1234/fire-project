---
paths:
  - "projects/road-shooter/**"
  - "projects/snake-game/**"
  - "projects/flappy-bird/**"
  - "projects/idle-clicker/**"
  - "projects/brick-breaker/**"
  - "projects/maze-runner/**"
  - "projects/pong-game/**"
  - "projects/block-puzzle/**"
  - "projects/minesweeper/**"
  - "projects/puzzle-2048/**"
  - "projects/emoji-merge/**"
---

# Game Development Rules

- GDD 참조: `docs/GAME-ROAD-SHOOTER.md`, `docs/GAME-SPEC.md`
- 첫 구현부터 의미 있는 난이도 스케일링 (너무 쉬운 기본값 금지)
- 리디자인 시 1회차에 완성도 있는 게임플레이 목표
- 게임 스테이지 사이 전면 광고 배치 고려
- 터치/키보드 듀얼 입력 지원
- requestAnimationFrame 기반 게임루프, deltaTime 사용

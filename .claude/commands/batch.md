대량 배치 작업 실행. 인자: $ARGUMENTS

사용법: /batch <작업 설명>

예시:
- `/batch SEO upgrade for all test apps missing FAQPage`
- `/batch add try-catch to all game loops`
- `/batch update social proof numbers across all test apps`

실행 방식:
1. 대상 앱/파일 목록 자동 탐색 (Glob/Grep)
2. 이미 적용된 앱 필터링 (중복 작업 방지)
3. **TaskCreate**로 앱별 태스크 생성 (진행률 추적)
4. 카나리: 1개 에이전트 먼저 → 성공 시 나머지 배치 (4~6개씩)
5. 각 에이전트: Read → Edit → commit → push → TaskUpdate(completed)
6. live-check 실행
7. 루트 서브모듈 ref 업데이트 + commit
8. TaskList로 최종 현황 확인 + 결과 테이블 출력

대규모 배치 (10+앱) 시:
- CronCreate로 3분마다 TaskList 체크 스케줄링 (진행률 자동 모니터링)
- 전체 완료 시 CronDelete로 정리

규칙:
- 에이전트 동시 최대 5개
- 같은 파일 동시 수정 금지
- 에이전트 mode: dontAsk
- 카나리 패턴: 첫 1개 성공 확인 후 나머지 배치
- 실패 시 log-failure.sh 기록 + TaskUpdate로 상태 반영

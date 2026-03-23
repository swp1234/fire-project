# Multi-Device Setup

> 노트북(C:)과 데스크탑(E:) 간 동기화 가이드

## 기기별 경로

| 기기 | 프로젝트 경로 | 설정 위치 |
|------|---------------|-----------|
| 노트북 | `C:\Fire Project` | `~/.claude.json` (C:\Users\swp55) |
| 데스크탑 | `E:\Fire Project` | `~/.claude.json` (C:\Users\박상우) |

## Git 동기화

**루트 repo**: `swp1234/fire-project` (private)

```bash
# 기기 A에서 작업 완료 후
git add .
git commit -m "..."
git push

# 기기 B에서 동기화
git pull
```

## 로컬 전용 파일 (git 제외)

### 1. `~/.claude.json` (사용자 홈 디렉토리)
- **위치**: 프로젝트 외부 → git과 무관
- **내용**: MCP 서버 경로, 프로젝트별 설정
- **경로 차이**:
  - 노트북: `projects["C:/Fire Project"]`
  - 데스크탑: `projects["E:/Fire Project"]`
- **관리**: 각 기기에서 `bash scripts/backup-local-settings.sh` 실행 → 백업 보관

### 2. `.claude/settings.local.json` (프로젝트 내)
- **위치**: `.gitignore`로 제외
- **내용**: 로컬 환경변수, permission 설정
- **관리**: 기기별 독립 유지

### 3. **Credentials**
- `shining-grid-*.json` (SA key) → `.gitignore`
- `%APPDATA%/gcloud/application_default_credentials.json` (ADC) → git 외부

### 4. **기타**
- `.nano-banana/` (이미지 출력)
- `fire-project-backup-*/` (백업 폴더)
- `.mcp-servers/` (on-demand MCP)

## 새 기기 추가 시

1. **Git clone**
   ```bash
   cd /c  # 또는 /e
   git clone https://github.com/swp1234/fire-project.git "Fire Project"
   ```

2. **백업 복원**
   ```bash
   # 기존 기기에서 백업 생성
   bash scripts/backup-local-settings.sh

   # 새 기기로 백업 폴더 복사 후
   cd fire-project-backup-YYYYMMDD_HHMMSS
   FIRE_PROJECT_PATH="C:/Fire Project" bash restore.sh  # 또는 E:/
   ```

3. **인증**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud config set project pubg-platform-ai
   gh auth login
   ```

4. **패키지 설치**
   ```bash
   pip install google-analytics-mcp
   npm i -g @justmpm/nanobanana @ycse/nanobanana-mcp mcp-server-gsc
   npm install  # 프로젝트 의존성
   npx playwright install
   ```

5. **경로 확인**
   - `~/.claude.json`에서 프로젝트 경로가 현재 기기와 일치하는지 확인
   - GA4 MCP 서버 경로: `where ga4-mcp-server` 결과로 업데이트

## 경로 변경이 필요한 경우

**예:** 노트북에서 D:\로 변경

```python
# .claude.json 경로 일괄 변경
python -c '
import json
with open("C:/Users/swp55/.claude.json", "r", encoding="utf-8") as f:
    config = json.load(f)
config_str = json.dumps(config).replace("C:/Fire Project", "D:/Fire Project")
config = json.loads(config_str)
with open("C:/Users/swp55/.claude.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)
'
```

## 주의사항

- **절대 commit 금지**: `~/.claude.json`, credentials, 백업 폴더
- **기기 간 차이**: Python 버전/경로, npm global path 다를 수 있음
- **Memory 공유**: `~/.claude/projects/C--Fire-Project/memory/` 또는 `E--Fire-Project/memory/` → git으로 동기화 가능 (별도 관리)
- **루트 repo**: private이므로 민감 정보 leak 없음, 하지만 `.gitignore` 준수 필수

## 트러블슈팅

### MCP 서버 연결 실패
1. `~/.claude.json`에서 프로젝트 키 확인 (`C:/Fire Project` vs `E:/Fire Project`)
2. SA key 경로 확인 (`C:\Fire Project\...` vs `E:\Fire Project\...`)
3. ADC credentials 확인 (`%APPDATA%/gcloud/application_default_credentials.json`)

### Python 경로 불일치
```bash
where python
where ga4-mcp-server
# ~/.claude.json에서 "command" 경로 업데이트
```

### Git submodule 오류
```bash
git submodule update --init --recursive
```

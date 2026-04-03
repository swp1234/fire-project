# AdSense MCP 운영 가이드

프로젝트 전용 읽기 전용 `AdSense MCP`는 로컬 서버로 `E:/Fire Project/.mcp-servers/adsense-mcp/`에 위치합니다.

## 범위

- OAuth 2.0 사용자 인증만 지원
- scope: `https://www.googleapis.com/auth/adsense.readonly`
- token 저장 위치: `%USERPROFILE%/.config/adsense-mcp/`
- 제공 도구:
  - `adsense_list_accounts`
  - `adsense_get_earnings_summary`
  - `adsense_generate_report`
  - `adsense_list_sites`
  - `adsense_list_alerts`
  - `adsense_list_policy_issues`
  - `adsense_list_payments`
  - `adsense_list_ad_clients`
  - `adsense_list_ad_units`
  - `adsense_list_url_channels`
  - `adsense_list_custom_channels`
  - `adsense_list_saved_reports`

## 1. 빌드

```bash
cd "E:/Fire Project/.mcp-servers/adsense-mcp"
npm install
npm run build
```

## 2. OAuth 초기화

Google Cloud Console에서 발급한 OAuth desktop client JSON이 필요합니다.

```bash
node "E:/Fire Project/.mcp-servers/adsense-mcp/build/index.js" init \
  --credentials-file="C:/path/to/client_secret.apps.googleusercontent.com.json"
```

실행 흐름:

1. 터미널에 출력된 Google 동의 URL을 브라우저에서 엽니다.
2. 승인 후 `localhost`로 리디렉션된 전체 URL 또는 `code` 값을 복사합니다.
3. 터미널 프롬프트에 붙여넣습니다.
4. refresh token과 기본 account가 `%USERPROFILE%/.config/adsense-mcp/` 아래에 저장됩니다.

## 3. 상태 점검

```bash
node "E:/Fire Project/.mcp-servers/adsense-mcp/build/index.js" doctor
```

`doctor`는 다음을 확인합니다.

- 저장된 credentials / token 존재 여부
- accounts 조회 가능 여부
- 기본 account 기준 sites / policyIssues / adClients 접근 여부

## 4. Codex 등록

`C:/Users/박상우/.codex/config.toml`:

```toml
[mcp_servers.adsense]
command = "node"
args = ["E:/Fire Project/.mcp-servers/adsense-mcp/build/index.js", "run"]
```

## 5. Claude 등록

```bash
claude mcp add adsense -s user \
  -- node "E:/Fire Project/.mcp-servers/adsense-mcp/build/index.js" run
```

또는 복원 스크립트 사용:

```bash
bash "E:/Fire Project/scripts/mcp-restore.sh" monetization
```

## 6. 비고

- 서비스 계정은 AdSense Management API에서 지원하지 않으므로 제외합니다.
- 서버는 메타데이터와 리포트 조회에 대해 파일 기반 캐시와 retry/backoff를 적용합니다.
- refresh token이 누락되면 `init`을 다시 실행해야 합니다.
- 테스트나 임시 검증은 `ADSENSE_MCP_PROFILE_DIR` 환경변수로 별도 프로필 경로를 지정할 수 있습니다.

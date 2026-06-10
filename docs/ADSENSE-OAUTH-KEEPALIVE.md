# AdSense OAuth Keepalive

Last checked: 2026-06-10.

## Summary

AdSense Management API authentication cannot be made truly permanent.

The durable setup is:

1. Use the AdSense installed-application OAuth flow.
2. Keep the Google Cloud OAuth consent screen in `In production`, not `Testing`.
3. Store a refresh token securely.
4. Let the Google auth library exchange that refresh token for short-lived access tokens.
5. Run a scheduled keepalive check so the token is exercised and `invalid_grant` is detected early.

Official references:

- Google OAuth 2.0 overview: https://developers.google.com/identity/protocols/oauth2
- Google Cloud token types: https://docs.cloud.google.com/docs/authentication/token-types
- AdSense direct requests and auth rules: https://developers.google.com/adsense/management/direct_requests

## Why not permanent?

Google access tokens are short-lived. Refresh tokens are longer-lived, but can still stop working when the user revokes access, a token is unused for six months, the account exceeds live refresh-token limits, time-limited access expires, an admin policy applies, or the OAuth consent screen is external and still in `Testing`.

For external apps in `Testing`, Google can issue refresh tokens that expire after seven days unless only basic profile scopes are requested. The AdSense scope is not a basic profile scope, so the OAuth consent screen should be moved to `In production` before creating the next token.

AdSense does not support service accounts. Every AdSense Management API request must be authorized by an authenticated user, so a service-account key is not a workaround.

## Recovery from `invalid_grant`

An `invalid_grant` refresh token cannot be revived automatically. Create a fresh one:

```powershell
npm run adsense:auth-url
```

Open the printed URL, approve access, then pass the redirect URL or code back to the MCP:

```powershell
node .\.mcp-servers\adsense-mcp\build\index.js init --code="<redirect URL or code>"
npm run adsense:doctor
```

## Scheduled keepalive

After `npm run adsense:doctor` succeeds, register the daily Windows task:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-adsense-mcp-keepalive-task.ps1 -Schedule Daily -At 09:10
```

Manual check:

```powershell
npm run adsense:keepalive
```

The keepalive writes JSONL status to:

```text
logs\adsense-mcp-keepalive.jsonl
```

This check does not bypass Google token expiry rules. Its purpose is to exercise the refresh token regularly and surface auth breakage before a revenue/analytics session depends on it.

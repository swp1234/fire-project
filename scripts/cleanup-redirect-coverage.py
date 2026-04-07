from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse
import re


REPO_ROOT = Path(__file__).resolve().parents[1]
PORTAL_ROOT = REPO_ROOT / "projects" / "portal"

REDIRECT_FILES = {
    PORTAL_ROOT / "blog" / "es" / "qr-code-guide.html",
    PORTAL_ROOT / "blog" / "de" / "2048-game-guide.html",
    PORTAL_ROOT / "blog" / "en" / "2048-game-guide.html",
    PORTAL_ROOT / "blog" / "en" / "2026-02-10-psychology-tests-guide.html",
    PORTAL_ROOT / "blog" / "en" / "future-self-prediction-test.html",
    PORTAL_ROOT / "blog" / "en" / "dopabrain-games-2026.html",
    PORTAL_ROOT / "blog" / "fr" / "test-velocidad-escritura-guia.html",
    PORTAL_ROOT / "blog" / "de" / "flappy-bird-guide.html",
    PORTAL_ROOT / "blog" / "de" / "quiz-desarrollador-guia.html",
    PORTAL_ROOT / "blog" / "en" / "block-puzzle-guide.html",
    PORTAL_ROOT / "blog" / "en" / "2026-free-brain-games-top10.html",
    PORTAL_ROOT / "blog" / "free-games.html",
    PORTAL_ROOT / "blog" / "iq-test-guide.html",
    PORTAL_ROOT / "blog" / "focus-methods.html",
    PORTAL_ROOT / "blog" / "sleep-guide.html",
}

REDIRECT_MAP = {
    "https://dopabrain.com/portal/blog/es/qr-code-guide.html": "https://dopabrain.com/portal/blog/en/qr-generator-guide.html",
    "https://dopabrain.com/portal/blog/de/2048-game-guide.html": "https://dopabrain.com/portal/blog/2048-game-guide.html",
    "https://dopabrain.com/portal/blog/en/2048-game-guide.html": "https://dopabrain.com/portal/blog/2048-game-guide.html",
    "https://dopabrain.com/portal/blog/en/2026-02-10-psychology-tests-guide.html": "https://dopabrain.com/portal/blog/en/2026-02-10-personality-tests-guide.html",
    "https://dopabrain.com/portal/blog/en/future-self-prediction-test.html": "https://dopabrain.com/portal/blog/en/future-self-test-guide.html",
    "https://dopabrain.com/portal/blog/en/dopabrain-games-2026.html": "https://dopabrain.com/portal/games/",
    "https://dopabrain.com/portal/blog/fr/test-velocidad-escritura-guia.html": "https://dopabrain.com/portal/blog/en/typing-speed-test-guide.html",
    "https://dopabrain.com/portal/blog/de/flappy-bird-guide.html": "https://dopabrain.com/portal/blog/en/flappy-bird-game-guide.html",
    "https://dopabrain.com/portal/blog/de/quiz-desarrollador-guia.html": "https://dopabrain.com/portal/blog/es/quiz-desarrollador-guia.html",
    "https://dopabrain.com/portal/blog/en/block-puzzle-guide.html": "https://dopabrain.com/portal/blog/en/block-puzzle-game-guide.html",
    "https://dopabrain.com/portal/blog/en/2026-free-brain-games-top10.html": "https://dopabrain.com/portal/blog/en/best-free-brain-training-games-2026.html",
    "https://dopabrain.com/portal/blog/free-games.html": "https://dopabrain.com/portal/games/",
    "https://dopabrain.com/portal/blog/iq-test-guide.html": "https://dopabrain.com/portal/blog/en/free-iq-test-guide.html",
    "https://dopabrain.com/portal/blog/focus-methods.html": "https://dopabrain.com/portal/blog/",
    "https://dopabrain.com/portal/blog/sleep-guide.html": "https://dopabrain.com/portal/blog/en/sleep-science.html",
}

LOC_RE_TPL = r"\s*<url>\s*<loc>{loc}</loc>.*?</url>\s*"


def variants(url: str) -> list[tuple[str, str]]:
    path = urlparse(url).path
    target_path = urlparse(REDIRECT_MAP[url]).path

    items = [(url, REDIRECT_MAP[url]), (path, target_path)]
    if path.startswith("/portal/") and target_path.startswith("/portal/"):
        items.append((path[len("/portal/") :], target_path[len("/portal/") :]))
    return items


def cleanup_file(path: Path) -> bool:
    if path in REDIRECT_FILES:
        return False

    text = path.read_text(encoding="utf-8")
    original = text

    for old_url in REDIRECT_MAP:
        text = re.sub(
            LOC_RE_TPL.format(loc=re.escape(old_url)),
            "\n",
            text,
            flags=re.DOTALL,
        )

    cleaned_lines: list[str] = []
    for line in text.splitlines():
        if any(old in line for old in REDIRECT_MAP):
            if "hreflang=" in line or "xhtml:link" in line:
                continue
        cleaned_lines.append(line)
    text = "\n".join(cleaned_lines)

    for old_url in REDIRECT_MAP:
        for old, new in variants(old_url):
            text = text.replace(old, new)

    if text != original:
        trailing = "\n" if original.endswith("\n") else ""
        path.write_text(text + trailing, encoding="utf-8")
        return True
    return False


def main() -> int:
    changed = 0
    for path in PORTAL_ROOT.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".html", ".xml", ".js"}:
            continue
        if cleanup_file(path):
            changed += 1

    print(f"updated {changed} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

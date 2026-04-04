from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]
BLOG_ROOT = REPO_ROOT / "projects" / "portal" / "blog"
HREF_RE = re.compile(
    r'<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"',
    re.IGNORECASE,
)
HREF_LINE_RE = re.compile(
    r'^(?P<indent>\s*)<link\s+rel="alternate"\s+hreflang="(?P<lang>[^"]+)"\s+href="(?P<href>[^"]+)">\s*$',
    re.IGNORECASE,
)


def collect_files(items: list[str]) -> list[Path]:
    if not items:
        return sorted(BLOG_ROOT.rglob("*.html"))

    files: list[Path] = []
    for item in items:
        path = Path(item)
        if not path.is_absolute():
            path = (REPO_ROOT / item).resolve()
        if path.is_dir():
            files.extend(sorted(path.rglob("*.html")))
        elif path.is_file():
            files.append(path)
    return files


def resolve_blog_target(href: str) -> Path | None:
    parsed = urlparse(href)
    path = parsed.path
    if not path.startswith("/portal/blog/"):
        return None

    rel = path[len("/portal/blog/") :].lstrip("/")
    target = BLOG_ROOT / rel
    if target.suffix == "":
        target = target / "index.html"
    return target


def get_issue_code(href: str) -> str | None:
    if "/portal/blog/{lang}/" in href:
        return "PLACEHOLDER"

    if "/portal/blog/ru/ru/" in href:
        return "DUPLICATE_LANG_SEGMENT"

    target = resolve_blog_target(href)
    if target is not None and not target.exists():
        return "MISSING_TARGET"

    return None


def process_file(file_path: Path, fix: bool) -> tuple[list[str], bool]:
    text = file_path.read_text(encoding="utf-8")
    issues: list[str] = []

    for lang, href in HREF_RE.findall(text):
        issue_code = get_issue_code(href)
        if issue_code is not None:
            issues.append(f"{issue_code}\t{file_path}\t{lang}\t{href}")

    if not fix or not issues:
        return issues, False

    updated_lines: list[str] = []
    changed = False
    for line in text.splitlines():
        match = HREF_LINE_RE.match(line)
        if match:
            href = match.group("href")
            if get_issue_code(href) is not None:
                changed = True
                continue
        updated_lines.append(line)

    if changed:
        trailing_newline = "\n" if text.endswith("\n") else ""
        file_path.write_text("\n".join(updated_lines) + trailing_newline, encoding="utf-8")

    return issues, changed


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check blog hreflang targets for placeholders, duplicated locale segments, and missing files."
    )
    parser.add_argument("paths", nargs="*", help="Optional files or directories to check.")
    parser.add_argument("--fix", action="store_true", help="Remove invalid alternate hreflang lines in place.")
    args = parser.parse_args()

    issues: list[str] = []
    changed_files = 0
    for file_path in collect_files(args.paths):
        file_issues, changed = process_file(file_path, fix=args.fix)
        issues.extend(file_issues)
        if changed:
            changed_files += 1

    if issues:
        if args.fix:
            print(f"FIXED\t{changed_files}\tfiles")
        else:
            for issue in issues:
                print(issue)
            return 1

    print("OK: no missing blog hreflang targets found")
    return 0


if __name__ == "__main__":
    sys.exit(main())

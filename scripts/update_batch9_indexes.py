from __future__ import annotations

import html
import re
from pathlib import Path


BASE_DIR = Path("E:/Fire Project/projects/portal/blog")
PUBLISH_DATE = "2026-03-27"

POSTS = [
    {
        "slug": "attachment-style-quiz-guide",
        "card_class": "psychology",
        "accent": "#e91e63",
        "category_key": "relationships",
    },
    {
        "slug": "people-pleasing-fawn-response-guide",
        "card_class": "psychology",
        "accent": "#ff7043",
        "category_key": "trauma",
    },
    {
        "slug": "emotional-exhaustion-signs-recovery",
        "card_class": "psychology",
        "accent": "#7e57c2",
        "category_key": "burnout",
    },
    {
        "slug": "boundaries-setting-complete-guide",
        "card_class": "wellness",
        "accent": "#26a69a",
        "category_key": "mind",
    },
    {
        "slug": "gaslighting-signs-recovery-guide",
        "card_class": "psychology",
        "accent": "#ef5350",
        "category_key": "relationships",
    },
]

CATEGORY_LABELS = {
    "hi": {
        "relationships": "रिश्ते",
        "trauma": "ट्रॉमा",
        "burnout": "बर्नआउट",
        "mind": "मन",
    },
    "ja": {
        "relationships": "人間関係",
        "trauma": "トラウマ",
        "burnout": "バーンアウト",
        "mind": "心",
    },
    "es": {
        "relationships": "Relaciones",
        "trauma": "Trauma",
        "burnout": "Burnout",
        "mind": "Mente",
    },
    "ru": {
        "relationships": "Отношения",
        "trauma": "Травма",
        "burnout": "Выгорание",
        "mind": "Разум",
    },
    "pt": {
        "relationships": "Relacionamentos",
        "trauma": "Trauma",
        "burnout": "Burnout",
        "mind": "Mente",
    },
    "id": {
        "relationships": "Hubungan",
        "trauma": "Trauma",
        "burnout": "Burnout",
        "mind": "Pikiran",
    },
    "tr": {
        "relationships": "İlişkiler",
        "trauma": "Travma",
        "burnout": "Tükenmişlik",
        "mind": "Zihin",
    },
    "de": {
        "relationships": "Beziehungen",
        "trauma": "Trauma",
        "burnout": "Burnout",
        "mind": "Geist",
    },
    "fr": {
        "relationships": "Relations",
        "trauma": "Traumatisme",
        "burnout": "Burnout",
        "mind": "Esprit",
    },
}

READ_MORE = {
    "hi": "और पढ़ें",
    "ja": "続きを読む",
    "es": "Leer más",
    "ru": "Читать далее",
    "pt": "Ler mais",
    "id": "Baca selengkapnya",
    "tr": "Devamını oku",
    "de": "Weiterlesen",
    "fr": "Lire la suite",
}

SECTION_TITLE_PATTERN = re.compile(r"\n\s*<h2 class=\"section-title\">", re.DOTALL)
TITLE_PATTERN = re.compile(r"<meta\s+property=\"og:title\"\s+content=\"(.*?)\"\s*/?>", re.IGNORECASE)
FALLBACK_TITLE_PATTERN = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def extract_first(pattern: re.Pattern[str], content: str) -> str | None:
    match = pattern.search(content)
    if not match:
        return None
    return html.unescape(match.group(1).strip())


def extract_title(content: str) -> str:
    title = extract_first(TITLE_PATTERN, content)
    if title:
        return title
    fallback = extract_first(FALLBACK_TITLE_PATTERN, content)
    if not fallback:
        raise ValueError("Unable to extract title")
    return fallback.replace(" | DopaBrain", "").strip()


def build_card(lang: str, post: dict[str, str], title: str) -> str:
    category = CATEGORY_LABELS[lang][post["category_key"]]
    read_more = READ_MORE[lang]
    slug = post["slug"]
    return (
        f'            <a href="/portal/blog/{lang}/{slug}.html" '
        f'class="blog-card {post["card_class"]}" style="--card-accent: {post["accent"]};">\n'
        f"                <span class=\"blog-category\">{category}</span>\n"
        f"                <h3>{title}</h3>\n"
        f"                <div class=\"blog-meta\"><span>{PUBLISH_DATE}</span></div>\n"
        f"                <span class=\"read-more\">{read_more} →</span>\n"
        f"            </a>"
    )


def update_index(lang: str) -> str:
    index_path = BASE_DIR / lang / "index.html"
    if not index_path.exists():
        return f"SKIP {lang}: index.html not found"

    content = index_path.read_text(encoding="utf-8")

    if POSTS[0]["slug"] in content:
        return f"SKIP {lang}: batch9 cards already present"

    cards: list[str] = []

    for post in POSTS:
        article_path = BASE_DIR / lang / f'{post["slug"]}.html'
        if not article_path.exists():
            return f"SKIP {lang}: missing {article_path.name}"

        article = article_path.read_text(encoding="utf-8")
        title = extract_title(article)
        cards.append(build_card(lang, post, title))

    matches = list(SECTION_TITLE_PATTERN.finditer(content))
    if not matches:
        return f"SKIP {lang}: language section not found"

    insert_at = matches[-1].start()
    injection = "\n" + "\n".join(cards) + "\n"
    updated = content[:insert_at] + injection + content[insert_at:]
    index_path.write_text(updated, encoding="utf-8")
    return f"OK {lang}: added 5 batch9 cards"


def main() -> None:
    langs = ["hi", "ja", "es", "ru", "pt", "id", "tr", "de", "fr"]
    for lang in langs:
        print(update_index(lang))


if __name__ == "__main__":
    main()

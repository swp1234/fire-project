#!/usr/bin/env node

const fs = require("fs"),
  http = require("http"),
  path = require("path");
const { chromium } = require("playwright");
const { listenOnSafePort } = require("./lib/safe-local-port");
const ROOT = path.resolve(__dirname, ".."),
  PORTAL = path.join(ROOT, "projects", "portal"),
  APP = path.join(ROOT, "projects", "stress-check");
const ROUTE = "/portal/blog/zh/cognitive-distortions-list.html",
  LIVE = `https://dopabrain.com${ROUTE}`;
const QUICK = ["stress-check", "hsp-test", "emotional-regulation", "hsp-guide"];
function ok(v, m) {
  if (!v) throw Error(m);
}
function clone(v) {
  return JSON.parse(JSON.stringify(v));
}
function visible(h) {
  return h
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}
function events(l) {
  return l
    .map((x) => Array.from(x || []))
    .filter((x) => x[0] === "event")
    .map((x) => ({ name: x[1], params: x[2] || {} }));
}
function fixture() {
  return {
    guide: fs.readFileSync(
      path.join(PORTAL, "blog", "zh", "cognitive-distortions-list.html"),
      "utf8",
    ),
    index: fs.readFileSync(
      path.join(PORTAL, "blog", "zh", "index.html"),
      "utf8",
    ),
    sitemap: fs.readFileSync(path.join(PORTAL, "blog", "sitemap.xml"), "utf8"),
    html: fs.readFileSync(path.join(APP, "index.html"), "utf8"),
    app: fs.readFileSync(path.join(APP, "js", "app.js"), "utf8"),
    data: fs.readFileSync(path.join(APP, "js", "data.js"), "utf8"),
    readme: fs.readFileSync(path.join(APP, "README.md"), "utf8"),
    locales: fs
      .readdirSync(path.join(APP, "js", "locales"))
      .filter((x) => x.endsWith(".json"))
      .map((file) =>
        fs.readFileSync(path.join(APP, "js", "locales", file), "utf8"),
      ),
  };
}
function source(v) {
  const text = visible(v.guide),
    all = [v.html, v.app, v.data, v.readme, ...v.locales].join("\n");
  ok(
    v.guide.includes('data-zh-thought-check-contract="2026-08-30"'),
    "Chinese thought-check marker missing",
  );
  ok(
    /<meta name="dateModified" content="2026-08-30" \/>/.test(v.guide),
    "Chinese thought-check date stale",
  );
  ok(
    (
      v.guide.match(
        /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g,
      ) || []
    ).length === 1,
    "Chinese thought-check Auto Ads drifted",
  );
  ok(
    !/FAQPage|AggregateRating|content_ad_impression|data-ad-slot=|adsbygoogle\.push/.test(
      v.guide,
    ),
    "Chinese thought-check unsupported schema or ad telemetry",
  );
  ok(
    /不是诊断/.test(text) &&
      /不能诊断、治疗或替代专业照护/.test(text) &&
      /15种常见模式/.test(text),
    "Chinese thought-check boundary or list missing",
  );
  const patternCount = (v.guide.match(/class="pattern"/g) || []).length;
  ok(patternCount === 15, "Chinese thought-check pattern count drifted");
  for (const s of [
    "thought-record/",
    "self-help-cbt-techniques/",
    "who.int/publications/b/53604",
  ])
    ok(v.guide.includes(s), `Chinese thought-check source missing: ${s}`);
  ok(
    v.guide.includes(
      "/stress-check/?lang=zh&amp;start=1&amp;surface=zh_cognitive_distortion_primary",
    ),
    "Chinese thought-check primary route broken",
  );
  const quick = [
    ...v.guide.matchAll(
      /<a\s+class="[^"]*\bquick-card\b[^"]*"[^>]*data-target-slug="([^"]+)"/g,
    ),
  ].map((x) => x[1]);
  ok(
    JSON.stringify(quick) === JSON.stringify(QUICK),
    "Chinese thought-check quick routes drifted",
  );
  ok(
    /intersectionRatio\s*>=\s*0?\.5/.test(v.guide) &&
      /},\s*500\)/.test(v.guide) &&
      /content_zh_thought_check_view/.test(v.guide) &&
      /content_zh_thought_check_use/.test(v.guide),
    "Chinese thought-check interaction telemetry incomplete",
  );
  ok(
    v.sitemap.includes(`<loc>${LIVE}</loc><lastmod>2026-08-30</lastmod>`),
    "Chinese thought-check sitemap stale",
  );
  ok(/识别与证据检查/.test(v.index), "Chinese thought-check catalog stale");
  ok(
    v.html.includes('data-stress-check-contract="2026-09-03"'),
    "Stress Check contract missing",
  );
  ok(
    (
      v.html.match(
        /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g,
      ) || []
    ).length === 1,
    "Stress Check Auto Ads drifted",
  );
  ok(
    !/FAQPage|AggregateRating|page_engage|content_ad_impression|social-proof|btn-premium|data-ad-slot=/.test(
      v.html,
    ),
    "Stress Check page retains fake proof or ad telemetry",
  );
  ok(
    !/result_type:|score:|percentage:|plan_focus:|share_url:/.test(v.app),
    "Stress Check telemetry leaks result data",
  );
  ok(
    /getAutoStartSurface/.test(v.app) &&
      /zh_cognitive_distortion_\(primary\|quick\)/.test(v.app),
    "Stress Check linked entry contract missing",
  );
  ok(
    !/shareResult|saveResultImage|btn-share|btn-save-image|result-canvas/.test(
      v.app + "\n" + v.html,
    ),
    "Stress Check retired result action returned",
  );
  ok(
    !/AI|인공지능|人工智能|unlockPremium|socialProof|percentileStat|aiAnalysis|watchVideo/.test(
      all,
    ),
    "Stress Check dormant fake promise remains",
  );
  ok(
    v.locales.length === 12 &&
      v.locales.every((x) => /"trust"/.test(x) && /"actionPlan"/.test(x)),
    "Stress Check locale trust contract missing",
  );
  return {
    patterns: patternCount,
    quick: quick.length,
    sources: 3,
    locales: 12,
  };
}
function mutations(base) {
  const cases = [
    [
      "faq",
      "unsupported schema",
      (v) =>
        (v.guide +=
          '<script type="application/ld+json">{"@type":"FAQPage"}</script>'),
    ],
    [
      "boundary",
      "boundary or list missing",
      (v) =>
        (v.guide = v.guide.replace(
          "不能诊断、治疗或替代专业照护",
          "可以诊断和治疗",
        )),
    ],
    [
      "source",
      "source missing",
      (v) => (v.guide = v.guide.replace("thought-record/", "removed/")),
    ],
    [
      "route",
      "primary route broken",
      (v) =>
        (v.guide = v.guide.replace(
          "zh_cognitive_distortion_primary",
          "broken",
        )),
    ],
    [
      "quick",
      "quick routes drifted",
      (v) =>
        (v.guide = v.guide.replace(
          'data-target-slug="hsp-test"',
          'data-target-slug="stress-check"',
        )),
    ],
    [
      "easy-view",
      "interaction telemetry incomplete",
      (v) =>
        (v.guide = v.guide.replace(
          "intersectionRatio >= 0.5",
          "intersectionRatio >= 0",
        )),
    ],
    [
      "fake-proof",
      "fake proof or ad telemetry",
      (v) =>
        (v.html = v.html.replace(
          "<main",
          '<div class="social-proof">4,800 users</div><main',
        )),
    ],
    [
      "result-leak",
      "telemetry leaks result data",
      (v) =>
        (v.app = v.app.replace(
          "content_type: 'reflection',",
          "content_type: 'reflection', result_type:this.stressLevel.level,",
        )),
    ],
    [
      "retired-share",
      "retired result action returned",
      (v) =>
        (v.app +=
          "\nshareResult(){navigator.share({text:this.totalScore})}\n"),
    ],
    [
      "locale-ai",
      "dormant fake promise remains",
      (v) =>
        (v.locales[0] = v.locales[0].replace(
          '"trust"',
          '"aiAnalysis": "AI unlock", "trust"',
        )),
    ],
  ];
  for (const [n, e, m] of cases) {
    const v = clone(base);
    m(v);
    let msg = "";
    try {
      source(v);
    } catch (x) {
      msg = x.message;
    }
    ok(msg.includes(e), `${n} mutation escaped: ${msg || "passed"}`);
    console.log(`[PASS] ${n}: ${msg}`);
  }
}
function server() {
  const types = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
  };
  return http.createServer((q, r) => {
    const p = decodeURIComponent(new URL(q.url, "http://x").pathname);
    let base, rel;
    if (p.startsWith("/portal/")) {
      base = PORTAL;
      rel = p.slice(8);
    } else if (p.startsWith("/stress-check/")) {
      base = APP;
      rel = p.slice(14);
    } else {
      r.writeHead(404);
      r.end();
      return;
    }
    let f = path.resolve(base, rel);
    if (!(f === base || f.startsWith(base + path.sep))) {
      r.writeHead(403);
      r.end();
      return;
    }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory())
      f = path.join(f, "index.html");
    if (!fs.existsSync(f)) {
      r.writeHead(404);
      r.end();
      return;
    }
    r.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": `${types[path.extname(f)] || "application/octet-stream"}; charset=utf-8`,
    });
    fs.createReadStream(f).pipe(r);
  });
}
async function prep(p, local) {
  if (local)
    await p.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) =>
      /googletagmanager|googlesyndication/.test(r.request().url())
        ? r.fulfill({
            status: 200,
            contentType: "application/javascript",
            body: "",
          })
        : r.abort(),
    );
  await p.addInitScript(() => {
    window.dataLayer = [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  });
}
async function runtime(url, local) {
  const b = await chromium.launch({ headless: true }),
    layouts = [];
  try {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      const c = await b.newContext({ viewport, serviceWorkers: "block" }),
        p = await c.newPage();
      await prep(p, local);
      const errors = [];
      p.on("pageerror", (e) => errors.push(String(e)));
      await p.goto(url, { waitUntil: "domcontentloaded" });
      const s = await p.evaluate(() => ({
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        h1: document.querySelectorAll("h1").length,
        targets: [...document.querySelectorAll("a,button")]
          .filter((x) => x.offsetParent)
          .map((x) => ({
            w: x.getBoundingClientRect().width,
            h: x.getBoundingClientRect().height,
          })),
      }));
      ok(
        s.overflow === 0 && s.h1 === 1 && errors.length === 0,
        `Chinese thought-check ${viewport.width}px layout error`,
      );
      for (const t of s.targets)
        ok(
          t.w >= 44 && t.h >= 44,
          `Chinese thought-check target below 44px: ${JSON.stringify(t)}`,
        );
      layouts.push(viewport.width);
      await c.close();
    }
    const c = await b.newContext({
        viewport: { width: 390, height: 844 },
        serviceWorkers: "block",
      }),
      p = await c.newPage();
    await prep(p, local);
    await p.goto(url, { waitUntil: "domcontentloaded" });
    await p
      .locator(".thought-check")
      .evaluate((n) => n.scrollIntoView({ block: "center" }));
    await p.waitForTimeout(250);
    let rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      !rows.some((x) => x.name === "content_zh_thought_check_view"),
      "Thought-check view fired early",
    );
    await p.waitForFunction(() =>
      dataLayer.some(
        (x) => x[0] === "event" && x[1] === "content_zh_thought_check_view",
      ),
    );
    for (const button of await p.locator(".check button").all())
      await button.click();
    rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      rows.filter((x) => x.name === "content_zh_thought_check_use").length ===
        1,
      "Thought-check use mismatch",
    );
    await p.evaluate(() =>
      document.addEventListener(
        "click",
        (e) => {
          if (e.target.closest(".cta")) e.preventDefault();
        },
        true,
      ),
    );
    await p.click(".cta");
    rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      rows.filter((x) => x.name === "content_cta_click").length === 1,
      "Thought-check CTA mismatch",
    );
    const href = await p.locator(".cta").getAttribute("href");
    await p.goto(new URL(href, new URL(url).origin).href, {
      waitUntil: "domcontentloaded",
    });
    await p.waitForFunction(
      () =>
        document.documentElement.lang === "zh" &&
        document.getElementById("question-screen").classList.contains("active"),
    );
    for (let i = 0; i < 15; i++) {
      await p.locator(".option-btn").first().click();
      if (i < 14) {
        await p.waitForFunction(
          (expected) =>
            document.getElementById("progress-text").textContent.trim() ===
            `${expected} / 15`,
          i + 2,
        );
      }
    }
    await p.waitForFunction(() =>
      document.getElementById("result-screen").classList.contains("active"),
    );
    rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      rows.filter(
        (x) =>
          x.name === "test_start" &&
          x.params.cta_surface === "zh_cognitive_distortion_primary",
      ).length === 1,
      "Stress linked start mismatch",
    );
    ok(
      rows.filter((x) => x.name === "test_complete").length === 1,
      "Stress completion mismatch",
    );
    ok(
      !/result_type|score|percentage|plan_focus|answer/.test(
        JSON.stringify(rows),
      ),
      "Stress runtime telemetry leaked private result",
    );
    await c.close();
    return {
      layouts,
      view: 1,
      use: 1,
      cta: 1,
      start: 1,
      complete: 1,
      private: true,
    };
  } finally {
    await b.close();
  }
}
async function main() {
  const a = process.argv.slice(2),
    mi = a.includes("--mutations"),
    ui = a.indexOf("--url"),
    url = ui >= 0 ? a[ui + 1] : null;
  ok(
    a.length === (mi ? 1 : 0) + (ui >= 0 ? 2 : 0) && !(mi && url),
    "Usage: verifier [--mutations] | --url " + LIVE,
  );
  if (url) {
    ok(new URL(url).href === LIVE, "Live URL mismatch");
    console.log("PASS live " + JSON.stringify(await runtime(url, false)));
    return;
  }
  const base = fixture(),
    s = source(base);
  if (mi) mutations(base);
  const srv = server(),
    addr = await listenOnSafePort(srv);
  try {
    console.log(
      "PASS " +
        JSON.stringify({
          source: s,
          runtime: await runtime(`http://127.0.0.1:${addr.port}${ROUTE}`, true),
        }),
    );
  } finally {
    await new Promise((r) => srv.close(r));
  }
}
main().catch((e) => {
  console.error(e.stack || e.message);
  process.exitCode = 1;
});

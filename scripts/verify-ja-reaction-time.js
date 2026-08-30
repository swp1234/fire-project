#!/usr/bin/env node
const fs = require("fs"),
  http = require("http"),
  path = require("path");
const { chromium } = require("playwright");
const { listenOnSafePort } = require("./lib/safe-local-port");
const ROOT = path.resolve(__dirname, ".."),
  PORTAL = path.join(ROOT, "projects", "portal"),
  APP = path.join(ROOT, "projects", "reaction-test");
const ROUTE = "/portal/blog/ja/reaction-time-test-guide.html",
  LIVE = `https://dopabrain.com${ROUTE}`;
const QUICK = [
  "reaction-test",
  "typing-speed",
  "puzzle-2048",
  "brain-type-guide",
];
function ok(v, m) {
  if (!v) throw Error(m);
}
function clone(v) {
  return JSON.parse(JSON.stringify(v));
}
function visible(v) {
  return v
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}
function events(v) {
  return v
    .map((x) => Array.from(x || []))
    .filter((x) => x[0] === "event")
    .map((x) => ({ name: x[1], params: x[2] || {} }));
}
function fixture() {
  return {
    guide: fs.readFileSync(
      path.join(PORTAL, "blog", "ja", "reaction-time-test-guide.html"),
      "utf8",
    ),
    index: fs.readFileSync(
      path.join(PORTAL, "blog", "ja", "index.html"),
      "utf8",
    ),
    sitemap: fs.readFileSync(path.join(PORTAL, "blog", "sitemap.xml"), "utf8"),
    appHtml: fs.readFileSync(path.join(APP, "index.html"), "utf8"),
    appJs: fs.readFileSync(path.join(APP, "js", "app.js"), "utf8"),
    i18n: fs.readFileSync(path.join(APP, "js", "i18n.js"), "utf8"),
    readme: fs.readFileSync(path.join(APP, "README.md"), "utf8"),
    locales: fs
      .readdirSync(path.join(APP, "js", "locales"))
      .filter((x) => x.endsWith(".json"))
      .map((x) => fs.readFileSync(path.join(APP, "js", "locales", x), "utf8")),
  };
}
function source(v) {
  const text = visible(v.guide),
    app = [v.appHtml, v.appJs, v.i18n, v.readme, ...v.locales].join("\n");
  ok(
    v.guide.includes('data-ja-reaction-guide-contract="2026-08-30"'),
    "Japanese reaction guide marker missing",
  );
  ok(
    v.appHtml.includes('data-reaction-test-contract="2026-08-30"'),
    "Reaction app marker missing",
  );
  ok(
    (
      v.guide.match(
        /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g,
      ) || []
    ).length === 1,
    "Japanese reaction guide Auto Ads drifted",
  );
  ok(
    (
      v.appHtml.match(
        /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g,
      ) || []
    ).length === 1,
    "Reaction app Auto Ads drifted",
  );
  ok(
    !/FAQPage|AggregateRating|content_ad_impression|data-ad-slot=|adsbygoogle\.push/.test(
      v.guide,
    ),
    "Japanese reaction guide unsupported schema or ad telemetry",
  );
  ok(
    !/AggregateRating|FAQPage|page_engage|premium-analysis|interstitial-ad|ad-placeholder|average_time|round_times|getPercentile|generateAIAnalysis|timer_engagement|scroll_engagement/.test(
      app,
    ),
    "Reaction app fake proof, gate, or private telemetry remains",
  );
  ok(
    /医療検査、知能検査/.test(text) &&
      /他人との順位や能力判定には使えません/.test(text) &&
      /解析イベントには送りません/.test(text),
    "Japanese reaction boundary missing",
  );
  for (const x of ["PMC4374455", "27496171", "w3.org/TR/hr-time-2/"])
    ok(v.guide.includes(x), `Japanese reaction source missing: ${x}`);
  ok(
    v.guide.includes(
      "/reaction-test/?lang=ja&amp;start=1&amp;surface=ja_reaction_guide_primary",
    ),
    "Japanese reaction primary route broken",
  );
  const quick = [
    ...v.guide.matchAll(
      /<a class="[^"]*\bquick-card\b[^"]*"[^>]*data-content-surface="quick_rail"[^>]*data-target-slug="([^"]+)"/g,
    ),
  ].map((x) => x[1]);
  ok(
    JSON.stringify(quick) === JSON.stringify(QUICK),
    "Japanese reaction quick routes drifted",
  );
  ok(
    /intersectionRatio>=\.5/.test(v.guide) &&
      /},500\)/.test(v.guide) &&
      /content_ja_reaction_setup_view/.test(v.guide) &&
      /content_ja_reaction_setup_use/.test(v.guide),
    "Japanese reaction qualified interaction incomplete",
  );
  ok(
    !/selected_item|selected_count|round_time|average_time|reaction_time/.test(
      v.guide,
    ),
    "Japanese reaction guide leaks a selection",
  );
  ok(
    v.sitemap.includes(`<loc>${LIVE}</loc><lastmod>2026-08-30</lastmod>`),
    "Japanese reaction sitemap stale",
  );
  ok(
    /反応速度テスト：端末差と測り方/.test(v.index) &&
      /更新 2026-08/.test(v.index),
    "Japanese reaction catalog stale",
  );
  ok(
    /queryLang/.test(v.i18n) &&
      /params\.get\('start'\) === '1'/.test(v.appJs) &&
      /performance\.now\(\)/.test(v.appJs),
    "Reaction linked entry or timer missing",
  );
  ok(
    /reaction_test_view/.test(v.appJs) &&
      /reaction_test_start/.test(v.appJs) &&
      /reaction_test_complete/.test(v.appJs) &&
      /await navigator\.share/.test(v.appJs) &&
      /await navigator\.clipboard\.writeText/.test(v.appJs),
    "Reaction private funnel or share gate missing",
  );
  ok(
    v.locales.length === 12 &&
      v.locales.every(
        (x) => /"trust"/.test(x) && !/"premium"|"grades"|"topPercent"/.test(x),
      ),
    "Reaction locale trust contract missing",
  );
  return { sources: 3, quick: 4, locales: 12, prompts: 3 };
}
function mutations(base) {
  const cases = [
    [
      "guide-schema",
      "unsupported schema",
      (v) =>
        (v.guide +=
          '<script type="application/ld+json">{"@type":"FAQPage"}</script>'),
    ],
    [
      "guide-boundary",
      "boundary missing",
      (v) =>
        (v.guide = v.guide.replace(
          "他人との順位や能力判定には使えません",
          "順位を正確に判定します",
        )),
    ],
    [
      "guide-source",
      "source missing",
      (v) => (v.guide = v.guide.replace("PMC4374455", "removed")),
    ],
    [
      "guide-route",
      "primary route broken",
      (v) => (v.guide = v.guide.replace("ja_reaction_guide_primary", "broken")),
    ],
    [
      "guide-quick",
      "quick routes drifted",
      (v) =>
        (v.guide = v.guide.replace(
          'data-target-slug="typing-speed"',
          'data-target-slug="reaction-test"',
        )),
    ],
    [
      "guide-easy-view",
      "qualified interaction incomplete",
      (v) =>
        (v.guide = v.guide.replace(
          "intersectionRatio>=.5",
          "intersectionRatio>=0",
        )),
    ],
    [
      "app-rating",
      "fake proof, gate, or private telemetry remains",
      (v) =>
        (v.appHtml = v.appHtml.replace(
          "<main",
          "<div>AggregateRating 4.9</div><main",
        )),
    ],
    [
      "app-result-leak",
      "fake proof, gate, or private telemetry remains",
      (v) =>
        (v.appJs = v.appJs.replace(
          "content_type: 'browser_measurement'",
          "content_type: 'browser_measurement', average_time: average",
        )),
    ],
    [
      "app-autostart",
      "linked entry or timer missing",
      (v) =>
        (v.appJs = v.appJs.replace(
          "params.get('start') === '1'",
          "params.get('start') === '0'",
        )),
    ],
    [
      "locale-premium",
      "locale trust contract missing",
      (v) =>
        (v.locales[0] = v.locales[0].replace(
          '"trust"',
          '"premium": {},\n  "trust"',
        )),
    ],
  ];
  for (const [name, expected, mutate] of cases) {
    const v = clone(base);
    mutate(v);
    let msg = "";
    try {
      source(v);
    } catch (e) {
      msg = e.message;
    }
    ok(msg.includes(expected), `${name} mutation escaped: ${msg || "passed"}`);
    console.log(`[PASS] ${name}: ${msg}`);
  }
}
function server() {
  const types = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json",
  };
  return http.createServer((q, r) => {
    const p = decodeURIComponent(new URL(q.url, "http://x").pathname);
    let base, rel;
    if (p.startsWith("/portal/")) {
      base = PORTAL;
      rel = p.slice(8);
    } else if (p.startsWith("/reaction-test/")) {
      base = APP;
      rel = p.slice(15);
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
    Math.random = () => 0;
  });
}
async function runtime(url, local) {
  const browser = await chromium.launch({ headless: true }),
    layouts = [];
  try {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      const c = await browser.newContext({ viewport, serviceWorkers: "block" }),
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
        s.overflow === 0 && s.h1 === 1 && !errors.length,
        `Japanese reaction ${viewport.width}px layout error`,
      );
      for (const t of s.targets)
        ok(
          t.w >= 44 && t.h >= 44,
          `Japanese reaction target below 44px: ${JSON.stringify(t)}`,
        );
      layouts.push(viewport.width);
      await c.close();
    }
    const c = await browser.newContext({
        viewport: { width: 390, height: 844 },
        serviceWorkers: "block",
      }),
      p = await c.newPage();
    await prep(p, local);
    await p.goto(url, { waitUntil: "domcontentloaded" });
    await p
      .locator(".measure-card h2")
      .evaluate((n) => n.scrollIntoView({ block: "center" }));
    await p.waitForTimeout(250);
    let rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      !rows.some((x) => x.name === "content_ja_reaction_setup_view"),
      "Reaction setup view fired early",
    );
    await p.waitForFunction(() =>
      dataLayer.some(
        (x) => x[0] === "event" && x[1] === "content_ja_reaction_setup_view",
      ),
    );
    for (const x of await p.locator(".check button span").all())
      await x.click();
    rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      rows.filter((x) => x.name === "content_ja_reaction_setup_use").length ===
        1,
      "Reaction setup use mismatch",
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
    await p.locator(".cta").click();
    rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      rows.filter((x) => x.name === "content_cta_click").length === 1,
      "Reaction guide CTA mismatch",
    );
    const href = await p.locator(".cta").getAttribute("href");
    await p.goto(new URL(href, new URL(url).origin).href, {
      waitUntil: "domcontentloaded",
    });
    await p.waitForFunction(
      () =>
        document.documentElement.lang === "ja" &&
        document.getElementById("game-screen").classList.contains("active"),
    );
    for (let i = 0; i < 5; i++) {
      await p.waitForFunction(() =>
        document.getElementById("game-area").classList.contains("ready"),
      );
      await p.locator("#game-area").click();
      if (i < 4)
        await p.waitForFunction(
          (expected) =>
            document.getElementById("round-number").textContent.trim() ===
            String(expected),
          i + 2,
        );
    }
    await p.waitForFunction(
      () =>
        document.getElementById("result-screen").classList.contains("active"),
      null,
      { timeout: 15000 },
    );
    rows = events(
      await p.evaluate(() => dataLayer.map((x) => Array.from(x || []))),
    );
    ok(
      rows.filter(
        (x) =>
          x.name === "reaction_test_start" &&
          x.params.entry_surface === "ja_reaction_guide_primary",
      ).length === 1,
      "Reaction linked start mismatch",
    );
    ok(
      rows.filter((x) => x.name === "reaction_test_complete").length === 1,
      "Reaction completion mismatch",
    );
    ok(
      !/average_time|round_times|reaction_time|grade|percentile/.test(
        JSON.stringify(rows.map((x) => x.params)),
      ),
      "Reaction runtime leaked result data",
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
    await browser.close();
  }
}
async function main() {
  const a = process.argv.slice(2),
    mi = a.includes("--mutations"),
    ui = a.indexOf("--url"),
    url = ui >= 0 ? a[ui + 1] : null;
  ok(
    a.length === (mi ? 1 : 0) + (ui >= 0 ? 2 : 0) && !(mi && url),
    `Usage: verifier [--mutations] | --url ${LIVE}`,
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

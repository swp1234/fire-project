#!/usr/bin/env node

const fs = require("fs"),
  http = require("http"),
  path = require("path");
const { chromium } = require("playwright");
const { listenOnSafePort } = require("./lib/safe-local-port");

const ROOT = path.resolve(__dirname, ".."),
  PORTAL = path.join(ROOT, "projects", "portal"),
  APP = path.join(ROOT, "projects", "hsp-test");
const ROUTE = "/portal/blog/zh/hsp-test-guide.html",
  LIVE = `https://dopabrain.com${ROUTE}`;
const QUICK = [
  "hsp-test",
  "sensory-reset",
  "sensory-map",
  "sensory-overload-guide",
];

function ok(value, message) {
  if (!value) throw Error(message);
}
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function visible(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}
function events(dataLayer) {
  return dataLayer
    .map((row) => Array.from(row || []))
    .filter((row) => row[0] === "event")
    .map((row) => ({ name: row[1], params: row[2] || {} }));
}
function fixture() {
  return {
    guide: fs.readFileSync(
      path.join(PORTAL, "blog", "zh", "hsp-test-guide.html"),
      "utf8",
    ),
    index: fs.readFileSync(
      path.join(PORTAL, "blog", "zh", "index.html"),
      "utf8",
    ),
    sitemap: fs.readFileSync(path.join(PORTAL, "blog", "sitemap.xml"), "utf8"),
    appHtml: fs.readFileSync(path.join(APP, "index.html"), "utf8"),
    appJs: fs.readFileSync(path.join(APP, "js", "app.js"), "utf8"),
  };
}

function source(value) {
  const text = visible(value.guide);
  ok(
    value.guide.includes('data-zh-hsp-guide-contract="2026-08-30"'),
    "Chinese HSP guide marker missing",
  );
  ok(
    value.guide.includes('<meta name="dateModified" content="2026-08-30" />'),
    "Chinese HSP guide date stale",
  );
  ok(
    (
      value.guide.match(
        /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g,
      ) || []
    ).length === 1,
    "Chinese HSP guide Auto Ads drifted",
  );
  ok(
    !/FAQPage|AggregateRating|content_ad_impression|data-ad-slot=|adsbygoogle\.push/.test(
      value.guide,
    ),
    "Chinese HSP guide unsupported schema or ad telemetry",
  );
  ok(
    /不是疾病名称或医学诊断/.test(text) &&
      /不是经验证的临床量表/.test(text) &&
      /不能证明每位敏感者都有相同、先天且固定/.test(text),
    "Chinese HSP guide boundary missing",
  );
  ok(
    !/20道题快速诊断|专业诊断|经过验证的HSP测试|科学研究的专业测试|全球15-20%|必须同时具备.{0,30}才能诊断/.test(
      text,
    ),
    "Chinese HSP guide diagnosis claim returned",
  );
  ok(
    (value.guide.match(/class="card"/g) || []).length === 4 &&
      (value.guide.match(/<button type="button" aria-pressed="false">/g) || [])
        .length === 4,
    "Chinese HSP guide observation structure drifted",
  );
  for (const sourceUrl of [
    "pubmed.ncbi.nlm.nih.gov/9248053/",
    "pubmed.ncbi.nlm.nih.gov/30639671/",
    "pmc.ncbi.nlm.nih.gov/articles/PMC4086365/",
  ])
    ok(value.guide.includes(sourceUrl), `Chinese HSP source missing: ${sourceUrl}`);
  ok(
    value.guide.includes(
      "/hsp-test/?lang=zh&amp;start=1&amp;surface=zh_hsp_guide_primary",
    ),
    "Chinese HSP primary route broken",
  );
  const quick = [
    ...value.guide.matchAll(
      /<a\s+class="[^"]*\bquick-card\b[^"]*"[^>]*data-target-slug="([^"]+)"/g,
    ),
  ].map((match) => match[1]);
  ok(
    JSON.stringify(quick) === JSON.stringify(QUICK),
    "Chinese HSP quick routes drifted",
  );
  ok(
    /intersectionRatio\s*>=\s*0?\.5/.test(value.guide) &&
      /},\s*500\)/.test(value.guide) &&
      /content_zh_hsp_profile_view/.test(value.guide) &&
      /content_zh_hsp_profile_use/.test(value.guide),
    "Chinese HSP interaction telemetry incomplete",
  );
  ok(
    !/selected_prompt|choice_value|selected_count|prompt_value/.test(value.guide),
    "Chinese HSP telemetry leaks a private choice",
  );
  ok(
    value.sitemap.includes(`<loc>${LIVE}</loc><lastmod>2026-08-30</lastmod>`),
    "Chinese HSP sitemap stale",
  );
  ok(
    /HSP高敏感：研究边界与自我观察/.test(value.index) &&
      /更新 2026-08/.test(value.index),
    "Chinese HSP catalog stale",
  );
  ok(
    /function getAutoStartSurface\(\)/.test(value.appJs) &&
      /trackEvent\('test_start',[\s\S]{0,240}cta_surface: ctaSurface/.test(
        value.appJs,
      ) &&
      value.appHtml.includes("not a diagnosis or validated scale"),
    "HSP linked entry contract missing",
  );
  return { observations: 4, prompts: 4, quick: quick.length, sources: 3 };
}

function mutations(base) {
  const cases = [
    [
      "schema",
      "unsupported schema",
      (value) =>
        (value.guide +=
          '<script type="application/ld+json">{"@type":"FAQPage"}</script>'),
    ],
    [
      "boundary",
      "boundary missing",
      (value) =>
        (value.guide = value.guide.replace(
          "不是疾病名称或医学诊断",
          "是一种固定人格",
        )),
    ],
    [
      "claim",
      "diagnosis claim returned",
      (value) =>
        (value.guide = value.guide.replace(
          "研究框架 · 私密反思",
          "20道题快速诊断",
        )),
    ],
    [
      "source",
      "source missing",
      (value) =>
        (value.guide = value.guide.replace(
          "pubmed.ncbi.nlm.nih.gov/9248053/",
          "example.invalid/removed/",
        )),
    ],
    [
      "route",
      "primary route broken",
      (value) =>
        (value.guide = value.guide.replace("zh_hsp_guide_primary", "broken")),
    ],
    [
      "quick",
      "quick routes drifted",
      (value) =>
        (value.guide = value.guide.replace(
          'data-target-slug="sensory-map"',
          'data-target-slug="hsp-test"',
        )),
    ],
    [
      "easy-view",
      "interaction telemetry incomplete",
      (value) =>
        (value.guide = value.guide.replace(
          "intersectionRatio >= 0.5",
          "intersectionRatio >= 0",
        )),
    ],
    [
      "choice-leak",
      "leaks a private choice",
      (value) =>
        (value.guide = value.guide.replace(
          'interaction_name: "four_prompt_reflection",',
          'interaction_name: "four_prompt_reflection", selected_count: done,',
        )),
    ],
    [
      "catalog",
      "catalog stale",
      (value) =>
        (value.index = value.index.replace(
          "HSP高敏感：研究边界与自我观察",
          "旧HSP页面",
        )),
    ],
    [
      "linked-entry",
      "linked entry contract missing",
      (value) =>
        (value.appJs = value.appJs.replace(
          "function getAutoStartSurface()",
          "function removedAutoStartSurface()",
        )),
    ],
  ];
  for (const [name, expected, mutate] of cases) {
    const value = clone(base);
    mutate(value);
    let message = "";
    try {
      source(value);
    } catch (error) {
      message = error.message;
    }
    ok(
      message.includes(expected),
      `${name} mutation escaped: ${message || "passed"}`,
    );
    console.log(`[PASS] ${name}: ${message}`);
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
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://local").pathname,
    );
    let base;
    let relative;
    if (pathname.startsWith("/portal/")) {
      base = PORTAL;
      relative = pathname.slice(8);
    } else if (pathname.startsWith("/hsp-test/")) {
      base = APP;
      relative = pathname.slice(10);
    } else {
      response.writeHead(404);
      response.end();
      return;
    }
    let file = path.resolve(base, relative);
    if (!(file === base || file.startsWith(base + path.sep))) {
      response.writeHead(403);
      response.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8`,
    });
    fs.createReadStream(file).pipe(response);
  });
}

async function prepare(page, local) {
  if (local)
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) =>
      /googletagmanager|googlesyndication/.test(route.request().url())
        ? route.fulfill({
            status: 200,
            contentType: "application/javascript",
            body: "",
          })
        : route.abort(),
    );
  await page.addInitScript(() => {
    window.dataLayer = [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  });
}

async function runtime(url, local) {
  const browser = await chromium.launch({ headless: true });
  const layouts = [];
  try {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      const context = await browser.newContext({
        viewport,
        serviceWorkers: "block",
      });
      const page = await context.newPage();
      await prepare(page, local);
      const errors = [];
      page.on("pageerror", (error) => errors.push(String(error)));
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const state = await page.evaluate(() => ({
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        h1: document.querySelectorAll("h1").length,
        targets: [...document.querySelectorAll("a,button")]
          .filter((node) => node.offsetParent)
          .map((node) => ({
            width: node.getBoundingClientRect().width,
            height: node.getBoundingClientRect().height,
          })),
      }));
      ok(
        state.overflow === 0 && state.h1 === 1 && errors.length === 0,
        `Chinese HSP guide ${viewport.width}px layout error`,
      );
      for (const target of state.targets)
        ok(
          target.width >= 44 && target.height >= 44,
          `Chinese HSP guide target below 44px: ${JSON.stringify(target)}`,
        );
      layouts.push(viewport.width);
      await context.close();
    }

    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    await prepare(page, local);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page
      .locator(".profile-check h2")
      .evaluate((node) => node.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(250);
    let rows = events(
      await page.evaluate(() => dataLayer.map((row) => Array.from(row || []))),
    );
    ok(
      !rows.some((row) => row.name === "content_zh_hsp_profile_view"),
      "Chinese HSP profile view fired early",
    );
    await page.waitForFunction(() =>
      dataLayer.some(
        (row) => row[0] === "event" && row[1] === "content_zh_hsp_profile_view",
      ),
    );
    for (const label of await page.locator(".reflection button span").all())
      await label.click();
    rows = events(
      await page.evaluate(() => dataLayer.map((row) => Array.from(row || []))),
    );
    ok(
      rows.filter((row) => row.name === "content_zh_hsp_profile_view").length ===
        1 &&
        rows.filter((row) => row.name === "content_zh_hsp_profile_use").length ===
          1,
      "Chinese HSP profile event mismatch",
    );
    ok(
      !/selected_prompt|choice_value|selected_count|prompt_value/.test(
        JSON.stringify(rows.map((row) => row.params)),
      ),
      "Chinese HSP runtime leaked a private choice",
    );

    await page.evaluate(() =>
      document.addEventListener(
        "click",
        (event) => {
          if (event.target.closest(".cta")) event.preventDefault();
        },
        true,
      ),
    );
    await page.locator(".cta").click();
    rows = events(
      await page.evaluate(() => dataLayer.map((row) => Array.from(row || []))),
    );
    ok(
      rows.filter(
        (row) =>
          row.name === "content_cta_click" &&
          row.params.cta_surface === "hero_primary" &&
          row.params.target_slug === "hsp-test",
      ).length === 1,
      "Chinese HSP CTA mismatch",
    );
    const href = await page.locator(".cta").getAttribute("href");
    await page.goto(new URL(href, new URL(url).origin).href, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () =>
        document.documentElement.lang === "zh" &&
        document.getElementById("screen-test").classList.contains("active"),
    );
    for (let category = 1; category <= 5; category += 1) {
      await page.locator("#btn-limit").click();
      if (category < 5)
        await page.waitForFunction(
          (expected) =>
            document.getElementById("cat-progress").textContent.trim() ===
            `${expected} / 5`,
          category + 1,
        );
    }
    await page.waitForFunction(() =>
      document.getElementById("screen-result").classList.contains("active"),
    );
    rows = events(
      await page.evaluate(() => dataLayer.map((row) => Array.from(row || []))),
    );
    ok(
      rows.filter(
        (row) =>
          row.name === "test_start" &&
          row.params.cta_surface === "zh_hsp_guide_primary",
      ).length === 1,
      "HSP linked start mismatch",
    );
    ok(
      rows.filter((row) => row.name === "quiz_complete").length === 1,
      "HSP completion mismatch",
    );
    ok(
      !/catScores|currentLevel|score|percent|result_band|choice/.test(
        JSON.stringify(rows.map((row) => row.params)),
      ),
      "HSP runtime telemetry leaked a private result",
    );
    await context.close();
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
  const args = process.argv.slice(2),
    mutationMode = args.includes("--mutations"),
    urlIndex = args.indexOf("--url"),
    url = urlIndex >= 0 ? args[urlIndex + 1] : null;
  ok(
    args.length === (mutationMode ? 1 : 0) + (urlIndex >= 0 ? 2 : 0) &&
      !(mutationMode && url),
    `Usage: verifier [--mutations] | --url ${LIVE}`,
  );
  if (url) {
    ok(new URL(url).href === LIVE, "Live URL mismatch");
    console.log(`PASS live ${JSON.stringify(await runtime(url, false))}`);
    return;
  }
  const base = fixture(),
    sourceState = source(base);
  if (mutationMode) mutations(base);
  const localServer = server(),
    address = await listenOnSafePort(localServer);
  try {
    console.log(
      `PASS ${JSON.stringify({
        source: sourceState,
        runtime: await runtime(
          `http://127.0.0.1:${address.port}${ROUTE}`,
          true,
        ),
      })}`,
    );
  } finally {
    await new Promise((resolve) => localServer.close(resolve));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

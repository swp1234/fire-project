#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const PROJECTS = path.join(ROOT, "projects");
const IQ_ROOT = path.join(PROJECTS, "iq-test");
const LANGUAGES = [
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "id",
  "ja",
  "ko",
  "pt",
  "ru",
  "tr",
  "zh",
];
const EXPECTED_EVENTS = [
  "iq_puzzle_view",
  "iq_puzzle_start",
  "iq_puzzle_complete",
  "iq_puzzle_share",
  "iq_puzzle_related_click",
];

function fail(message) {
  throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(IQ_ROOT, relativePath), "utf8");
}

function loadQuestions(source = read("js/questions.js")) {
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  return sandbox.window.IQ_PUZZLES;
}

function loadBundle() {
  const locales = {};
  for (const language of LANGUAGES)
    locales[language] = JSON.parse(read(`js/locales/${language}.json`));
  return {
    app: read("js/app.js"),
    html: read("index.html"),
    i18n: read("js/i18n.js"),
    locales,
    manifest: read("manifest.json"),
    questions: JSON.parse(JSON.stringify(loadQuestions())),
    readme: read("README.md"),
    sw: read("sw.js"),
  };
}

function verifySource(bundle) {
  if (!Array.isArray(bundle.questions) || bundle.questions.length !== 10)
    fail("IQ contract must contain exactly ten puzzles");
  const categories = new Set();
  for (const question of bundle.questions) {
    categories.add(question.category);
    if (!question.display || /\p{L}/u.test(question.display))
      fail(`Puzzle ${question.id} is not language neutral`);
    if (
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      question.options.some((option) => /\p{L}/u.test(option))
    )
      fail(`Puzzle ${question.id} choices are not language neutral`);
    if (
      !Number.isInteger(question.correct) ||
      question.correct < 0 ||
      question.correct >= question.options.length
    )
      fail(`Puzzle ${question.id} answer index is invalid`);
  }
  if (
    JSON.stringify([...categories].sort()) !==
    JSON.stringify(["logic", "pattern", "sequence", "spatial"])
  )
    fail("IQ category set drifted");
  if (
    !/calculatePuzzleScore\(score\)/.test(bundle.app) ||
    !/score\s*\/\s*this\.questions\.length/.test(bundle.app)
  )
    fail("IQ score formula is not correct/questions");
  if (
    /(?:page_engage|timer_engagement|scroll_engagement|question_answered|ai_analysis_view|setInterval\s*\(|30-second|30초)/i.test(
      `${bundle.app}\n${bundle.html}\n${bundle.manifest}`,
    )
  )
    fail("IQ legacy timer, synthetic, or answer event remains");
  if (
    /gtag\(["']event["'],\s*name,\s*\{[^}]*\b(?:score|answer|correct|question|result|time|category|value)\s*:/s.test(
      bundle.app,
    )
  )
    fail("IQ event payload leaks answer or result data");
  for (const name of EXPECTED_EVENTS)
    if (!new RegExp(`track\\(["']${name}["'](?:\\)|,)`).test(bundle.app))
      fail(`IQ stage event missing: ${name}`);
  const autoAds =
    bundle.html.match(
      /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g,
    ) || [];
  if (
    autoAds.length !== 1 ||
    /data-ad-slot|adsbygoogle\s*\.\s*push|class=["'][^"']*ad-banner/i.test(
      bundle.html,
    )
  )
    fail("IQ Auto Ads contract is not loader-only");
  if (
    /AggregateRating|aggregateRating|percentile-stat|results\.percentile|\bgrades\b|premium-section|countdown|AI[- ](?:analysis|powered)/i.test(
      `${bundle.html}\n${bundle.app}\n${bundle.readme}`,
    )
  )
    fail("IQ fabricated ranking, gate, or AI claim remains");
  if (
    /\b20\b|timed|time limit per question|action=start/i.test(
      `${bundle.html}\n${bundle.manifest}\n${bundle.readme}`,
    )
  )
    fail("IQ public ten-puzzle contract drifted");
  if (
    !/window\.i18n\s*=\s*i18n/.test(bundle.i18n) ||
    !/queryLanguage/.test(bundle.i18n)
  )
    fail("IQ query locale singleton contract missing");
  if (
    !/requestUrl\.pathname\.startsWith\(APP_ROOT\.pathname\)/.test(bundle.sw) ||
    /clients\.openWindow|notificationclick|\/portal\//.test(bundle.sw)
  )
    fail("IQ service-worker scope is not app-local");
  if (Object.keys(bundle.locales).sort().join(",") !== LANGUAGES.join(","))
    fail("IQ locale inventory drifted");
  const required = [
    ["app", "title"],
    ["app", "description"],
    ["header", "subtitle"],
    ["start", "description"],
    ["start", "disclaimer"],
    ["puzzle", "choose_next"],
    ["puzzle", "find_missing"],
    ["puzzle", "apply_rule"],
    ["results", "correct_count"],
    ["results", "boundary"],
    ["results", "detail_body"],
    ["share", "text"],
    ["accessibility", "skipToMain"],
  ];
  for (const [language, locale] of Object.entries(bundle.locales)) {
    const source = JSON.stringify(locale);
    if (source.includes("�") || source.includes("??"))
      fail(`${language}: damaged locale text`);
    for (const [group, key] of required)
      if (
        typeof locale[group]?.[key] !== "string" ||
        !locale[group][key].trim()
      )
        fail(`${language}: missing ${group}.${key}`);
    if (/\b20\b|30초|30秒|30 seconds|30 segundos|30 секунд/i.test(source))
      fail(`${language}: stale long/timed promise`);
  }
  return {
    questions: bundle.questions.length,
    categories: categories.size,
    locales: Object.keys(bundle.locales).length,
    autoAds: autoAds.length,
  };
}

function expectMutation(name, mutate) {
  const bundle = loadBundle();
  mutate(bundle);
  try {
    verifySource(bundle);
  } catch (error) {
    console.log(`[PASS] ${name}: ${error.message}`);
    return;
  }
  fail(`Mutation escaped: ${name}`);
}

function runMutations() {
  const mutations = [
    ["question-count", (bundle) => bundle.questions.pop()],
    [
      "language-neutral",
      (bundle) => {
        bundle.questions[0] = { ...bundle.questions[0], display: "WORD ?" };
      },
    ],
    [
      "timer-return",
      (bundle) => {
        bundle.app += "\nsetInterval(() => {}, 1000);";
      },
    ],
    [
      "answer-event",
      (bundle) => {
        bundle.app += "\nquestion_answered";
      },
    ],
    [
      "result-payload",
      (bundle) => {
        bundle.app = bundle.app.replace(
          "{ entry_surface: this.surface, ...params }",
          "{ entry_surface: this.surface, score: 10, ...params }",
        );
      },
    ],
    [
      "fake-rating",
      (bundle) => {
        bundle.html += "\nAggregateRating";
      },
    ],
    [
      "manual-ad",
      (bundle) => {
        bundle.html += '\n<div data-ad-slot="auto"></div>';
      },
    ],
    [
      "missing-locale",
      (bundle) => {
        delete bundle.locales.ko;
      },
    ],
    [
      "damaged-locale",
      (bundle) => {
        bundle.locales.ja.app.title += "�";
      },
    ],
    [
      "broad-cache",
      (bundle) => {
        bundle.sw = bundle.sw.replace(
          /\|\|\s*!requestUrl\.pathname\.startsWith\(APP_ROOT\.pathname\)/,
          "",
        );
      },
    ],
  ];
  for (const [name, mutate] of mutations) expectMutation(name, mutate);
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let file = path.resolve(PROJECTS, pathname.replace(/^\/+/, ""));
    if (!file.startsWith(`${PROJECTS}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const types = {
      ".css": "text/css",
      ".html": "text/html",
      ".js": "application/javascript",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".jpg": "image/jpeg",
    };
    response.writeHead(200, {
      "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8`,
    });
    fs.createReadStream(file).pipe(response);
  });
}

async function listen(server) {
  for (let port = 25000; port <= 45000; port += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off("listening", onListening);
          reject(error);
        };
        const onListening = () => {
          server.off("error", onError);
          resolve();
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, "127.0.0.1");
      });
      return port;
    } catch (error) {
      if (!["EADDRINUSE", "EACCES"].includes(error.code)) throw error;
    }
  }
  fail("No safe IQ verification port available");
}

async function instrument(page) {
  await page.addInitScript(() => {
    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) =>
      originalSetTimeout(callback, Math.min(Number(delay) || 0, 5), ...args);
    const events = [];
    const dataLayer = [];
    const originalPush = Array.prototype.push;
    dataLayer.push = function pushProxy(...items) {
      for (const item of items) {
        const args = Array.from(item || []);
        if (args[0] === "event")
          events.push({ name: args[1], params: args[2] || {} });
      }
      return originalPush.apply(this, items);
    };
    window.__iqEvents = events;
    window.dataLayer = dataLayer;
  });
  await page.route("https://**/*", async (route) => {
    const url = route.request().url();
    if (
      /googletagmanager\.com|googlesyndication\.com|doubleclick\.net/.test(url)
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "",
      });
      return;
    }
    await route.continue();
  });
}

function targetUrl(base, language) {
  const url = new URL(base);
  url.searchParams.set("lang", language);
  url.searchParams.set("start", "1");
  url.searchParams.set("surface", "iq_organic_reset");
  return url.href;
}

async function completeJourney(page, base, language, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto(targetUrl(base, language), { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.iqApp && document.querySelector("#screen-test.active"),
  );
  const initial = await page.evaluate(
    (expectedLanguage) => ({
      language: document.documentElement.lang,
      prompt: document.getElementById("question-text")?.textContent || "",
      display: document.getElementById("question-content")?.textContent || "",
      related: [...document.querySelectorAll("[data-related-route]")].map(
        (link) => new URL(link.href).searchParams.get("lang"),
      ),
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      expectedLanguage,
    }),
    language,
  );
  if (
    initial.language !== language ||
    !initial.prompt.trim() ||
    /\p{L}/u.test(initial.display) ||
    initial.related.some((value) => value !== language) ||
    initial.overflow > 0
  )
    fail(
      `IQ ${language}/${width} linked entry failed: ${JSON.stringify(initial)}`,
    );
  for (let index = 0; index < 10; index += 1) {
    await page.locator(".option").first().click();
    if (index < 9)
      await page.waitForFunction(
        (expected) =>
          document.getElementById("progress-current")?.textContent ===
          String(expected),
        index + 2,
      );
  }
  await page.waitForSelector("#screen-results.active");
  const result = await page.evaluate(() => {
    const iqEvents = (window.__iqEvents || []).filter((event) =>
      String(event.name).startsWith("iq_"),
    );
    const counts = Object.fromEntries(
      iqEvents.map((event) => [
        event.name,
        iqEvents.filter((item) => item.name === event.name).length,
      ]),
    );
    const privateParams = iqEvents.every((event) =>
      Object.keys(event.params || {}).every(
        (key) =>
          !/(score|answer|correct|question|result|time|category|value)/i.test(
            key,
          ),
      ),
    );
    const targets = [...document.querySelectorAll("button, a")]
      .filter((node) => node.offsetParent !== null)
      .map((node) => node.getBoundingClientRect())
      .every((rect) => rect.width >= 44 && rect.height >= 44);
    return {
      counts,
      privateParams,
      targets,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      summary: document.getElementById("grade-desc")?.textContent || "",
    };
  });
  for (const name of EXPECTED_EVENTS.slice(0, 3))
    if (result.counts[name] !== 1)
      fail(`IQ ${language}/${width} ${name} count ${result.counts[name] || 0}`);
  if (
    result.counts.iq_puzzle_share ||
    result.counts.iq_puzzle_related_click ||
    !result.privateParams ||
    !result.targets ||
    result.overflow > 0 ||
    !result.summary.includes("10")
  )
    fail(
      `IQ ${language}/${width} result contract failed: ${JSON.stringify(result)}`,
    );
  await page.evaluate(() => {
    document
      .querySelector("[data-related-route]")
      ?.addEventListener("click", (event) => event.preventDefault(), true);
  });
  await page.locator("[data-related-route]").first().click();
  await page.waitForFunction(
    () =>
      (window.__iqEvents || []).filter(
        (event) => event.name === "iq_puzzle_related_click",
      ).length === 1,
  );
  return result;
}

async function verifyShare(page) {
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: () => Promise.reject(new Error("denied")),
    }),
  );
  await page.click("#btn-share");
  await page.waitForTimeout(20);
  let count = await page.evaluate(
    () =>
      (window.__iqEvents || []).filter(
        (event) => event.name === "iq_puzzle_share",
      ).length,
  );
  if (count !== 0) fail("IQ share event fired before success");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });
  await page.click("#btn-share");
  await page.waitForFunction(
    () =>
      (window.__iqEvents || []).filter(
        (event) => event.name === "iq_puzzle_share",
      ).length === 1,
  );
  count = await page.evaluate(
    () =>
      (window.__iqEvents || []).filter(
        (event) => event.name === "iq_puzzle_share",
      ).length,
  );
  if (count !== 1) fail(`IQ successful share count ${count}`);
}

async function runBrowser(base, localServer) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await instrument(page);
  const layouts = new Set();
  try {
    for (const language of LANGUAGES) {
      await completeJourney(page, base, language, 390);
      layouts.add(390);
    }
    await completeJourney(page, base, "ko", 1440);
    layouts.add(1440);
    await verifyShare(page);
    if (errors.length) fail(`IQ page errors: ${errors.join(" | ")}`);
    return {
      layouts: [...layouts],
      locales: LANGUAGES.length,
      journeys: LANGUAGES.length + 1,
      related: 1,
      share: 1,
      private: true,
    };
  } finally {
    await browser.close();
    if (localServer) await new Promise((resolve) => localServer.close(resolve));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf("--url");
  const source = verifySource(loadBundle());
  if (args.includes("--mutations")) runMutations();
  let server = null;
  let base;
  if (urlIndex >= 0) {
    if (!args[urlIndex + 1]) fail("--url requires a value");
    base = args[urlIndex + 1];
  } else {
    server = createServer();
    const port = await listen(server);
    base = `http://127.0.0.1:${port}/iq-test/`;
  }
  const runtime = await runBrowser(base, server);
  console.log(
    `PASS ${urlIndex >= 0 ? "live " : ""}${JSON.stringify({ source, runtime })}`,
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

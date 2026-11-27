'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');

const TOOLS = [
  '/portal/tools/burnout-stress-differential.html',
  '/portal/tools/grounding-exercise.html',
  '/portal/tools/cognitive-load-calculator.html',
  '/portal/tools/cognitive-distortion-reframer.html',
  '/portal/tools/rsd-coping-audit.html',
  '/portal/tools/attachment-trigger-decoder.html',
  '/portal/tools/sleep-chronotype-reset.html',
  '/portal/tools/procrastination-root-decoder.html',
  '/portal/tools/daily-mind-checkin.html',
  '/portal/tools/imposter-syndrome-audit.html',
  '/portal/tools/boundary-script-builder.html',
  '/portal/tools/window-of-tolerance-check.html',
  '/portal/tools/adhd-focus-friction-audit.html',
  '/portal/tools/inner-critic-compassion-lab.html',
  '/portal/tools/overthinking-rumination-breaker.html',
  '/portal/tools/social-battery-recharge-planner.html',
  '/portal/tools/somatic-tension-body-map.html',
  '/portal/tools/emotional-energy-audit.html',
  '/portal/tools/gaslighting-reality-check.html',
  '/portal/tools/codependency-reset-audit.html',
  '/portal/tools/perfectionism-loop-decoder.html',
  '/portal/tools/social-anxiety-exposure-ladder.html',
  '/portal/tools/vagal-nervous-system-reset.html',
  '/portal/tools/doomscrolling-circuit-breaker.html',
  '/portal/tools/inner-child-need-decoder.html',
  '/portal/tools/decision-fatigue-declutter.html',
  '/portal/tools/emotional-flashback-grounding.html',
  '/portal/tools/anxiety-vs-panic-reset.html',
  '/portal/tools/emotional-exhaustion-recovery.html',
  '/portal/tools/emotional-validation-reframer.html',
  '/portal/tools/abandonment-anxiety-soother.html',
  '/portal/tools/nvc-conflict-script-builder.html',
  '/portal/tools/morning-energy-architect.html',
  '/portal/tools/emotional-trigger-decoder.html',
  '/portal/tools/workplace-stress-triage.html',
  '/portal/tools/grief-loss-wave-companion.html',
  '/portal/tools/relationship-green-flag-audit.html',
  '/portal/tools/people-pleasing-fawn-decoder.html',
  '/portal/tools/functional-freeze-thaw-planner.html',
  '/portal/tools/hypervigilance-safety-reset.html',
  '/portal/tools/self-worth-evidence-builder.html',
  '/portal/tools/sensory-overload-calm-kit.html',
  '/portal/tools/avoidant-attachment-thaw-lab.html',
  '/portal/tools/anger-cooldown-deescalator.html',
  '/portal/tools/guilt-vs-responsibility-filter.html',
  '/portal/tools/loneliness-micro-connection-plan.html',
  '/portal/tools/sunday-scaries-week-reset.html',
  '/portal/tools/working-memory-span-trainer.html',
  '/portal/tools/attention-switching-agility-lab.html',
  '/portal/tools/deep-work-focus-readiness.html',
  '/portal/tools/hsp-workplace-energy-planner.html',
  '/portal/tools/nervous-system-state-mapper.html',
  '/portal/tools/burnout-boundary-recovery-calc.html',
  '/portal/tools/sleep-debt-recovery-planner.html',
  '/portal/tools/maladaptive-daydreaming-grounding.html',
  '/portal/tools/executive-dysfunction-micro-ramp.html',
  '/portal/tools/health-anxiety-reassurance-breaker.html',
  '/portal/tools/allostatic-stress-budgeter.html',
  '/portal/tools/self-sabotage-pattern-decoder.html',
  '/portal/tools/comparison-spiral-detox.html',
  '/portal/tools/burnout-return-to-work-planner.html',
  '/portal/tools/digital-eye-strain-focus-reset.html',
  '/portal/tools/conflict-repair-apology-builder.html',
  '/portal/tools/career-decision-clarity-matrix.html',
  '/portal/tools/empathy-fatigue-boundary-kit.html',
  '/portal/tools/pre-sleep-brain-dump-vault.html',
  '/portal/tools/perfectionist-inbox-triage-lab.html',
  '/portal/tools/financial-worry-action-triage.html',
  '/portal/tools/meeting-fatigue-recovery-scheduler.html',
  '/portal/tools/insomnia-3am-thought-parker.html',
  '/portal/tools/family-holiday-boundary-planner.html',
  '/portal/tools/career-burnout-sabbatical-planner.html',
  '/portal/tools/chronic-indecision-deadline-tool.html',
  '/portal/tools/caregiver-exhaustion-relief-check.html',
  '/portal/tools/phone-notification-calm-audit.html',
  '/portal/tools/public-speaking-nerves-reframer.html',
  '/portal/tools/bedtime-revenge-procrastination-reset.html',
  '/portal/tools/exam-test-anxiety-cooldown.html',
  '/portal/tools/job-interview-postmortem-calm.html',
  '/portal/tools/toxic-workplace-exit-readiness.html',
  '/portal/tools/night-shift-circadian-anchor.html',
  '/portal/tools/travel-jetlag-sleep-shifter.html',
  '/portal/tools/creative-block-momentum-starter.html',
  '/portal/tools/sunday-meal-decision-fatigue.html',
  '/portal/tools/scrolling-envy-comparison-reset.html',
  '/portal/tools/chronic-overcommitment-no-audit.html',
  '/portal/tools/new-parent-sleep-sanity-plan.html',
  '/portal/tools/adhd-body-doubling-session-prep.html',
  '/portal/tools/breakup-no-contact-anchor.html',
  '/portal/tools/seasonal-winter-mood-light-plan.html',
  '/portal/tools/work-from-home-shutdown-ritual.html',
  '/portal/tools/social-hangover-recovery-timer.html',
  '/portal/tools/health-checkup-appointment-calm.html',
  '/portal/tools/friendship-drift-repair-planner.html',
  '/portal/tools/perfectionist-parenting-guilt-reset.html',
  '/portal/tools/sunday-money-admin-sprint-plan.html',
  '/portal/tools/retirement-transition-purpose-map.html',
  '/portal/tools/dopamine-detox-weekend-planner.html',
  '/portal/tools/brain-fog-clarity-checklist.html',
  '/portal/tools/dual-n-back-focus-warmup.html',
  '/portal/tools/phone-scroll-friction-builder.html',
  '/portal/tools/reading-attention-span-rebuilder.html',
  '/portal/tools/caffeine-cutoff-sleep-calculator.html',
  '/portal/tools/afternoon-slump-recovery-protocol.html',
  '/portal/tools/study-pomodoro-customizer.html',
  '/portal/tools/overstimulation-quiet-corner-plan.html',
  '/portal/tools/mental-clarity-weekly-review.html',
  '/portal/tools/wellness-lab.html',
  '/portal/tools/decision-matrix.html',
  '/portal/tools/dopamine-detox-protocol.html',
  '/portal/tools/emotion-regulation-planner.html',
  '/portal/tools/kpop-role-roster.html',
  '/portal/tools/brain-game-workout.html',
  '/portal/tools/past-life-story-studio.html',
  '/portal/tools/palworld-breeding-notebook.html',
  '/portal/tools/palworld-server-settings.html',
  '/portal/tools/palworld-field-guide.html',
  '/portal/tools/palworld-base-planner.html',
  '/portal/tools/palworld-server-troubleshooter.html',
  '/portal/tools/salary-negotiation-nerves-prep.html',
  '/portal/tools/career-pivot-fear-audit.html',
  '/portal/tools/chronic-lateness-time-buffer.html',
  '/portal/tools/memory-name-recall-trainer.html',
  '/portal/tools/social-media-envy-detox.html',
  '/portal/tools/difficult-phone-call-starter.html',
  '/portal/tools/partner-chore-fairness-reset.html',
  '/portal/tools/in-law-holiday-boundary-prep.html',
  '/portal/tools/middle-of-night-3am-wake-reset.html',
  '/portal/tools/weekend-sleep-debt-recovery.html',
  '/portal/tools/year-end-burnout-closure-audit.html',
  '/portal/tools/manager-1on1-feedback-prep.html',
  '/portal/tools/inbox-zero-10min-triage.html',
  '/portal/tools/hyperfocus-exit-transition-cue.html',
  '/portal/tools/dental-medical-visit-calm-kit.html',
  '/portal/tools/flying-turbulence-calm-protocol.html',
  '/portal/tools/texting-anxiety-reply-pace-guide.html',
  '/portal/tools/saying-no-to-family-guilt-script.html',
  '/portal/tools/shift-end-evening-winddown-timer.html',
  '/portal/tools/early-morning-waking-cortisol-calm.html',
  '/portal/tools/layoff-job-security-anxiety-plan.html',
  '/portal/tools/return-from-vacation-reentry-plan.html',
  '/portal/tools/meeting-note-action-distiller.html',
  '/portal/tools/digital-declutter-15min-reset.html',
  '/portal/tools/driving-highway-anxiety-calm-kit.html',
  '/portal/tools/needle-blood-draw-faint-calm-kit.html',
  '/portal/tools/new-city-adult-friendship-plan.html',
  '/portal/tools/awkward-small-talk-icebreaker-kit.html',
  '/portal/tools/snoring-partner-sleep-peace-plan.html',
  '/portal/tools/afternoon-power-nap-timer-guide.html',
  '/portal/tools/index.html'
];

async function runTest() {
  console.log('=== Verifying Portal High-Dwell Tools with Playwright (390x844) ===');

  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(ROOT, 'projects', urlPath.replace(/^\/+/, ''));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found: ' + filePath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      };

      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } catch (err) {
      res.writeHead(500);
      res.end(err.message);
    }
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  await page.route(url => !url.href.includes('127.0.0.1'), route => route.abort());

  let allPass = true;

  for (const tool of TOOLS) {
    const url = `${baseUrl}${tool}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // 1. Horizontal overflow check
    const overflow = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const clientW = document.documentElement.clientWidth;
      return scrollW - clientW;
    });

    if (overflow > 0) {
      console.error(`[FAIL] ${tool}: Horizontal overflow ${overflow}px`);
      allPass = false;
    } else {
      console.log(`[PASS] ${tool}: 0px horizontal overflow`);
    }

    // 2. Interactive touch targets >= 44px
    const targetsCompliant = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a.cta-btn, a.bridge-card, a.tool-card, a.routine-card, .opt-btn, .primary-btn, .ghost-btn'));
      const small = [];
      for (const el of elements) {
        if (!el.offsetParent) continue; // Skip hidden
        const rect = el.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          small.push({ tag: el.tagName, text: el.innerText.slice(0, 30), w: Math.round(rect.width), h: Math.round(rect.height) });
        }
      }
      return { compliant: small.length === 0, count: elements.length, small: small.slice(0, 5) };
    });

    if (!targetsCompliant.compliant) {
      console.warn(`[WARN] ${tool}: ${targetsCompliant.small.length} touch targets < 44px:`, targetsCompliant.small);
      // Let's inspect if any interactive button/link is violating
    } else {
      console.log(`[PASS] ${tool}: All ${targetsCompliant.count} interactive targets >= 44px`);
    }
  }

  await browser.close();
  await new Promise(resolve => server.close(resolve));

  if (!allPass) {
    process.exit(1);
  }
  console.log('=== All Portal Tools checks completed! ===');
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});

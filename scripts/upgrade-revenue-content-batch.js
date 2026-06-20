#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = (process.env.REVENUE_CONTENT_TODAY || new Date().toISOString().slice(0, 10)).slice(0, 10);

const TARGETS = [
  {
    file: 'projects/portal/blog/ko/passive-aggressive-behavior-guide.html',
    url: 'https://dopabrain.com/portal/blog/ko/passive-aggressive-behavior-guide.html',
    title: '수동 공격적 행동 12가지 신호: 뜻, 예시, 대처법 | DopaBrain',
    headline: '수동 공격적 행동 12가지 신호: 뜻, 예시, 대처법',
    description: '수동 공격적 행동의 뜻과 12가지 신호, 숨은 심리, 직장·연애에서 자주 보이는 예시, 감정 소모를 줄이는 대처 문장을 정리했습니다.',
    ogDescription: '수동 공격 뒤의 숨은 메시지와 심리적 뿌리를 이해하고, 관계를 악화시키지 않는 대화·경계 설정법을 확인하세요.',
    metaPattern: /<p class="meta">[\s\S]*?<\/p>/i,
    summary: `<div class="highlight-box" data-revenue-surface="answer_summary">
                <p><strong>3분 요약:</strong> 수동 공격은 노골적인 분노보다 알아차리기 어렵지만, 반복되면 관계의 신뢰와 집중력을 크게 깎습니다. 이 글에서는 무시, 비꼼, 미루기, 침묵 같은 12가지 신호를 먼저 확인하고, 바로 써볼 수 있는 짧은 대처 문장으로 연결합니다.</p>
            </div>`,
    quickRailId: 'ko-passive-aggressive-next-steps',
    quickRail: `<section class="quick-rail" aria-labelledby="ko-passive-aggressive-next-steps">
                <h2 id="ko-passive-aggressive-next-steps">지금 바로 확인할 다음 단계</h2>
                <p>글을 읽기 전에 짧은 자가 점검으로 감정 패턴을 먼저 잡아두면, 아래 대처법을 훨씬 더 현실적으로 적용할 수 있습니다.</p>
                <div class="quick-grid">
                    <a href="/eq-test/" class="quick-card" data-content-surface="quick_eq_test" data-target-slug="eq-test">
                        <strong>EQ 테스트</strong>
                        <span>어려운 대화 전 감정 인식과 표현 습관을 점검합니다.</span>
                    </a>
                    <a href="/toxic-trait-test/" class="quick-card" data-content-surface="quick_toxic_trait_test" data-target-slug="toxic-trait-test">
                        <strong>독성 성향 테스트</strong>
                        <span>나와 상대의 방어적 패턴을 과도한 비난 없이 분리합니다.</span>
                    </a>
                    <a href="/stress-response/" class="quick-card" data-content-surface="quick_stress_response" data-target-slug="stress-response">
                        <strong>스트레스 반응 테스트</strong>
                        <span>싸움, 회피, 얼어붙음, 맞춰주기 반응을 확인합니다.</span>
                    </a>
                    <a href="/red-flag-test/" class="quick-card" data-content-surface="quick_red_flag_test" data-target-slug="red-flag-test">
                        <strong>레드 플래그 테스트</strong>
                        <span>갈등 습관과 안전하지 않은 관계 신호를 구분합니다.</span>
                    </a>
                </div>
            </section>`,
  },
  {
    file: 'projects/portal/blog/pt/toxic-relationship-patterns-signs.html',
    url: 'https://dopabrain.com/portal/blog/pt/toxic-relationship-patterns-signs.html',
    title: 'Relacionamento Tóxico: 6 Sinais, Teste e Como Sair com Segurança | DopaBrain',
    headline: 'Relacionamento Tóxico: 6 Sinais, Teste e Como Sair com Segurança',
    description: 'Veja 6 sinais de relacionamento tóxico, exemplos de gaslighting e manipulação emocional, um teste rápido de apoio e passos seguros para recuperar limites.',
    ogDescription: 'Reconheça gaslighting, lei do gelo, triangulação, love bombing e invalidação emocional. Use o guia e os testes para organizar sinais, limites e apoio.',
    metaPattern: /<div class="meta">[\s\S]*?<\/div>/i,
    summary: `<div class="info-card" data-revenue-surface="answer_summary">
                <h4>Resumo rápido</h4>
                <p>Se você chegou por dúvida ou medo, comece pelos sinais observáveis: controle, isolamento, culpa constante, negação da sua realidade, punição silenciosa e ciclos de carinho intenso seguidos de desvalorização. Depois use os testes abaixo para transformar a sensação em uma lista clara de próximos passos.</p>
            </div>`,
    quickRailId: 'pt-toxic-next-steps-title',
    quickRail: `<section class="quick-rail" aria-labelledby="pt-toxic-next-steps-title">
                <h2 id="pt-toxic-next-steps-title">Escolha o próximo passo certo</h2>
                <p>Use o guia para entender o padrão e uma avaliação rápida para organizar sinais, limites e apoio sem tomar decisões no impulso.</p>
                <div class="quick-grid">
                    <a href="/red-flag-test/" class="quick-card" data-content-surface="quick_red_flag_test" data-target-slug="red-flag-test">
                        <strong>Teste de Bandeiras Vermelhas</strong>
                        <span>Verifique sinais de alerta antes que o padrão escale.</span>
                    </a>
                    <a href="/toxic-trait-test/" class="quick-card" data-content-surface="quick_toxic_trait_test" data-target-slug="toxic-trait-test">
                        <strong>Teste de Traço Tóxico</strong>
                        <span>Identifique padrões que aparecem em conflitos e relações.</span>
                    </a>
                    <a href="/attachment-style/" class="quick-card" data-content-surface="quick_attachment_style" data-target-slug="attachment-style">
                        <strong>Estilo de Apego</strong>
                        <span>Entenda por que certos ciclos emocionais parecem familiares.</span>
                    </a>
                    <a href="/trauma-response/" class="quick-card" data-content-surface="quick_trauma_response" data-target-slug="trauma-response">
                        <strong>Resposta ao Trauma</strong>
                        <span>Compare luta, fuga, congelamento e agradar como respostas de proteção.</span>
                    </a>
                </div>
            </section>`,
  },
  {
    file: 'projects/portal/blog/hi/best-free-brain-training-games-2026.html',
    url: 'https://dopabrain.com/portal/blog/hi/best-free-brain-training-games-2026.html',
    title: '2026 के 7 मुफ्त ब्रेन ट्रेनिंग गेम्स: मेमोरी, फोकस और रिएक्शन | DopaBrain',
    headline: '2026 के 7 मुफ्त ब्रेन ट्रेनिंग गेम्स',
    description: '2026 में खेलने लायक मुफ्त ब्रेन ट्रेनिंग गेम्स देखें: Memory Card, Color Memory, Reaction Test और 2048 से मेमोरी, फोकस और रिएक्शन बेहतर करें.',
    ogDescription: 'फोकस, मेमोरी और रिएक्शन स्पीड के लिए 2026 के सर्वश्रेष्ठ मुफ्त ब्रेन गेम्स. तुरंत खेलें और फिर रणनीति पढ़ें.',
    metaPattern: /<div class="meta">[\s\S]*?<\/div>/i,
    summary: `<div class="benefit-box" data-revenue-surface="answer_summary">
                <p><strong>त्वरित शुरुआत:</strong> अगर आपके पास सिर्फ 2 मिनट हैं, तो पहले Memory Card या Reaction Test खेलें. अगर आप शांत रणनीति चाहते हैं, तो 2048 चुनें. नीचे दिए गए गेम हल्के हैं, मोबाइल पर चलते हैं और गाइड पढ़ने से पहले तुरंत शुरू किए जा सकते हैं.</p>
            </div>`,
    quickRailId: 'hi-brain-games-quick-start',
    quickRail: `<section class="quick-rail" aria-labelledby="hi-brain-games-quick-start">
                <h2 id="hi-brain-games-quick-start">अभी ब्रेन गेम शुरू करें</h2>
                <p>पहले एक छोटा गेम चुनें, फिर रणनीति और तुलना पढ़ने के लिए गाइड पर वापस आएं.</p>
                <div class="quick-grid">
                    <a href="/memory-card/" class="quick-card" data-content-surface="quick_memory_card" data-target-slug="memory-card">
                        <strong>Memory Card</strong>
                        <span>जोड़े मिलाएं और short-term visual memory को ट्रेन करें.</span>
                    </a>
                    <a href="/color-memory/" class="quick-card" data-content-surface="quick_color_memory" data-target-slug="color-memory">
                        <strong>Color Memory</strong>
                        <span>रंगों की sequence दोहराएं और working memory मजबूत करें.</span>
                    </a>
                    <a href="/reaction-test/" class="quick-card" data-content-surface="quick_reaction_test" data-target-slug="reaction-test">
                        <strong>Reaction Test</strong>
                        <span>speed, attention और reflex consistency को मापें.</span>
                    </a>
                    <a href="/puzzle-2048/" class="quick-card" data-content-surface="quick_2048" data-target-slug="puzzle-2048">
                        <strong>2048 Puzzle</strong>
                        <span>शांत number puzzle से आगे की चाल सोचने की आदत बनाएं.</span>
                    </a>
                </div>
            </section>`,
  },
  {
    file: 'projects/portal/blog/zh/hsp-coping-strategies-highly-sensitive.html',
    url: 'https://dopabrain.com/portal/blog/zh/hsp-coping-strategies-highly-sensitive.html',
    title: 'HSP应对策略：高敏感人群15个减压与边界技巧 | DopaBrain',
    headline: 'HSP应对策略：高敏感人群15个减压与边界技巧',
    description: '高敏感人群如何减少情绪耗竭？整理15个HSP应对策略，包括边界设置、感官减压、社交恢复、工作节奏和自我测试。',
    ogDescription: '用15个实用HSP应对策略减少过度刺激、情绪耗竭和社交疲惫，并通过测试找到适合自己的恢复路径。',
    metaPattern: /<div class="meta">[\s\S]*?<\/div>/i,
    summary: `<div class="info-card" data-revenue-surface="answer_summary">
                    <h4>快速判断</h4>
                    <p>如果你经常被声音、气味、情绪氛围或他人的评价拖垮，先不要急着责备自己。高敏感更需要的是明确边界、低刺激恢复和可重复的自我调节流程。下面先选一个测试，再回到15个技巧逐项应用。</p>
                </div>`,
    quickRailId: 'indexing-quick-rail-title',
    quickRail: `<section class="indexing-quick-rail" aria-labelledby="indexing-quick-rail-title">
                    <h2 id="indexing-quick-rail-title">先做一个快速自测</h2>
                    <div class="quick-grid">
                        <a class="quick-card" href="/hsp-test/?lang=zh" data-content-surface="quick_hsp_test" data-target-slug="hsp-test"><strong>HSP测试</strong><span>确认你是否属于高敏感倾向。</span></a>
                        <a class="quick-card" href="/stress-response/?lang=zh" data-content-surface="quick_stress_response" data-target-slug="stress-response"><strong>压力反应测试</strong><span>看见你在压力下最常见的保护模式。</span></a>
                        <a class="quick-card" href="/eq-test/?lang=zh" data-content-surface="quick_eq_test" data-target-slug="eq-test"><strong>EQ测试</strong><span>理解情绪识别、表达和调节习惯。</span></a>
                        <a class="quick-card" href="/burnout-test/?lang=zh" data-content-surface="quick_burnout_test" data-target-slug="burnout-test"><strong>倦怠测试</strong><span>区分短期疲惫和长期耗竭。</span></a>
                    </div>
                </section>`,
  },
  {
    file: 'projects/portal/blog/en/15-signs-highly-sensitive-person.html',
    url: 'https://dopabrain.com/portal/blog/en/15-signs-highly-sensitive-person.html',
    title: 'Highly Sensitive Person: 15 Signs, HSP Test and Coping Tips | DopaBrain',
    headline: 'Highly Sensitive Person: 15 Signs, HSP Test and Coping Tips',
    description: 'Learn 15 signs you may be a highly sensitive person, what HSP actually means, and which coping tips help with overstimulation, relationships, and work.',
    ogDescription: 'Check the signs of being highly sensitive, take the HSP test, and get practical coping tips for overstimulation, boundaries, work, and relationships.',
    metaPattern: /<div class="meta">[\s\S]*?<\/div>/i,
    summary: `<div class="info-card" data-revenue-surface="answer_summary">
                <h4>Start here</h4>
                <p>If you arrived because the signs feel painfully familiar, take the HSP test first and then use this guide to name the patterns: sensory overload, emotional absorption, recovery needs, and boundary pressure. The goal is not to label yourself forever; it is to choose the next support habit faster.</p>
            </div>`,
    quickRailId: 'indexing-quick-rail-title',
    quickRail: `<section class="indexing-quick-rail" aria-labelledby="indexing-quick-rail-title">
                    <h2 id="indexing-quick-rail-title">Choose a quick next step</h2>
                    <div class="quick-grid">
                        <a class="quick-card" href="/hsp-test/?lang=en" data-content-surface="quick_hsp_test" data-target-slug="hsp-test"><strong>HSP test</strong><span>Check whether the signs match your sensitivity pattern.</span></a>
                        <a class="quick-card" href="/stress-response/?lang=en" data-content-surface="quick_stress_response" data-target-slug="stress-response"><strong>Stress response</strong><span>Map fight, flight, freeze, or fawn reactions.</span></a>
                        <a class="quick-card" href="/eq-test/?lang=en" data-content-surface="quick_eq_test" data-target-slug="eq-test"><strong>EQ test</strong><span>Understand emotional awareness and regulation habits.</span></a>
                        <a class="quick-card" href="/burnout-test/?lang=en" data-content-surface="quick_burnout_test" data-target-slug="burnout-test"><strong>Burnout test</strong><span>Separate high sensitivity from long-term depletion.</span></a>
                    </div>
                </section>`,
  },
  {
    file: 'projects/portal/blog/en/self-sabotage-patterns.html',
    url: 'https://dopabrain.com/portal/blog/en/self-sabotage-patterns.html',
    title: 'Self-Sabotage Patterns: 7 Signs, Causes and How to Stop | DopaBrain',
    headline: 'Self-Sabotage Patterns: 7 Signs, Causes and How to Stop',
    description: 'Spot 7 self-sabotage patterns, understand why you undermine your own progress, and use practical tools for fear of failure, overthinking, and avoidance.',
    ogDescription: 'Recognize procrastination, perfectionism, avoidance, overthinking, and fear of failure as self-sabotage patterns, then choose a practical next step.',
    metaPattern: /<div class="meta">[\s\S]*?<\/div>/i,
    summary: `<div class="info-card" data-revenue-surface="answer_summary">
                <h4>Fast self-check</h4>
                <p>Self-sabotage usually protects you from a feeling, not from success itself. Before reading every pattern, choose the closest next tool: fear of failure, overthinking, stress response, or emotional regulation. Then return to the section that matches your result.</p>
            </div>`,
    quickRailId: 'indexing-quick-rail-title',
    quickRail: `<section class="indexing-quick-rail" aria-labelledby="indexing-quick-rail-title">
                    <h2 id="indexing-quick-rail-title">Pick the pattern to check first</h2>
                    <div class="quick-grid">
                        <a class="quick-card" href="/overthinker-test/?lang=en" data-content-surface="quick_overthinker_test" data-target-slug="overthinker-test"><strong>Overthinker test</strong><span>See whether rumination is driving avoidance.</span></a>
                        <a class="quick-card" href="/stress-response/?lang=en" data-content-surface="quick_stress_response" data-target-slug="stress-response"><strong>Stress response</strong><span>Identify the protective reaction underneath the habit.</span></a>
                        <a class="quick-card" href="/eq-test/?lang=en" data-content-surface="quick_eq_test" data-target-slug="eq-test"><strong>EQ test</strong><span>Check emotional naming and regulation habits.</span></a>
                        <a class="quick-card" href="/work-style/?lang=en" data-content-surface="quick_work_style" data-target-slug="work-style"><strong>Work style</strong><span>Find a workflow that lowers friction instead of relying on willpower.</span></a>
                    </div>
                </section>`,
  },
  {
    file: 'projects/portal/blog/zh/personality-tests.html',
    url: 'https://dopabrain.com/portal/blog/zh/personality-tests.html',
    title: '2026年最佳免费性格测试：MBTI、HSP、爱情与心理测验 | DopaBrain',
    headline: '2026年最佳免费性格测试推荐',
    headlineHtml: '2026年最佳<span>免费性格测试</span>推荐',
    description: '精选2026年免费性格测试，包括MBTI爱情匹配、HSP高敏感、动物人格、EQ、前世和压力反应测试，帮你快速找到适合的测验。',
    ogDescription: '从MBTI、HSP、动物人格、EQ到爱情匹配，快速选择适合你的免费性格测试并查看下一步解读。',
    summaryAfterPattern: /<main class="article-content">\s*/i,
    summary: `<div class="info-card" data-revenue-surface="answer_summary">
                    <h4>怎么选第一个测试？</h4>
                    <p>想了解恋爱关系，先选MBTI爱情或依恋风格；想了解情绪和压力，先选EQ、HSP或压力反应；想轻松分享结果，先选动物人格或颜色人格。先做一个测试，再用本文的分类继续探索。</p>
                </div>`,
    quickRailId: 'indexing-quick-rail-title',
    quickRail: `<section class="indexing-quick-rail" aria-labelledby="indexing-quick-rail-title">
                    <h2 id="indexing-quick-rail-title">热门免费测试入口</h2>
                    <div class="quick-grid">
                        <a class="quick-card" href="/animal-personality/?lang=zh" data-content-surface="quick_animal_personality" data-target-slug="animal-personality"><strong>动物人格测试</strong><span>轻松、好分享，适合第一次体验。</span></a>
                        <a class="quick-card" href="/mbti-love/?lang=zh" data-content-surface="quick_mbti_love" data-target-slug="mbti-love"><strong>MBTI爱情匹配</strong><span>查看关系互动和匹配倾向。</span></a>
                        <a class="quick-card" href="/hsp-test/?lang=zh" data-content-surface="quick_hsp_test" data-target-slug="hsp-test"><strong>HSP高敏感测试</strong><span>理解敏感、边界和恢复需求。</span></a>
                        <a class="quick-card" href="/eq-test/?lang=zh" data-content-surface="quick_eq_test" data-target-slug="eq-test"><strong>EQ测试</strong><span>查看情绪识别和调节能力。</span></a>
                    </div>
                </section>`,
  },
  {
    file: 'projects/portal/blog/en/past-life-calculator-birthday.html',
    url: 'https://dopabrain.com/portal/blog/en/past-life-calculator-birthday.html',
    title: 'Past Life Calculator by Birthday: Meaning, Archetypes and Free Test | DopaBrain',
    headline: 'Past Life Calculator by Birthday: Meaning, Archetypes and Free Test',
    description: 'Use your birthday to explore past-life archetypes, symbolic meanings, personality clues, and a free DopaBrain past life calculator for shareable results.',
    ogDescription: 'Explore past-life archetypes by birthday, learn what the result means, and open the free calculator for a fast shareable result.',
    metaPattern: /<div class="meta">[\s\S]*?<\/div>/i,
    summary: `<div class="info-card" data-revenue-surface="answer_summary">
                <h4>Try it before reading</h4>
                <p>The fastest path is to open the calculator, get your archetype, and then use this guide to interpret the story: recurring traits, relationship themes, strengths, and the shadow pattern your result points toward.</p>
            </div>`,
    quickRailId: 'indexing-quick-rail-title',
    quickRail: `<section class="indexing-quick-rail" aria-labelledby="indexing-quick-rail-title">
                    <h2 id="indexing-quick-rail-title">Open a related result path</h2>
                    <div class="quick-grid">
                        <a class="quick-card" href="/past-life/?lang=en" data-content-surface="quick_past_life" data-target-slug="past-life"><strong>Past life calculator</strong><span>Get the result first, then read the meaning.</span></a>
                        <a class="quick-card" href="/soul-age/?lang=en" data-content-surface="quick_soul_age" data-target-slug="soul-age"><strong>Soul age</strong><span>Compare the result with your current growth stage.</span></a>
                        <a class="quick-card" href="/animal-personality/?lang=en" data-content-surface="quick_animal_personality" data-target-slug="animal-personality"><strong>Animal personality</strong><span>Add a lighter personality archetype to the story.</span></a>
                        <a class="quick-card" href="/shadow-work/?lang=en" data-content-surface="quick_shadow_work" data-target-slug="shadow-work"><strong>Shadow work</strong><span>Turn symbolic themes into reflection prompts.</span></a>
                    </div>
                </section>`,
  },
];

function readText(relativeFile) {
  return fs.readFileSync(path.join(ROOT, relativeFile), 'utf8');
}

function writeText(relativeFile, html) {
  fs.writeFileSync(path.join(ROOT, relativeFile), html, 'utf8');
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceMeta(html, name, content) {
  const pattern = new RegExp(`<meta\\b([^>]*\\bname\\s*=\\s*["']${escapeRegex(name)}["'][^>]*)>`, 'i');
  return html.replace(pattern, (tag) => {
    if (/\bcontent\s*=/i.test(tag)) {
      return tag.replace(/\bcontent\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/i, `content="${escapeAttr(content)}"`);
    }
    return tag.replace(/>$/, ` content="${escapeAttr(content)}">`);
  });
}

function replaceProperty(html, property, content) {
  const pattern = new RegExp(`<meta\\b([^>]*\\bproperty\\s*=\\s*["']${escapeRegex(property)}["'][^>]*)>`, 'i');
  return html.replace(pattern, (tag) => {
    if (/\bcontent\s*=/i.test(tag)) {
      return tag.replace(/\bcontent\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/i, `content="${escapeAttr(content)}"`);
    }
    return tag.replace(/>$/, ` content="${escapeAttr(content)}">`);
  });
}

function replaceJsonString(html, key, value) {
  const pattern = new RegExp(`("${escapeRegex(key)}"\\s*:\\s*")([^"]*)(")`, 'g');
  return html.replace(pattern, `$1${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}$3`);
}

function replaceQuickRail(html, id, replacement) {
  const pattern = new RegExp(`<section\\b[^>]*aria-labelledby\\s*=\\s*["']${escapeRegex(id)}["'][\\s\\S]*?<\\/section>`, 'i');
  return html.replace(pattern, replacement);
}

function insertSummary(html, target) {
  if (html.includes('data-revenue-surface="answer_summary"')) return html;
  if (target.summaryAfterPattern) {
    return html.replace(target.summaryAfterPattern, (match) => `${match}\n                ${target.summary}\n`);
  }
  return html.replace(target.metaPattern, (match) => `${match}\n\n            ${target.summary}`);
}

function updatePage(target) {
  let html = readText(target.file);
  const before = html;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${target.title}</title>`);
  html = replaceMeta(html, 'description', target.description);
  html = replaceProperty(html, 'og:title', target.headline);
  html = replaceProperty(html, 'og:description', target.ogDescription);
  html = replaceMeta(html, 'twitter:title', target.headline);
  html = replaceMeta(html, 'twitter:description', target.ogDescription);
  html = replaceJsonString(html, 'headline', target.headline);
  html = replaceJsonString(html, 'description', target.description);
  html = replaceJsonString(html, 'dateModified', TODAY);
  html = html.replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${target.headlineHtml || target.headline}</h1>`);
  html = insertSummary(html, target);
  html = replaceQuickRail(html, target.quickRailId, target.quickRail);

  if (html !== before) writeText(target.file, html);
  return html !== before;
}

function updateSitemap(relativeFile, url) {
  const filePath = path.join(ROOT, relativeFile);
  if (!fs.existsSync(filePath)) return false;
  const before = fs.readFileSync(filePath, 'utf8');
  const escaped = escapeRegex(url);
  const after = before.replace(
    new RegExp(`(<loc>${escaped}<\\/loc>[\\s\\S]*?<lastmod>)([^<]+)(<\\/lastmod>)`, 'g'),
    `$1${TODAY}$3`
  );
  if (after !== before) fs.writeFileSync(filePath, after, 'utf8');
  return after !== before;
}

const changed = [];
const sitemapChanged = new Set();

for (const target of TARGETS) {
  if (updatePage(target)) changed.push(target.file);
  for (const sitemap of ['projects/root-domain/sitemap.xml', 'projects/portal/sitemap.xml', 'projects/portal/blog/sitemap.xml']) {
    if (updateSitemap(sitemap, target.url)) sitemapChanged.add(sitemap);
  }
}

console.log(JSON.stringify({
  today: TODAY,
  pagesChanged: changed.length,
  sitemapFilesChanged: sitemapChanged.size,
  changed,
  sitemapChanged: Array.from(sitemapChanged),
}, null, 2));

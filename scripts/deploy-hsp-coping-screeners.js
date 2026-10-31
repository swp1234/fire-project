'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTAL_BLOG = path.join(ROOT, 'projects', 'portal', 'blog');
const BLOG_SITEMAP = path.join(PORTAL_BLOG, 'sitemap.xml');
const TODAY = '2026-10-31';

const TRIAGE_CSS = `
        /* HSP Interactive Triage Widget */
        .hsp-triage-widget { padding: 26px; border: 1.5px solid rgba(167,139,250,.35); border-radius: 18px; background: linear-gradient(145deg, rgba(167,139,250,.12), rgba(18,22,42,.98)); margin: 32px 0; }
        .hsp-triage-head { text-align: center; margin-bottom: 20px; }
        .hsp-triage-head h2 { font-size: 1.35rem; color: #f0f0f8; margin: 8px 0; }
        .hsp-triage-head p { font-size: 0.95rem; color: var(--text-secondary); }
        .hsp-triage-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(167,139,250,.2); border: 1px solid rgba(167,139,250,.3); color: #ddd6fe; font-size: 11px; font-weight: 800; letter-spacing: .08em; margin-bottom: 6px; }
        .hsp-triage-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .hsp-triage-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(25,29,53,.8); border: 1px solid var(--border-color); border-radius: 12px; cursor: pointer; min-height: 48px; touch-action: manipulation; transition: all .2s; }
        .hsp-triage-item:hover { border-color: var(--secondary); background: rgba(167,139,250,.1); }
        .hsp-triage-item input[type="checkbox"] { width: 20px; height: 20px; accent-color: #a78bfa; cursor: pointer; flex-shrink: 0; }
        .hsp-triage-item .chk-text { font-size: 14.5px; color: var(--text-primary); line-height: 1.4; }
        .hsp-triage-item.is-checked { border-color: var(--secondary); background: rgba(167,139,250,.18); }
        .hsp-triage-feedback { text-align: center; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .hsp-triage-score { font-size: 15px; font-weight: 700; color: var(--secondary); margin-bottom: 6px; }
        .hsp-triage-feedback p { font-size: 14px; color: var(--text-secondary); margin-bottom: 18px; min-height: 22px; }
        .hsp-triage-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .triage-btn { width: 100%; max-width: 380px; text-align: center; display: inline-flex; align-items: center; justify-content: center; min-height: 48px; touch-action: manipulation; }
        .triage-sub-btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 18px; color: var(--secondary); text-decoration: none; font-size: 14px; font-weight: 600; min-height: 44px; line-height: 24px; touch-action: manipulation; }
        .triage-sub-btn:hover { text-decoration: underline; }
`;

const LOCALES_DATA = {
  pt: {
    ariaLabel: 'Avaliação Rápida de Sobrecarga Sensorial PAS',
    listAriaLabel: 'Lista de sinais de sobrecarga sensorial',
    badge: 'TRIAGEM RÁPIDA DE 30 SEGUNDOS',
    heading: 'Está a passar por sobrecarga sensorial agora?',
    sub: 'Marque os sinais de sobrecarga que estão a sobrecarregar o seu sistema nervoso:',
    item1: 'O ruído de fundo, as conversas cruzadas ou sons repetitivos causam irritação ou cansaço rápido.',
    item2: 'A iluminação forte, telas brilhantes ou desordem visual provocam cansaço ocular e tensão muscular.',
    item3: 'Demandas simultâneas bloqueiam a mente e dificultam processar qualquer pensamento com calma.',
    item4: 'Vontade intensa de se isolar num espaço escuro, silencioso e sem interrupções para descompressão.',
    scoreUnit: 'de 4 sinais selecionados',
    verdict0: 'Marque os sinais acima para avaliar a sua sobrecarga sensorial em tempo real.',
    verdict1: '🌿 Sobrecarga leve: Diminuir uma única fonte de estímulo (reduzir volume ou atenuar luz) traz alívio rápido.',
    verdict23: '⚡ Sobrecarga moderada a alta: O seu sistema nervoso está bastante exigido. Recomendamos uma pausa descompressiva.',
    verdict4: '🚨 Sobrecarga sensorial aguda: Limiar de estímulo saturado. Ative a sala de reset sensorial e descanse.',
    primaryBtn: 'Abrir Sala de Reset Sensorial (60s) &rarr;',
    subBtn: 'Explorar Perfil PAS Completo &rarr;'
  },
  ru: {
    ariaLabel: 'Экспресс-оценка сенсорной перегрузки ВЧЛ',
    listAriaLabel: 'Список признаков сенсорной перегрузки',
    badge: '30-СЕКУНДНЫЙ ТРИАЖ ПЕРЕГРУЗКИ',
    heading: 'Испытываете ли вы сенсорную перегрузку прямо сейчас?',
    sub: 'Отметьте сенсорные раздражители, перегружающие вашу нервную систему:',
    item1: 'Фоновый шум, постоянные разговоры или резкие звуки вызывают сильное раздражение и усталость.',
    item2: 'Яркое освещение, экраны или визуальный хаос вызывают напряжение в глазах и шее.',
    item3: 'Несколько одновременных задач вызывают ступор и мешают сосредоточиться на одной мысли.',
    item4: 'Острое желание уединиться в тихой, темной комнате без посторонних, чтобы восстановить силы.',
    scoreUnit: 'из 4 признаков выбрано',
    verdict0: 'Отметьте признаки выше, чтобы оценить уровень сенсорной нагрузки в реальном времени.',
    verdict1: '🌿 Легкая перегрузка: Устранение хотя бы одного раздражителя (звук, свет) быстро вернет комфорт.',
    verdict23: '⚡ Умеренная или высокая нагрузка: Нервная система перегружена. Рекомендуется пауза для разгрузки.',
    verdict4: '🚨 Острая сенсорная перегрузка: Порог восприятия превышен. Перейдите в комнату сенсорного сброса.',
    primaryBtn: 'Открыть комнату сенсорного сброса (60 сек) &rarr;',
    subBtn: 'Пройти полный профиль чувствительности ВЧЛ &rarr;'
  },
  id: {
    ariaLabel: 'Evaluasi Cepat Kelebihan Sensorik HSP',
    listAriaLabel: 'Daftar tanda beban sensorik berlebih',
    badge: 'TRIASE CEPAT 30 DETIK',
    heading: 'Apakah Anda Sedang Mengalami Sensorik Berlebih Saat Ini?',
    sub: 'Centang pemicu sensorik yang saat ini membebani sistem saraf Anda:',
    item1: 'Kebisingan latar, obrolan ramai, atau suara berulang terasa menusuk dan membuat gelisah.',
    item2: 'Pencahayaan silau, layar terlalu terang, atau ruangan berantakan menyebabkan ketegangan mata.',
    item3: 'Banyaknya tuntutan sekaligus membuat pikiran buntu dan sulit memproses satu ide pun.',
    item4: 'Dorongan kuat untuk menyendiri di ruangan tenang dan redup guna memulihkan ketenangan diri.',
    scoreUnit: 'dari 4 tanda terpilih',
    verdict0: 'Centang faktor di atas untuk mengevaluasi tingkat ketegangan sensorik Anda secara langsung.',
    verdict1: '🌿 Beban ringan: Kurangi satu sumber stimulasi (kecilkan volume atau redupkan lampu) untuk relaksasi cepat.',
    verdict23: '⚡ Beban moderat hingga tinggi: Sistem saraf Anda terbebani. Sangat disarankan mengambil jeda istirahat.',
    verdict4: '🚨 Sensorik berlebih akut: Ambang batas sensorik jenuh. Segera masuk ruang reset sensorik untuk dekompresi.',
    primaryBtn: 'Buka Ruang Reset Sensorik 60 Detik &rarr;',
    subBtn: 'Jelajahi Profil Lengkap Orang Sangat Sensitif &rarr;'
  },
  tr: {
    ariaLabel: 'HSP Duyusal Aşırı Yüklenme Hızlı Değerlendirmesi',
    listAriaLabel: 'Duyusal aşırı yüklenme işaretleri listesi',
    badge: '30 SANİYELİK HIZLI DEĞERLENDİRME',
    heading: 'Şu Anda Duyusal Aşırı Yüklenme Yaşıyor musunuz?',
    sub: 'Sinir sisteminizi zorlayan duyusal uyarıcıları işaretleyin:',
    item1: 'Arka plan gürültüsü, tekrarlayan sesler veya uğultu rahatsızlık verici ve yorucu geliyor.',
    item2: 'Parlak ışıklar, yoğun ekran süresi veya görsel dağınıklık göz ve boyun gerginliğine yol açıyor.',
    item3: 'Aynı anda birden fazla taleple karşılaşmak zihnin kilitlenmesine ve odaklanamamaya neden oluyor.',
    item4: 'Kendinizi toparlamak için acilen sessiz, loş ve yalnız kalabileceğiniz bir alana çekilme ihtiyacı duyuyorsunuz.',
    scoreUnit: 'seçilen işaret (toplam 4)',
    verdict0: 'Gerçek zamanlı duyusal yükünüzü değerlendirmek için yukarıdaki işaretleri seçin.',
    verdict1: '🌿 Hafif yüklenme: Tek bir uyaran kaynağını azaltmak (sesi kısmak veya ışığı kısmak) hızlı rahatlama sağlar.',
    verdict23: '⚡ Orta-yüksek yüklenme: Sinir sisteminiz yoğun baskı altında. Bir sakinleşme molası vermeniz önerilir.',
    verdict4: '🚨 Akut duyusal doyum: Eşik değeriniz aşıldı. Hemen duyusal sıfırlama odasına geçin ve dinlenin.',
    primaryBtn: '60 Saniyelik Duyusal Sıfırlama Odasını Aç &rarr;',
    subBtn: 'Kapsamlı Yüksek Hassasiyet Profilini İncele &rarr;'
  },
  hi: {
    ariaLabel: 'एचएसपी त्वरित संवेदी अधिभार मूल्यांकन',
    listAriaLabel: 'संवेदी अधिभार संकेतों की सूची',
    badge: '30-सेकंड त्वरित संवेदी जांच',
    heading: 'क्या आप इस समय संवेदी अधिभार महसूस कर रहे हैं?',
    sub: 'उन संवेदी तनावों को चुनें जो आपके तंत्रिका तंत्र पर दबाव डाल रहे हैं:',
    item1: 'पृष्ठभूमि का शोर, निरंतर बातचीत या बार-बार होने वाली आवाज़ें बेचैनी पैदा कर रही हैं।',
    item2: 'तेज़ रोशनी, स्क्रीन की चमक या अव्यवस्था आंखों और गर्दन में खिंचाव पैदा कर रही है।',
    item3: 'एक साथ कई कार्यों का दबाव आपके विचारों को भ्रमित और एकाग्रता को बाधित कर रहा है।',
    item4: 'शांति पाने के लिए तुरंत किसी शांत, मंद रोशनी वाले कमरे में अकेले जाने की तीव्र इच्छा।',
    scoreUnit: 'में से चुने गए संकेत (कुल 4)',
    verdict0: 'अपनी वर्तमान संवेदी स्थिति जांचने के लिए ऊपर दिए गए विकल्पों को चुनें।',
    verdict1: '🌿 हल्का संवेदी तनाव: किसी एक उद्दीपक को कम करना (आवाज़ धीमी करना या रोशनी कम करना) तुरंत राहत देगा।',
    verdict23: '⚡ मध्यम से उच्च तनाव: आपका तंत्रिका तंत्र अत्यधिक दबाव में है। विश्राम विराम लेने की सलाह दी जाती है।',
    verdict4: '🚨 गंभीर संवेदी अधिभार: आपकी संवेदी सहनशीलता संतृप्त हो चुकी है। तुरंत संवेदी रीसेट रूम खोलें।',
    primaryBtn: '60-सेकंड संवेदी रीसेट रूम खोलें &rarr;',
    subBtn: 'पूर्ण एचएसपी संवेदनशीलता प्रोफ़ाइल देखें &rarr;'
  }
};

function buildWidgetHtml(lang, data) {
  return `            <div class="hsp-triage-widget" id="sensory-triage" role="region" aria-label="${data.ariaLabel}">
                <div class="hsp-triage-head">
                    <span class="hsp-triage-badge">${data.badge}</span>
                    <h2>${data.heading}</h2>
                    <p>${data.sub}</p>
                </div>
                <div class="hsp-triage-list" role="group" aria-label="${data.listAriaLabel}">
                    <label class="hsp-triage-item">
                        <input type="checkbox" class="triage-chk" data-type="sound" value="1">
                        <span class="chk-text">${data.item1}</span>
                    </label>
                    <label class="hsp-triage-item">
                        <input type="checkbox" class="triage-chk" data-type="visual" value="1">
                        <span class="chk-text">${data.item2}</span>
                    </label>
                    <label class="hsp-triage-item">
                        <input type="checkbox" class="triage-chk" data-type="cognitive" value="1">
                        <span class="chk-text">${data.item3}</span>
                    </label>
                    <label class="hsp-triage-item">
                        <input type="checkbox" class="triage-chk" data-type="somatic" value="1">
                        <span class="chk-text">${data.item4}</span>
                    </label>
                </div>
                <div class="hsp-triage-feedback">
                    <div class="hsp-triage-score">
                        <span id="triageCount">0</span> ${data.scoreUnit}
                    </div>
                    <p id="triageVerdictText">${data.verdict0}</p>
                    <div class="hsp-triage-actions">
                        <a class="cta-btn triage-btn" href="/hsp-test/reset.html?lang=${lang}&amp;source=blog_${lang}_hsp_triage" data-target-slug="sensory-reset">
                            ${data.primaryBtn}
                        </a>
                        <a class="triage-sub-btn" href="/hsp-test/?lang=${lang}&amp;source=blog_${lang}_hsp_triage" data-target-slug="hsp-test">
                            ${data.subBtn}
                        </a>
                    </div>
                </div>
            </div>`;
}

function buildScriptHtml(data) {
  return `    <script>
        (function initHspTriage() {
            var chks = document.querySelectorAll('.triage-chk');
            var countEl = document.getElementById('triageCount');
            var verdictEl = document.getElementById('triageVerdictText');
            if (!chks.length || !countEl || !verdictEl) return;

            function update() {
                var checked = 0;
                chks.forEach(function(c) {
                    var parent = c.closest('.hsp-triage-item');
                    if (c.checked) {
                        checked++;
                        if (parent) parent.classList.add('is-checked');
                    } else {
                        if (parent) parent.classList.remove('is-checked');
                    }
                });
                countEl.textContent = String(checked);
                if (checked === 0) {
                    verdictEl.textContent = '${data.verdict0.replace(/'/g, "\\'")}';
                } else if (checked === 1) {
                    verdictEl.textContent = '${data.verdict1.replace(/'/g, "\\'")}';
                } else if (checked <= 3) {
                    verdictEl.textContent = '${data.verdict23.replace(/'/g, "\\'")}';
                } else {
                    verdictEl.textContent = '${data.verdict4.replace(/'/g, "\\'")}';
                }
            }

            chks.forEach(function(c) {
                c.addEventListener('change', update);
            });
            update();
        })();
    </script>`;
}

function deploy() {
  console.log('=== Deploying Sensory Triage to Remaining 5 Locales (pt, ru, id, tr, hi) ===');

  for (const [lang, data] of Object.entries(LOCALES_DATA)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'hsp-coping-strategies-highly-sensitive.html');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Update dateModified in json-ld & meta
    html = html.replace(/"dateModified"\s*:\s*"[^"]+"/g, `"dateModified": "${TODAY}"`);
    html = html.replace(/<meta[^>]*name="dateModified"[^>]*content="[^"]*"[^>]*>/gi, `<meta name="dateModified" content="${TODAY}">`);

    // 2. Add TRIAGE_CSS before </style> if not present
    if (!html.includes('.hsp-triage-widget')) {
      html = html.replace('</style>', `${TRIAGE_CSS}\n    </style>`);
    }

    // 3. Replace the first .cta-box with the widget
    const widgetHtml = buildWidgetHtml(lang, data);
    const ctaBoxMatch = html.match(/<div class="cta-box">[\s\S]*?<\/div>/);
    if (ctaBoxMatch) {
      html = html.replace(ctaBoxMatch[0], widgetHtml);
    } else {
      console.warn(`[WARN] Could not find .cta-box in ${lang}`);
    }

    // 4. Inject init script before </body>
    const scriptHtml = buildScriptHtml(data);
    if (!html.includes('initHspTriage')) {
      html = html.replace('</body>', `${scriptHtml}\n</body>`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[UPDATED] ${lang}/hsp-coping-strategies-highly-sensitive.html`);
  }

  // 5. Update sitemap.xml lastmod for these 5 URLs
  let sitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  for (const lang of Object.keys(LOCALES_DATA)) {
    const locPattern = new RegExp(`(<loc>https:\\/\\/dopabrain\\.com\\/portal\\/blog\\/${lang}\\/hsp-coping-strategies-highly-sensitive\\.html<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`, 'g');
    sitemap = sitemap.replace(locPattern, `$1${TODAY}$2`);
  }
  fs.writeFileSync(BLOG_SITEMAP, sitemap, 'utf8');
  console.log(`[UPDATED] blog/sitemap.xml lastmod -> ${TODAY}`);
}

deploy();

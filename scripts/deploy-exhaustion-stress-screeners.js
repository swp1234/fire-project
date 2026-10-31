'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTAL_BLOG = path.join(ROOT, 'projects', 'portal', 'blog');
const PORTAL_SITEMAP = path.join(ROOT, 'projects', 'portal', 'sitemap.xml');
const BLOG_SITEMAP = path.join(PORTAL_BLOG, 'sitemap.xml');
const TODAY = '2026-10-31';

const UniversalCss = `
        /* 30-Second Interactive CRO Screener */
        .screener-box { background: linear-gradient(145deg, rgba(124,58,237,0.12), rgba(15,23,42,0.95)); border: 1.5px solid var(--border-color, rgba(167,139,250,0.35)); border-radius: 18px; padding: 26px 22px; margin: 32px 0; }
        .screener-head { text-align: center; margin-bottom: 18px; }
        .screener-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color, rgba(255,255,255,0.25)); color: var(--accent, #e2e8f0); font-size: 11px; font-weight: 800; letter-spacing: .08em; margin-bottom: 8px; }
        .screener-head h3 { margin: 6px 0 8px; color: var(--primary-light, #a78bfa); font-size: 1.25rem; font-weight: 700; }
        .screener-head p { margin: 0; color: var(--text-secondary, #94a3b8); font-size: 0.92rem; }
        .screener-list { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
        .screener-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: rgba(30,41,59,0.7); border: 1px solid var(--border-color, rgba(255,255,255,0.18)); border-radius: 12px; cursor: pointer; min-height: 48px; touch-action: manipulation; transition: all .2s; }
        .screener-item:hover { border-color: var(--primary-light, #a78bfa); background: rgba(255,255,255,0.08); }
        .screener-item.is-checked { border-color: var(--primary-light, #a78bfa); background: rgba(124,58,237,0.22); }
        .screener-item input[type="checkbox"] { width: 22px; height: 22px; accent-color: var(--primary, #7c3aed); cursor: pointer; flex-shrink: 0; }
        .screener-item .screener-text { font-size: 14.5px; color: var(--text-primary, #f0f0f8); line-height: 1.4; text-align: left; }
        .screener-feedback { text-align: center; padding-top: 16px; border-top: 1px solid var(--border-color, rgba(255,255,255,0.18)); }
        .screener-score { font-size: 15px; font-weight: 700; color: var(--secondary, #c4b5fd); margin-bottom: 6px; }
        .screener-feedback p { font-size: 14px; color: var(--text-secondary, #94a3b8); margin-bottom: 16px; min-height: 20px; }
        .screener-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .screener-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; max-width: 380px; min-height: 48px; padding: 12px 24px; background: linear-gradient(135deg, var(--primary, #7c3aed), var(--primary-light, #8b5cf6)); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(0,0,0,0.3); transition: all 0.25s; }
        .screener-btn:hover { transform: translateY(-1px); opacity: 0.95; color: #fff; }
        .screener-sub-btn { display: inline-block; padding: 10px 16px; color: var(--primary-light, #a78bfa); text-decoration: none; font-size: 13.5px; font-weight: 600; min-height: 44px; line-height: 24px; }
        .screener-sub-btn:hover { text-decoration: underline; }
`;

const EXHAUSTION_LOCALES = {
  en: {
    badge: '30-SECOND DEPLETION TRIAGE',
    heading: 'Are You Emotionally Exhausted Right Now?',
    sub: 'Check the core depletion signals you have experienced over the past 2 weeks:',
    items: [
      '<strong>Cognitive Fog:</strong> Simple decisions feel overwhelming, and your focus or working memory drops noticeably by midday.',
      '<strong>Emotional Detachment:</strong> You feel numb, cynical, or unusually irritable toward people and tasks you normally care about.',
      '<strong>Unrefreshing Sleep:</strong> Even after 7–8 hours in bed, you wake up feeling physically heavy and unrecovered.',
      '<strong>Social Withdrawal:</strong> Replying to messages or making small talk feels like an exhausting chore you want to avoid.'
    ],
    scoreUnit: 'of 4 exhaustion domains active',
    verdicts: [
      'Check the signals above to evaluate your current emotional reserve.',
      'Mild energy dip (1/4). Early cognitive fatigue—schedule a low-stimulation recovery block tonight.',
      'Moderate emotional depletion (2/4). Your stress load is outpacing your daily nervous system recovery.',
      'High emotional exhaustion (3/4). Multiple reserves are depleted; active boundary protection is needed.',
      'Severe multi-domain exhaustion (4/4). Your nervous system is in chronic overload—prioritize immediate decompression.'
    ],
    primaryBtn: 'Take the Free Stress Check &rarr;',
    subBtn: 'Compare Burnout vs. Stress &rarr;'
  },
  ko: {
    badge: '30초 정서적 소진 트리아지',
    heading: '지금 정서적 탈진(Emotional Exhaustion) 상태인가요?',
    sub: '최근 2주간 반복해서 경험하고 있는 소진 신호를 체크해보세요:',
    items: [
      '<strong>인지적 안개(브레인 포그):</strong> 사소한 결정도 버겁게 느껴지고 집중력과 기억력이 눈에 띄게 떨어졌습니다.',
      '<strong>정서적 무감각 및 냉소:</strong> 평소 아끼던 사람이나 일에도 감정이 메마르고 쉽게 짜증이 납니다.',
      '<strong>회복되지 않는 피로:</strong> 잠을 자고 일어나도 몸이 천근만근 무겁고 개운하지 않습니다.',
      '<strong>사회적 회피 및 고립:</strong> 메시지 답장이나 일상적인 대화조차 에너지를 뺏기는 일처럼 느껴져 피하게 됩니다.'
    ],
    scoreUnit: '개 소진 영역 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 정서적 에너지 잔량을 확인해보세요.',
      '경미한 피로 신호(1/4). 초기 인지 피로 단계로, 오늘 저녁 저자극 휴식이 권장됩니다.',
      '중등도 정서적 소진(2/4). 일일 스트레스 부하가 신경계의 자연 회복 속도를 앞지르고 있습니다.',
      '높은 정서적 탈진(3/4). 다중 영역에서 에너지가 고갈되었습니다. 적극적인 경계 설정이 필요합니다.',
      '심각한 전방위 소진(4/4). 신경계가 만성 과부하 상태입니다. 즉각적인 부담 축소와 휴식이 시급합니다.'
    ],
    primaryBtn: '무료 스트레스 지수 체크하기 &rarr;',
    subBtn: '번아웃 vs 스트레스 감별 도구 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN ERSCHÖPFUNGS-TRIAGE',
    heading: 'Sind Sie aktuell emotional erschöpft?',
    sub: 'Wählen Sie die Warnsignale aus, die Sie in den letzten 2 Wochen erlebt haben:',
    items: [
      '<strong>Kognitiver Nebel:</strong> Einfache Entscheidungen fallen schwer und Ihre Konzentration lässt schnell nach.',
      '<strong>Emotionale Distanz:</strong> Sie fühlen sich innerlich leer, zynisch oder ungewöhnlich gereizt.',
      '<strong>Nicht erholsamer Schlaf:</strong> Trotz ausreichend Schlaf wachen Sie morgens wie erschlagen auf.',
      '<strong>Sozialer Rückzug:</strong> Selbst kurze Nachrichten oder Gespräche wirken wie eine kraftraubende Pflicht.'
    ],
    scoreUnit: 'von 4 Erschöpfungsbereichen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um Ihre emotionale Reserve zu prüfen.',
      'Leichte Ermüdung (1/4). Frühe kognitive Belastung – planen Sie heute eine reizarme Pause ein.',
      'Moderate Erschöpfung (2/4). Ihre Stressbelastung übersteigt derzeit Ihre tägliche Regeneration.',
      'Hohe emotionale Erschöpfung (3/4). Mehrere Reserven sind erschöpft; klare Grenzen sind jetzt wichtig.',
      'Akute Tiefenerschöpfung (4/4). Ihr Nervensystem ist chronisch überlastet – sofortige Entlastung empfohlen.'
    ],
    primaryBtn: 'Kostenlosen Stress-Check starten &rarr;',
    subBtn: 'Burnout vs. Stress vergleichen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE AGOTAMIENTO EN 30 SEGUNDOS',
    heading: '¿Estás emocionalmente agotado ahora mismo?',
    sub: 'Marca las señales de desgaste que has experimentado en las últimas 2 semanas:',
    items: [
      '<strong>Niebla mental:</strong> Las decisiones simples abruman y tu concentración cae rápidamente.',
      '<strong>Desconexión emocional:</strong> Te sientes apático, cínico o inusualmente irritable con tu entorno.',
      '<strong>Fatiga sin alivio:</strong> Incluso después de dormir, despiertas con pesadez física y sin energía.',
      '<strong>Aislamiento defensivo:</strong> Responder mensajes o conversar se siente como una carga agotadora.'
    ],
    scoreUnit: 'de 4 dominios de agotamiento activos',
    verdicts: [
      'Marca las señales anteriores para evaluar tu reserva emocional actual.',
      'Desgaste leve (1/4). Fatiga cognitiva temprana; programa una pausa sin pantallas hoy.',
      'Agotamiento moderado (2/4). Tu carga de estrés supera tu capacidad de recuperación diaria.',
      'Alto agotamiento emocional (3/4). Múltiples reservas están vacías; necesitas proteger tus límites.',
      'Agotamiento severo (4/4). Tu sistema nervioso está en sobrecarga crónica; prioriza el descanso inmediato.'
    ],
    primaryBtn: 'Hacer el Test de Estrés Gratis &rarr;',
    subBtn: 'Diferenciar Burnout vs. Estrés &rarr;'
  },
  fr: {
    badge: 'TRIAGE D ÉPUISEMENT EN 30 SECONDES',
    heading: 'Êtes-vous émotionnellement épuisé en ce moment ?',
    sub: 'Cochez les signaux d usure que vous ressentez depuis 2 semaines :',
    items: [
      '<strong>Brouillard mental :</strong> Les décisions simples pèsent lourd et votre concentration chute vite.',
      '<strong>Détachement émotionnel :</strong> Vous vous sentez engourdi, cynique ou irritable face au quotidien.',
      '<strong>Sommeil non réparateur :</strong> Même après une nuit complète, vous vous réveillez vidé.',
      '<strong>Retrait social :</strong> Répondre aux messages ou discuter semble demander un effort insurmontable.'
    ],
    scoreUnit: 'sur 4 domaines d épuisement actifs',
    verdicts: [
      'Cochez les signaux ci-dessus pour évaluer vos réserves émotionnelles.',
      'Fatigue légère (1/4). Début de saturation cognitive — accordez-vous une pause calme ce soir.',
      'Épuisement modéré (2/4). Votre charge de stress dépasse votre récupération nerveuse quotidienne.',
      'Fort épuisement émotionnel (3/4). Plusieurs réserves sont à plat ; posez des limites claires.',
      'Épuisement sévère (4/4). Votre système nerveux est en surcharge chronique — décompressez immédiatement.'
    ],
    primaryBtn: 'Faire le Bilan de Stress Gratuit &rarr;',
    subBtn: 'Comparer Burnout vs Stress &rarr;'
  },
  ja: {
    badge: '30秒・感情的消耗トリアージ',
    heading: '今、心がエネルギー切れになっていませんか？',
    sub: '過去2週間で繰り返し感じている消耗サインにチェックを入れてください：',
    items: [
      '<strong>ブレインフォグ（思考の霧）：</strong> 簡単な判断が億劫になり、集中力や記憶力が落ちている。',
      '<strong>感情の麻痺・イライラ：</strong> 普段なら大切に思える人や仕事に対しても無関心や苛立ちを感じる。',
      '<strong>寝ても取れない疲労感：</strong> しっかり睡眠時間をとっても、朝から体が重く回復した感じがしない。',
      '<strong>連絡や会話の回避：</strong> メッセージの返信やちょっとした雑談さえエネルギーを奪われるように感じる。'
    ],
    scoreUnit: 'つの消耗領域が該当（全4領域）',
    verdicts: [
      '上の項目をチェックして、現在の心のエネルギー残量を確認してください。',
      '軽度の疲労サイン(1/4)。初期の認知疲労です。今夜はデジタル機器から離れる休息を取りましょう。',
      '中程度の感情的消耗(2/4)。日々のストレス負荷が神経系の回復スピードを上回っています。',
      '高い感情的消耗(3/4)。複数のエネルギー貯蔵が枯渇しています。境界線（バウンダリー）の保護が必要です。',
      '深刻な全方位消耗(4/4)。神経系が慢性的な過負荷状態です。最優先で負荷を減らし休息してください。'
    ],
    primaryBtn: '無料ストレスチェックを受ける &rarr;',
    subBtn: '燃え尽き vs ストレス識別ツール &rarr;'
  },
  zh: {
    badge: '30秒情绪耗竭快速筛查',
    heading: '您目前是否处于情绪耗竭（Emotional Exhaustion）状态？',
    sub: '勾选您在过去两周内频繁出现的心理与生理透支信号：',
    items: [
      '<strong>脑雾与决策疲劳：</strong> 简单的小决定也觉得心累，注意力与记忆力明显下降。',
      '<strong>情感麻木与烦躁：</strong> 对平时在乎的人或事感到冷漠、疏离，或容易无故烦躁。',
      '<strong>睡眠无法恢复精力：</strong> 即使睡够了时间，醒来时依然浑身沉重、疲惫不堪。',
      '<strong>社交与任务退缩：</strong> 回复消息或日常寒暄都像是一项沉重的负担，只想逃避独处。'
    ],
    scoreUnit: '项耗竭维度激活（共4项）',
    verdicts: [
      '勾选上方信号以评估您当前的心理能量储备。',
      '轻度精力下滑(1/4)。早期认知疲劳，建议今晚安排一段无屏幕的低刺激休息。',
      '中度情绪透支(2/4)。您的日常压力负荷已超过神经系统的自然恢复速度。',
      '高度情绪耗竭(3/4)。多项心理储备告急，需要立即设立边界并减少额外消耗。',
      '严重全面耗竭(4/4)。您的神经系统处于慢性超载状态，请立刻优先减负与深度休整。'
    ],
    primaryBtn: '参加免费压力水平测试 &rarr;',
    subBtn: '区分职业倦怠与急性压力 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE EXAUSTÃO EM 30 SEGUNDOS',
    heading: 'Você está emocionalmente exausto agora?',
    sub: 'Marque os sinais de desgaste que você sentiu nas últimas 2 semanas:',
    items: [
      '<strong>Névoa mental:</strong> Decisões simples parecem pesadas e seu foco cai rapidamente.',
      '<strong>Distanciamento emocional:</strong> Sensação de anestesia, cinismo ou irritabilidade constante.',
      '<strong>Cansaço que não passa:</strong> Mesmo dormindo, você acorda sem energia e com o corpo pesado.',
      '<strong>Isolamento defensivo:</strong> Responder mensagens ou conversar parece exigir um esforço enorme.'
    ],
    scoreUnit: 'de 4 domínios de exaustão ativos',
    verdicts: [
      'Marque os sinais acima para avaliar sua reserva emocional.',
      'Fadiga leve (1/4). Cansativo cognitivo inicial — reserve uma pausa sem telas hoje.',
      'Exaustão moderada (2/4). Sua carga de estresse está superando sua recuperação diária.',
      'Alta exaustão emocional (3/4). Várias reservas estão esgotadas; proteja seus limites.',
      'Exaustão severa (4/4). Seu sistema nervoso está em sobrecarga crônica — priorize desacelerar.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse Grátis &rarr;',
    subBtn: 'Comparar Burnout vs. Estresse &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ СКРИНИНГ ИСТОЩЕНИЯ',
    heading: 'Испытываете ли вы эмоциональное истощение прямо сейчас?',
    sub: 'Отметьте признаки истощения, которые вы замечаете последние 2 недели:',
    items: [
      '<strong>Когнитивный туман:</strong> Простые решения даются с трудом, концентрация быстро падает.',
      '<strong>Эмоциональное онемение:</strong> Чувство пустоты, цинизма или раздражительности к привычным делам.',
      '<strong>Сон не приносит бодрости:</strong> Даже после полноценного сна вы просыпаетесь уставшим.',
      '<strong>Социальное избегание:</strong> Ответы на сообщения и общение кажутся непосильной нагрузкой.'
    ],
    scoreUnit: 'из 4 сфер истощения активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить свой эмоциональный резерв.',
      'Легкое утомление (1/4). Начальная усталость — устройте сегодня вечер без гаджетов.',
      'Умеренное истощение (2/4). Уровень стресса превышает скорость восстановления нервной системы.',
      'Высокое эмоциональное истощение (3/4). Резервы на исходе; необходимо выстроить границы.',
      'Глубокое истощение (4/4). Хроническая перегрузка нервной системы — требуется срочный отдых.'
    ],
    primaryBtn: 'Пройти бесплатный тест на стресс &rarr;',
    subBtn: 'Отличить выгорание от стресса &rarr;'
  },
  id: {
    badge: 'TRIASE KELELAHAN EMOSIONAL 30 DETIK',
    heading: 'Apakah Anda Sedang Mengalami Kelelahan Emosional?',
    sub: 'Centang sinyal kelelahan yang sering Anda rasakan selama 2 minggu terakhir:',
    items: [
      '<strong>Kabut Kognitif:</strong> Keputusan kecil terasa berat dan fokus mudah buyar.',
      '<strong>Mati Rasa Emosional:</strong> Merasa hampa, sinis, atau mudah tersinggung pada hal biasa.',
      '<strong>Tidur Tidak Menyegarkan:</strong> Bangun tidur tetap terasa berat dan lelah secara fisik.',
      '<strong>Penarikan Diri:</strong> Membalas pesan atau mengobrol terasa sangat menguras tenaga.'
    ],
    scoreUnit: 'dari 4 domain kelelahan aktif',
    verdicts: [
      'Centang sinyal di atas untuk mengevaluasi cadangan energi emosional Anda.',
      'Kelelahan ringan (1/4). Kelelahan kognitif awal — jadwalkan istirahat tenang malam ini.',
      'Kelelahan moderat (2/4). Beban stres Anda melampaui pemulihan harian sistem saraf.',
      'Kelelahan emosional tinggi (3/4). Banyak cadangan energi terkuras; perkuat batasan Anda.',
      'Kelelahan parah (4/4). Sistem saraf mengalami kelebihan beban kronis — prioritaskan pemulihan segera.'
    ],
    primaryBtn: 'Ikuti Cek Stres Gratis &rarr;',
    subBtn: 'Bandingkan Burnout vs Stres &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK TÜKENMİŞLİK TARAMASI',
    heading: 'Şu Anda Duygusal Tükenmişlik Yaşıyor musunuz?',
    sub: 'Son 2 haftadır düzenli olarak yaşadığınız tükenme sinyallerini işaretleyin:',
    items: [
      '<strong>Zihinsel Sis:</strong> Basit kararlar bile ağır geliyor ve odaklanma süreniz hızla düşüyor.',
      '<strong>Duygusal Uyuşukluk:</strong> Normalde önemsediğiniz konulara karşı hissiz veya çabuk sinirlenen bir haldesiniz.',
      '<strong>Dinlendirmeyen Uyku:</strong> Yeterince uyusanız bile sabahları bedenen ağır ve yorgun uyanıyorsunuz.',
      '<strong>Sosyal Geri Çekilme:</strong> Mesajlara yanıt vermek veya sohbet etmek bile büyük bir yük gibi geliyor.'
    ],
    scoreUnit: '/ 4 tükenmişlik alanı aktif',
    verdicts: [
      'Mevcut duygusal enerji rezervinizi ölçmek için yukarıdaki sinyalleri işaretleyin.',
      'Hafif yorgunluk (1/4). Erken bilişsel yorgunluk — bu akşam экраnsız bir dinlenme planlayın.',
      'Orta düzey tükenme (2/4). Stres yükünüz günlük sinir sistemi toparlanma hızınızı aşıyor.',
      'Yüksek duygusal tükenmişlik (3/4). Enerji rezervleriniz azalmış; net sınırlar koymalısınız.',
      'Şiddetli tükenmişlik (4/4). Sinir sisteminiz kronik aşırı yük altında — acil dinlenmeye öncelik verin.'
    ],
    primaryBtn: 'Ücretsiz Stres Testini Çöz &rarr;',
    subBtn: 'Tükenmişlik ve Stresi Karşılaştır &rarr;'
  },
  hi: {
    badge: '30-सेकंड भावनात्मक थकान जांच',
    heading: 'क्या आप इस समय भावनात्मक रूप से थके हुए हैं?',
    sub: 'पिछले 2 सप्ताह में अनुभव किए गए थकान के संकेतों को चुनें:',
    items: [
      '<strong>मानसिक धुंध (Brain Fog):</strong> छोटे फैसले लेना भी भारी लगता है और ध्यान जल्दी भटकता है।',
      '<strong>भावनात्मक सुन्नता:</strong> सामान्य बातों पर भी चिड़चिड़ापन या भावनात्मक खालीपन महसूस होता है।',
      '<strong>नींद के बाद भी थकान:</strong> पूरी नींद लेने के बाद भी सुबह शरीर भारी और थका हुआ लगता है।',
      '<strong>सामाजिक दूरी:</strong> संदेशों का जवाब देना या बातचीत करना भी ऊर्जा छीनने वाला काम लगता है।'
    ],
    scoreUnit: '/ 4 थकान क्षेत्र सक्रिय हैं',
    verdicts: [
      'अपनी भावनात्मक ऊर्जा का मूल्यांकन करने के लिए ऊपर दिए गए संकेतों को चुनें।',
      'हल्की थकान (1/4)। प्रारंभिक मानसिक थकान — आज रात स्क्रीन-मुक्त आराम का समय निकालें।',
      'मध्यम भावनात्मक थकान (2/4)। आपका तनाव स्तर दैनिक रिकवरी से अधिक हो रहा है।',
      'उच्च भावनात्मक थकान (3/4)। ऊर्जा भंडार कम हो रहे हैं; अपनी सीमाएं तय करना आवश्यक है।',
      'गंभीर थकान (4/4)। आपका तंत्रिका तंत्र अत्यधिक दबाव में है — तुरंत आराम को प्राथमिकता दें।'
    ],
    primaryBtn: 'निःशुल्क स्ट्रेस चेक लें &rarr;',
    subBtn: 'बर्नआउट बनाम तनाव की तुलना करें &rarr;'
  }
};

const STRESS_MGMT_LOCALES = {
  en: {
    badge: '30-SECOND AUTONOMIC STRESS CHECK',
    heading: 'What Is Your Current Stress Response Pattern?',
    sub: 'Check the nervous system stress signals you are experiencing today:',
    items: [
      '<strong>Fight-or-Flight Tension:</strong> Racing thoughts, clenched jaw or tight shoulders, shallow breathing, and constant urgency.',
      '<strong>Freeze / Overwhelm Shutdown:</strong> Feeling mentally paralyzed, spacing out, or procrastinating when tasks pile up.',
      '<strong>Cortisol Sleep Disruption:</strong> Feeling "tired but wired" at night or waking up with immediate morning anxiety.',
      '<strong>Low Frustration Threshold:</strong> Reacting strongly to small interruptions and struggling to switch off after work.'
    ],
    scoreUnit: 'of 4 stress response signals active',
    verdicts: [
      'Check the signals above to match the right relief technique to your nervous system state.',
      'Mild sympathetic activation (1/4). A 2-minute Box Breathing (4-4-4-4) cycle will quickly reset your baseline.',
      'Moderate stress load (2/4). Combine 5-4-3-2-1 Grounding withProgressive Muscle Relaxation to release somatic tension.',
      'High cortisol activation (3/4). Your nervous system is stuck in survival mode—use Physiological Sighs and strict time-blocking.',
      'Acute autonomic overload (4/4). Down-regulate immediately with cold-water dive reflex calming before attempting cognitive work.'
    ],
    primaryBtn: 'Take the Free Stress Check &rarr;',
    subBtn: 'Try 5-4-3-2-1 Grounding Tool &rarr;'
  },
  ko: {
    badge: '30초 자율신경 스트레스 반응 체크',
    heading: '지금 나의 스트레스 반응 유형은 무엇인가요?',
    sub: '오늘 내 몸과 마음에서 나타나고 있는 스트레스 신경 신호를 체크해보세요:',
    items: [
      '<strong>투쟁-도피 과각성(Fight/Flight):</strong> 생각이 멈추지 않고 턱·어깨가 굳으며 호흡이 얕아지고 조급함이 듭니다.',
      '<strong>얼어붙기·셧다운(Freeze):</strong> 할 일이 쌓이면 오히려 머리가 멈추고 멍해지거나 시작하기가 두렵습니다.',
      '<strong>코르티솔 수면 교란:</strong> 밤에 몸은 피곤한데 뇌가 각성되어 잠들기 어렵거나 아침부터 불안감이 올라옵니다.',
      '<strong>감각 및 인내심 포화:</strong> 사소한 방해에도 예민하게 반응하고 퇴근 후에도 업무 스위치가 꺼지지 않습니다.'
    ],
    scoreUnit: '개 자율신경 스트레스 신호 활성화',
    verdicts: [
      '위 항목을 체크하여 현재 신경계 상태에 가장 효과적인 이완 기법을 확인하세요.',
      '경미한 교감신경 활성화(1/4). 2분 박스 호흡(4-4-4-4)만으로도 빠르게 평정심을 되찾을 수 있습니다.',
      '중등도 스트레스 부하(2/4). 5-4-3-2-1 그라운딩과 점진적 근육 이완법으로 신체 긴장을 먼저 풀어주세요.',
      '높은 코르티솔 각성(3/4). 신경계가 생존 모드에 갇혀 있습니다. 생리적 한숨과 타임블로킹이 필요합니다.',
      '급성 자율신경 과부하(4/4). 인지적 작업을 멈추고 찬물 자극(잠수 반사)과 즉각적인 감각 차단을 우선하세요.'
    ],
    primaryBtn: '무료 스트레스 지수 체크하기 &rarr;',
    subBtn: '5-4-3-2-1 그라운딩 실습 도구 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN STRESSREAKTIONS-CHECK',
    heading: 'Welches Stressmuster zeigt Ihr Nervensystem gerade?',
    sub: 'Wählen Sie die Stresssignale aus, die Sie heute bei sich beobachten:',
    items: [
      '<strong>Kampf-oder-Flucht-Spannung:</strong> Gedankenrasen, verspannte Schultern oder Kiefer, flache Atmung und innere Unruhe.',
      '<strong>Erstarrung (Freeze):</strong> Bei vielen Aufgaben fühlen Sie sich wie blockiert, geistig abgeschaltet oder aufgeschoben.',
      '<strong>Cortisol-Schlafstörung:</strong> Abends „todmüde, aber hellwach“ oder morgens direkt mit Anspannung aufwachen.',
      '<strong>Niedrige Reizschwelle:</strong> Kleine Störungen lösen starken Ärger aus und das Abschalten nach Feierabend fällt schwer.'
    ],
    scoreUnit: 'von 4 Stresssignalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um die passende Entspannungstechnik zu finden.',
      'Leichte Aktivierung (1/4). 2 Minuten Box-Atmung (4-4-4-4) senken Ihre Anspannung sofort.',
      'Moderate Stresslast (2/4). Kombinieren Sie 5-4-3-2-1 Grounding mit Progressiver Muskelentspannung.',
      'Hohe Cortisol-Aktivierung (3/4). Ihr Nervensystem ist im Alarmmodus – nutzen Sie Atem-Reset und klare Pausen.',
      'Akute Überlastung (4/4). Beruhigen Sie zuerst den Körper über Kältereiz (Tauchreflex) und Reizreduktion.'
    ],
    primaryBtn: 'Kostenlosen Stress-Check starten &rarr;',
    subBtn: '5-4-3-2-1 Grounding-Tool öffnen &rarr;'
  },
  es: {
    badge: 'CHEQUEO DE RESPUESTA AL ESTRÉS (30S)',
    heading: '¿Cuál es tu patrón actual de respuesta al estrés?',
    sub: 'Marca las señales autonómicas de estrés que estás sintiendo hoy:',
    items: [
      '<strong>Tensión de Lucha o Huida:</strong> Pensamientos acelerados, mandíbula o hombros tensos y urgencia constante.',
      '<strong>Bloqueo o Parálisis (Freeze):</strong> Sentirse mentalmente bloqueado o postergar todo cuando se acumulan tareas.',
      '<strong>Alteración del sueño por cortisol:</strong> Sentirse agotado pero incapaz de desconectar por la noche.',
      '<strong>Baja tolerancia a la frustración:</strong> Irritabilidad ante pequeñas interrupciones y dificultad para descansar.'
    ],
    scoreUnit: 'de 4 señales de estrés activas',
    verdicts: [
      'Marca las señales anteriores para elegir la técnica de alivio ideal para tu sistema nervioso.',
      'Activación leve (1/4). 2 minutos de Respiración en Caja (4-4-4-4) restablecerán tu calma rápidamente.',
      'Carga moderada (2/4). Combina el método 5-4-3-2-1 con relajación muscular progresiva.',
      'Alta activación de cortisol (3/4). Tu sistema nervioso está en modo supervivencia; aplica pausas activas.',
      'Sobrecarga aguda (4/4). Regula primero el cuerpo con agua fría (reflejo de inmersión) y silencio sensorial.'
    ],
    primaryBtn: 'Hacer el Test de Estrés Gratis &rarr;',
    subBtn: 'Probar ejercicio 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'BILAN DE RÉPONSE AU STRESS (30S)',
    heading: 'Quel est votre profil de stress actuel ?',
    sub: 'Cochez les signaux nerveux que vous ressentez aujourd hui :',
    items: [
      '<strong>Tension Lutte ou Fuite :</strong> Pensées rapides, mâchoire ou épaules crispées, souffle court et urgence.',
      '<strong>Figement (Freeze) :</strong> Sensation de blocage mental ou de paralysie face à l accumulation des tâches.',
      '<strong>Sommeil perturbé par le cortisol :</strong> Se sentir « épuisé mais survolté » le soir ou anxieux dès le réveil.',
      '<strong>Irritabilité accrue :</strong> Faible tolérance aux imprévus et incapacité à déconnecter après le travail.'
    ],
    scoreUnit: 'sur 4 signaux de stress actifs',
    verdicts: [
      'Cochez les signaux ci-dessus pour cibler la technique adaptée à votre système nerveux.',
      'Activation légère (1/4). 2 minutes de respiration carrée (4-4-4-4) apaiseront votre rythme.',
      'Charge modérée (2/4). Associez l ancrage 5-4-3-2-1 à la relaxation musculaire progressive.',
      'Forte activation du cortisol (3/4). Votre système est en mode survie — réduisez immédiatement les stimulations.',
      'Surcharge aiguë (4/4). Calmez le nerf vague par le réflexe d immersion (eau froide) et le repos.'
    ],
    primaryBtn: 'Faire le Bilan de Stress Gratuit &rarr;',
    subBtn: 'Outil d ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・自律神経ストレス反応チェック',
    heading: '今のあなたのストレス反応タイプは？',
    sub: '今日、心身に現れているストレスのサインにチェックを入れてください：',
    items: [
      '<strong>闘争・逃走の過緊張：</strong> 思考が止まらず、顎や肩に力が入り、呼吸が浅く焦りを感じる。',
      '<strong>フリーズ（思考停止）：</strong> やることが重なると頭が真っ白になり、動けなくなったり先延ばしにしてしまう。',
      '<strong>コルチゾール睡眠乱れ：</strong> 夜は疲れているのに脳が冴えて眠れない、または朝から不安感が強い。',
      '<strong>許容力の低下：</strong> 些細な割り込みにイライラし、仕事の後もオフに切り替えられない。'
    ],
    scoreUnit: 'つのストレス信号が該当（全4項目）',
    verdicts: [
      '上の項目をチェックして、今の神経系に最適なストレス解消法を確認しましょう。',
      '軽度の交感神経活性化(1/4)。2分間のボックス呼吸法（4-4-4-4）ですぐに落ち着きを取り戻せます。',
      '中程度のストレス負荷(2/4)。5-4-3-2-1グラウンディングと漸進的筋弛緩法を組み合わせましょう。',
      '高いコルチゾール覚醒(3/4)。神経系がサバイバルモードに入っています。深い呼吸とタイムブロッキングが必要です。',
      '急性の自律神経オーバーロード(4/4)。冷水刺激（潜水反射）と静かな環境でまず身体の警報を鎮めてください。'
    ],
    primaryBtn: '無料ストレスチェックを受ける &rarr;',
    subBtn: '5-4-3-2-1グラウンディング実践 &rarr;'
  },
  zh: {
    badge: '30秒自主神经压力反应筛查',
    heading: '您当前的压力反应模式是什么？',
    sub: '勾选您今天正在经历的神经系统压力信号：',
    items: [
      '<strong>战或逃高唤醒（Fight/Flight）：</strong> 思绪飞转、肩颈或下颌紧绷、呼吸浅快、充满紧迫感。',
      '<strong>冻结与宕机（Freeze）：</strong> 任务堆积时反而大脑空白、瘫痪拖延，难以启动任何行动。',
      '<strong>皮质醇睡眠干扰：</strong> 晚上身体很累但大脑异常清醒，或早晨一醒来就感到焦虑。',
      '<strong>情绪阈值降低：</strong> 对微小打扰极度烦躁，下班后依然无法关掉工作模式。'
    ],
    scoreUnit: '项压力反应信号激活（共4项）',
    verdicts: [
      '勾选上方信号以匹配最适合您当前神经状态的减压技术。',
      '轻度交感神经激活(1/4)。2分钟方框呼吸法（4-4-4-4）即可快速平复心率。',
      '中度压力负荷(2/4)。建议结合5-4-3-2-1感官着陆法与渐进式肌肉放松。',
      '高皮质醇唤醒(3/4)。神经系统正处于生存警戒模式，需立即进行生理叹息与时间隔离。',
      '急性自主神经超载(4/4)。请先通过冷水敷面（潜水反射）降低心率，暂停高强度脑力消耗。'
    ],
    primaryBtn: '参加免费压力水平测试 &rarr;',
    subBtn: '体验5-4-3-2-1感官着陆工具 &rarr;'
  },
  pt: {
    badge: 'CHECK DE RESPOSTA AO ESTRESSE (30S)',
    heading: 'Qual é o seu padrão atual de resposta ao estresse?',
    sub: 'Marque os sinais do sistema nervoso que você está sentindo hoje:',
    items: [
      '<strong>Tensão de Luta ou Fuga:</strong> Pensamentos acelerados, ombros ou mandíbula tensos e urgência constante.',
      '<strong>Paralisia (Freeze):</strong> Sensação de bloqueio mental ou procrastinação quando as tarefas acumulam.',
      '<strong>Sono alterado pelo cortisol:</strong> Sentir-se cansado, mas com a mente ligada à noite.',
      '<strong>Baixa tolerância à frustração:</strong> Irritação com pequenas interrupções e dificuldade de desligar após o trabalho.'
    ],
    scoreUnit: 'de 4 sinais de estresse ativos',
    verdicts: [
      'Marque os sinais acima para encontrar a técnica ideal para seu sistema nervoso.',
      'Ativação leve (1/4). 2 minutos de Respiração em Caixa (4-4-4-4) restauram a calma rapidamente.',
      'Carga moderada (2/4). Combine o aterramento 5-4-3-2-1 com relaxamento muscular progressivo.',
      'Alta ativação de cortisol (3/4). Seu sistema está em modo de sobrevivência — faça pausas estruturadas.',
      'Sobrecarga aguda (4/4). Regule o corpo imediatamente com água fria (reflexo de mergulho) e silêncio.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse Grátis &rarr;',
    subBtn: 'Usar Ferramenta 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ РЕАКЦИИ НА СТРЕСС',
    heading: 'Какой у вас сейчас тип стрессовой реакции?',
    sub: 'Отметьте сигналы нервной системы, которые вы ощущаете сегодня:',
    items: [
      '<strong>Реакция «Бей или беги»:</strong> Скачка мыслей, зажатые плечи или челюсть, поверхностное дыхание.',
      '<strong>Замирание (Freeze):</strong> Ощущение ступора, прокрастинации и пустоты в голове при избытке задач.',
      '<strong>Кортизоловый сбой сна:</strong> Вечером тело устало, но мозг не выключается, или тревога с самого утра.',
      '<strong>Низкий порог терпения:</strong> Раздражение от мелочей и неспособность отключиться от работы.'
    ],
    scoreUnit: 'из 4 сигналов стресса активны',
    verdicts: [
      'Отметьте сигналы выше, чтобы подобрать точную технику снятия стресса.',
      'Легкая активация (1/4). 2 минуты квадратного дыхания (4-4-4-4) быстро вернут спокойствие.',
      'Умеренная нагрузка (2/4). Сочетайте заземление 5-4-3-2-1 с прогрессивной мышечной релаксацией.',
      'Высокий кортизол (3/4). Нервная система в режиме выживания — нужны дыхательные паузы и четкие границы.',
      'Острая перегрузка (4/4). Снимите пик возбуждения холодной водой (нырятельный рефлекс) и тишиной.'
    ],
    primaryBtn: 'Пройти бесплатный тест на стресс &rarr;',
    subBtn: 'Практика заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'CEK RESPONS STRES 30 DETIK',
    heading: 'Apa Pola Respons Stres Anda Saat Ini?',
    sub: 'Centang sinyal sistem saraf yang Anda rasakan hari ini:',
    items: [
      '<strong>Ketegangan Lawan-atau-Lari:</strong> Pikiran berpacu, bahu/rahang tegang, napas pendek, dan rasa terburu-buru.',
      '<strong>Reaksi Membeku (Freeze):</strong> Merasa lumpuh secara mental atau menunda pekerjaan saat tugas menumpuk.',
      '<strong>Gangguan Tidur Kortisol:</strong> Tubuh lelah tetapi pikiran tetap terjaga di malam hari.',
      '<strong>Ambang Frustrasi Rendah:</strong> Mudah kesal oleh gangguan kecil dan sulit rileks setelah jam kerja.'
    ],
    scoreUnit: 'dari 4 sinyal stres aktif',
    verdicts: [
      'Centang sinyal di atas untuk mencocokkan teknik pereda stres yang tepat.',
      'Aktivasi ringan (1/4). 2 menit Pernapasan Kotak (4-4-4-4) akan быстро menenangkan sistem saraf.',
      'Beban stres moderat (2/4). Gunakan teknik Grounding 5-4-3-2-1 dan relaksasi otot progresif.',
      'Aktivasi kortisol tinggi (3/4). Sistem saraf dalam mode bertahan hidup — terapkan jeda terstruktur.',
      'Kelebihan beban akut (4/4). Tenangkan tubuh segera dengan air dingin (refleks menyelam) dan ruang tenang.'
    ],
    primaryBtn: 'Ikuti Cek Stres Gratis &rarr;',
    subBtn: 'Coba Alat Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK STRES TEPKİSİ TARAMASI',
    heading: 'Şu Anki Stres Tepki Modeliniz Nedir?',
    sub: 'Bugün sinir sisteminizde hissettiğiniz stres sinyallerini işaretleyin:',
    items: [
      '<strong>Savaş ya da Kaç Gerilimi:</strong> Hızlı düşünceler, sıkılı çene veya omuzlar, sığ nefes ve aciliyet hissi.',
      '<strong>Donakalma (Freeze):</strong> Görevler biriktiğinde zihinsel felç, dalgınlık veya erteleme döngüsü.',
      '<strong>Kortizol Uyku Bozulması:</strong> Gece yorgun ama zihnen uyanık hissetmek veya sabah kaygıyla uyanmak.',
      '<strong>Düşük Tahammül Eşiği:</strong> Küçük bölünmelere aşırı tepki vermek ve iş sonrasında şarteli kapatamamak.'
    ],
    scoreUnit: '/ 4 stres sinyali aktif',
    verdicts: [
      'Sinir sistemi durumunuza en uygun rahatlama tekniğini bulmak için yukarıdakileri işaretleyin.',
      'Hafif aktivasyon (1/4). 2 dakikalık Kutu Nefesi (4-4-4-4) dengenizi hızla geri kazandırır.',
      'Orta düzey stres (2/4). 5-4-3-2-1 Topraklama tekniğini kas gevşetme egzersiziyle birleştirin.',
      'Yüksek kortizol (3/4). Sinir sisteminiz hayatta kalma modunda — fizyolojik iç çekiş ve zaman bloklama uygulayın.',
      'Akut aşırı yük (4/4). Bilişsel çabadan önce soğuk su (dalış refleksi) ile bedensel alarmı düşürün.'
    ],
    primaryBtn: 'Ücretsiz Stres Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड स्ट्रेस रिस्पॉन्स जांच',
    heading: 'आपका वर्तमान तनाव प्रतिक्रिया पैटर्न क्या है?',
    sub: 'आज अपने तंत्रिका तंत्र में महसूस हो रहे तनाव संकेतों को चुनें:',
    items: [
      '<strong>लड़ो-या-भागो तनाव (Fight/Flight):</strong> तेज़ विचार, जबड़े या कंधों में अकड़न, उथली सांस और बेचैनी।',
      '<strong>फ्रीज़ / मानसिक जाम (Freeze):</strong> काम बढ़ने पर दिमाग सुन्न होना या काम शुरू करने में असमर्थ महसूस करना।',
      '<strong>कोर्टिसोल नींद बाधा:</strong> रात में थकान के बावजूद दिमाग का जागते रहना या सुबह चिंता के साथ उठना।',
      '<strong>कम सहनशीलता:</strong> छोटी बाधाओं पर जल्दी चिढ़ना और काम के बाद भी दिमाग को शांत न कर पाना।'
    ],
    scoreUnit: '/ 4 तनाव संकेत सक्रिय हैं',
    verdicts: [
      'अपनी स्थिति के अनुसार सही तनाव मुक्ति तकनीक चुनने के लिए ऊपर दिए गए संकेतों को चुनें।',
      'हल्का तनाव सक्रियण (1/4)। 2 मिनट की बॉक्स ब्रीदिंग (4-4-4-4) तुरंत शांति बहाल करेगी।',
      'मध्यम तनाव भार (2/4)। 5-4-3-2-1 ग्राउंडिंग और मांसपेशियों के विश्राम का संयोजन करें।',
      'उच्च कोर्टिसोल स्तर (3/4)। आपका तंत्रिका तंत्र सर्वाइवल मोड में है — गहरी सांस और टाइम-ब्लॉकिंग अपनाएं।',
      'तीव्र अधिभार (4/4)। किसी भी मानसिक कार्य से पहले ठंडे पानी (डाइव रिफ्लेक्स) से शरीर को शांत करें।'
    ],
    primaryBtn: 'निःशुल्क स्ट्रेस चेक लें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग टूल आजमाएं &rarr;'
  }
};

const SPECIAL_PAGES = [
  {
    relPath: 'ko/hsp-workplace-survival-guide.html',
    lang: 'ko',
    id: 'workplaceDrainScreener',
    chkClass: 'wp-ko-chk',
    badge: '30초 직장 감각 소진 트리아지',
    heading: '지금 사무실 환경에서 감각 과부하를 겪고 있나요?',
    sub: '근무 중 에너지를 급격히 고갈시키는 직장 내 마찰 요인을 체크해보세요:',
    items: [
      '<strong>개방형 소음 및 조명:</strong> 주변 통화 소리, 키보드 소음, 밝은 형광등 때문에 오후가 되기 전에 진이 빠집니다.',
      '<strong>연속 회의 및 멀티태스킹:</strong> 회의가 이어지거나 동시다발적 요청이 오면 정보 처리가 과부하되어 머리가 멈춥니다.',
      '<strong>감정 스펀지 현상:</strong> 상사나 동료의 미묘한 한숨, 짜증, 긴장감을 그대로 흡수하여 내 몸까지 긴장됩니다.',
      '<strong>퇴근 후 고립 욕구:</strong> 퇴근 후에는 누구와도 말하지 않고 조용하고 어두운 공간에서 혼자 쉬어야만 회복됩니다.'
    ],
    scoreUnit: '개 직장 소진 요인 해당 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 직장 내 감각 포화도를 점검해보세요.',
      '경미한 자극 피로(1/4). 소음 차단 이어폰이나 짧은 시각 휴식으로 충분히 관리 가능한 수준입니다.',
      '중등도 직장 감각 소진(2/4). 업무 중 의도적인 무자극 휴식 블록(마이크로 브레이크) 배치가 필요합니다.',
      '높은 HSP 직장 과부하(3/4). 환경 자극과 감정 노동이 겹쳐 있습니다. 경계 설정 전략을 즉시 적용하세요.',
      '심각한 감각·정서 탈진(4/4). 신경계가 만성 과각성 상태입니다. 정밀 민감도 진단과 퇴근 후 감각 리셋이 시급합니다.'
    ],
    primaryHref: '/hsp-test/?lang=ko&source=workplace_drain_screener',
    primaryTargetSlug: 'hsp-test',
    primaryBtn: '무료 HSP 민감성 정밀 테스트 &rarr;',
    subHref: '/hsp-test/reset.html?lang=ko',
    subBtn: '2분 감각 리셋 룸 열기 &rarr;'
  },
  {
    relPath: 'zh/avoidant-attachment-dating-guide.html',
    lang: 'zh',
    id: 'avoidantScreener',
    chkClass: 'av-zh-chk',
    badge: '30秒依恋去激活模式自测',
    heading: '亲密关系中，您或伴侣是否触发了“回避防卫”？',
    sub: '勾选在关系靠近或冲突时反复出现的互动信号：',
    items: [
      '<strong>亲密窒息感：</strong> 当关系快速升温或对方提出情感需求时，本能地感到压力、被束缚或想逃离。',
      '<strong>过度独立防卫：</strong> 习惯独自消化负面情绪，认为“靠自己最安全”，难以开口向伴侣示弱或求助。',
      '<strong>冲突时关闭沟通：</strong> 面对争执或情绪质问时，大脑一片空白，倾向于沉默、冷处理或推迟回应。',
      '<strong>挑剔降温机制：</strong> 一旦关系稳定下来，容易莫名放大对方的缺点，以此合理化心理距离。'
    ],
    scoreUnit: '项去激活防卫信号激活（共4项）',
    verdicts: [
      '勾选上方信号以识别关系中的回避去激活强度。',
      '轻度边界需求(1/4)。这更接近健康的个人独处需求，而非典型的回避型依恋防卫。',
      '中度去激活倾向(2/4)。在压力或高亲密情境下会触发防卫性后撤，建议练习提前约定冷静时间。',
      '显著回避依恋模式(3/4)。您的神经系统容易将“亲密”识别为“失去自主权”，需要渐进式安全感练习。',
      '典型高回避防卫机制(4/4)。全部4项去激活策略均已激活，建议先测清自身依恋光谱再制订沟通边界。'
    ],
    primaryHref: '/attachment-style/?lang=zh&start=1&surface=zh_avoidant_primary_v2',
    primaryTargetSlug: 'attachment-style',
    primaryBtn: '开始免费依恋类型自测 &rarr;',
    subHref: '/stress-check/?lang=zh',
    subBtn: '检查关系压力负荷 &rarr;'
  },
  {
    relPath: 'ko/avoidant-attachment-dating-patterns.html',
    lang: 'ko',
    id: 'avoidantScreenerKo',
    chkClass: 'av-ko-chk',
    badge: '30초 회피형 비활성화 패턴 체크',
    heading: '연애할 때 무의식적인 ‘거리두기 방어기제’가 작동하나요?',
    sub: '관계가 깊어지거나 갈등이 생길 때 나타나는 신호를 체크해보세요:',
    items: [
      '<strong>친밀감 질식감:</strong> 상대가 정서적으로 가까워지거나 의존하려 할 때 답답함과 도망치고 싶은 충동을 느낍니다.',
      '<strong>과도한 독립성 고수:</strong> 힘들 때도 도움을 요청하기보다 “혼자 해결하는 게 편하다”며 속마음을 닫습니다.',
      '<strong>갈등 시 정서적 셧다운:</strong> 감정적인 대화가 시작되면 머리가 하얘지고 입을 다물거나 자리를 피하고 싶어집니다.',
      '<strong>단점 찾기 및 냉각화:</strong> 관계가 안정될수록 갑자기 상대의 사소한 단점이 크게 보이며 마음이 식는 느낌이 듭니다.'
    ],
    scoreUnit: '개 회피 방어 신호 해당 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 관계 내 애착 비활성화 수준을 점검해보세요.',
      '자연스러운 독립성 욕구(1/4). 회피형 애착이라기보다 건강한 개인 시간 욕구에 가깝습니다.',
      '중등도 회피 방어 경향(2/4). 친밀감 압박이 클 때 방어적 거리두기가 작동합니다. 안전 신호 소통이 도움됩니다.',
      '뚜렷한 회피형 애착 패턴(3/4). 뇌가 친밀감을 통제력 상실로 인식하고 있습니다. 단계적 개방 연습이 필요합니다.',
      '전형적인 회피형 비활성화(4/4). 4대 거리두기 전략이 모두 작동 중입니다. 정확한 애착 스펙트럼 진단을 권장합니다.'
    ],
    primaryHref: '/attachment-style/?lang=ko&source=avoidant_screener',
    primaryTargetSlug: 'attachment-style',
    primaryBtn: '무료 애착유형 정밀 테스트 &rarr;',
    subHref: '/stress-check/?lang=ko',
    subBtn: '관계 스트레스 지수 확인하기 &rarr;'
  }
];

function buildScreenerMarkup(cfg) {
  const itemsHtml = cfg.items.map(text => `        <label class="screener-item">
          <input type="checkbox" class="${cfg.chkClass}" value="1">
          <span class="screener-text">${text}</span>
        </label>`).join('\n');

  return `<div class="screener-box" id="${cfg.id}">
      <div class="screener-head">
        <span class="screener-badge">${cfg.badge}</span>
        <h3>${cfg.heading}</h3>
        <p>${cfg.sub}</p>
      </div>
      <div class="screener-list" role="group" aria-label="${cfg.badge}">
${itemsHtml}
      </div>
      <div class="screener-feedback">
        <div class="screener-score">
          <span id="${cfg.id}Count">0</span> ${cfg.scoreUnit}
        </div>
        <p id="${cfg.id}Verdict">${cfg.verdicts[0]}</p>
        <div class="screener-actions">
          <a class="screener-btn cta-btn" href="${cfg.primaryHref}" data-content-surface="cta" data-target-slug="${cfg.primaryTargetSlug}">${cfg.primaryBtn}</a>
          <a class="screener-sub-btn" href="${cfg.subHref}">${cfg.subBtn}</a>
        </div>
      </div>
    </div>`;
}

function buildScreenerScript(cfg) {
  return `<script>
(function init_${cfg.id}() {
  var box = document.getElementById('${cfg.id}');
  if (!box) return;
  var chks = box.querySelectorAll('.${cfg.chkClass}');
  var countEl = document.getElementById('${cfg.id}Count');
  var verdictEl = document.getElementById('${cfg.id}Verdict');
  if (!chks.length || !countEl || !verdictEl) return;
  var verdicts = ${JSON.stringify(cfg.verdicts)};
  function update() {
    var checked = 0;
    chks.forEach(function(c) {
      var parent = c.closest('.screener-item');
      if (c.checked) {
        checked++;
        if (parent) parent.classList.add('is-checked');
      } else {
        if (parent) parent.classList.remove('is-checked');
      }
    });
    countEl.textContent = checked;
    verdictEl.textContent = verdicts[checked] || verdicts[0];
  }
  chks.forEach(function(c) { c.addEventListener('change', update); });
})();
</script>`;
}

function applyScreenerToFile(filePath, cfg) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Update dateModified
  content = content.replace(/"dateModified":\s*"[^"]+"/, `"dateModified": "${TODAY}"`);

  // Inject CSS if needed
  if (!content.includes('.screener-box {')) {
    const styleClose = content.indexOf('</style>');
    if (styleClose !== -1) {
      content = content.slice(0, styleClose) + UniversalCss + '\n    ' + content.slice(styleClose);
    }
  }

  // Replace first .cta-box or update existing screener
  const markup = buildScreenerMarkup(cfg);
  const existingScreenerRegex = new RegExp(`<div class="screener-box" id="${cfg.id}">[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>`);
  const ctaBoxRegex = /<div class="cta-box">[\s\S]*?<\/div>/;

  if (existingScreenerRegex.test(content)) {
    content = content.replace(existingScreenerRegex, markup);
  } else if (ctaBoxRegex.test(content)) {
    content = content.replace(ctaBoxRegex, markup);
  } else {
    console.warn(`[WARN] No .cta-box found in ${filePath}`);
  }

  // Fix bare /stress-type/ link if present
  content = content.replace(/href="\/stress-type\/"/g, `href="/stress-type/?lang=${cfg.lang}"`);

  // Inject script before </body> if not present
  const fnName = `init_${cfg.id}`;
  if (!content.includes(fnName)) {
    const scriptHtml = buildScreenerScript(cfg);
    const bodyClose = content.lastIndexOf('</body>');
    if (bodyClose !== -1) {
      content = content.slice(0, bodyClose) + scriptHtml + '\n\n' + content.slice(bodyClose);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function updateSitemapUrl(sitemapContent, url) {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRegex = new RegExp(`(<loc>${escaped}<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`);
  if (blockRegex.test(sitemapContent)) {
    return sitemapContent.replace(blockRegex, `$1${TODAY}$2`);
  }
  return sitemapContent;
}

function run() {
  const changedUrls = [];

  // 0. Ensure cta-btn class on am-i-highly-sensitive-person-signs.html across 12 locales
  for (const lang of Object.keys(EXHAUSTION_LOCALES)) {
    const hspFile = path.join(PORTAL_BLOG, lang, 'am-i-highly-sensitive-person-signs.html');
    if (fs.existsSync(hspFile)) {
      let c = fs.readFileSync(hspFile, 'utf8');
      if (c.includes('class="screener-btn"')) {
        c = c.replace('class="screener-btn"', 'class="screener-btn cta-btn" data-content-surface="cta" data-target-slug="hsp-test"');
        fs.writeFileSync(hspFile, c, 'utf8');
      }
    }
  }

  // 1. Deploy Emotional Exhaustion screener across 12 locales
  for (const [lang, loc] of Object.entries(EXHAUSTION_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-exhaustion-signs-recovery.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'exhaustionScreener',
      chkClass: 'exh-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=exhaustion_primary`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-exhaustion-signs-recovery.html`);
    console.log(`[PASS] emotional-exhaustion-signs-recovery (${lang})`);
  }

  // 2. Deploy Stress Management Techniques screener across 12 locales
  for (const [lang, loc] of Object.entries(STRESS_MGMT_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'stress-management-techniques-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'stressResponseScreener',
      chkClass: 'str-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/stress-management-techniques-guide.html`);
    console.log(`[PASS] stress-management-techniques-guide (${lang})`);
  }

  // 3. Deploy Special High-Traffic Guides (KO HSP Workplace, ZH Avoidant, KO Avoidant)
  for (const spec of SPECIAL_PAGES) {
    const filePath = path.join(PORTAL_BLOG, spec.relPath);
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, spec);
    changedUrls.push(`https://dopabrain.com/portal/blog/${spec.relPath}`);
    console.log(`[PASS] ${spec.relPath}`);
  }

  // 4. Sync sitemaps
  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Updated lastmod=${TODAY} for ${changedUrls.length} URLs in sitemaps.`);
}

run();

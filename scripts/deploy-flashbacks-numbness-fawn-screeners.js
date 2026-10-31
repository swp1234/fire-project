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
        .screener-btn, .screener-btn.cta-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; max-width: 380px; min-height: 48px; padding: 12px 24px; background: linear-gradient(135deg, var(--primary, #7c3aed), var(--primary-light, #8b5cf6)); color: #fff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.35); text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(0,0,0,0.3); transition: all 0.25s; }
        .screener-btn:hover { transform: translateY(-1px); opacity: 0.95; color: #fff !important; }
        .screener-sub-btn { display: inline-block; padding: 10px 16px; color: var(--primary-light, #a78bfa); text-decoration: none; font-size: 13.5px; font-weight: 600; min-height: 44px; line-height: 24px; }
        .screener-sub-btn:hover { text-decoration: underline; }
`;

const EMOTIONAL_FLASHBACK_LOCALES = {
  en: {
    badge: '30-SECOND CPTSD EMOTIONAL FLASHBACK SCREENER',
    heading: 'Are You Experiencing an Emotional Flashback Right Now?',
    sub: 'Check the nervous system regression signals you notice when a subtle trigger hits:',
    items: [
      '<strong>Sudden Emotional Age Regression:</strong> You abruptly feel small, helpless, or terrified like a child, even though you are a capable adult.',
      '<strong>Flashback Without Visual Memory:</strong> Overwhelming dread, shame, or panic floods your body without any clear picture of a past event.',
      '<strong>Disproportionate Threat Alarm:</strong> A minor critique, sigh, or unanswered text feels like catastrophic abandonment or imminent danger.',
      '<strong>Inner Critic Attack Surge:</strong> Your mind immediately spirals into toxic shame ("I am broken / unsafe") or frantic people-pleasing.'
    ],
    scoreUnit: 'of 4 CPTSD emotional flashback signals active',
    verdicts: [
      'Check the signals above to see if your nervous system is in a present-moment reaction or an emotional flashback.',
      'Mild Trigger Activation (1/4). Your body noticed a reminder of past stress, but your adult pre-frontal cortex remains anchored.',
      'Moderate Emotional Regression (2/4). Implicit amygdala memory is amplifying current stress—anchor yourself in the present.',
      'High CPTSD Flashback State (3/4). Your nervous system is reliving an old survival state without visual memory.',
      'Active Emotional Flashback Hijack (4/4). Anchor your body with 5-4-3-2-1 Grounding now, then check your full nervous system load.'
    ],
    primaryBtn: 'Check Your Nervous System &amp; Trauma Load &rarr;',
    subBtn: 'Anchor Now with 5-4-3-2-1 Sensory Grounding &rarr;'
  },
  ko: {
    badge: '30초 복합트라우마(C-PTSD) 정서적 플래시백 판별기',
    heading: '지금 내 감정은 현재의 반응일까요, 정서적 플래시백일까요?',
    sub: '사소한 자극 직후 몸과 마음에서 일어나는 신경계 퇴행 신호를 체크해보세요:',
    items: [
      '<strong>갑작스러운 정서적 연령 퇴행:</strong> 성인임에도 불구하고 순간적으로 어린아이처럼 작고 무력하며 어쩔 줄 모르는 공포에 휩싸입니다.',
      '<strong>시각적 기억 없는 감정의 홍수:</strong> 특정 과거 장면이 떠오르지 않는데도 설명할 수 없는 공포, 수치심, 절망감이 온몸을 덮칩니다.',
      '<strong>상황에 비해 과도한 생존 위협감:</strong> 가벼운 지적이나 늦은 답장 하나가 마치 세상에서 완전히 버림받는 듯한 재앙처럼 느껴집니다.',
      '<strong>맹렬한 내면의 비판자 폭주:</strong> 순간적으로 "나는 결함이 있어"라는 독성 수치심에 빠지거나 상대를 달래려 과잉 영합(Fawn)합니다.'
    ],
    scoreUnit: '개 C-PTSD 정서적 플래시백 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 반응이 암묵적 기억에 의한 정서적 플래시백인지 확인해보세요.',
      '경미한 트리거 반응(1/4). 과거의 기억이 살짝 자극되었으나 현재의 성인 자아가 중심을 잡고 있습니다.',
      '중등도 정서적 퇴행(2/4). 편도체에 저장된 과거의 암묵적 감정 기억이 현재 스트레스를 증폭시키고 있습니다.',
      '높은 정서적 플래시백 상태(3/4). 시각적 회상 없이 과거의 무력감과 생존 공포가 신경계에서 재연되고 있습니다.',
      '강한 정서적 플래시백 하이재킹(4/4). 지금 즉시 5-4-3-2-1 오감 그라운딩으로 현재로 돌아온 뒤 신경계 부하를 점검하세요.'
    ],
    primaryBtn: '무료 신경계 스트레스 및 트라우마 반응 진단 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 지금 여기로 돌아오기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN K-PTBS EMOTIONALER FLASHBACK-CHECK',
    heading: 'Erleben Sie gerade einen emotionalen Flashback?',
    sub: 'Wählen Sie die Signale aus, die bei subtilen Auslösern in Ihrem Nervensystem auftreten:',
    items: [
      '<strong>Plötzliche emotionale Regression:</strong> Sie fühlen sich schlagartig klein, hilflos und ausgeliefert wie ein Kind.',
      '<strong>Gefühlsflut ohne innere Bilder:</strong> Überwältigende Angst, Scham oder Verzweiflung überrollt Sie ohne klare Erinnerung an früher.',
      '<strong>Unverhältnismäßiger Bedrohungsalarm:</strong> Leichte Kritik oder ein Seufzen fühlt sich wie totaler Verlust oder Gefahr an.',
      '<strong>Toxische Scham-Attacke:</strong> Ihr innerer Kritiker greift Sie sofort massiv an oder zwingt Sie in extremes People-Pleasing.'
    ],
    scoreUnit: 'von 4 emotionalen Flashback-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um einen emotionalen Flashback zu erkennen.',
      'Leichte Trigger-Reaktion (1/4). Ihr Erwachsenen-Ich behält die Orientierung in der Gegenwart.',
      'Moderate emotionale Regression (2/4). Implizite Amygdala-Erinnerungen verstärken den aktuellen Stress.',
      'Hoher emotionaler Flashback-Zustand (3/4). Ihr Nervensystem durchlebt alte Überlebensgefühle erneut.',
      'Akuter emotionaler Flashback (4/4). Verankern Sie sich jetzt mit 5-4-3-2-1 Grounding und prüfen Sie Ihr Stressprofil.'
    ],
    primaryBtn: 'Kostenlosen Nervensystem- &amp; Stress-Check starten &rarr;',
    subBtn: '5-4-3-2-1 Grounding-Übung gegen Flashbacks öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE FLASHBACK EMOCIONAL (TEPT-C) EN 30 SEGUNDOS',
    heading: '¿Estás experimentando un flashback emocional ahora mismo?',
    sub: 'Marca las señales de regresión del sistema nervioso que notas ante un detonante sutil:',
    items: [
      '<strong>Regresión emocional repentina:</strong> De pronto te sientes pequeño, indefenso o aterrado como un niño aunque seas adulto.',
      '<strong>Inundación emocional sin imágenes:</strong> Pánico, vergüenza o desolación te invaden sin recordar una escena específica del pasado.',
      '<strong>Alarma de amenaza desproporcionada:</strong> Una crítica leve o un silencio se siente como abandono total o peligro inminente.',
      '<strong>Ataque del crítico interno:</strong> Caes de inmediato en vergüenza tóxica o en una urgencia desesperada por complacer.'
    ],
    scoreUnit: 'de 4 señales de flashback emocional activas',
    verdicts: [
      'Marca las señales arriba para distinguir una reacción actual de un flashback emocional.',
      'Activación leve (1/4). Tu cerebro adulto mantiene el anclaje en el presente.',
      'Regresión emocional moderada (2/4). La memoria implícita de la amígdala está amplificando el momento actual.',
      'Estado alto de flashback emocional (3/4). Tu cuerpo está reviviendo un estado antiguo de supervivencia.',
      'Secuestro agudo por flashback emocional (4/4). Ánclate al presente con Grounding 5-4-3-2-1 y evalúa tu sistema nervioso.'
    ],
    primaryBtn: 'Hacer el Test Gratuito de Estrés y Sistema Nervioso &rarr;',
    subBtn: 'Anclarse al Presente con Grounding 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE FLASHBACK ÉMOTIONNEL (TSPT-C) EN 30 SECONDES',
    heading: 'Vivez-vous un flashback émotionnel en ce moment ?',
    sub: 'Cochez les signaux de régression nerveuse que vous ressentez face à un déclencheur :',
    items: [
      '<strong>Régression émotionnelle soudaine :</strong> Vous vous sentez brusquement petit, impuissant ou terrifié comme un enfant.',
      '<strong>Submersion sans image visuelle :</strong> Une terreur, une honte ou un désespoir intense vous envahit sans souvenir précis.',
      '<strong>Alarme de menace disproportionnée :</strong> Une remarque mineure ou un silence est vécu comme un abandon catastrophique.',
      '<strong>Assaut du critique intérieur :</strong> Vous basculez instantanément dans la honte toxique ou la soumission (Fawn).'
    ],
    scoreUnit: 'sur 4 signaux de flashback émotionnel actifs',
    verdicts: [
      'Cochez les signaux ci-dessus pour identifier un flashback émotionnel.',
      'Activation légère (1/4). Votre cortex adulte reste ancré dans le présent.',
      'Régression émotionnelle modérée (2/4). La mémoire implicite amplifie votre stress actuel.',
      'État élevé de flashback émotionnel (3/4). Votre système nerveux revit une ancienne détresse.',
      'Flashback émotionnel aigu (4/4). Ancrez votre corps avec l’exercice 5-4-3-2-1 et vérifiez votre charge nerveuse.'
    ],
    primaryBtn: 'Faire le Test Gratuit Système Nerveux et Stress &rarr;',
    subBtn: 'Revenir au Présent avec l’Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒 C-PTSD 感情的フラッシュバック判定チェック',
    heading: '今の苦しさは「現在の反応」それとも「感情的フラッシュバック」？',
    sub: '些細なきっかけの直後に起きる神経系の退行サインをチェックしてください：',
    items: [
      '<strong>突然の感情的な年齢退行：</strong> 大人であるにもかかわらず、急に無力で小さな子どものような恐怖や心細さに襲われる。',
      '<strong>映像を伴わない感情の洪水：</strong> 過去の具体的な場面は浮かばないのに、強烈な恐怖・羞恥心・絶望感が身体を支配する。',
      '<strong>状況に見合わない脅威アラーム：</strong> 軽い指摘や返信の遅れが、見捨てられや破滅的な危機のように感じられる。',
      '<strong>内なる批判者の暴走：</strong> 瞬時に「自分はダメだ」という強い恥に陥るか、相手をなだめようと過剰に迎合（フォーン）してしまう。'
    ],
    scoreUnit: '/ 4 個の感情的フラッシュバック信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、感情的フラッシュバックが起きていないか確認しましょう。',
      '軽度のトリガー反応（1/4）。大人の理性が「今ここ」の現実を保っています。',
      '中程度の感情的退行（2/4）。扁桃体の暗黙記憶が現在のストレスを増幅させています。',
      '高い感情的フラッシュバック状態（3/4）。視覚的記憶なしに過去の生存恐怖が身体で再演されています。',
      '強い感情的フラッシュバック状態（4/4）。今すぐ5-4-3-2-1グラウンディングで現在に戻り、神経系ストレスを診断してください。'
    ],
    primaryBtn: '無料の神経系ストレス＆トラウマ反応チェックへ &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで「今ここ」に戻る &rarr;'
  },
  zh: {
    badge: '30秒 C-PTSD 情绪闪回（Emotional Flashback）筛查',
    heading: '你现在经历的是当下情绪，还是“情绪闪回”？',
    sub: '勾选在遇到微小触发点后，你身体和神经系统出现的退行信号：',
    items: [
      '<strong>突然的心理年龄退行：</strong> 明明已经是成年人，却瞬间感到自己像个弱小、无助、孤立无援的孩子。',
      '<strong>没有画面的情绪淹没：</strong> 脑海中并没有浮现具体的过去画面，但强烈的恐惧、羞耻或绝望感瞬间席卷全身。',
      '<strong>不成比例的生存警报：</strong> 一句轻微的批评、叹气或未回消息，让你感觉像要被彻底抛弃或面临灭顶之灾。',
      '<strong>内在批判者猛烈攻击：</strong> 瞬间陷入毒性羞耻（“我糟糕透了”），或拼命讨好迎合以求安全。'
    ],
    scoreUnit: '/ 4 个 C-PTSD 情绪闪回信号已激活',
    verdicts: [
      '勾选上方信号，判断神经系统是否正处于隐性情绪闪回中。',
      '轻度触发反应（1/4）。你的成年理性依然稳固地锚定在当下。',
      '中度情绪退行（2/4）。杏仁核的隐性记忆正在放大当下的压力反应。',
      '高度情绪闪回状态（3/4）。你的神经系统正在重演过去的生存恐惧。',
      '强烈情绪闪回劫持（4/4）。请立即使用 5-4-3-2-1 感官着陆法回到当下，并测算你的神经系统负荷。'
    ],
    primaryBtn: '开始免费神经系统与压力反应测试 &rarr;',
    subBtn: '立即打开 5-4-3-2-1 感官着陆练习回到当下 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE FLASHBACK EMOCIONAL (TEPT-C) EM 30 SEGUNDOS',
    heading: 'Você está tendo um Flashback Emocional agora?',
    sub: 'Marque os sinais de regressão do sistema nervoso que você sente após um gatilho sutil:',
    items: [
      '<strong>Regressão emocional súbita:</strong> De repente você se sente pequeno, indefeso e assustado como uma criança.',
      '<strong>Inundação sem memória visual:</strong> Pavor, vergonha ou desespero intensos tomam conta do corpo sem imagens claras do passado.',
      '<strong>Alarme de ameaça desproporcional:</strong> Uma crítica leve ou demora na resposta parece um abandono catastrófico.',
      '<strong>Ataque do crítico interno:</strong> Você cai instantaneamente em vergonha tóxica ou em necessidade urgente de agradar (Fawn).'
    ],
    scoreUnit: 'de 4 sinais de flashback emocional ativos',
    verdicts: [
      'Marque os sinais acima para identificar se está em um flashback emocional.',
      'Ativação leve (1/4). Seu cérebro adulto permanece ancorado no presente.',
      'Regressão emocional moderada (2/4). Memórias implícitas da amígdala estão amplificando o estresse atual.',
      'Estado alto de flashback emocional (3/4). Seu sistema nervoso está revivendo um estado antigo de sobrevivência.',
      'Flashback emocional agudo (4/4). Ancore seu corpo agora com o Grounding 5-4-3-2-1 e avalie seu nível de estresse.'
    ],
    primaryBtn: 'Fazer o Teste Gratuito de Estresse e Sistema Nervoso &rarr;',
    subBtn: 'Voltar ao Presente com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ЭМОЦИОНАЛЬНЫЙ ФЛЕШБЭК (К-ПТСР)',
    heading: 'Вы сейчас проживаете эмоциональный флешбэк?',
    sub: 'Отметьте признаки регрессии нервной системы, возникающие после мелкого триггера:',
    items: [
      '<strong>Внезапная возрастная регрессия:</strong> Вы резко ощущаете себя маленьким, беспомощным и напуганным ребенком.',
      '<strong>Лавина чувств без визуальных образов:</strong> Ужас, стыд или отчаяние накрывают тело без конкретных картинок прошлого.',
      '<strong>Несоразмерная тревога угрозы:</strong> Легкое замечание или пауза в переписке ощущаются как катастрофа и полное отвержение.',
      '<strong>Атака внутреннего критика:</strong> Вы мгновенно проваливаетесь в токсичный стыд или паническое угодничество (Fawn).'
    ],
    scoreUnit: 'из 4 признаков эмоционального флешбэка активны',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить текущую реакцию от эмоционального флешбэка.',
      'Легкая реакция на триггер (1/4). Ваша взрослая часть сохраняет опору в настоящем.',
      'Умеренная эмоциональная регрессия (2/4). Имплицитная память миндалевидного тела усиливает стресс.',
      'Высокий уровень флешбэка (3/4). Нервная система заново проживает старый опыт выживания.',
      'Острый эмоциональный флешбэк (4/4). Вернитесь в реальность через заземление 5-4-3-2-1 и проверьте уровень стресса.'
    ],
    primaryBtn: 'Пройти бесплатный тест на стресс и реакцию нервной системы &rarr;',
    subBtn: 'Вернуться в «здесь и сейчас» через заземление 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING FLASHBACK EMOSIONAL (CPTSD) 30 DETIK',
    heading: 'Apakah Anda Sedang Mengalami Flashback Emosional Saat Ini?',
    sub: 'Centang sinyal regresi sistem saraf yang muncul saat ada pemicu kecil:',
    items: [
      '<strong>Regresi Usia Emosional Mendadak:</strong> Anda tiba-tiba merasa kecil, tak berdaya, dan ketakutan seperti anak kecil.',
      '<strong>Banjir Emosi Tanpa Ingatan Visual:</strong> Rasa takut, malu, atau putus asa melanda tubuh tanpa gambaran masa lalu yang jelas.',
      '<strong>Alarm Ancaman Berlebihan:</strong> Kritik ringan atau pesan yang belum dibalas terasa seperti pengabaian total.',
      '<strong>Serangan Kritikus Batin:</strong> Pikiran langsung terjebak rasa malu toksik atau dorongan panik untuk menyenangkan orang lain.'
    ],
    scoreUnit: 'dari 4 sinyal flashback emosional aktif',
    verdicts: [
      'Centang sinyal di atas untuk mengenali apakah Anda sedang mengalami flashback emosional.',
      'Aktivasi pemicu ringan (1/4). Otak dewasa Anda masih berpijak kuat di masa kini.',
      'Regresi emosional sedang (2/4). Memori implisit amigdala memperkuat stres saat ini.',
      'Status flashback emosional tinggi (3/4). Sistem saraf Anda sedang mengulang ketakutan masa lalu.',
      'Flashback emosional akut (4/4). Jangkar tubuh Anda dengan Grounding 5-4-3-2-1 sekarang dan cek beban stres Anda.'
    ],
    primaryBtn: 'Ikuti Tes Gratis Stres &amp; Sistem Saraf &rarr;',
    subBtn: 'Kembali ke Masa Kini dengan Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK K-TSSB DUYGUSAL FLASHBACK TARAMASI',
    heading: 'Şu Anda Duygusal Bir Flashback mi Yaşıyorsunuz?',
    sub: 'Küçük bir tetikleyiciden sonra sinir sisteminizde beliren gerileme sinyallerini işaretleyin:',
    items: [
      '<strong>Ani Duygusal Yaş Gerilemesi:</strong> Yetişkin olmanıza rağmen aniden kendinizi küçük, çaresiz ve savunmasız bir çocuk gibi hissediyorsunuz.',
      '<strong>Görsel Anı Olmadan Duygu Tufanı:</strong> Zihninizde net bir geçmiş sahnesi yokken yoğun korku, utanç veya çaresizlik bedeninizi sarıyor.',
      '<strong>Orantısız Tehdit Alarmı:</strong> Küçük bir eleştiri veya geciken mesaj, felaket boyutunda bir terk edilme gibi geliyor.',
      '<strong>İçsel Eleştirmen Saldırısı:</strong> Anında toksik utanca ("Ben bozuğum") veya panik halinde memnun etme (Fawn) tepkisine düşüyorsunuz.'
    ],
    scoreUnit: '/ 4 duygusal flashback sinyali aktif',
    verdicts: [
      'Mevcut tepkinizi duygusal bir flashback’ten구분 etmek için yukarıdaki sinyalleri işaretleyin.',
      'Hafif Tetiklenme (1/4). Yetişkin bilinciniz şu anda ve gerçeklikte kalmaya devam ediyor.',
      'Orta Düzey Duygusal Gerileme (2/4). Örtük amigdala hafızası mevcut stresi büyütüyor.',
      'Yüksek Duygusal Flashback Durumu (3/4). Sinir sisteminiz eski bir hayatta kalma korkusunu yeniden yaşıyor.',
      'Akut Duygusal Flashback (4/4). Şimdi 5-4-3-2-1 Topraklama ile bedeninizi şimdiki zamana sabitleyin ve stres yükünüzü ölçün.'
    ],
    primaryBtn: 'Ücretsiz Sinir Sistemi ve Stres Testini Başlat &rarr;',
    subBtn: '5-4-3-2-1 Topraklama Egzersizi ile Şimdiye Dön &rarr;'
  },
  hi: {
    badge: '30-सेकंड C-PTSD इमोशनल फ्लैशबैक स्क्रीनर',
    heading: 'क्या आप इस समय इमोशनल फ्लैशबैक का अनुभव कर रहे हैं?',
    sub: 'किसी छोटे ट्रिगर के बाद नर्वस सिस्टम में दिखने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>अचानक भावनात्मक रूप से बच्चे जैसा असहाय महसूस करना:</strong> वयस्क होने के बावजूद अचानक खुद को छोटा, डरा हुआ और बेबस महसूस करना।',
      '<strong>बिना किसी दृश्य याद के भावनाओं का तूफान:</strong> अतीत की किसी स्पष्ट तस्वीर के बिना अचानक गहरा डर, शर्म या निराशा छा जाना।',
      '<strong>अत्यधिक खतरे का अलार्म:</strong> छोटी सी आलोचना या देर से आया रिप्लाई पूरी तरह त्यागे जाने जैसा महसूस होना।',
      '<strong>आंतरिक आलोचक (Inner Critic) का हमला:</strong> तुरंत गहरी शर्म या दूसरों को खुश करने (Fawn) की घबराहट में चले जाना।'
    ],
    scoreUnit: '/ 4 इमोशनल फ्लैशबैक संकेत सक्रिय',
    verdicts: [
      'यह जानने के लिए ऊपर दिए गए संकेतों को चुनें कि क्या आप इमोशनल फ्लैशबैक में हैं।',
      'हल्का ट्रिगर सक्रियण (1/4)। आपका वयस्क मस्तिष्क वर्तमान में स्थिर है।',
      'मध्यम भावनात्मक प्रतिगमन (2/4)। अतीत की अनकही भावनात्मक यादें वर्तमान तनाव को बढ़ा रही हैं।',
      'उच्च इमोशनल फ्लैशबैक स्थिति (3/4)। आपका नर्वस सिस्टम पुराने डर को फिर से जी रहा है।',
      'तीव्र इमोशनल फ्लैशबैक (4/4)। अभी 5-4-3-2-1 ग्राउंडिंग से वर्तमान में लौटें और अपना स्ट्रेस लोड जांचें।'
    ],
    primaryBtn: 'मुफ्त नर्वस सिस्टम और स्ट्रेस चेक शुरू करें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग अभ्यास से वर्तमान में लौटें &rarr;'
  }
};

const EMOTIONAL_NUMBNESS_LOCALES = {
  en: {
    badge: '30-SECOND EMOTIONAL NUMBNESS & SHUTDOWN SCREENER',
    heading: 'Why Did Your Feelings Shut Off? Check Your Shutdown Pattern',
    sub: 'Select the emotional blunting and dorsal vagal protective signals you experience:',
    items: [
      '<strong>Muted Joy &amp; Muted Grief:</strong> Even during milestones, losses, or affectionate moments, you feel flat—unable to cry or feel genuinely excited.',
      '<strong>Glass-Wall Detachment:</strong> You watch your own life and conversations from behind an invisible pane of glass, going through the motions on autopilot.',
      '<strong>Post-Overwhelm Circuit Breaker:</strong> After prolonged stress, conflict, or burnout, your emotions suddenly go "offline" into hollow emptiness.',
      '<strong>Cognitive Empathy Only:</strong> You logically know you care about loved ones, yet you cannot feel the warm emotional resonance in your chest.'
    ],
    scoreUnit: 'of 4 emotional numbness &amp; shutdown signals active',
    verdicts: [
      'Check the items above to evaluate whether your nervous system has pulled its protective circuit breaker.',
      'Mild Protective Blunting (1/4). Temporary emotional fatigue after stress—gentle rest and sensory grounding help.',
      'Moderate Emotional Detachment (2/4). Your brain is dampening emotional volume to shield you from overload.',
      'High Dorsal Vagal Shutdown (3/4). Prolonged stress or freeze/fawn patterns have engaged your emotional circuit breaker.',
      'Severe Emotional Numbness (4/4). Your nervous system is in protective shutdown—measure your stress load and gently awaken sensory safety.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Shutdown Check &rarr;',
    subBtn: 'Gently Reconnect with 5-4-3-2-1 Sensory Grounding &rarr;'
  },
  ko: {
    badge: '30초 감정 무감각(Emotional Numbness) 및 신경계 셧다운 판별기',
    heading: '왜 아무런 감정도 느껴지지 않을까요? 내 감정 차단 패턴 확인하기',
    sub: '최근 일상에서 겪고 있는 정서적 둔마 및 방어적 셧다운 신호를 체크해보세요:',
    items: [
      '<strong>기쁨과 슬픔의 동시 소실:</strong> 좋은 일이 생겨도 설레지 않고, 슬픈 상황에서도 눈물이 나지 않으며 마음이 평평하게 멈춰 있습니다.',
      '<strong>유리벽 너머의 관찰자 느낌:</strong> 내 삶과 대화를 투명한 유리벽 뒤에서 남 일처럼 바라보며 자동조종(Autopilot) 모드로 버텨냅니다.',
      '<strong>과부하 이후의 두꺼비집 차단:</strong> 긴 스트레스, 갈등, 번아웃 끝에 어느 순간 감정이 뚝 끊기며 텅 빈 공허감만 남았습니다.',
      '<strong>머리로는 알지만 가슴이 무덤덤함:</strong> 소중한 사람들을 아낀다는 사실은 머리로는 알지만 가슴에서 따뜻한 정서적 울림이 느껴지지 않습니다.'
    ],
    scoreUnit: '개 감정 무감각·셧다운 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 신경계가 과부하로부터 나를 지키기 위해 감정 차단기를 내렸는지 확인해보세요.',
      '일시적 정서 피로(1/4). 단기 스트레스 후 나타나는 자연스러운 둔감화 상태입니다.',
      '중등도 감정 거리두기(2/4). 뇌가 정서적 과부하를 막기 위해 감정의 볼륨을 낮추고 있습니다.',
      '높은 등쪽 미주신경 셧다운(3/4). 만성 스트레스나 동결(Freeze) 반응으로 인해 감정 회로가 보호 차단에 들어갔습니다.',
      '심각한 정서적 무감각 상태(4/4). 신경계가 방어적 셧다운에 빠져 있습니다. 지금 스트레스 부하를 진단하고 안전한 감각 깨우기를 시작하세요.'
    ],
    primaryBtn: '3분 신경계 스트레스 및 셧다운 정밀 진단 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 안전하게 감각 깨우기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN EMOTIONALE TAUBHEIT & SHUTDOWN-CHECK',
    heading: 'Warum fühlen Sie nichts mehr? Prüfen Sie Ihr Shutdown-Muster',
    sub: 'Wählen Sie die Anzeichen für emotionale Abstumpfung und Schutz-Shutdown:',
    items: [
      '<strong>Gedämpfte Freude &amp; Trauer:</strong> Selbst bei schönen Momenten oder Verlusten fühlen Sie sich innerlich flach und können kaum weinen oder jubeln.',
      '<strong>Glaswand-Distanz:</strong> Sie erleben Ihr Leben wie hinter einer unsichtbaren Glasscheibe im Autopilot-Modus.',
      '<strong>Sicherung nach Überlastung:</strong> Nach langem Stress oder Konflikten schalten Ihre Gefühle plötzlich komplett auf Leere.',
      '<strong>Nur kognitive Empathie:</strong> Sie wissen im Kopf, dass Ihnen Menschen wichtig sind, spüren aber keine Wärme in der Brust.'
    ],
    scoreUnit: 'von 4 Signalen für emotionale Taubheit aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihren Schutz-Shutdown zu prüfen.',
      'Leichte emotionale Ermüdung (1/4). Kurzzeitige Schutzreaktion nach Belastung.',
      'Moderate emotionale Distanzierung (2/4). Ihr Gehirn regelt die Gefühlsintensität herunter.',
      'Hoher dorsaler Vagus-Shutdown (3/4). Chronischer Stress hat den emotionalen Schutzschalter ausgelöst.',
      'Ausgeprägte emotionale Taubheit (4/4). Prüfen Sie jetzt Ihre Stresslast und aktivieren Sie sanft Ihre Sinne.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Shutdown-Check starten &rarr;',
    subBtn: 'Sanftes 5-4-3-2-1 Sinnes-Grounding öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE ENTUMECIMIENTO EMOCIONAL EN 30 SEGUNDOS',
    heading: '¿Por qué se apagaron tus emociones? Evalúa tu bloqueo protector',
    sub: 'Marca las señales de embotamiento afectivo y apagado vagal que experimentas:',
    items: [
      '<strong>Alegría y tristeza silenciadas:</strong> Incluso en momentos importantes te sientes plano, sin poder llorar ni entusiasmarse de verdad.',
      '<strong>Desconexión tras un cristal:</strong> Observas tu vida y tus conversaciones detrás de una pared de vidrio en piloto automático.',
      '<strong>Cortacircuitos tras sobrecarga:</strong> Después de mucho estrés o agotamiento, tus emociones se desconectan dejando un vacío hueco.',
      '<strong>Empatía solo cognitiva:</strong> Sabes mentalmente que quieres a los tuyos, pero no logras sentir calidez emocional en el pecho.'
    ],
    scoreUnit: 'de 4 señales de entumecimiento emocional activas',
    verdicts: [
      'Marca las señales arriba para ver si tu sistema nervioso activó su cortacircuitos emocional.',
      'Fatiga emocional leve (1/4). Respuesta temporal tras un pico de estrés.',
      'Desconexión emocional moderada (2/4). Tu cerebro está bajando el volumen emocional para protegerte.',
      'Alto apagado vagal dorsal (3/4). El estrés crónico o la respuesta de congelamiento bloquearon tus emociones.',
      'Entumecimiento emocional severo (4/4). Evalúa tu carga de estrés y reconecta suavemente a través de los sentidos.'
    ],
    primaryBtn: 'Hacer el Chequeo de Estrés y Bloqueo en 3 Minutos &rarr;',
    subBtn: 'Reconectar Suavemente con Grounding 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR D’ENGOURDISSEMENT ÉMOTIONNEL EN 30 SECONDES',
    heading: 'Pourquoi vos émotions sont-elles coupées ? Testez votre mise en veille',
    sub: 'Cochez les signes d’émoussement affectif et de protection vagale que vous vivez :',
    items: [
      '<strong>Joie et tristesse en sourdine :</strong> Même lors d’événements forts, vous vous sentez plat, incapable de pleurer ou de vibrer.',
      '<strong>Détachement derrière une vitre :</strong> Vous observez votre propre vie en pilote automatique derrière une paroi invisible.',
      '<strong>Disjoncteur après surcharge :</strong> Après un stress prolongé ou un conflit, vos émotions s’éteignent brusquement.',
      '<strong>Empathie purement mentale :</strong> Vous savez que vous aimez vos proches, mais sans ressentir de chaleur dans la poitrine.'
    ],
    scoreUnit: 'sur 4 signaux d’engourdissement émotionnel actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer votre mécanisme de coupure émotionnelle.',
      'Fatigue émotionnelle légère (1/4). Baisse temporaire après une surcharge.',
      'Détachement émotionnel modéré (2/4). Votre cerveau réduit le volume émotionnel par autoprotection.',
      'Mise en veille vagale élevée (3/4). Le stress chronique a enclenché votre disjoncteur émotionnel.',
      'Engourdissement émotionnel sévère (4/4). Mesurez votre charge de stress et réveillez doucement vos sens.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Mise en Veille en 3 Minutes &rarr;',
    subBtn: 'Se Réancrer en Douceur avec l’Exercice 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒 感情麻痺（エモーショナル・ナムネス）＆シャットダウン診断',
    heading: 'なぜ何も感じないのか？感情のブレーカー遮断パターンをチェック',
    sub: '日常で感じている感情の平板化や防衛的シャットダウンのサインを選んでください：',
    items: [
      '<strong>喜びも悲しみもミュートされる：</strong> 嬉しい出来事でも心が動かず、悲しい場面でも涙が出ないまま平坦に感じる。',
      '<strong>ガラスの壁越しの感覚：</strong> 自分の人生や会話を透明なガラスの向こう側から見ているように自動操縦で過ごしている。',
      '<strong>過負荷後のブレーカー遮断：</strong> 長引くストレスや燃え尽きの後、突然プツンと感情が切れて空っぽの虚無感だけが残る。',
      '<strong>頭だけの共感：</strong> 大切な人を想う気持ちは頭では分かるのに、胸の温かさや感情の共鳴が感じられない。'
    ],
    scoreUnit: '/ 4 個の感情麻痺・シャットダウン信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、神経系が防衛的な感情遮断を起こしているか確認しましょう。',
      '軽度の感情疲労（1/4）。一時的なストレス後の自然な感覚の鈍りです。',
      '中程度の感情的切り離し（2/4）。脳がオーバーロードを防ぐために感情の音量を下げています。',
      '高い背側迷走神経シャットダウン（3/4）。慢性ストレスやフリーズ反応により感情のブレーカーが落ちています。',
      '深刻な感情麻痺（4/4）。今すぐ神経系のストレス負荷を測定し、安全な五感グラウンディングで感覚を取り戻しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆シャットダウン診断へ &rarr;',
    subBtn: '5-4-3-2-1 五感グラウンディングで優しく感覚を呼び覚ます &rarr;'
  },
  zh: {
    badge: '30秒 情绪麻木（Emotional Numbness）与神经关闭筛查',
    heading: '为什么你感觉不到情绪了？检测你的防御性关闭模式',
    sub: '勾选你在日常中感受到的情感钝化与迷走神经保护信号：',
    items: [
      '<strong>喜悦与悲伤同时静音：</strong> 遇到好事提不起劲，难过时也哭不出来，内心像一条平直的线。',
      '<strong>隔着玻璃墙看生活：</strong> 仿佛隔着一层透明玻璃观察自己的生活与对话，全靠自动驾驶模式撑着。',
      '<strong>过载后的断路器跳闸：</strong> 在长期高压、冲突或倦怠之后，情绪突然“断电”，只剩下空洞感。',
      '<strong>只剩理性共情：</strong> 脑子里知道自己在乎身边的人，但胸口却感受不到温暖的情感共鸣。'
    ],
    scoreUnit: '/ 4 个情绪麻木与关闭信号已激活',
    verdicts: [
      '勾选上方信号，查看你的神经系统是否拉下了情绪保护闸。',
      '轻度情感疲劳（1/4）。压力过后的暂时性情绪降温。',
      '中度情感抽离（2/4）。大脑正在调低情绪音量以防止精神过载。',
      '高度背侧迷走神经关闭（3/4）。长期高压或冻结反应触发了情绪断路器。',
      '重度情绪麻木状态（4/4）。请立即测算你的压力负荷，并通过 5-4-3-2-1 感官练习温柔唤醒身体安全感。'
    ],
    primaryBtn: '开始 3 分钟压力与情绪关闭测评 &rarr;',
    subBtn: '通过 5-4-3-2-1 感官着陆法温柔唤醒感受 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE DORMÊNCIA EMOCIONAL EM 30 SEGUNDOS',
    heading: 'Por que suas emoções desligaram? Verifique seu padrão de bloqueio',
    sub: 'Selecione os sinais de embotamento afetivo e desligamento protetor que você sente:',
    items: [
      '<strong>Alegria e tristeza no mudo:</strong> Mesmo em momentos marcantes, você se sente neutro, sem conseguir chorar ou se empolgar.',
      '<strong>Sensação de parede de vidro:</strong> Você assiste à própria vida no piloto automático, como se estivesse atrás de um vidro.',
      '<strong>Disjuntor após sobrecarga:</strong> Após estresse prolongado ou burnout, suas emoções caem subitamente em um vazio oco.',
      '<strong>Empatia apenas racional:</strong> Você sabe racionalmente que se importa com quem ama, mas não sente calor emocional no peito.'
    ],
    scoreUnit: 'de 4 sinais de dormência emocional ativos',
    verdicts: [
      'Marque os itens acima para avaliar se seu sistema nervoso acionou o disjuntor emocional.',
      'Fadiga emocional leve (1/4). Amortecimento temporário após sobrecarga.',
      'Distanciamento emocional moderado (2/4). Seu cérebro está reduzindo o volume emocional para protegê-lo.',
      'Alto desligamento vagal dorsal (3/4). O estresse crônico acionou seu bloqueio emocional protetor.',
      'Dormência emocional severa (4/4). Meça sua carga de estresse agora e desperte seus sentidos com segurança.'
    ],
    primaryBtn: 'Fazer o Check-up de Estresse e Bloqueio em 3 Minutos &rarr;',
    subBtn: 'Reconectar com Segurança pelo Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ЭМОЦИОНАЛЬНОЕ ОНЕМЕНИЕ',
    heading: 'Почему чувства «отключились»? Проверьте защитную блокировку',
    sub: 'Отметьте признаки эмоционального притупления и дорсального вагусного отключения:',
    items: [
      '<strong>Приглушенная радость и печаль:</strong> Даже в важные моменты внутри ровно и плоско — нет ни слез, ни искреннего восторга.',
      '<strong>Жизнь за стеклянной стеной:</strong> Вы наблюдаете за своей жизнью на автопилоте, словно через невидимое стекло.',
      '<strong>Предохранитель после перегрузки:</strong> После долгого стресса или выгорания эмоции резко выключаются в пустоту.',
      '<strong>Только когнитивная эмпатия:</strong> Умом вы понимаете, что любите близких, но не чувствуете душевного тепла в груди.'
    ],
    scoreUnit: 'из 4 признаков эмоционального онемения активны',
    verdicts: [
      'Отметьте пункты выше, чтобы понять, сработал ли защитный предохранитель нервной системы.',
      'Легкая эмоциональная усталость (1/4). Временное притупление после нагрузки.',
      'Умеренное отстранение (2/4). Мозг снижает громкость эмоций для защиты от перегрузки.',
      'Высокое вагусное отключение (3/4). Хронический стресс перевел эмоциональную систему в режим заморозки.',
      'Глубокое эмоциональное онемение (4/4). Проверьте уровень стресса и мягко верните чувствительность через заземление.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и отключение &rarr;',
    subBtn: 'Мягко пробудить чувства с практикой 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING MATI RASA EMOSIONAL (NUMBNESS) 30 DETIK',
    heading: 'Mengapa Perasaan Anda Mati Rasa? Cek Pola Shutdown Anda',
    sub: 'Pilih sinyal penumpulan emosi dan proteksi sistem saraf yang Anda alami:',
    items: [
      '<strong>Suka &amp; Duka Terasa Datar:</strong> Bahkan di momen penting atau sedih, hati terasa datar—sulit menangis atau merasa antusias.',
      '<strong>Terpisah Dinding Kaca:</strong> Anda menjalani hidup dengan mode autopilot seperti menonton dari balik kaca.',
      '<strong>Sekring Putus Setelah Kewalahan:</strong> Setelah stres panjang atau burnout, emosi tiba-tiba mati dan menyisakan kehampaan.',
      '<strong>Empati Hanya di Pikiran:</strong> Secara logika Anda peduli pada orang terdekat, namun dada tidak merasakan kehangatan emosional.'
    ],
    scoreUnit: 'dari 4 sinyal mati rasa emosional aktif',
    verdicts: [
      'Centang item di atas untuk melihat apakah sistem saraf Anda menurunkan sekring pelindungnya.',
      'Kelelahan emosional ringan (1/4). Penumpulan sementara setelah tekanan.',
      'Penjarakan emosional sedang (2/4). Otak mengecilkan volume emosi agar tidak kewalahan.',
      'Shutdown vagal dorsal tinggi (3/4). Stres kronis memicu penguncian emosi pelindung.',
      'Mati rasa emosional berat (4/4). Ukur beban stres Anda sekarang dan bangunkan kembali pancaindra dengan lembut.'
    ],
    primaryBtn: 'Ikuti Cek Stres &amp; Shutdown 3 Menit &rarr;',
    subBtn: 'Bangunkan Indra dengan Lembut via Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK DUYGUSAL UYUŞMA (NUMBNESS) TARAMASI',
    heading: 'Duygularınız Neden Kapandı? Koruyucu Kapanma Modelinizi Ölçün',
    sub: 'Yaşadığınız duygusal körelme ve sinir sistemi kapanma sinyallerini seçin:',
    items: [
      '<strong>Sessize Alınmış Sevinç ve Üzüntü:</strong> Önemli anlarda bile içiniz düz; ağlayamıyor veya gerçekten heyecanlanamıyorsunuz.',
      '<strong>Cam Duvar Arkasından Yaşam:</strong> Hayatınızı görünmez bir camın arkasından otomatik pilotta izliyorsunuz.',
      '<strong>Aşırı Yük Sonrası Sigorta Atması:</strong> Uzun süreli stres veya tükenmişlikten sonra duygularınız aniden boşluğa kapandı.',
      '<strong>Yalnızca Zihinsel Empati:</strong> Sevdiklerinizi önemsediğinizi mantıken biliyor ama göğsünüzde duygusal sıcaklık hissedemiyorsunuz.'
    ],
    scoreUnit: '/ 4 duygusal uyuşma sinyali aktif',
    verdicts: [
      'Sinir sisteminizin koruyucu şalteri indirip indirmediğini görmek için yukarıdakileri işaretleyin.',
      'Hafif Duygusal Yorgunluk (1/4). Stres sonrası geçici duygusal 둔감화.',
      'Orta Düzey Duygusal Uzaklaşma (2/4). Beyniniz aşırı yükü önlemek için duygu sesini kısıyor.',
      'Yüksek Dorsal Vagal Kapanma (3/4). Kronik stres koruyucu duygu kilidini devreye soktu.',
      'Şiddetli Duygusal Uyuşma (4/4). Şimdi stres yükünüzü ölçün ve 5-4-3-2-1 egzersiziyle duyularınızı nazikçe uyandırın.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Kapanma Testini Başlat &rarr;',
    subBtn: '5-4-3-2-1 Topraklama ile Duyuları Nazikçe Uyandır &rarr;'
  },
  hi: {
    badge: '30-सेकंड इमोशनल नंबनेस (भावनात्मक सुन्नता) स्क्रीनर',
    heading: 'आपकी भावनाएं क्यों बंद हो गईं? अपना शटडाउन पैटर्न जांचें',
    sub: 'अपने दैनिक जीवन में महसूस होने वाले भावनात्मक सुन्नता के संकेतों को चुनें:',
    items: [
      '<strong>खुशी और दुख दोनों का सुन्न होना:</strong> खास पलों या दुखद स्थितियों में भी मन सपाट रहता है—न रोना आता है, न उत्साह।',
      '<strong>कांच की दीवार के पीछे से जीना:</strong> आप अपनी ही ज़िंदगी को ऑटोपायलट मोड पर जैसे किसी कांच के पीछे से देख रहे हैं।',
      '<strong>ओवरलोड के बाद भावनाओं का स्विच ऑफ होना:</strong> लंबे तनाव या बर्नआउट के बाद अचानक भावनाएं बंद होकर खालीपन छोड़ जाती हैं।',
      '<strong>केवल दिमागी सहानुभूति:</strong> आप दिमाग से जानते हैं कि आप अपनों की परवाह करते हैं, लेकिन सीने में भावनात्मक गर्माहट महसूस नहीं होती।'
    ],
    scoreUnit: '/ 4 भावनात्मक सुन्नता संकेत सक्रिय',
    verdicts: [
      'यह देखने के लिए ऊपर दिए गए विकल्प चुनें कि क्या आपके नर्वस सिस्टम ने सुरक्षात्मक शटडाउन किया है।',
      'हल्की भावनात्मक थकान (1/4)। तनाव के बाद अस्थायी सुन्नता।',
      'मध्यम भावनात्मक दूरी (2/4)। ओवरलोड से बचाने के लिए मस्तिष्क भावनाओं की तीव्रता कम कर रहा है।',
      'उच्च डोर्सल वेगस शटडाउन (3/4)। लंबे तनाव ने आपके भावनात्मक सर्किट ब्रेकर को सक्रिय कर दिया है।',
      'गंभीर भावनात्मक सुन्नता (4/4)। अभी अपना स्ट्रेस लोड जांचें और 5-4-3-2-1 ग्राउंडिंग से इंद्रियों को धीरे-धीरे जगाएं।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और शटडाउन चेक लें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग से सुरक्षित रूप से जुड़ाव महसूस करें &rarr;'
  }
};

const PEOPLE_PLEASING_SIGNS_LOCALES = {
  en: {
    badge: '30-SECOND FAWN RESPONSE & PEOPLE-PLEASING SCREENER',
    heading: 'Is Your Kindness Actually a Nervous System Fawn Response?',
    sub: 'Check the automatic appeasement reflexes that fire when you sense tension or disapproval:',
    items: [
      '<strong>Reflexive Apologizing:</strong> You say "sorry" when someone bumps into you, when asking a valid question, or when expressing a basic need.',
      '<strong>Chameleon Self-Erasure:</strong> You instantly mirror the opinions, mood, and preferences of whoever is in the room to avoid friction.',
      '<strong>Somatic Dread of Displeasure:</strong> The thought of someone being slightly annoyed or disappointed with you triggers stomach knots or racing thoughts.',
      '<strong>Delayed Resentment Burnout:</strong> You say "yes" with a warm smile, then feel exhausted, trapped, and silently resentful afterward.'
    ],
    scoreUnit: 'of 4 fawn trauma response signals active',
    verdicts: [
      'Check the signals above to distinguish healthy empathy from a trauma-driven fawn response.',
      'Healthy Consideration (1/4). You care about harmony without sacrificing your core boundaries.',
      'Moderate Appeasement Habit (2/4). Conflict anxiety is nudging you to override your honest preferences.',
      'High Fawn Response Activation (3/4). Your nervous system equates other people’s approval with physical safety.',
      'Severe Self-Abandonment Loop (4/4). Chronic fawning is draining your life force—check your stress load and generate a refusal script now.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Fawn Response Check &rarr;',
    subBtn: 'Generate Polite "No" &amp; Boundary Scripts Now &rarr;'
  },
  ko: {
    badge: '30초 착한아이 증후군 · 영합(Fawn) 트라우마 반응 판별기',
    heading: '배려심일까요, 생존을 위한 영합(Fawn) 반응일까요?',
    sub: '갈등이나 불편한 기류를 감지할 때 자동으로 튀어나오는 반응을 체크해보세요:',
    items: [
      '<strong>반사적인 사과 습관:</strong> 내 잘못이 아닌 일이나 정당한 요청을 할 때조차 습관적으로 "죄송합니다/미안해요"가 먼저 나옵니다.',
      '<strong>카멜레온식 자기 지우기:</strong> 마찰을 피하기 위해 함께 있는 사람의 의견, 기분, 취향에 내 본래 생각을 즉시 맞춰버립니다.',
      '<strong>타인의 실망에 대한 신체적 공포:</strong> 누군가 나에게 조금이라도 기분 나빠하거나 실망할까 봐 속이 쓰리고 머릿속이 복잡해집니다.',
      '<strong>웃으며 수락한 뒤 밀려오는 번아웃:</strong> 겉으로는 밝게 웃으며 "괜찮아요, 제가 할게요"라고 해놓고, 돌아서서 억울함과 탈진을 느낍니다.'
    ],
    scoreUnit: '개 영합(Fawn) 트라우마 반응 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 건강한 배려와 신경계 영합(Fawn) 반응을 구분해보세요.',
      '건강한 배려 수준(1/4). 타인을 존중하면서도 나의 핵심 경계를 잘 지키고 있습니다.',
      '중등도 눈치 보기·영합 습관(2/4). 갈등 불안 때문에 내 솔직한 욕구를 자주 뒤로 미루고 있습니다.',
      '높은 영합(Fawn) 반응 활성화(3/4). 신경계가 타인의 기분과 승인을 곧 나의 안전으로 동일시하고 있습니다.',
      '심각한 자기 소외·과잉 영합 루프(4/4). 만성적인 착한아이 반응이 에너지를 고갈시키고 있습니다. 지금 스트레스 부하를 점검하고 거절 대본을 만드세요.'
    ],
    primaryBtn: '3분 스트레스 및 영합(Fawn) 반응 정밀 진단 &rarr;',
    subBtn: '상황별 정중한 거절·경계 설정 대본 빌더 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN FAWN-RESPONSE & PEOPLE-PLEASING-CHECK',
    heading: 'Ist Ihre Freundlichkeit in Wahrheit eine Fawn-Traumareaktion?',
    sub: 'Wählen Sie die automatischen Beschwichtigungsreflexe, die bei Spannung auftreten:',
    items: [
      '<strong>Reflexhaftes Entschuldigen:</strong> Sie sagen „Tut mir leid“, selbst wenn Sie keine Schuld trifft oder nur ein Grundbedürfnis äußern.',
      '<strong>Chamäleon-Selbsterlöschung:</strong> Sie passen Ihre Meinung und Stimmung sofort Ihrem Gegenüber an, um Reibung zu verhindern.',
      '<strong>Körperliche Angst vor Missfallen:</strong> Der Gedanke, jemand könnte verärgert über Sie sein, löst Magendruck oder Grübeln aus.',
      '<strong>Verzögerter Groll &amp; Erschöpfung:</strong> Sie sagen lächelnd „Ja“, fühlen sich danach aber ausgelaugt und innerlich wütend.'
    ],
    scoreUnit: 'von 4 Fawn-Response-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um gesundes Mitgefühl von einer Fawn-Reaktion zu unterscheiden.',
      'Gesunde Rücksichtnahme (1/4). Sie wahren Harmonie, ohne Ihre eigenen Grenzen aufzugeben.',
      'Moderate Beschwichtigung (2/4). Konfliktangst drängt Ihre eigenen Bedürfnisse zurück.',
      'Hohe Fawn-Aktivierung (3/4). Ihr Nervensystem setzt die Zustimmung anderer mit Sicherheit gleich.',
      'Chronische Selbstaufgabe (4/4). Prüfen Sie jetzt Ihre Stresslast und erstellen Sie klare Nein-Skripte.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Fawn-Response-Test starten &rarr;',
    subBtn: 'Interaktiven Nein-Sagen- &amp; Grenz-Skript-Builder öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE RESPUESTA FAWN Y COMPLACENCIA EN 30 SEGUNDOS',
    heading: '¿Tu amabilidad es en realidad una respuesta traumática de sumisión (Fawn)?',
    sub: 'Marca los reflejos automáticos de apaciguamiento cuando sientes tensión o desaprobación:',
    items: [
      '<strong>Disculpas reflejas:</strong> Pides perdón incluso cuando no tienes la culpa o al expresar una necesidad básica.',
      '<strong>Camaleón emocional:</strong> Adaptas al instante tus opiniones y gustos a quien tienes enfrente para evitar roces.',
      '<strong>Miedo físico al disgusto ajeno:</strong> Pensar que alguien está molesto contigo te provoca nudos en el estómago o rumiación.',
      '<strong>Agotamiento y resentimiento tardío:</strong> Dices «sí» sonriendo y después te sientes exhausto, atrapado y resentido.'
    ],
    scoreUnit: 'de 4 señales de respuesta Fawn activas',
    verdicts: [
      'Marca las señales arriba para distinguir la empatía sana de la respuesta traumática Fawn.',
      'Consideración saludable (1/4). Cuidas la armonía sin abandonar tus límites.',
      'Hábito moderado de apaciguamiento (2/4). El miedo al conflicto desplaza tus verdaderas preferencias.',
      'Alta activación Fawn (3/4). Tu sistema nervioso confunde la aprobación ajena con tu seguridad vital.',
      'Bucle severo de autoabandono (4/4). Mide tu carga de estrés ahora y genera guiones firmes para decir «no».'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Respuesta Fawn en 3 Minutos &rarr;',
    subBtn: 'Generar Guiones para Decir «No» y Poner Límites &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE RÉPONSE FAWN ET COMPLAISANCE EN 30 SECONDES',
    heading: 'Votre gentillesse est-elle une réponse traumatique d’apaisement (Fawn) ?',
    sub: 'Cochez les réflexes automatiques qui s’activent face à une tension ou un désaccord :',
    items: [
      '<strong>Excuses réflexes :</strong> Vous dites « pardon » même sans être en tort ou en exprimant un besoin légitime.',
      '<strong>Effacement caméléon :</strong> Vous calquez immédiatement vos avis et votre humeur sur autrui pour éviter tout conflit.',
      '<strong>Angoisse physique de déplaire :</strong> L’idée que quelqu’un soit déçu de vous noue votre estomac et déclenche des ruminations.',
      '<strong>Épuisement et rancœur différée :</strong> Vous dites « oui » avec le sourire, puis vous vous sentez vidé et amer.'
    ],
    scoreUnit: 'sur 4 signaux de réponse Fawn actifs',
    verdicts: [
      'Cochez les signaux ci-dessus pour distinguer l’empathie saine d’un réflexe de survie Fawn.',
      'Bienveillance équilibrée (1/4). Vous respectez vos limites tout en restant attentif.',
      'Habitude d’apaisement modérée (2/4). La peur du conflit vous pousse à vous oublier.',
      'Activation Fawn élevée (3/4). Votre système nerveux lie l’approbation d’autrui à votre sécurité.',
      'Boucle sévère d’auto-abandon (4/4). Évaluez votre stress et créez vos scripts de refus dès maintenant.'
    ],
    primaryBtn: 'Faire le Test Stress et Réponse Fawn en 3 Minutes &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts pour Dire « Non » &rarr;'
  },
  ja: {
    badge: '30秒 過剰適応・フォーン（Fawn）トラウマ反応チェック',
    heading: 'その優しさは「思いやり」それとも生存のための「迎合（Fawn）反応」？',
    sub: '不機嫌や対立の気配を感じたときに自動で出る反応をチェックしてください：',
    items: [
      '<strong>反射的な謝罪クセ：</strong> 自分が悪くない時や正当なお願いをする時でさえ、反射的に「すみません」と謝ってしまう。',
      '<strong>カメレオン的な自己消去：</strong> 摩擦を避けるため、一緒にいる相手の意見や機嫌に自分の本音を即座に合わせてしまう。',
      '<strong>不興を買うことへの身体的な恐怖：</strong> 誰かが自分に少しでも不満や失望を持っていると思うと、胃が痛くなり頭から離れなくなる。',
      '<strong>笑顔の「イエス」の後の消耗と怒り：</strong> 笑顔で引き受けた後に、どっと疲れが出て「なぜ断れなかったのか」と苦しくなる。'
    ],
    scoreUnit: '/ 4 個のフォーン（迎合）反応サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、健全な思いやりとトラウマ由来のフォーン反応を見分けましょう。',
      '健全な配慮レベル（1/4）。自分の境界線を守りながら周囲と調和できています。',
      '中程度の迎合パターン（2/4）。対立への不安から自分の本音を後回しにしがちです。',
      '高いフォーン反応の活性化（3/4）。神経系が「他人の承認＝自分の安全」と結びつけています。',
      '深刻な自己犠牲ループ（4/4）。今すぐストレス負荷をチェックし、罪悪感なく断るためのスクリプトを作成しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆フォーン反応チェックへ &rarr;',
    subBtn: '角を立てずに断る「境界線スクリプト作成ツール」を開く &rarr;'
  },
  zh: {
    badge: '30秒 讨好型（Fawn）创伤反应筛查',
    heading: '你的善良是出于真心，还是神经系统的“讨好型（Fawn）生存反应”？',
    sub: '勾选当感受到气氛紧张或他人不满时，你自动触发的安抚反射：',
    items: [
      '<strong>条件反射式道歉：</strong> 即使不是你的错，或者只是提出合理需求，嘴里也会先蹦出“不好意思/对不起”。',
      '<strong>变色龙式自我抹除：</strong> 为了避免摩擦，你会瞬间顺着对方的观点、情绪和喜好说话，隐藏真实想法。',
      '<strong>对他人不满的生理性恐惧：</strong> 一想到有人可能对你失望或生气，就会胃部发紧、脑中反复内耗。',
      '<strong>微笑答应后的倦怠与委屈：</strong> 表面微笑着说“没问题”，事后却感到筋疲力尽、压抑和暗自怨恨。'
    ],
    scoreUnit: '/ 4 个讨好型（Fawn）创伤反应信号已激活',
    verdicts: [
      '勾选上方信号，区分健康的共情与创伤驱动的讨好反应。',
      '健康的体贴（1/4）。你在照顾他人感受的同时守住了核心边界。',
      '中度安抚习惯（2/4）。对冲突的焦虑正让你习惯性压抑真实需求。',
      '高度讨好型（Fawn）激活（3/4）。你的神经系统把别人的认可等同于自身安全。',
      '严重自我抛弃循环（4/4）。长期讨好正在掏空精力，请立即检测压力负荷并生成温和拒绝话术。'
    ],
    primaryBtn: '开始 3 分钟压力与讨好反应测评 &rarr;',
    subBtn: '打开边界与温和拒绝话术生成器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE RESPOSTA FAWN E AGRADAR DEMAIS EM 30 SEGUNDOS',
    heading: 'Sua gentileza é empatia ou uma resposta traumática de submissão (Fawn)?',
    sub: 'Marque os reflexos automáticos de apaziguamento que surgem diante de tensão:',
    items: [
      '<strong>Pedidos de desculpa reflexos:</strong> Você pede desculpas mesmo sem ter culpa ou ao expressar uma necessidade básica.',
      '<strong>Apagamento camaleão:</strong> Você espelha instantaneamente as opiniões e o humor dos outros para evitar atritos.',
      '<strong>Medo físico de desagradar:</strong> A ideia de alguém ficar chateado com você causa aperto no estômago e pensamentos acelerados.',
      '<strong>Exaustão e ressentimento tardio:</strong> Você diz "sim" sorrindo, mas depois se sente esgotado, preso e ressentido.'
    ],
    scoreUnit: 'de 4 sinais de resposta Fawn ativos',
    verdicts: [
      'Marque os sinais acima para diferenciar empatia saudável da resposta traumática Fawn.',
      'Consideração saudável (1/4). Você preserva a harmonia sem abrir mão dos seus limites.',
      'Hábito moderado de apaziguamento (2/4). A ansiedade de conflito está silenciando suas preferências.',
      'Alta ativação Fawn (3/4). Seu sistema nervoso associa a aprovação alheia à sua segurança física.',
      'Ciclo severo de autoabandono (4/4). Meça sua carga de estresse agora e crie roteiros firmes para dizer "não".'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Resposta Fawn em 3 Minutos &rarr;',
    subBtn: 'Abrir o Gerador de Scripts para Dizer "Não" &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА РЕАКЦИЮ УГОДНИЧЕСТВА (FAWN)',
    heading: 'Ваша доброта — это эмпатия или травматическая реакция Fawn?',
    sub: 'Отметьте автоматические рефлексы задабривания, возникающие при малейшем напряжении:',
    items: [
      '<strong>Рефлекторные извинения:</strong> Вы говорите «извините», даже когда не виноваты или просто озвучиваете базовую просьбу.',
      '<strong>Стирание себя (эффект хамелеона):</strong> Вы мгновенно подстраиваетесь под чужое мнение и настроение, чтобы избежать трений.',
      '<strong>Телесный страх чужого недовольства:</strong> Мысль о том, что кто-то недоволен вами, вызывает спазм в животе и тревогу.',
      '<strong>Отложенная обида и истощение:</strong> Вы с улыбкой говорите «да», а потом чувствуете опустошение и скрытое раздражение.'
    ],
    scoreUnit: 'из 4 признаков реакции Fawn активны',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить здоровую чуткость от травматической реакции угодничества.',
      'Здоровая тактичность (1/4). Вы сохраняете свои границы в общении.',
      'Умеренная привычка сглаживать углы (2/4). Страх конфликта заставляет вас поступаться собой.',
      'Высокая активация реакции Fawn (3/4). Нервная система приравнивает чужое одобрение к безопасности.',
      'Глубокий цикл самоотвержения (4/4). Проверьте уровень стресса и создайте готовые фразы для мягкого отказа.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и реакцию Fawn &rarr;',
    subBtn: 'Открыть конструктор фраз для отказа и личных границ &rarr;'
  },
  id: {
    badge: 'SKRINING RESPONS FAWN & PEOPLE-PLEASING 30 DETIK',
    heading: 'Apakah Kebaikan Anda Sebenarnya Respons Trauma Fawn?',
    sub: 'Centang refleks menyenangkan orang lain yang otomatis muncul saat ada ketegangan:',
    items: [
      '<strong>Refleks Meminta Maaf:</strong> Anda mengucap "maaf" meski tidak salah atau saat menyampaikan kebutuhan dasar.',
      '<strong>Menghapus Diri Bak Bunglon:</strong> Anda langsung menyesuaikan pendapat dan suasana hati demi menghindari gesekan.',
      '<strong>Ketakutan Fisik Akan Ketidaksetujuan:</strong> Pikiran bahwa seseorang kecewa pada Anda memicu perut mulas dan pikiran berputar.',
      '<strong>Kelelahan &amp; Kesal Terpendam:</strong> Anda berkata "ya" sambil tersenyum, lalu merasa terkuras dan menyesal setelahnya.'
    ],
    scoreUnit: 'dari 4 sinyal respons trauma Fawn aktif',
    verdicts: [
      'Centang sinyal di atas untuk membedakan empati sehat dari respons trauma Fawn.',
      'Kepedulian Sehat (1/4). Anda menjaga harmoni tanpa mengorbankan batasan utama.',
      'Kebiasaan Menyenangkan Sedang (2/4). Kecemasan konflik mendorong Anda mengabaikan keinginan sendiri.',
      'Aktivasi Respons Fawn Tinggi (3/4). Sistem saraf Anda menyamakan persetujuan orang lain dengan rasa aman.',
      'Siklus Mengabaikan Diri Berat (4/4). Cek beban stres Anda sekarang dan buat skrip penolakan yang sopan.'
    ],
    primaryBtn: 'Ikuti Tes Stres &amp; Respons Fawn 3 Menit &rarr;',
    subBtn: 'Buka Pembuat Skrip Batasan &amp; Menolak dengan Sopan &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK FAWN TEPKİSİ VE İNSAN MEMNUN ETME TARAMASI',
    heading: 'Nezaketiniz Empati mi Yoksa Sinir Sisteminin Fawn Tepkisi mi?',
    sub: 'Gerginlik veya onaylanmama hissettiğinizde otomatik devreye giren tepkileri işaretleyin:',
    items: [
      '<strong>Refleks Özür Dileme:</strong> Suçunuz olmadığında veya temel bir ihtiyacınızı söylerken bile otomatik olarak "özür dilerim" diyorsunuz.',
      '<strong>Bukalemun Gibi Kendini Silme:</strong> Sürtüşmeyi önlemek için karşınızdakinin fikrine ve ruh haline anında uyum sağlıyorsunuz.',
      '<strong>Hoşnutsuzluk Karşısında Bedensel Korku:</strong> Birinin size kırıldığı veya kızdığı düşüncesi midenizi düğümlüyor.',
      '<strong>Gecikmiş Öfke ve Tükenmişlik:</strong> Gülümseyerek "evet" diyor, sonrasında tükenmiş ve içten içe kırgın hissediyorsunuz.'
    ],
    scoreUnit: '/ 4 Fawn travma tepkisi sinyali aktif',
    verdicts: [
      'Sağlıklı empatiyi travma kaynaklı Fawn tepkisinden ayırmak için yukarıdakileri işaretleyin.',
      'Sağlıklı Nezaket (1/4). Kendi sınırlarınızı koruyarak uyum sağlıyorsunuz.',
      'Orta Düzey Yatıştırma Alışkanlığı (2/4). Çatışma kaygısı kendi tercihlerinizi bastırmanıza yol açıyor.',
      'Yüksek Fawn Tepkisi (3/4). Sinir sisteminiz başkalarının onayını fiziksel güvenlikle eşdeğer tutuyor.',
      'Şiddetli Kendini Terk Etme Döngüsü (4/4). Şimdi stres yükünüzü ölçün ve nazikçe "Hayır" deme cümlelerinizi oluşturun.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Fawn Tepkisi Testini Başlat &rarr;',
    subBtn: 'Sınır Koyma ve "Hayır" Deme Metin Oluşturucuyu Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड फ़ॉन (Fawn) रिस्पॉन्स और पीपल-प्लीज़िंग स्क्रीनर',
    heading: 'क्या आपकी विनम्रता वास्तव में नर्वस सिस्टम का फ़ॉन (Fawn) रिस्पॉन्स है?',
    sub: 'तनाव या असहमति भांपते ही अपने आप सक्रिय होने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>बिना गलती के माफ़ी मांगना:</strong> अपनी गलती न होने या सामान्य ज़रूरत बताने पर भी तुरंत "सॉरी" निकल जाना।',
      '<strong>गिरगिट की तरह खुद को मिटाना:</strong> टकराव से बचने के लिए सामने वाले की राय और मूड के अनुसार खुद को तुरंत बदल लेना।',
      '<strong>नाराज़गी का शारीरिक डर:</strong> कोई आपसे थोड़ा भी नाराज़ या निराश है, यह सोचकर ही पेट में मरोड़ या घबराहट होना।',
      '<strong>मुस्कुराकर "हाँ" कहने के बाद थकान:</strong> ऊपर से मुस्कुराकर काम ले लेना, लेकिन बाद में अंदर से थका हुआ और आहत महसूस करना।'
    ],
    scoreUnit: '/ 4 फ़ॉन (Fawn) ट्रॉमा रिस्पॉन्स संकेत सक्रिय',
    verdicts: [
      'स्वस्थ सहानुभूति और ट्रॉमा-आधारित फ़ॉन रिस्पॉन्स में अंतर करने के लिए ऊपर चुनें।',
      'स्वस्थ संवेदनशीलता (1/4)। आप अपनी सीमाओं की रक्षा करते हुए दूसरों का ध्यान रखते हैं।',
      'मध्यम तुष्टिकरण आदत (2/4)। टकराव का डर आपकी अपनी प्राथमिकताओं को पीछे धकेल रहा है।',
      'उच्च फ़ॉन रिस्पॉन्स सक्रियण (3/4)। आपका नर्वस सिस्टम दूसरों की स्वीकृति को ही सुरक्षा मान रहा है।',
      'गंभीर आत्म-त्याग चक्र (4/4)। अभी अपना स्ट्रेस लोड जांचें और विनम्रता से "ना" कहने की स्क्रिप्ट तैयार करें।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और फ़ॉन रिस्पॉन्स चेक लें &rarr;',
    subBtn: 'बाउंड्री और विनम्रता से "ना" कहने का स्क्रिप्ट टूल खोलें &rarr;'
  }
};

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

function findBalancedDivRange(html, startIndex) {
  let depth = 0;
  const tagRegex = /<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = startIndex;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match[0].startsWith('</')) {
      depth--;
      if (depth === 0) {
        return [startIndex, tagRegex.lastIndex];
      }
    } else {
      depth++;
    }
  }
  return null;
}

function replaceFirstBodyDivByClass(html, className, replacement, insertAfter = false) {
  const headEnd = html.indexOf('</head>');
  const searchStart = headEnd !== -1 ? headEnd : 0;
  const targetOpen = `<div class="${className}">`;
  const idx = html.indexOf(targetOpen, searchStart);
  if (idx === -1) return null;
  const range = findBalancedDivRange(html, idx);
  if (!range) return null;
  if (insertAfter) {
    return html.slice(0, range[1]) + '\n\n            ' + replacement + html.slice(range[1]);
  }
  return html.slice(0, range[0]) + replacement + html.slice(range[1]);
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

  const markup = buildScreenerMarkup(cfg);
  const headEnd = content.indexOf('</head>');
  const existingIdx = content.indexOf(`<div class="screener-box" id="${cfg.id}">`, headEnd !== -1 ? headEnd : 0);

  if (existingIdx !== -1) {
    const range = findBalancedDivRange(content, existingIdx);
    if (range) {
      content = content.slice(0, range[0]) + markup + content.slice(range[1]);
    }
  } else {
    const updatedCta = replaceFirstBodyDivByClass(content, 'cta-box', markup, false);
    const updatedIntro = !updatedCta ? replaceFirstBodyDivByClass(content, 'intro', markup, true) : null;
    const updatedHl = (!updatedCta && !updatedIntro) ? replaceFirstBodyDivByClass(content, 'highlight-box', markup, true) : null;
    if (updatedCta) {
      content = updatedCta;
    } else if (updatedIntro) {
      content = updatedIntro;
    } else if (updatedHl) {
      content = updatedHl;
    } else {
      console.warn(`[WARN] No .cta-box, .intro, or .highlight-box found in ${filePath}`);
    }
  }

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

  // 1. emotional-flashbacks-cptsd.html (12 locales)
  for (const [lang, loc] of Object.entries(EMOTIONAL_FLASHBACK_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-flashbacks-cptsd.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'emotionalFlashbackScreener',
      chkClass: 'eflash-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=emotional_flashback_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=emotional_flashback_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-flashbacks-cptsd.html`);
    console.log(`[PASS] emotional-flashbacks-cptsd (${lang})`);
  }

  // 2. emotional-numbness-causes-healing.html (12 locales)
  for (const [lang, loc] of Object.entries(EMOTIONAL_NUMBNESS_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-numbness-causes-healing.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'emotionalNumbnessScreener',
      chkClass: 'enumb-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=emotional_numbness_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=emotional_numbness_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-numbness-causes-healing.html`);
    console.log(`[PASS] emotional-numbness-causes-healing (${lang})`);
  }

  // 3. people-pleasing-signs-fawn-response.html (12 locales)
  for (const [lang, loc] of Object.entries(PEOPLE_PLEASING_SIGNS_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'people-pleasing-signs-fawn-response.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'peoplePleasingSignsScreener',
      chkClass: 'ppsigns-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=people_pleasing_signs_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=people_pleasing_signs_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/people-pleasing-signs-fawn-response.html`);
    console.log(`[PASS] people-pleasing-signs-fawn-response (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 5: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

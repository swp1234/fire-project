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

const EQ_RELATIONSHIPS_LOCALES = {
  en: {
    badge: '30-SECOND RELATIONAL EQ & CO-REGULATION SCREENER',
    heading: 'How Does Your Emotional Intelligence Hold Up Under Relationship Conflict?',
    sub: 'Check the relational friction points that appear when emotions run high with a partner:',
    items: [
      '<strong>Defensive Flooding Under Critique:</strong> When a partner brings up a complaint, your heart rate spikes and you immediately defend, counter-attack, or shut down.',
      '<strong>Mind-Reading Expectations:</strong> You expect your partner to intuitively know why you are hurt without you having to state your need directly.',
      '<strong>Fix-It Over Validation:</strong> When someone shares emotional pain, you jump straight to logical advice instead of sitting with their feelings.',
      '<strong>Delayed Repair Attempts:</strong> After an argument, pride or anxiety keeps both of you in a cold standoff rather than initiating a warm repair.'
    ],
    scoreUnit: 'of 4 relational EQ friction signals active',
    verdicts: [
      'Check the items above to see how your relational EQ and attachment system interact under stress.',
      'High Co-Regulation Mastery (1/4). You stay emotionally present and repair conflicts smoothly.',
      'Moderate Conflict Flooding (2/4). Stress occasionally hijacks your ability to listen without defensiveness.',
      'High Relational EQ Strain (3/4). Unspoken expectations and defensive flooding are blocking deeper intimacy.',
      'Core Attachment-EQ Trigger Loop (4/4). Conflict is triggering survival defenses—map your Attachment Style and build a regulation plan now.'
    ],
    primaryBtn: 'Map Your Relational Pattern with the Attachment Style Test &rarr;',
    subBtn: 'Open Interactive Emotion Regulation Planner &rarr;'
  },
  ko: {
    badge: '30초 관계 감성지능(Relational EQ) 및 공동조절 판별기',
    heading: '갈등의 순간, 내 관계 감성지능(EQ)은 어떻게 작동하나요?',
    sub: '연인이나 배우자와 감정이 격해질 때 나타나는 4가지 관계 반응 신호를 체크해보세요:',
    items: [
      '<strong>지적 앞에서의 방어적 홍수(Flooding):</strong> 상대가 서운함을 말하면 심장이 빨리 뛰면서 즉시 변명하거나 맞받아치거나 입을 닫아버립니다.',
      '<strong>말하지 않아도 알아주길 바라는 독심술 기대:</strong> 내 욕구나 서운한 이유를 직접 말하지 않고도 상대가 알아서 눈치채 주기를 바랍니다.',
      '<strong>공감보다 앞서는 해결책 제시:</strong> 상대가 힘든 감정을 털어놓을 때 충분히 공감해주기보다 논리적인 조언이나 잘잘못부터 따집니다.',
      '<strong>다툼 후 길어지는 냉전과 화해 지연:</strong> 싸운 뒤 자존심이나 두려움 때문에 먼저 다가가지 못하고 차가운 침묵을 오래 유지합니다.'
    ],
    scoreUnit: '개 관계 감성지능(EQ) 마찰 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 갈등 상황에서 내 감성지능과 애착 시스템이 어떻게 반응하는지 확인해보세요.',
      '높은 관계 공동조절 역량(1/4). 갈등 속에서도 정서적 여유를 잃지 않고 건강하게 화해를 이끕니다.',
      '중등도 갈등 각성(2/4). 스트레스가 높을 때 방어기제가 먼저 켜져 경청이 어려워지고 있습니다.',
      '높은 관계 EQ 마찰(3/4). 말하지 않은 기대와 방어적 태도가 깊은 친밀감을 가로막고 있습니다.',
      '핵심 애착-감정조절 트리거 루프(4/4). 갈등이 생존 경보를 울리고 있습니다. 지금 애착 유형 진단과 정서 조절 플래너로 관계 패턴을 전환하세요.'
    ],
    primaryBtn: '무료 애착 유형 및 관계 소통 패턴 진단 &rarr;',
    subBtn: '갈등 진정을 위한 맞춤 정서 조절 플래너 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN BEZIEHUNGS-EQ- &amp; CO-REGULATIONS-CHECK',
    heading: 'Wie stabil bleibt Ihre emotionale Intelligenz bei Beziehungskonflikten?',
    sub: 'Wählen Sie die Muster aus, die bei emotionaler Spannung in Ihrer Partnerschaft auftreten:',
    items: [
      '<strong>Abwehr-Überflutung bei Kritik:</strong> Bei Vorwürfen rast Ihr Puls und Sie gehen sofort in Rechtfertigung, Gegenangriff oder Rückzug.',
      '<strong>Gedankenlesen-Erwartung:</strong> Sie hoffen, dass Ihr Partner spürt, was Ihnen fehlt, ohne dass Sie es offen aussprechen müssen.',
      '<strong>Lösen statt Mitfühlen:</strong> Wenn Ihr Partner Kummer teilt, geben Sie sofort logische Ratschläge, statt erst emotional da zu sein.',
      '<strong>Verzögerte Versöhnung:</strong> Nach einem Streit verhindern Stolz oder Angst über Stunden ein klärendes, warmes Zugehen.'
    ],
    scoreUnit: 'von 4 Beziehungs-EQ-Reibungssignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre emotionale Co-Regulation zu prüfen.',
      'Hohe Co-Regulations-Kompetenz (1/4). Sie bleiben auch bei Reibung empathisch und verbunden.',
      'Moderate Konflikt-Überflutung (2/4). Unter Stress übernimmt kurzzeitig die Abwehr.',
      'Hohe Beziehungs-EQ-Belastung (3/4). Unausgesprochene Wünsche und Abwehr bremsen die Nähe.',
      'Akute Bindungs-EQ-Schleife (4/4). Prüfen Sie jetzt Ihren Bindungsstil und erstellen Sie einen Regulationsplan.'
    ],
    primaryBtn: 'Beziehungsmuster mit dem Bindungsstil-Test prüfen &rarr;',
    subBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE INTELIGENCIA EMOCIONAL EN PAREJA EN 30 SEGUNDOS',
    heading: '¿Cómo responde tu Inteligencia Emocional (EQ) durante un conflicto?',
    sub: 'Marca los puntos de fricción que aparecen cuando suben las emociones en tu relación:',
    items: [
      '<strong>Inundación defensiva ante quejas:</strong> Cuando tu pareja señala algo, te aceleras y pasas al contraataque, excusa o bloqueo.',
      '<strong>Expectativa de lectura mental:</strong> Esperas que tu pareja adivine por qué estás dolido sin expresar tu necesidad directamente.',
      '<strong>Solucionar en vez de validar:</strong> Ante el dolor emocional del otro, saltas a dar consejos lógicos sin validar primero su emoción.',
      '<strong>Reparación tardía tras discutir:</strong> El orgullo o la ansiedad alargan el silencio frío después de una pelea.'
    ],
    scoreUnit: 'de 4 señales de fricción de EQ relacional activas',
    verdicts: [
      'Marca los puntos arriba para ver cómo interactúan tu EQ y tu estilo de apego.',
      'Alta maestría de co-regulación (1/4). Mantienes la presencia emocional y reparas con fluidez.',
      'Inundación moderada en conflictos (2/4). El estrés activa defensas que dificultan escuchar.',
      'Alta tensión de EQ relacional (3/4). Las expectativas tácitas y la defensividad frenan la intimidad.',
      'Bucle profundo de apego y EQ (4/4). Descubre tu Estilo de Apego ahora y diseña tu plan de regulación.'
    ],
    primaryBtn: 'Evaluar tu Relación con el Test de Estilo de Apego &rarr;',
    subBtn: 'Abrir Planificador de Regulación Emocional &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR D’INTELLIGENCE ÉMOTIONNELLE EN COUPLE EN 30 SECONDES',
    heading: 'Comment réagit votre Intelligence Émotionnelle (QE) lors d’un conflit ?',
    sub: 'Cochez les points de friction qui apparaissent lorsque la tension monte en couple :',
    items: [
      '<strong>Submersion défensive :</strong> Face à un reproche, votre cœur s’accélère et vous passez immédiatement à la justification ou au mutisme.',
      '<strong>Attente de lecture de pensée :</strong> Vous espérez que votre partenaire devine vos besoins sans avoir à les formuler clairement.',
      '<strong>Conseiller au lieu de valider :</strong> Face à la peine de l’autre, vous proposez tout de suite des solutions logiques sans accueillir l’émotion.',
      '<strong>Réparation différée :</strong> Après une dispute, la fierté ou l’anxiété prolonge le froid au lieu de renouer le lien.'
    ],
    scoreUnit: 'sur 4 signaux de friction QE en couple actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer votre co-régulation émotionnelle.',
      'Excellente co-régulation (1/4). Vous restez présent et réparez les désaccords avec souplesse.',
      'Submersion modérée (2/4). Le stress déclenche parfois des réflexes défensifs.',
      'Tension élevée sur le QE relationnel (3/4). Les non-dits et la défensive freinent l’intimité.',
      'Boucle réactive Attachement-QE (4/4). Passez le Test d’Attachement et créez votre plan de régulation.'
    ],
    primaryBtn: 'Analyser votre Couple avec le Test d’Attachement &rarr;',
    subBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;'
  },
  ja: {
    badge: '30秒 恋愛・パートナーシップの感情知能（EQ）＆共同調整チェック',
    heading: '意見がぶつかった瞬間、あなたの「関係性EQ」はどう働いていますか？',
    sub: 'パートナーと感情がぶつかる場面で出やすい4つの摩擦サインをチェックしてください：',
    items: [
      '<strong>指摘に対する防衛的パニック：</strong> 相手から不満を言われた瞬間、心拍数が上がって言い訳・逆ギレ・貝のような沈黙に出てしまう。',
      '<strong>「言わなくても察してほしい」期待：</strong> 自分の希望や傷ついた理由を言葉にせず、相手が察してくれるのを待ってしまう。',
      '<strong>共感より先に正論・解決策を出す：</strong> 相手が弱音を吐いたとき、気持ちに寄り添う前にアドバイスや正論を言ってしまう。',
      '<strong>喧嘩後の仲直り（リペア）の遅れ：</strong> 言い合いのあと、プライドや不安が邪魔をして冷戦状態が長引いてしまう。'
    ],
    scoreUnit: '/ 4 個の関係性EQ摩擦サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、ストレス下のコミュニケーションと愛着反応を確認しましょう。',
      '高い共同調整（コ・レギュレーション）力（1/4）。対立しても感情の安全基地を保ち、スムーズに修復できています。',
      '中程度の防衛反応（2/4）。プレッシャーがかかると防衛本能が先に立ち、傾聴しづらくなっています。',
      '高い関係性EQの摩擦（3/4）。「察してほしい期待」と防衛反応が、深い親密さの壁になっています。',
      '愛着×感情調整の強いトリガーループ（4/4）。今すぐ愛着スタイル診断で根本パターンを知り、感情調整プランを作成しましょう。'
    ],
    primaryBtn: '無料の愛着スタイル＆関係パターン診断へ &rarr;',
    subBtn: '対立を鎮める「感情調整プランナー」を開く &rarr;'
  },
  zh: {
    badge: '30秒 亲密关系情商（Relational EQ）与共同调节筛查',
    heading: '在发生争执的瞬间，你的“亲密关系情商”经得起考验吗？',
    sub: '勾选在与伴侣情绪升温时，你身上容易出现的 4 个关系摩擦信号：',
    items: [
      '<strong>面对抱怨时的防御性淹没：</strong> 当伴侣提出不满时，你心跳加速，立刻本能地辩解、反击或冷脸关机。',
      '<strong>期待对方有“读心术”：</strong> 不直接说出自己的需求或委屈，而是期待对方能自动猜中你的心思。',
      '<strong>急于讲道理而非共情确认：</strong> 当伴侣倾诉痛苦时，你跳过情感共鸣，直接开始讲道理或给解决方案。',
      '<strong>争吵后难以主动修复：</strong> 吵架后因为面子或恐惧，双方陷入漫长的冷战僵局，难以迈出温和修复的第一步。'
    ],
    scoreUnit: '/ 4 个亲密关系 EQ 摩擦信号已激活',
    verdicts: [
      '勾选上方信号，查看你的关系情商与依恋系统在压力下如何互动。',
      '高水平共同调节力（1/4）。你能在冲突中保持情绪在场并顺畅修复关系。',
      '中度冲突淹没（2/4）。压力升高时，防御本能会暂时干扰你的倾听能力。',
      '较高的关系 EQ 内耗（3/4）。未说出口的期待与防卫反应正在阻碍深层亲密。',
      '核心依恋-情绪触发循环（4/4）。冲突正在触发你的生存防御，请立即测绘依恋类型并制定情绪调节方案。'
    ],
    primaryBtn: '通过免费依恋类型测试测绘你的关系模式 &rarr;',
    subBtn: '打开化解冲突的情绪调节规划器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE QE NOS RELACIONAMENTOS EM 30 SEGUNDOS',
    heading: 'Como sua Inteligência Emocional reage durante um conflito a dois?',
    sub: 'Marque os pontos de atrito que surgem quando os ânimos esquentam na relação:',
    items: [
      '<strong>Inundação defensiva:</strong> Quando o parceiro faz uma crítica, seu coração acelera e você logo se defende, contra-ataca ou se fecha.',
      '<strong>Expectativa de leitura mental:</strong> Você espera que a pessoa adivinhar por que você está magoado sem precisar explicar.',
      '<strong>Resolver em vez de acolher:</strong> Quando o outro desabafa, você pula direto para conselhos lógicos sem acolher o sentimento.',
      '<strong>Demora na reconciliação:</strong> Após uma discussão, o orgulho ou a ansiedade prolongam o gelo entre vocês.'
    ],
    scoreUnit: 'de 4 sinais de atrito de QE relacional ativos',
    verdicts: [
      'Marque os itens acima para ver como seu QE e estilo de apego reagem sob tensão.',
      'Alta capacidade de corregulação (1/4). Você mantém presença emocional e repara conflitos.',
      'Inundação moderada em conflitos (2/4). O estresse às vezes bloqueia sua escuta.',
      'Alto desgaste de QE relacional (3/4). Expectativas ocultas e defensividade travam a intimidade.',
      'Loop reativo de Apego e QE (4/4). Mapeie seu Estilo de Apego agora e monte seu plano de regulação.'
    ],
    primaryBtn: 'Mapear sua Relação com o Teste de Estilo de Apego &rarr;',
    subBtn: 'Abrir o Planejador de Regulação Emocional &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ЭМОЦИОНАЛЬНЫЙ ИНТЕЛЛЕКТ (EQ) В ПАРЕ',
    heading: 'Как работает ваш эмоциональный интеллект в момент ссоры?',
    sub: 'Отметьте реакции, которые включаются при напряжении в отношениях:',
    items: [
      '<strong>Защитное затопление при критике:</strong> На замечание партнера вы мгновенно переходите к оправданиям, встречным упрекам или закрываетесь.',
      '<strong>Ожидание чтения мыслей:</strong> Вы ждете, что партнер сам догадается о вашей обиде без прямых слов.',
      '<strong>Советы вместо сочувствия:</strong> Когда близкий человек делится болью, вы сразу даете логические советы вместо эмоциональной поддержки.',
      '<strong>Затяжной холод после спора:</strong> После ссоры гордость или страх мешают сделать первый шаг к примирению.'
    ],
    scoreUnit: 'из 4 признаков трения EQ в отношениях активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить связь вашего EQ и типа привязанности.',
      'Высокая ко-регуляция (1/4). Вы сохраняете контакт и легко восстанавливаете близость.',
      'Умеренная реактивность в спорах (2/4). Стресс иногда включает защиту вместо слушания.',
      'Высокое напряжение EQ в паре (3/4). Невысказанные ожидания и защита мешают близости.',
      'Глубокий цикл триггеров привязанности (4/4). Пройдите тест на тип привязанности и составьте план регуляции эмоций.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности в паре &rarr;',
    subBtn: 'Открыть планировщик эмоциональной регуляции &rarr;'
  },
  id: {
    badge: 'SKRINING EQ HUBUNGAN &amp; REGULASI EMOSI 30 DETIK',
    heading: 'Bagaimana Kecerdasan Emosional (EQ) Anda Saat Konflik Hubungan?',
    sub: 'Centang titik gesekan yang muncul saat emosi memanas bersama pasangan:',
    items: [
      '<strong>Banjir Defensif Saat Dikritik:</strong> Saat pasangan mengeluh, jantung berdebar dan Anda langsung membela diri, menyerang balik, atau diam.',
      '<strong>Harapan Baca Pikiran:</strong> Anda berharap pasangan peka sendiri alasan Anda kecewa tanpa perlu dikatakan terus terang.',
      '<strong>Solusi Logis Tanpa Validasi:</strong> Saat pasangan curhat, Anda langsung memberi nasihat logis alih-alih memvalidasi perasaannya.',
      '<strong>Sulit Memulai Perbaikan:</strong> Usai bertengkar, gengsi atau cemas membuat suasana dingin bertahan lama.'
    ],
    scoreUnit: 'dari 4 sinyal gesekan EQ hubungan aktif',
    verdicts: [
      'Centang item di atas untuk melihat interaksi EQ dan gaya kelekatan Anda saat stres.',
      'Penguasaan Ko-Regulasi Tinggi (1/4). Anda tetap hadir secara emosional dan mudah berdamai.',
      'Reaktivitas Konflik Sedang (2/4). Stres terkadang memicu sikap defensif saat mendengarkan.',
      'Ketegangan EQ Hubungan Tinggi (3/4). Harapan terpendam dan sikap defensif menghambat keintiman.',
      'Siklus Pemicu Kelekatan-EQ (4/4). Petakan Gaya Kelekatan Anda sekarang dan buat rencana regulasi emosi.'
    ],
    primaryBtn: 'Petakan Pola Hubungan dengan Tes Gaya Kelekatan &rarr;',
    subBtn: 'Buka Perencana Regulasi Emosi Interaktif &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İLİŞKİSEL EQ VE BİRLİKTE DÜZENLEME TARAMASI',
    heading: 'İlişki Çatışmalarında Duygusal Zekanız (EQ) Nasıl Tepki Veriyor?',
    sub: 'Partnerinizle duygular yükseldiğinde ortaya çıkan sürtüşme noktalarını işaretleyin:',
    items: [
      '<strong>Eleştiri Karşısında Savunmacı Taşma:</strong> Partneriniz bir şikayet dile getirdiğinde nabzınız yükseliyor ve hemen savunmaya veya duvar örmeye geçiyorsunuz.',
      '<strong>Zihin Okuma Beklentisi:</strong> İhtiyacınızı açıkça söylemeden partnerinizin neden kırıldığınızı sezmesini bekliyorsunuz.',
      '<strong>Onaylamak Yerine Çözüm Dayatma:</strong> Karşı taraf duygusal acısını paylaştığında duygusuna eşlik etmek yerine hemen mantıksal tavsiye veriyorsunuz.',
      '<strong>Geciken Onarım Girişimleri:</strong> Tartışma sonrasında gurur veya kaygı yüzünden soğuk savaş uzuyor.'
    ],
    scoreUnit: '/ 4 ilişkisel EQ sürtüşme sinyali aktif',
    verdicts: [
      'Stres altında ilişkisel EQ ve bağlanma sisteminizin nasıl çalıştığını görmek için işaretleyin.',
      'Yüksek Birlikte Düzenleme Ustası (1/4). Çatışmalarda duygusal teması koruyor ve hızla onarıyorsunuz.',
      'Orta Düzey Çatışma Taşması (2/4). Stres bazen savunmasız dinleme becerinizi zorluyor.',
      'Yüksek İlişkisel EQ Zorlanması (3/4). Söylenmeyen beklentiler ve savunmacılık yakınlığı engelliyor.',
      'Derin Bağlanma-EQ Tetik Döngüsü (4/4). Şimdi Bağlanma Stili Testini çözün ve duygu düzenleme planınızı oluşturun.'
    ],
    primaryBtn: 'Bağlanma Stili Testiyle İlişki Kalıbınızı Haritalayın &rarr;',
    subBtn: 'Duygu Düzenleme Planlayıcısını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड रिलेशनशिप इमोशनल इंटेलिजेंस (EQ) स्क्रीनर',
    heading: 'रिश्ते के तनाव और मतभेद में आपका इमोशनल इंटेलिजेंस (EQ) कैसे काम करता है?',
    sub: 'पार्टनर के साथ भावनाएं तेज़ होने पर दिखने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>शिकायत सुनते ही रक्षात्मक हो जाना:</strong> पार्टनर के कुछ कहने पर तुरंत दिल की धड़कन बढ़ना और बचाव, पलटवार या चुप्पी में चले जाना।',
      '<strong>बिना कहे मन की बात समझने की उम्मीद:</strong> अपनी ज़रूरत सीधे बताने के बजाय यह उम्मीद करना कि पार्टनर खुद ही आपकी तकलीफ समझ जाए।',
      '<strong>भावनाएं समझने से पहले सलाह देना:</strong> जब कोई अपना दुख साझा करे, तो उसकी भावनाओं को महसूस करने के बजाय तुरंत तार्किक समाधान देने लगना।',
      '<strong>बहस के बाद सुलह में देरी:</strong> झगड़े के बाद अहंकार या झिझक के कारण लंबे समय तक बातचीत बंद रखना।'
    ],
    scoreUnit: '/ 4 रिलेशनशिप EQ घर्षण संकेत सक्रिय',
    verdicts: [
      'तनाव में आपके EQ और अटैचमेंट सिस्टम के काम करने का तरीका जानने के लिए ऊपर चुनें।',
      'मजबूत भावनात्मक संतुलन (1/4)। आप मतभेदों को समझदारी और जुड़ाव से सुलझाते हैं।',
      'मध्यम वैचारिक तनाव (2/4)। तनाव के समय कभी-कभी रक्षात्मक रवैया सुनने में बाधा बनता है।',
      'उच्च रिलेशनशिप EQ तनाव (3/4)। अनकही उम्मीदें और बचाव की मुद्रा गहरे जुड़ाव को रोक रही हैं।',
      'गहरा अटैचमेंट-EQ ट्रिगर चक्र (4/4)। अभी अटैचमेंट स्टाइल टेस्ट लें और इमोशन रेगुलेशन प्लान बनाएं।'
    ],
    primaryBtn: 'अटैचमेंट स्टाइल टेस्ट से अपने रिलेशनशिप पैटर्न जानें &rarr;',
    subBtn: 'इमोशन रेगुलेशन प्लानर (Emotion Regulation Planner) खोलें &rarr;'
  }
};

const EQ_DIMENSION_LOCALES = {
  en: {
    badge: '30-SECOND 4-PILLAR EMOTIONAL INTELLIGENCE (EQ) SCREENER',
    heading: 'Which of the 4 Emotional Intelligence Pillars Is Your Bottleneck?',
    sub: 'Check the emotional regulation and awareness challenges you experience under pressure:',
    items: [
      '<strong>Delayed Emotional Naming (Self-Awareness):</strong> You feel physical tension, irritability, or exhaustion long before you can name the exact emotion behind it.',
      '<strong>Impulse Hijack Under Stress (Self-Management):</strong> When frustrated or overwhelmed, you send reactive texts, snap, or shut down before your logic catches up.',
      '<strong>Social Cue Overload (Social Awareness):</strong> In tense group dynamics, you either miss subtle shifts or absorb so much tension that you freeze.',
      '<strong>Conflict Avoidance or Escalation (Relationship Management):</strong> Difficult feedback conversations make you either appease too quickly or become overly blunt.'
    ],
    scoreUnit: 'of 4 EQ bottleneck signals active',
    verdicts: [
      'Check the items above to identify which of the 4 EQ dimensions needs targeted strengthening.',
      'High 4-Pillar EQ Integration (1/4). Strong emotional vocabulary and steady self-regulation under pressure.',
      'Targeted EQ Bottleneck (2/4). One specific pillar (awareness or impulse regulation) dips when your battery is low.',
      'Multi-Pillar EQ Strain (3/4). Unprocessed stress is narrowing your window of emotional regulation.',
      'High Emotional Overload &amp; Hijack Risk (4/4). Build your personalized Emotion Regulation Plan now and check your nervous system stress load.'
    ],
    primaryBtn: 'Build Your Custom Emotion Regulation Plan Now &rarr;',
    subBtn: 'Take the 3-Minute Nervous System &amp; Stress Check &rarr;'
  },
  ko: {
    badge: '30초 4대 영역 감성지능(EQ) 병목 구간 판별기',
    heading: '나의 감성지능(EQ) 4대 영역 중 어디에서 에너지가 새고 있을까요?',
    sub: '스트레스 상황에서 나타나는 감정 인식·조절·관계 대처 신호를 체크해보세요:',
    items: [
      '<strong>감정 이름 붙이기 지연 (자기인식):</strong> 내가 지금 왜 화가 나거나 지쳤는지 정확한 감정 이름을 알기 전에 몸의 긴장이나 짜증이 먼저 터져 나옵니다.',
      '<strong>스트레스 시 충동적 반응 (자기조절):</strong> 압박감을 느끼면 이성적으로 생각하기 전에 날 선 말을 내뱉거나 회피·잠수를 선택합니다.',
      '<strong>대인 기류 과부하 (사회적 인식):</strong> 긴장된 분위기에서 상대의 미묘한 신호를 놓치거나, 반대로 너무 많이 흡수해 얼어붙습니다.',
      '<strong>어려운 대화 회피 또는 충돌 (관계 관리):</strong> 불편한 피드백이나 거절을 해야 할 때 지나치게 눈치를 보며 영합하거나 반대로 너무 직설적으로 부딪힙니다.'
    ],
    scoreUnit: '개 감성지능(EQ) 병목 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 4대 감성지능 영역 중 집중 강화가 필요한 구간을 확인해보세요.',
      '높은 4대 영역 EQ 균형(1/4). 감정을 명확히 인식하고 압박 속에서도 안정적으로 조율하고 있습니다.',
      '특정 영역 EQ 병목 감지(2/4). 에너지가 떨어질 때 감정 명명이나 충동 조절 한 곳이 흔들리고 있습니다.',
      '복합 영역 EQ 과부하(3/4). 누적된 스트레스가 정서 조절의 창(Window of Tolerance)을 좁히고 있습니다.',
      '높은 감정 하이재킹 위험(4/4). 지금 맞춤 정서 조절 플래너로 대응 전략을 설계하고 신경계 스트레스 부하를 진단하세요.'
    ],
    primaryBtn: '맞춤형 정서 조절 플래너(Emotion Regulation) 열기 &rarr;',
    subBtn: '3분 신경계 스트레스 및 정서 부하 진단 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN 4-SÄULEN-EQ-ENGPASS-CHECK',
    heading: 'Welche der 4 Säulen emotionaler Intelligenz ist Ihr Engpass?',
    sub: 'Wählen Sie die Herausforderungen aus, die Sie unter Druck erleben:',
    items: [
      '<strong>Verzögertes Benennen von Gefühlen (Selbstwahrnehmung):</strong> Sie spüren Verspannung oder Gereiztheit lange bevor Sie wissen, welches Gefühl dahintersteckt.',
      '<strong>Impuls-Durchbruch bei Stress (Selbstregulierung):</strong> Unter Druck reagieren Sie vorschnell, gereizt oder ziehen sich abrupt zurück.',
      '<strong>Soziale Reizüberlastung (Soziales Bewusstsein):</strong> In angespannten Runden übersehen Sie Signale oder nehmen zu viel Spannung auf.',
      '<strong>Konfliktscheu oder Härte (Beziehungsmanagement):</strong> Schwierige Gespräche führen entweder zu falschem Nachgeben oder zu schroffer Konfrontation.'
    ],
    scoreUnit: 'von 4 EQ-Engpass-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihren persönlichen EQ-Engpass zu finden.',
      'Hohe 4-Säulen-EQ-Balance (1/4). Sie benennen und regulieren Emotionen auch unter Druck souverän.',
      'Gezielter EQ-Engpass (2/4). Eine Säule gibt nach, sobald Ihre Energie sinkt.',
      'Mehrdimensionaler EQ-Druck (3/4). Stress verengt Ihr Fenster zur Emotionsregulation.',
      'Hohes Risiko für emotionale Überflutung (4/4). Erstellen Sie jetzt Ihren Regulationsplan und prüfen Sie Ihren Stresswert.'
    ],
    primaryBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;',
    subBtn: 'Kostenlosen 3-Minuten Stress-Check starten &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE LOS 4 PILARES DE INTELIGENCIA EMOCIONAL EN 30 SEGUNDOS',
    heading: '¿Cuál de los 4 pilares de la Inteligencia Emocional (EQ) te frena?',
    sub: 'Marca las dificultades de conciencia y regulación emocional que notas bajo presión:',
    items: [
      '<strong>Retraso al nombrar emociones (Autoconciencia):</strong> Sientes tensión física o irritabilidad mucho antes de identificar qué emoción exacta tienes.',
      '<strong>Secuestro emocional bajo estrés (Autogestión):</strong> Cuando te saturas, respondes de forma impulsiva o te bloqueas antes de pensar.',
      '<strong>Sobrecarga de señales sociales (Conciencia social):</strong> En ambientes tensos, o pierdes matices o absorbes tanta tensión que te paralizas.',
      '<strong>Evitación o choque en conflictos (Gestión de relaciones):</strong> Las conversaciones difíciles te llevan a ceder de más o a sonar demasiado brusco.'
    ],
    scoreUnit: 'de 4 señales de cuello de botella en EQ activas',
    verdicts: [
      'Marca los puntos arriba para identificar qué pilar de tu EQ necesita entrenamiento.',
      'Alta integración de los 4 pilares (1/4). Buen vocabulario emocional y autorregulación estable.',
      'Cuello de botella puntual (2/4). Un área específica flaquea cuando estás cansado.',
      'Tensión en múltiples pilares (3/4). El estrés acumulado está estrechando tu margen de regulación.',
      'Alto riesgo de desborde emocional (4/4). Diseña ahora tu Plan de Regulación Emocional y mide tu carga de estrés.'
    ],
    primaryBtn: 'Crear tu Plan de Regulación Emocional Ahora &rarr;',
    subBtn: 'Hacer el Test Gratuito de Estrés en 3 Minutos &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DES 4 PILIERS DU QE EN 30 SECONDES',
    heading: 'Lequel des 4 piliers de l’Intelligence Émotionnelle vous freine ?',
    sub: 'Cochez les défis émotionnels que vous rencontrez sous pression :',
    items: [
      '<strong>Difficulté à nommer l’émotion (Conscience de soi) :</strong> Vous ressentez une tension physique ou de l’irritabilité bien avant de mettre un mot sur l’émotion.',
      '<strong>Réaction impulsive sous stress (Maîtrise de soi) :</strong> Débordé, vous répondez à chaud ou vous fermez avant que la logique n’intervienne.',
      '<strong>Saturation sociale (Conscience sociale) :</strong> Dans un groupe tendu, vous absorbez trop de pression jusqu’à vous figer.',
      '<strong>Fuite ou brusquerie (Gestion des relations) :</strong> Les discussions délicates vous poussent soit à céder trop vite, soit à être trop sec.'
    ],
    scoreUnit: 'sur 4 signaux de blocage QE actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour cibler le pilier de votre QE à renforcer.',
      'Équilibre élevé des 4 piliers (1/4). Vous identifiez et régulez vos émotions avec recul.',
      'Point de blocage ciblé (2/4). Un pilier fléchit lorsque votre batterie est basse.',
      'Tension sur plusieurs piliers (3/4). Le stress réduit votre capacité de régulation.',
      'Risque élevé de débordement émotionnel (4/4). Créez votre plan de régulation émotionnelle et testez votre stress.'
    ],
    primaryBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;',
    subBtn: 'Faire le Bilan Stress en 3 Minutes &rarr;'
  },
  ja: {
    badge: '30秒 感情知能（EQ）4大領域ボトルネック診断',
    heading: 'あなたのEQ（心の知능指数）4領域のうち、どこが弱点になっている？',
    sub: 'プレッシャーがかかった時に起きやすい感情認識・制御のサインをチェックしてください：',
    items: [
      '<strong>感情の言語化の遅れ（自己認識）：</strong> 自分が何に傷つき怒っているのか言葉で気づくより先に、体調不良やイライラが出る。',
      '<strong>ストレス下の衝動反応（自己管理）：</strong> 余裕がなくなると、冷静に考える前に強い口調で返したり、急にシャットダウンしたりする。',
      '<strong>場の空気による過負荷（社会的認識）：</strong> ピリピリした場面で微細なサインを見落とすか、逆に空気を吸いすぎて固まってしまう。',
      '<strong>対立の回避または衝突（人間関係管理）：</strong> 言いにくいことを伝えるとき、我慢して迎合しすぎるか、逆にきつく言いすぎてしまう。'
    ],
    scoreUnit: '/ 4 個のEQボトルネック信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、4つのEQ領域のうちどこを強化すべきか確認しましょう。',
      '高い4領域EQバランス（1/4）。プレッシャーの中でも感情を正確に捉え、安定して調整できています。',
      '特定領域のEQボトルネック（2/4）。疲れがたまると感情の言語化や衝動コントロールの一部が揺らぎます。',
      '複数領域のEQ負荷（3/4）。蓄積したストレスが感情調整の幅を狭めています。',
      '感情ハイジャックのリスク大（4/4）。今すぐ「感情調整プランナー」で具体的な対策を作り、神経系ストレスを測定しましょう。'
    ],
    primaryBtn: 'あなた専用の「感情調整プランナー」を開く &rarr;',
    subBtn: '3分間の無料ストレス＆神経負荷チェックへ &rarr;'
  },
  zh: {
    badge: '30秒 情商（EQ）四大维度瓶颈筛查',
    heading: '情商（EQ）的四大核心支柱中，哪一项正在拖你的后腿？',
    sub: '勾选在高压或情绪波动下，你最常遇到的情绪觉察与调节难题：',
    items: [
      '<strong>情绪命名滞后（自我觉察）：</strong> 在你能准确说出自己到底是什么情绪之前，身体早就先出现了紧绷、烦躁或莫名疲惫。',
      '<strong>高压下冲动失控（自我管理）：</strong> 当感到受挫或过载时，理智还没上线就已经发出了冲动消息、发脾气或直接冷脸关机。',
      '<strong>社交气场过载（社会觉察）：</strong> 在紧张的人际氛围中，要么忽略微妙信号，要么过度吸收全场压力而僵住。',
      '<strong>逃避冲突或用力过猛（关系管理）：</strong> 面对需要提意见或拒绝的场合，要么委屈求全讨好，要么说话过于生硬伤人。'
    ],
    scoreUnit: '/ 4 个 EQ 维度瓶颈信号已激活',
    verdicts: [
      '勾选上方信号，找出四大情商维度中最需要针对性强化的一环。',
      '四大维度高度整合（1/4）。你拥有清晰的情绪词汇表与稳定的高压调节力。',
      '单一维度局部瓶颈（2/4）。当精力下滑时，情绪识别或冲动控制会出现短板。',
      '多维度情商过载（3/4）。未消化的压力正在压缩你的情绪容受窗。',
      '高情绪劫持风险（4/4）。请立即使用情绪调节规划器建立应对方案，并检测你的神经系统压力负荷。'
    ],
    primaryBtn: '立即打开定制化情绪调节规划器 &rarr;',
    subBtn: '开始 3 分钟神经系统与压力负荷测试 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DOS 4 PILARES DA INTELIGÊNCIA EMOCIONAL EM 30 SEGUNDOS',
    heading: 'Qual dos 4 pilares da Inteligência Emocional (QE) é o seu gargalo?',
    sub: 'Marque os desafios de percepção e regulação emocional que você sente sob pressão:',
    items: [
      '<strong>Atraso para nomear emoções (Autoconsciência):</strong> Você sente tensão física ou irritação muito antes de saber dar nome ao que está sentindo.',
      '<strong>Sequestro de impulso sob estresse (Autogestão):</strong> Quando frustrado, você responde no calor do momento ou trava antes da razão agir.',
      '<strong>Sobrecarga de clima social (Consciência social):</strong> Em ambientes tensos, você absorve tanta pressão que acaba paralisando.',
      '<strong>Esquiva ou rispidez em conflitos (Gestão de relações):</strong> Conversas difíceis fazem você ceder rápido demais ou ser direto demais.'
    ],
    scoreUnit: 'de 4 sinais de gargalo de QE ativos',
    verdicts: [
      'Marque os itens acima para identificar qual pilar do seu QE precisa de reforço.',
      'Alta integração dos 4 pilares (1/4). Bom vocabulário emocional e autorregulação firme.',
      'Gargalo pontual de QE (2/4). Um pilar específico oscila quando sua energia cai.',
      'Desgaste em múltiplos pilares (3/4). O estresse está estreitando sua janela de regulação.',
      'Alto risco de sobrecarga emocional (4/4). Monte seu Plano de Regulação Emocional agora e meça seu nível de estresse.'
    ],
    primaryBtn: 'Abrir o Planejador de Regulação Emocional Agora &rarr;',
    subBtn: 'Fazer o Teste Gratuito de Estresse em 3 Minutos &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ ПО 4 СТОЛПАМ ЭМОЦИОНАЛЬНОГО ИНТЕЛЛЕКТА (EQ)',
    heading: 'Какой из 4 навыков эмоционального интеллекта дает сбой под давлением?',
    sub: 'Отметьте трудности саморегуляции и понимания эмоций, знакомые вам в стрессе:',
    items: [
      '<strong>Задержка в распознавании чувств (Самосознание):</strong> Вы ощущаете зажим в теле или раздражение задолго до того, как понимаете, какая именно это эмоция.',
      '<strong>Импульсивные реакции (Самоконтроль):</strong> При перегрузке вы отвечаете сгоряча или уходите в глухую оборону раньше, чем включается логика.',
      '<strong>Перегрузка от чужих эмоций (Социальная чуткость):</strong> В напряженной обстановке вы либо теряете нить, либо впитываете общий стресс и цепенеете.',
      '<strong>Избегание или резкость (Управление отношениями):</strong> В сложных разговорах вы либо слишком быстро уступаете, либо говорите чересчур жестко.'
    ],
    scoreUnit: 'из 4 признаков уязвимости EQ активны',
    verdicts: [
      'Отметьте пункты выше, чтобы понять, какой из 4 навыков EQ нуждается в укреплении.',
      'Высокий баланс всех 4 сфер (1/4). Вы хорошо понимаете свои чувства и управляете реакциями.',
      'Локальная точка роста (2/4).Один из навыков проседает при усталости.',
      'Нагрузка по нескольким сферам EQ (3/4). Накопленный стресс сужает окно саморегуляции.',
      'Высокий риск эмоционального срыва (4/4). Составьте персональный план регуляции эмоций и проверьте уровень стресса.'
    ],
    primaryBtn: 'Открыть интерактивный планировщик регуляции эмоций &rarr;',
    subBtn: 'Пройти 3-минутный тест на уровень стресса &rarr;'
  },
  id: {
    badge: 'SKRINING 4 PILAR KECERDASAN EMOSIONAL (EQ) 30 DETIK',
    heading: 'Pilar Kecerdasan Emosional (EQ) Mana yang Menjadi Titik Lemah Anda?',
    sub: 'Centang tantangan kesadaran dan regulasi emosi yang Anda alami saat tertekan:',
    items: [
      '<strong>Lambat Menamai Emosi (Kesadaran Diri):</strong> Tubuh sudah tegang atau uring-uringan jauh sebelum Anda tahu persis emosi apa yang dirasakan.',
      '<strong>Reaksi Impulsif Saat Stres (Manajemen Diri):</strong> Saat kewalahan, Anda membalas pesan secara reaktif, membentak, atau menutup diri.',
      '<strong>Kewalahan Suasana Sosial (Kesadaran Sosial):</strong> Di situasi tegang, Anda menyerap terlalu banyak tekanan hingga membeku.',
      '<strong>Menghindar atau Terlalu Keras (Manajemen Hubungan):</strong> Obrolan sulit membuat Anda terlalu cepat mengalah atau justru terlalu blak-blakan.'
    ],
    scoreUnit: 'dari 4 sinyal hambatan EQ aktif',
    verdicts: [
      'Centang item di atas untuk menemukan pilar EQ mana yang perlu diperkuat.',
      'Integrasi 4 Pilar EQ Tinggi (1/4). Kosakata emosi kuat dan regulasi diri stabil.',
      'Hambatan EQ Spesifik (2/4). Satu pilar melemah saat energi Anda terkuras.',
      'Ketegangan Multi-Pilar EQ (3/4). Stres mempersempit jendela regulasi emosi Anda.',
      'Risiko Tinggi Pembajakan Emosi (4/4). Buat Rencana Regulasi Emosi Anda sekarang dan cek beban stres sistem saraf.'
    ],
    primaryBtn: 'Buka Perencana Regulasi Emosi Kustom Sekarang &rarr;',
    subBtn: 'Ikuti Tes Stres &amp; Sistem Saraf 3 Menit &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK 4 SÜTUNLU DUYGUSAL ZEKA (EQ) TARAMASI',
    heading: 'Duygusal Zekanın (EQ) 4 Sütunundan Hangisi Sizin Darboğazınız?',
    sub: 'Baskı altındayken yaşadığınız duygusal farkındalık ve düzenleme zorluklarını işaretleyin:',
    items: [
      '<strong>Duyguyu Geç Adlandırma (Öz-Farkındalık):</strong> Arkasındaki duyguyu tam olarak adlandırmadan çok önce bedensel gerginlik veya sinirlilik hissediyorsunuz.',
      '<strong>Stres Altında Dürtüsel Tepki (Öz-Yönetim):</strong> Bunaldığınızda mantığınız devreye girmeden tepkisel mesajlar atıyor veya tamamen kapanıyorsunuz.',
      '<strong>Sosyal İpucu Aşırı Yükü (Sosyal Farkındalık):</strong> Gergin ortamlarda ya ince sinyalleri kaçırıyor ya da ortamın gerginliğini emip donakalosunuz.',
      '<strong>Çatışmadan Kaçma veya Sertleşme (İlişki Yönetimi):</strong> Zor geri bildirim konuşmalarında ya hemen alttan alıyor ya da fazla sert çıkıyorsunuz.'
    ],
    scoreUnit: '/ 4 EQ darboğaz sinyali aktif',
    verdicts: [
      '4 EQ boyutundan hangisinin güçlendirilmesi gerektiğini görmek için yukarıdakileri işaretleyin.',
      'Yüksek 4 Sütunlu EQ Dengesi (1/4). Baskı altında bile güçlü duygusal farkındalık ve öz-düzenleme.',
      'Hedefli EQ Darboğazı (2/4). Enerjiniz düştüğünde belirli bir sütun zorlanıyor.',
      'Çoklu EQ Zorlanması (3/4). İşlenmemiş stres duygu düzenleme pencerenizi daraltıyor.',
      'Yüksek Duygusal Taşma Riski (4/4). Şimdi kişisel Duygu Düzenleme Planınızı oluşturun ve stres yükünüzü ölçün.'
    ],
    primaryBtn: 'Kişisel Duygu Düzenleme Planlayıcısını Şimdi Aç &rarr;',
    subBtn: '3 Dakikalık Sinir Sistemi ve Stres Testini Başlat &rarr;'
  },
  hi: {
    badge: '30-सेकंड 4-पिलर इमोशनल इंटेलिजेंस (EQ) स्क्रीनर',
    heading: 'इमोशनल इंटेलिजेंस (EQ) के 4 स्तंभों में से कौन-सा आपकी कमज़ोर कड़ी है?',
    sub: 'दबाव के समय महसूस होने वाली इन भावनात्मक चुनौतियों को चुनें:',
    items: [
      '<strong>भावना को पहचानने में देरी (Self-Awareness):</strong> अपनी सटीक भावना को समझने से बहुत पहले ही शरीर में जकड़न या चिड़चिड़ापन महसूस होना।',
      '<strong>तनाव में तुरंत प्रतिक्रिया देना (Self-Management):</strong> परेशान होने पर बिना सोचे-समझे तीखा जवाब दे देना या पूरी तरह चुप हो जाना।',
      '<strong>सामाजिक माहौल का ओवरलोड (Social Awareness):</strong> तनावपूर्ण माहौल में दूसरों के तनाव को इतना सोख लेना कि खुद सुन्न पड़ जाना।',
      '<strong>टकराव से बचना या तीखा बोलना (Relationship Management):</strong> कठिन बातचीत में या तो तुरंत हार मान लेना या बहुत कठोर हो जाना।'
    ],
    scoreUnit: '/ 4 EQ बाधा संकेत सक्रिय',
    verdicts: [
      'यह जानने के लिए ऊपर चुनें कि आपके EQ के किस हिस्से को मज़बूती की ज़रूरत है।',
      'मजबूत 4-पिलर EQ संतुलन (1/4)। आप दबाव में भी अपनी भावनाओं को अच्छी तरह समझते और संभालते हैं।',
      'सामान्य EQ रुकावट (2/4)। थकान होने पर भावनाओं को संभालने का एक हिस्सा कमज़ोर पड़ता है।',
      'उच्च EQ दबाव (3/4)। अनसुलझा तनाव आपकी भावनात्मक सहनशक्ति को कम कर रहा है।',
      'गंभीर भावनात्मक ओवरलोड (4/4)। अभी अपना इमोशन रेगुलेशन प्लान बनाएं और स्ट्रेस लोड जांचें।'
    ],
    primaryBtn: 'अपना कस्टम इमोशन रेगुलेशन प्लानर अभी खोलें &rarr;',
    subBtn: '3-मिनट का नर्वस सिस्टम और स्ट्रेस चेक लें &rarr;'
  }
};

const EQ_VS_IQ_LOCALES = {
  en: {
    badge: '30-SECOND IQ vs. EQ COGNITIVE BALANCE SCREENER',
    heading: 'Is Your Analytical Brain Outrunning Your Emotional Regulation?',
    sub: 'Check the signs that high analytical processing is colliding with emotional bottlenecks:',
    items: [
      '<strong>Intellectualizing Feelings:</strong> Instead of feeling sadness or fear in your body, you analyze the psychology behind it like a research paper.',
      '<strong>High-IQ Overthinking Traps:</strong> Your fast pattern-recognition brain invents 10 complex worst-case scenarios before a simple event even happens.',
      '<strong>Frustration with "Illogical" People:</strong> You get impatient when colleagues or partners need emotional validation rather than immediate data-driven fixes.',
      '<strong>Smart Brain, Exhausted Nervous System:</strong> You solve complex work problems all day, yet feel depleted by basic interpersonal friction.'
    ],
    scoreUnit: 'of 4 analytical-emotional imbalance signals active',
    verdicts: [
      'Check the items above to see how your analytical IQ and emotional regulation balance under load.',
      'Balanced Cognitive-Emotional Synergy (1/4). Your logic and emotional awareness work as partners.',
      'Analytical Over-Compensation (2/4). You rely on logic to bypass uncomfortable emotional states.',
      'High Intellectualization Imbalance (3/4). Your fast analytical mind is fueling overthinking and interpersonal friction.',
      'Severe Logic-Emotion Split (4/4). Benchmark your analytical pattern speed with the IQ Test and build an Emotion Regulation Plan now.'
    ],
    primaryBtn: 'Take the Free Pattern &amp; Analytical IQ Test &rarr;',
    subBtn: 'Balance Your Brain with the Emotion Regulation Planner &rarr;'
  },
  ko: {
    badge: '30초 이성 지능(IQ) vs 감성 조절(EQ) 밸런스 판별기',
    heading: '빠른 두뇌 회전(IQ)이 오히려 감정 조절(EQ)을 방해하고 있나요?',
    sub: '높은 분석력이 정서적 병목과 충돌할 때 나타나는 4가지 신호를 체크해보세요:',
    items: [
      '<strong>감정의 주지화(Intellectualization):</strong> 슬픔이나 불안을 몸으로 느끼고 흘려보내는 대신, 왜 이런 감정이 생겼는지 논문 쓰듯 머리로만 분석합니다.',
      '<strong>고성능 두뇌의 과잉 시뮬레이션:</strong> 빠른 패턴 인식 능력이 오히려 독이 되어, 일어나지도 않은 일의 최악 시나리오 10가지를 순식간에 만들어냅니다.',
      '<strong>비논리적인 감정 호소에 대한 답답함:</strong> 상대가 감정적 공감을 원할 때 "그게 왜 문제야? 이렇게 해결하면 되잖아"라며 답답해합니다.',
      '<strong>복잡한 일은 잘 풀면서 대인 피로에 취약함:</strong> 어려운 업무나 논리적 문제는 척척 해결하면서, 사소한 인간관계 마찰에는 에너지가 급격히 방전됩니다.'
    ],
    scoreUnit: '개 이성-감성 불균형 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 나의 분석적 사고(IQ)와 정서 조절(EQ)의 균형도를 확인해보세요.',
      '이상적인 인지-정서 시너지(1/4). 명석한 논리와 따뜻한 정서적 공감이 균형 있게 작동하고 있습니다.',
      '분석적 과잉 보상 단계(2/4). 불편한 감정을 느끼지 않기 위해 이성적 분석 뒤로 숨는 경향이 있습니다.',
      '높은 주지화 불균형(3/4). 빠른 두뇌 회전이 오히려 과잉사고와 관계 마찰을 키우고 있습니다.',
      '심각한 이성-감성 분리 루프(4/4). 지금 정밀 IQ 패턴 테스트로 인지 강점을 측정하고, 정서 조절 플래너로 감성 밸런스를 맞추세요.'
    ],
    primaryBtn: '무료 두뇌 패턴 및 분석 IQ 테스트 시작 &rarr;',
    subBtn: '이성-감성 균형을 위한 정서 조절 플래너 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN IQ vs. EQ BALANCE-CHECK',
    heading: 'Überholt Ihr analytischer Verstand Ihre emotionale Regulation?',
    sub: 'Wählen Sie die Anzeichen dafür, dass hohe Denkleistung mit emotionalen Engpässen kollidiert:',
    items: [
      '<strong>Intellektualisierung von Gefühlen:</strong> Statt Trauer oder Angst zu fühlen, analysieren Sie Ihre Emotionen nüchtern wie ein Forschungsprojekt.',
      '<strong>High-IQ-Grübelfalle:</strong> Ihre schnelle Mustererkennung konstruiert sofort zehn komplexe Katastrophenszenarien.',
      '<strong>Ungeduld mit „unlogischen“ Mitmenschen:</strong> Es fällt Ihnen schwer, einfach nur mitzufühlen, wenn die sachliche Lösung doch auf der Hand liegt.',
      '<strong>Starker Kopf, erschöpftes Nervensystem:</strong> Komplexe Fachprobleme lösen Sie mühelos, doch zwischenmenschliche Reibung laugt Sie völlig aus.'
    ],
    scoreUnit: 'von 4 IQ-EQ-Ungleichgewichtssignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um das Zusammenspiel von Logik und Gefühl zu prüfen.',
      'Ausgewogene Kopf-Herz-Synergie (1/4). Analytik und Empathie ergänzen sich harmonisch.',
      'Analytische Überkompensation (2/4). Sie nutzen Logik, um unangenehmen Gefühlen auszuweichen.',
      'Hohe Intellektualisierung (3/4). Ihr schneller Verstand verstärkt Grübeln und Beziehungsreibung.',
      'Starke Kopf-Gefühl-Spaltung (4/4). Testen Sie jetzt Ihre analytische Mustererkennung im IQ-Test und öffnen Sie den Emotions-Planer.'
    ],
    primaryBtn: 'Kostenlosen Muster- &amp; Analytik-IQ-Test starten &rarr;',
    subBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE EQUILIBRIO IQ vs. EQ EN 30 SEGUNDOS',
    heading: '¿Tu mente analítica va más rápido que tu regulación emocional?',
    sub: 'Marca las señales de que tu procesamiento lógico choca con cuellos de botella emocionales:',
    items: [
      '<strong>Intelectualizar las emociones:</strong> En lugar de sentir la tristeza o el miedo, analizas psicológicamente por qué ocurre como si fuera una tesis.',
      '<strong>Trampa de sobreanálisis:</strong> Tu rápida detección de patrones inventa diez escenarios complejos antes de que ocurra nada.',
      '<strong>Impaciencia ante lo «ilógico»:</strong> Te frustra que otros busquen validación emocional cuando la solución lógica es evidente.',
      '<strong>Mente brillante, sistema nervioso agotado:</strong> Resuelves problemas técnicos difíciles, pero el roce interpersonal te deja sin energía.'
    ],
    scoreUnit: 'de 4 señales de desequilibrio lógico-emocional activas',
    verdicts: [
      'Marca los puntos arriba para evaluar el equilibrio entre tu CI analítico y tu gestión emocional.',
      'Sinergia cognitivo-emocional (1/4). Tu lógica y tu empatía trabajan en equipo.',
      'Sobrecompensación analítica (2/4). Usas la razón para esquivar emociones incómodas.',
      'Alto desequilibrio por intelectualización (3/4). Tu rapidez mental alimenta la rumiación.',
      'Fuerte desconexión lógica-emoción (4/4). Mide tu agilidad mental con el Test de CI y equilibra tus emociones con el Planificador.'
    ],
    primaryBtn: 'Hacer el Test Gratuito de Patrones y CI Analítico &rarr;',
    subBtn: 'Equilibrar con el Planificador de Regulación Emocional &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR D’ÉQUILIBRE QI vs QE EN 30 SECONDES',
    heading: 'Votre esprit analytique dépasse-t-il votre régulation émotionnelle ?',
    sub: 'Cochez les signes montrant que votre logique entre en friction avec vos émotions :',
    items: [
      '<strong>Intellectualisation des affects :</strong> Au lieu de vivre une émotion dans le corps, vous la disséquez intellectuellement.',
      '<strong>Piège de la sur-analyse :</strong> Votre rapidité d’esprit génère dix scénarios catastrophes complexes en quelques secondes.',
      '<strong>Impatience face à « l’illogique » :</strong> Vous comprenez mal qu’on cherche du réconfort plutôt qu’une solution rationnelle immédiate.',
      '<strong>Esprit vif, système nerveux épuisé :</strong> Vous résolvez des problèmes complexes, mais les tensions relationnelles vous vident.'
    ],
    scoreUnit: 'sur 4 signaux de déséquilibre QI-QE actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour mesurer votre synergie entre raison et émotion.',
      'Synergie tête-cœur équilibrée (1/4). Votre logique et votre sensibilité coopèrent.',
      'Surcompensation analytique (2/4). Vous utilisez le mental pour éviter de ressentir.',
      'Forte intellectualisation (3/4). Votre vitesse cognitive alimente la rumination.',
      'Clivage marqué logique-émotion (4/4). Testez votre logique avec le Test de QI et ouvrez le Planificateur de Régulation.'
    ],
    primaryBtn: 'Passer le Test Gratuit de Logique et QI &rarr;',
    subBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;'
  },
  ja: {
    badge: '30秒 分析知能（IQ）vs 感情調整（EQ）バランス診断',
    heading: '頭の回転の速さ（IQ）が、かえって感情のケア（EQ）を邪魔していませんか？',
    sub: '高い分析力が感情のボトルネックと衝突するときに出る4つのサインをチェックしてください：',
    items: [
      '<strong>感情の「知性化（頭でっかち分析）」：</strong> 悲しみや不安を心で感じて癒やす代わりに、「なぜこの感情が起きたか」を論文のように分析してしまう。',
      '<strong>高回転ブレインの過剰シミュレーション：</strong> パターン認識が速すぎて、まだ起きてもいない未来のリスクを10通りも瞬時に作り出してしまう。',
      '<strong>「非論理的な感情論」への苛立ち：</strong> 相手が共感を求めている場面で「なぜ合理的に解決しないのか」とイライラしてしまう。',
      '<strong>仕事や論理パズルは得意なのに人間関係で消耗：</strong> 複雑な業務課題は解けるのに、ちょっとした対人摩擦でエネルギーが空になる。'
    ],
    scoreUnit: '/ 4 個の思考・感情アンバランス信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、論理的思考（IQ）と感情調整（EQ）のバランスを確認しましょう。',
      '理想的な思考×感情シナジー（1/4）。クリアな論理と温かい共感力がバランスよく連携しています。',
      '分析による過剰補正（2/4）。不快な感情を感じないために、理屈の鎧で処理しようとする傾向があります。',
      '高い知性化アンバランス（3/4）。頭の回転の速さが、かえって考えすぎや対人摩擦を増幅させています。',
      '論理と感情の強い乖離（4/4）。今すぐIQパターン診断で認知の強みを測定し、感情調整プランナーで心のバランスを整えましょう。'
    ],
    primaryBtn: '無料の図形・論理パターンIQ診断テストへ &rarr;',
    subBtn: '頭と心を整える「感情調整プランナー」を開く &rarr;'
  },
  zh: {
    badge: '30秒 逻辑智商（IQ）vs 情绪调节（EQ）平衡筛查',
    heading: '你高速运转的理性大脑，是否正在透支你的情绪系统？',
    sub: '勾选当高分析能力与情绪瓶颈发生碰撞时出现的 4 个信号：',
    items: [
      '<strong>把情绪“理智化（Intellectualizing）”：</strong> 面对悲伤或恐惧时，不是去感受和安抚身体，而是像写学术论文一样分析情绪成因。',
      '<strong>高智商过度推演陷阱：</strong> 极快的模式识别能力反而成了负担，事情还没发生就已经在脑中推演出 10 种复杂的危机剧本。',
      '<strong>对“不讲逻辑的情绪”缺乏耐心：</strong> 当伴侣或同事需要情感认同时，你却因为“道理明明很简单”而感到烦躁。',
      '<strong>搞得定复杂难题，却搞不定人际内耗：</strong> 高难度的工作或逻辑问题游刃有余，但一点小小的人际摩擦就会让你精疲力竭。'
    ],
    scoreUnit: '/ 4 个理性-感性失衡信号已激活',
    verdicts: [
      '勾选上方信号，测试你的分析智力（IQ）与情绪调节力（EQ）是否平衡。',
      '理性与感性高效协同（1/4）。你的清晰逻辑与敏锐共情能够默契配合。',
      '理性过度代偿（2/4）。你习惯用逻辑分析来逃避不舒服的情绪体验。',
      '高度理智化失衡（3/4）。过快的大脑运转正在加剧思维反刍与人际摩擦。',
      '严重的理智-情感割裂（4/4）。请立即通过免费 IQ 测试评估你的逻辑模式识别力，并使用情绪调节规划器找回内心平衡。'
    ],
    primaryBtn: '开始免费图形与逻辑推理 IQ 测试 &rarr;',
    subBtn: '打开平衡理性与感性的情绪调节规划器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE EQUILÍBRIO QI vs. QE EM 30 SEGUNDOS',
    heading: 'Seu cérebro analítico está atropelando sua regulação emocional?',
    sub: 'Marque os sinais de que seu raciocínio rápido está colidindo com bloqueios emocionais:',
    items: [
      '<strong>Intelectualização das emoções:</strong> Em vez de sentir tristeza ou medo, você analisa a psicologia por trás disso como um artigo científico.',
      '<strong>Armadilha do excesso de análise:</strong> Seu reconhecimento rápido de padrões cria dez cenários negativos antes mesmo de algo acontecer.',
      '<strong>Impaciência com o "ilógico":</strong> Você se irrita quando outros precisam de acolhimento emocional em vez de soluções práticas imediatas.',
      '<strong>Mente afiada, sistema nervoso exausto:</strong> Você resolve problemas difíceis no trabalho, mas se esgota com pequenos atritos pessoais.'
    ],
    scoreUnit: 'de 4 sinais de desequilíbrio lógico-emocional ativos',
    verdicts: [
      'Marque os itens acima para avaliar o equilíbrio entre seu QI analítico e seu QE.',
      'Sinergia cognitivo-emocional (1/4). Sua lógica e sua empatia trabalham juntas.',
      'Supercompensação analítica (2/4). Você usa a razão para evitar sentir emoções desconfortáveis.',
      'Alto desequilíbrio de intelectualização (3/4). Sua mente rápida está alimentando a ruminação.',
      'Forte divisão razão-emoção (4/4). Faça o Teste de QI Analítico agora e equilibre sua mente com o Planejador Emocional.'
    ],
    primaryBtn: 'Fazer o Teste Gratuito de Padrões e QI Analítico &rarr;',
    subBtn: 'Abrir o Planejador de Regulação Emocional &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ БАЛАНСА IQ И EQ',
    heading: 'Не обгоняет ли ваш аналитический ум вашу эмоциональную регуляцию?',
    sub: 'Отметьте признаки того, что быстрый интеллект конфликтует с эмоциональной сферой:',
    items: [
      '<strong>Интеллектуализация чувств:</strong> Вместо того чтобы прожить грусть или страх, вы препарируете их причины как научную задачу.',
      '<strong>Ловушка сверханализа:</strong> Быстрое распознавание паттернов мгновенно достраивает 10 сложных негативных сценариев будущего.',
      '<strong>Раздражение от «нелогичности» людей:</strong> Вам трудно просто посочувствовать, когда логическое решение проблемы лежит на поверхности.',
      '<strong>Сильный ум при истощенной нервной системе:</strong> Вы легко решаете сложные рабочие задачи, но быстро выгораете от мелких трений в общении.'
    ],
    scoreUnit: 'из 4 признаков дисбаланса логики и эмоций активны',
    verdicts: [
      'Отметьте пункты выше, чтобы проверить баланс между аналитическим IQ и эмоциональным EQ.',
      'Гармоничный союз ума и чувств (1/4). Логика и эмпатия дополняют друг друга.',
      'Аналитическая гиперкомпенсация (2/4). Вы прячетесь за логикой от неудобных переживаний.',
      'Высокий перекос в интеллектуализацию (3/4). Быстрый ум усиливает накрутку и трения с близкими.',
      'Резкий разрыв логики и эмоций (4/4). Проверьте аналитику в тесте IQ и выстройте баланс в планировщике регуляции эмоций.'
    ],
    primaryBtn: 'Пройти бесплатный аналитический тест IQ &rarr;',
    subBtn: 'Открыть планировщик эмоциональной регуляции &rarr;'
  },
  id: {
    badge: 'SKRINING KESEIMBANGAN IQ vs. EQ 30 DETIK',
    heading: 'Apakah Otak Analitis Anda Berlari Lebih Cepat dari Regulasi Emosi Anda?',
    sub: 'Centang tanda bahwa pemrosesan logika tinggi sedang berbenturan dengan hambatan emosi:',
    items: [
      '<strong>Intelektualisasi Perasaan:</strong> Alih-alih merasakan sedih atau takut, Anda menganalisis psikologi di baliknya seperti makalah ilmiah.',
      '<strong>Jebakan Overthinking Otak Cepat:</strong> Kemampuan mengenali pola yang cepat justru menciptakan 10 skenario buruk sebelum kejadian.',
      '<strong>Gemas pada Orang yang "Tidak Logis":</strong> Anda kurang sabar saat pasangan atau rekan butuh validasi emosi ketimbang solusi instan.',
      '<strong>Otak Cerdas, Sistem Saraf Lelah:</strong> Anda piawai memecahkan masalah kerja rumit, namun terkuras oleh gesekan interpersonal kecil.'
    ],
    scoreUnit: 'dari 4 sinyal ketimpangan logika-emosi aktif',
    verdicts: [
      'Centang item di atas untuk melihat keseimbangan IQ analitis dan regulasi emosi Anda.',
      'Sinergi Logika-Emosi Seimbang (1/4). Logika dan kepekaan emosi Anda bekerja selaras.',
      'Kompensasi Analitis Berlebih (2/4). Anda mengandalkan logika untuk menghindari rasa tidak nyaman.',
      'Ketimpangan Intelektualisasi Tinggi (3/4). Pikiran cepat Anda memicu overthinking dan gesekan sosial.',
      'Pemisahan Logika-Emosi Berat (4/4). Uji kecepatan pola Anda di Tes IQ dan seimbangkan dengan Perencana Regulasi Emosi.'
    ],
    primaryBtn: 'Ikuti Tes Pola &amp; IQ Analitis Gratis &rarr;',
    subBtn: 'Seimbangkan dengan Perencana Regulasi Emosi &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK IQ vs. EQ BİLİŞSEL DENGE TARAMASI',
    heading: 'Analitik Beyniniz Duygusal Düzenleme Becerinizin Önüne mi Geçiyor?',
    sub: 'Yüksek analitik işlemenin duygusal darboğazlarla çarpıştığını gösteren sinyalleri işaretleyin:',
    items: [
      '<strong>Duyguları Entelektüelleştirme:</strong> Üzüntüyü veya korkuyu bedende hissetmek yerine arkasındaki psikolojiyi makale yazar gibi analiz ediyorsunuz.',
      '<strong>Yüksek IQ Aşırı Düşünme Tuzağı:</strong> Hızlı örüntü tanıma beceriniz, basit bir olaydan önce 10 karmaşık felaket senaryosu üretiyor.',
      '<strong>"Mantıksız" Tepkilere Sabırsızlık:</strong> İnsanlar hızlı çözüm yerine duygusal onay beklediğinde sabırsızlanıyorsunuz.',
      '<strong>Keskin Zihin, Yorgun Sinir Sistemi:</strong> Karmaşık iş problemlerini kolayca çözüyor ama küçük kişilerarası sürtüşmelerde tükeniyorsunuz.'
    ],
    scoreUnit: '/ 4 analitik-duygusal dengesizlik sinyali aktif',
    verdicts: [
      'Analitik IQ ve duygusal düzenleme dengenizi görmek için yukarıdakileri işaretleyin.',
      'Dengeli Bilişsel-Duygusal Sinerji (1/4). Mantığınız ve duygusal farkındalığınız uyum içinde çalışıyor.',
      'Analitik Aşırı Telafi (2/4). Rahatsız edici duygulardan kaçmak için mantığa sığınıyorsunuz.',
      'Yüksek Entelektüelleştirme Dengesizliği (3/4). Hızlı zihniniz aşırı düşünmeyi ve ilişki sürtüşmesini besliyor.',
      'Derin Mantık-Duygu Kopukluğu (4/4). Şimdi IQ Testiyle analitik hızınızı ölçün ve Duygu Düzenleme Planlayıcısıyla denge kurun.'
    ],
    primaryBtn: 'Ücretsiz Örüntü ve Analitik IQ Testini Başlat &rarr;',
    subBtn: 'Duygu Düzenleme Planlayıcısını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड IQ बनाम EQ संतुलन स्क्रीनर',
    heading: 'क्या आपका तार्किक दिमाग (IQ) आपके भावनात्मक संतुलन (EQ) से तेज़ भाग रहा है?',
    sub: 'जब तेज़ विश्लेषण क्षमता भावनाओं से टकराती है, तो दिखने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>भावनाओं का केवल दिमागी विश्लेषण:</strong> दुख या डर को महसूस करने के बजाय उसके पीछे के मनोविज्ञान का किसी रिसर्च पेपर की तरह विश्लेषण करना।',
      '<strong>तेज़ दिमाग का ओवरथिंकिंग जाल:</strong> पैटर्न पहचानने की तेज़ क्षमता के कारण किसी साधारण घटना से पहले ही 10 बुरे परिणाम सोच लेना।',
      '<strong>"अतार्किक" बातों पर जल्दी चिढ़ना:</strong> जब लोग समाधान के बजाय केवल भावनात्मक सहानुभूति चाहते हैं, तो अधीर हो जाना।',
      '<strong>तेज़ दिमाग, लेकिन थका हुआ नर्वस सिस्टम:</strong> काम की जटिल समस्याएं आसानी से सुलझा लेना, लेकिन छोटे आपसी मतभेदों से थक जाना।'
    ],
    scoreUnit: '/ 4 तर्क-भावना असंतुलन संकेत सक्रिय',
    verdicts: [
      'अपने तार्किक IQ और भावनात्मक संतुलन को जांचने के लिए ऊपर चुनें।',
      'संतुलित तर्क-भावना तालमेल (1/4)। आपका तर्क और आपकी संवेदनशीलता मिलकर काम करते हैं।',
      'तार्किक अति-क्षतिपूर्ति (2/4)। आप असहज भावनाओं से बचने के लिए तर्क का सहारा लेते हैं।',
      'उच्च वैचारिक असंतुलन (3/4)। आपका तेज़ दिमाग ओवरथिंकिंग और आपसी तनाव को बढ़ा रहा है।',
      'गंभीर तर्क-भावना अंतर (4/4)। अभी फ्री IQ टेस्ट से अपनी तार्किक क्षमता जांचें और इमोशन रेगुलेशन प्लानर से संतुलन बनाएं।'
    ],
    primaryBtn: 'मुफ्त पैटर्न और एनालिटिकल IQ टेस्ट लें &rarr;',
    subBtn: 'इमोशन रेगुलेशन प्लानर (Emotion Regulation Planner) खोलें &rarr;'
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

  // 1. emotional-intelligence-relationships.html (12 locales)
  for (const [lang, loc] of Object.entries(EQ_RELATIONSHIPS_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-intelligence-relationships.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'eqRelationshipsScreener',
      chkClass: 'eqrel-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=eq_relationships_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=eq_relationships_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-intelligence-relationships.html`);
    console.log(`[PASS] emotional-intelligence-relationships (${lang})`);
  }

  // 2. eq-test-emotional-intelligence-quiz.html (12 locales)
  for (const [lang, loc] of Object.entries(EQ_DIMENSION_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'eq-test-emotional-intelligence-quiz.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'eqDimensionScreener',
      chkClass: 'eqdim-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=eq_dimension_screener`,
      primaryTargetSlug: 'emotion-regulation-planner',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/?lang=${lang}&source=eq_dimension_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/eq-test-emotional-intelligence-quiz.html`);
    console.log(`[PASS] eq-test-emotional-intelligence-quiz (${lang})`);
  }

  // 3. eq-vs-iq-which-matters-more.html (12 locales)
  for (const [lang, loc] of Object.entries(EQ_VS_IQ_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'eq-vs-iq-which-matters-more.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'eqVsIqBalanceScreener',
      chkClass: 'eqvsiq-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/iq-test/?lang=${lang}&source=eq_vs_iq_screener`,
      primaryTargetSlug: 'iq-test',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=eq_vs_iq_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/eq-vs-iq-which-matters-more.html`);
    console.log(`[PASS] eq-vs-iq-which-matters-more (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 11: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

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

const SHADOW_JOURNAL_LOCALES = {
  en: {
    badge: '30-SECOND SHADOW JOURNALING RESISTANCE SCREENER',
    heading: 'What Core Shadow Theme Is Your Unconscious Avoiding?',
    sub: 'Check the emotional and somatic defense patterns triggered when facing deep shadow prompts:',
    items: [
      '<strong>Somatic Tightness &amp; Avoidance:</strong> Thinking about prompts on anger, shame, or envy makes your chest tighten or urges you to scroll away.',
      '<strong>Projection Triggers:</strong> It feels painful to admit that the traits you judge most harshly in others also exist in a repressed form within you.',
      '<strong>Intellectualizing Past Wounds:</strong> When writing about past hurts, you analyze them logically ("It is in the past") while cutting off the feeling.',
      '<strong>Fear of Losing the "Good Person" Mask:</strong> You censor your own private journal entries out of guilt over sounding selfish or resentful.'
    ],
    scoreUnit: 'of 4 shadow resistance signals active',
    verdicts: [
      'Check the items above to evaluate how your nervous system responds to deep shadow exploration.',
      'Open & Grounded Readiness (1/4). Your defenses are flexible—start with the prompt below that sparks the strongest curiosity.',
      'Intellectualization Shield (2/4). You tend to manage raw shadow feelings in your head—pair journaling with the Emotion Regulation Planner.',
      'High Unconscious Repression (3/4). Facing shadow material is triggering protective tension—check your nervous system stress load first.',
      'Deep Somatic Defense Loop (4/4). Your body braces against repressed emotions—run the Stress & Emotional Load Check and regulate before digging deeper.'
    ],
    primaryBtn: 'Check My Nervous System Stress &amp; Emotional Load &rarr;',
    subBtn: 'Open Interactive Emotion Regulation Planner &rarr;'
  },
  ko: {
    badge: '30초 그림자 저널링 저항 & 방어기제 판별기',
    heading: '내 무의식이 외면하고 있는 핵심 그림자 주제는 무엇인가요?',
    sub: '깊은 내면 질문을 마주할 때 작동하는 신체·정서적 저항 신호 4가지를 체크해보세요:',
    items: [
      '<strong>가슴 답답함과 회피 충동:</strong> 분노·수치심·질투에 관한 질문을 보면 몸이 긴장하거나 즉시 딴청을 피우고 싶어집니다.',
      '<strong>투사(Projection) 인정의 고통:</strong> 내가 타인에게 가장 혐오하는 결점이 사실 내 안에도 억압되어 있다는 사실을 인정하기 힘듭니다.',
      '<strong>과거 상처의 주지화(머리로만 분석):</strong> 아픈 기억을 적을 때 감정을 느끼기보다 "다 지나간 일이야"라며 논리적으로만 정리합니다.',
      '<strong>"착한 사람" 가면을 잃을지 모른다는 검열:</strong> 혼자 보는 일기장인데도 이기적이거나 못된 생각을 적는 것에 죄책감을 느낍니다.'
    ],
    scoreUnit: '/ 4개 그림자 저항 신호 활성',
    verdicts: [
      '위 항목을 체크해 깊은 내면 탐색에 대한 무의식적 방어 수준을 확인하세요.',
      '유연한 탐색 준비 상태 (1/4). 방어기제가 안정적입니다—가장 마음이 끌리는 프롬프트부터 저널링을 시작해보세요.',
      '주지화 방어 패턴 (2/4). 불편한 감정을 머리로만 통제하려 합니다—정서 조절 플래너로 안전한 수용 범위를 함께 설계하세요.',
      '높은 무의식 억압 상태 (3/4). 그림자 직면이 신경계 긴장을 유발합니다—먼저 현재 스트레스 및 정서 부하를 점검하세요.',
      '강한 신체·정서 방어 루프 (4/4). 억압된 감정이 신경계 과부하를 만들고 있습니다—지금 스트레스 진단과 정서 조절 플래너를 먼저 실행하세요.'
    ],
    primaryBtn: '내 신경계 스트레스 및 정서 부하 진단하기 &rarr;',
    subBtn: '실시간 정서 조절 플래너 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN SCHATTENARBEIT-WIDERSTANDSTEST',
    heading: 'Welches Kernthema Ihres Schattens meidet Ihr Unterbewusstsein?',
    sub: 'Markieren Sie die emotionalen und körperlichen Abwehrmuster beim Lesen tiefer Schatten-Fragen:',
    items: [
      '<strong>Körperliche Enge &amp; Ablenkung:</strong> Fragen zu Wut, Scham oder Neid lösen Brustenge oder den Drang aus, sofort wegzuscrollen.',
      '<strong>Schmerzhafte Projektion:</strong> Es fällt schwer zuzugeben, dass Eigenschaften, die Sie an anderen verurteilen, auch unterdrückt in Ihnen liegen.',
      '<strong>Intellektualisierung alter Wunden:</strong> Beim Schreiben über Verletzungen analysieren Sie nüchtern („Das ist vorbei“) und schneiden das Gefühl ab.',
      '<strong>Selbstzensur im Tagebuch:</strong> Selbst privat zensieren Sie ehrliche Gedanken aus Schuldgefühlen, egoistisch oder nachtragend zu wirken.'
    ],
    scoreUnit: 'von 4 Schatten-Widerstandssignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre Abwehrreaktionen bei der Schattenarbeit zu prüfen.',
      'Offene Bereitschaft (1/4). Ihre Abwehr ist flexibel – starten Sie mit der Frage unten, die Sie am stärksten berührt.',
      'Kopf-Kontrollmuster (2/4). Sie steuern Gefühle über den Verstand – nutzen Sie begleitend den Emotionsregulations-Planer.',
      'Hohe unbewusste Verdrängung (3/4). Schattenarbeit löst Spannung aus – prüfen Sie zuerst Ihre aktuelle Stressbelastung.',
      'Starke Schutzblockade (4/4). Ihr Nervensystem wehrt unterdrückte Emotionen ab – starten Sie den Stress-Check und regulieren Sie sich vorab.'
    ],
    primaryBtn: 'Nervensystem-Stress &amp; Emotionale Last prüfen &rarr;',
    subBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE RESISTENCIA AL DIARIO DE LA SOMBRA EN 30 SEGUNDOS',
    heading: '¿Qué tema central de la sombra está evitando tu inconsciente?',
    sub: 'Marca los patrones de defensa emocional y corporal que aparecen ante preguntas profundas:',
    items: [
      '<strong>Tensión física y evasión:</strong> Pensar en temas de ira, vergüenza o envidia te oprime el pecho o te da ganas de distraerte.',
      '<strong>Resistencia a la proyección:</strong> Cuesta admitir que los defectos que más juzgas en otros también existen reprimidos en ti.',
      '<strong>Intelectualizar heridas pasadas:</strong> Al escribir sobre dolores antiguos, los racionalizas ("Ya quedó atrás") desconectando la emoción real.',
      '<strong>Autocensura de la «buena persona»:</strong> Incluso en privado censuras lo que escribes por culpa a sonar egoísta o rencoroso.'
    ],
    scoreUnit: 'de 4 señales de resistencia a la sombra activas',
    verdicts: [
      'Marca los puntos arriba para evaluar cómo responde tu sistema nervioso al trabajo de la sombra.',
      'Apertura y flexibilidad (1/4). Tus defensas están estables; empieza con la pregunta que despierte mayor curiosidad.',
      'Escudo de intelectualización (2/4). Controlas emociones incómodas con la mente; apóyate en el Planificador de Regulación Emocional.',
      'Alta represión inconsciente (3/4). Enfrentar la sombra activa tensión; evalúa primero tu carga de estrés basal.',
      'Bloqueo defensivo profundo (4/4). Tu cuerpo se tensa ante emociones reprimidas; mide tu estrés del sistema nervioso antes de profundizar.'
    ],
    primaryBtn: 'Evaluar Mi Estrés del Sistema Nervioso y Carga Emocional &rarr;',
    subBtn: 'Abrir Planificador de Regulación Emocional &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE RÉSISTANCE AU JOURNAL DE L’OMBRE EN 30 SECONDES',
    heading: 'Quel thème central de l’ombre votre inconscient évite-t-il ?',
    sub: 'Cochez les mécanismes de défense émotionnelle et corporelle déclenchés par les questions profondes :',
    items: [
      '<strong>Tension corporelle et fuite :</strong> Aborder la colère, la honte ou l’envie serre votre poitrine ou vous pousse à vous distraire.',
      '<strong>Douleur de la projection :</strong> Il est difficile d’admettre que les défauts que vous jugez chez autrui existent aussi de façon refoulée en vous.',
      '<strong>Intellectualisation des blessures :</strong> En écrivant sur le passé, vous rationalisez (« C’est réglé ») en coupant le ressenti émotionnel.',
      '<strong>Autocensure du « masque parfait » :</strong> Même dans un journal intime, vous filtrez vos pensées par culpabilité de paraître égoïste.'
    ],
    scoreUnit: 'sur 4 signaux de résistance à l’ombre actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer votre niveau de défense face au travail de l’ombre.',
      'Ouverture ancrée (1/4). Vos défenses sont souples — commencez par la question ci-dessous qui résonne le plus.',
      'Bouclier d’intellectualisation (2/4). Vous gérez l’inconfort par le mental — utilisez le Planificateur de Régulation Émotionnelle.',
      'Fort refoulement inconscient (3/4). L’exploration déclenche une tension protectrice — vérifiez d’abord votre charge de stress.',
      'Boucle défensive intense (4/4). Votre système nerveux bloque les affects refoulés — faites le bilan de stress et régulez-vous d’abord.'
    ],
    primaryBtn: 'Évaluer Mon Stress Nerveux et Ma Charge Émotionnelle &rarr;',
    subBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;'
  },
  ja: {
    badge: '30秒 シャドウ・ジャーナリング抵抗＆防衛診断',
    heading: 'あなたの無意識が避けている「核心のシャドウ」は？',
    sub: '深い内面の質問に向き合うときに起こる4つの心身の防衛反応をチェックしてください：',
    items: [
      '<strong>胸の詰まりと回避衝動：</strong> 怒り・恥・嫉妬に関する質問を見ると胸が苦しくなるか、スマホを見て気をそらしたくなる。',
      '<strong>投影（プロジェクション）を認める苦痛：</strong> 他人の許せない欠点が、実は自分の中にも抑圧되어存在していると認めるのがつらい。',
      '<strong>過去の傷の「知性化（頭でっかち分析）」：</strong> 過去の痛みを書くとき「もう終わったこと」と頭で合理化し、実際の感情を遮断してしまう。',
      '<strong>「いい人」の仮面が剥がれる恐怖：</strong> 誰にも見せない日記なのに、わがままや恨みを書くことに罪悪感を覚えて自己検閲してしまう。'
    ],
    scoreUnit: '/ 4 個のシャドウ抵抗サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、シャドウワークに対する無意識の防衛レベルを確認しましょう。',
      '柔軟な探求準備（1/4）。心の防衛は安定しています。最も心が動くプロンプトから書き始めましょう。',
      '知性化による防衛（2/4）。不快な感情を頭だけで処理する傾向があります。感情調整プランナーを併用しましょう。',
      '強い無意識の抑圧（3/4）。シャドウへの直面が緊張を生んでいます。まず現在のストレス負荷を測定してください。',
      '深い心身の防衛ループ（4/4）。抑圧された感情で神経系が過負荷になっています。ストレス診断と感情調整を先に行いましょう。'
    ],
    primaryBtn: '神経系のストレス＆感情負荷を診断する &rarr;',
    subBtn: '心を整える「感情調整プランナー」を開く &rarr;'
  },
  zh: {
    badge: '30秒 阴影日记阻抗与心理防御筛查',
    heading: '你的潜意识正在回避哪个核心阴影主题？',
    sub: '勾选面对深度阴影提问时出现的 4 个身心防御信号：',
    items: [
      '<strong>胸闷紧绷与逃避冲动：</strong> 看到关于愤怒、羞耻或嫉妒的提问时感到胸口发紧，或立刻想刷手机转移注意力。',
      '<strong>难以承认心理投射：</strong> 很难接受自己在别人身上最厌恶的缺点，其实也以压抑的形式存在于自己体内。',
      '<strong>对过往创伤的“理智化”：</strong> 书写过去的伤痛时，习惯用道理分析（“都已经翻篇了”），却切断了真实的身体感受。',
      '<strong>害怕撕下“好人面具”的自我审查：</strong> 哪怕是写给自己的私密日记，也会因为害怕显得自私或怨恨而产生负罪感。'
    ],
    scoreUnit: '/ 4 个阴影阻抗信号已激活',
    verdicts: [
      '勾选上方信号，评估你的神经系统对深度阴影探索的防御程度。',
      '开放且稳定的探索状态（1/4）。你的心理防御很灵活，请从下方最触动你的提示词开始书写。',
      '理智化防御护盾（2/4）。你倾向于用大脑控制不适情绪，建议配合使用情绪调节规划器。',
      '高度潜意识压抑（3/4）。直面阴影会引发保护性紧张，建议先测评当前的神经系统压力负荷。',
      '深度身心防御循环（4/4）。压抑的情绪正在消耗神经能量，请立即进行压力测评并先建立情绪安全感。'
    ],
    primaryBtn: '测试我的神经系统压力与情绪负荷 &rarr;',
    subBtn: '打开实时情绪调节规划器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE RESISTÊNCIA AO DIÁRIO DA SOMBRA EM 30 SEGUNDOS',
    heading: 'Qual tema central da sombra seu inconsciente está evitando?',
    sub: 'Marque os padrões de defesa emocional e somática ativados diante de perguntas profundas:',
    items: [
      '<strong>Aperto físico e distração:</strong> Pensar em raiva, vergonha ou inveja aperta o peito ou dá vontade de mudar de assunto.',
      '<strong>Dor da projeção:</strong> É difícil admitir que os defeitos que você mais julga nos outros também existem reprimidos em você.',
      '<strong>Intelectualização de feridas:</strong> Ao escrever sobre mágoas antigas, você racionaliza ("Já passou") e desliga o sentimento real.',
      '<strong>Autocensura de "pessoa boa":</strong> Mesmo no diário privado, você filtra seus pensamentos por culpa de parecer egoísta ou ressentido.'
    ],
    scoreUnit: 'de 4 sinais de resistência à sombra ativos',
    verdicts: [
      'Marque os itens acima para avaliar como seu sistema nervoso reage à exploração da sombra.',
      'Abertura segura (1/4). Suas defesas estão flexíveis; comece pela pergunta abaixo que mais desperta curiosidade.',
      'Escudo racional (2/4). Você controla emoções desconfortáveis com a mente; use o Planejador de Regulação Emocional.',
      'Alta repressão inconsciente (3/4). Encarar a sombra gera tensão; avalie primeiro sua carga de estresse.',
      'Bloqueio defensivo intenso (4/4). Seu corpo trava diante de emoções reprimidas; faça o teste de estresse antes de aprofundar.'
    ],
    primaryBtn: 'Avaliar Meu Estresse do Sistema Nervoso e Carga Emocional &rarr;',
    subBtn: 'Abrir Planejador de Regulação Emocional &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ СКРИНЕР СОПРОТИВЛЕНИЯ ДНЕВНИКУ ТЕНИ',
    heading: 'Какую ключевую тему Тени избегает ваше подсознание?',
    sub: 'Отметьте паттерны эмоциональной и телесной защиты при работе с глубокими вопросами:',
    items: [
      '<strong>Телесное сжатие и избегание:</strong> Мысли о гневе, стыде или зависти вызывают тяжесть в груди или желание отвлечься.',
      '<strong>Болезненность проекций:</strong> Трудно признать, что качества, которые вы осуждаете в других, в подавленном виде есть и в вас.',
      '<strong>Интеллектуализация обид:</strong> Описывая прошлую боль, вы уходите в сухую логику («Это давно в прошлом»), блокируя чувства.',
      '<strong>Самоцензура «хорошего человека»:</strong> Даже в личном дневнике вы фильтруете мысли из-за чувства вины за свой эгоизм или злость.'
    ],
    scoreUnit: 'из 4 сигналов сопротивления Тени активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить уровень психологической защиты перед работой с Тенью.',
      'Готовность к исследованию (1/4). Защиты гибки — начните с вопроса ниже, который вызывает наибольший отклик.',
      'Щит рационализации (2/4). Вы контролируете чувства головой — используйте планировщик эмоциональной регуляции.',
      'Высокое подавление (3/4). Встреча с Тенью вызывает напряжение — сначала проверьте уровень накопленного стресса.',
      'Глубокий защитный блок (4/4). Нервная система блокирует подавленные эмоции — пройдите тест стресса и стабилизируйтесь.'
    ],
    primaryBtn: 'Проверить уровень стресса и эмоциональной нагрузки &rarr;',
    subBtn: 'Открыть планировщик эмоциональной регуляции &rarr;'
  },
  id: {
    badge: 'SKRINING RESISTENSI JURNAL SHADOW WORK 30 DETIK',
    heading: 'Tema Bayangan (Shadow) Apa yang Dihindari Alam Bawah Sadar Anda?',
    sub: 'Centang pola pertahanan emosional dan fisik saat menghadapi pertanyaan mendalam:',
    items: [
      '<strong>Sesak Fisik &amp; Pengalihan:</strong> Memikirkan topik marah, malu, atau iri membuat dada sesak atau ingin segera mengalihkan perhatian.',
      '<strong>Menolak Proyeksi:</strong> Sulit mengakui bahwa sifat buruk yang paling Anda benci pada orang lain juga ada secara terpendam dalam diri Anda.',
      '<strong>Intelektualisasi Luka Lama:</strong> Saat menulis luka masa lalu, Anda merasionalisasi ("Sudah berlalu") sambil mematikan rasa.',
      '<strong>Sensor Diri "Orang Baik":</strong> Bahkan di jurnal pribadi, Anda menyensor tulisan karena merasa bersalah jika terlihat egois.'
    ],
    scoreUnit: 'dari 4 sinyal resistensi shadow aktif',
    verdicts: [
      'Centang item di atas untuk melihat kesiapan sistem saraf Anda menghadapi eksplorasi shadow.',
      'Terbuka & Siap (1/4). Pertahanan Anda fleksibel; mulai dari pertanyaan di bawah yang paling menggugah rasa ingin tahu.',
      'Perisai Logika (2/4). Anda mengontrol emosi dengan pikiran; gunakan Perencana Regulasi Emosi saat menulis.',
      'Represi Bawah Sadar Tinggi (3/4). Materi shadow memicu ketegangan; cek beban stres sistem saraf Anda terlebih dahulu.',
      'Kunci Pertahanan Tubuh (4/4). Tubuh Anda menahan emosi terpendam; jalankan Cek Stres dan stabilkan diri sebelum menggali lebih dalam.'
    ],
    primaryBtn: 'Cek Beban Stres Sistem Saraf &amp; Emosi Saya &rarr;',
    subBtn: 'Buka Perencana Regulasi Emosi Interaktif &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK GÖLGE GÜNLÜĞÜ DİRENÇ TARAMASI',
    heading: 'Bilinçaltınız Hangi Temel Gölge Temasından Kaçıyor?',
    sub: 'Derin gölge sorularıyla yüzleşirken tetiklenen duygusal ve bedensel savunmaları işaretleyin:',
    items: [
      '<strong>Göğüs Sıkışması ve Kaçınma:</strong> Öfke, utanç veya kıskançlık sorularını düşünmek göğsünüzü sıkıştırıyor veya dikkatinizi dağıtma isteği veriyor.',
      '<strong>Yansıtma (Projeksiyon) Direnci:</strong> Başkalarında en sert eleştirdiğiniz kusurların kendi içinizde de bastırılmış halde bulunduğunu kabul etmek zor geliyor.',
      '<strong>Geçmiş Yaraları Mantığa Bürümek:</strong> Eski kırgınlıkları yazarken duyguyu kesip "Artık geçmişte kaldı" diyerek sadece mantıksal analiz yapıyorsunuz.',
      '<strong>"İyi İnsan" Maskesini Kaybetme Korkusu:</strong> Kendi özel günlüğünüzde bile bencil veya öfkeli görünmemek için düşüncelerinizi sansürlüyorsunuz.'
    ],
    scoreUnit: '/ 4 gölge direnç sinyali aktif',
    verdicts: [
      'Sinir sisteminizin gölge çalışmasına nasıl tepki verdiğini görmek için yukarıdakileri işaretleyin.',
      'Keşfe Hazır (1/4). Savunmalarınız esnek; aşağıda en çok merak uyandıran sorudan yazmaya başlayın.',
      'Zihinsel Kontrol Kalkanı (2/4). Duyguları zihinle bastırma eğilimindesiniz; Duygu Düzenleme Planlayıcısını kullanın.',
      'Yüksek Bilinçaltı Bastırma (3/4). Gölgeyle yüzleşmek gerilim yaratıyor; önce mevcut stres yükünüzü ölçün.',
      'Derin Bedensel Savunma Döngüsü (4/4). Bedeniniz bastırılmış duygulara karşı kilitleniyor; derine inmeden önce Stres Kontrolünü başlatın.'
    ],
    primaryBtn: 'Sinir Sistemi Stresimi ve Duygusal Yükümü Ölç &rarr;',
    subBtn: 'Duygu Düzenleme Planlayıcısını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड शैडो जर्नलिंग प्रतिरोध स्क्रीनर',
    heading: 'आपका अवचेतन मन किस मुख्य शैडो विषय से बच रहा है?',
    sub: 'गहरे सवालों का सामना करते समय सक्रिय होने वाले भावनात्मक और शारीरिक बचाव संकेतों को चुनें:',
    items: [
      '<strong>सीने में जकड़न और ध्यान भटकाना:</strong> क्रोध, शर्म या ईर्ष्या से जुड़े सवालों को सोचकर सीने में भारीपन होता है या फोन स्क्रॉल करने का मन करता है।',
      '<strong>प्रोजेक्शन स्वीकार करने में कठिनाई:</strong> यह मानना कठिन लगता है कि दूसरों की जो कमियां आपको सबसे ज्यादा चुभती हैं, वे आपके भीतर भी दबी हुई हैं।',
      '<strong>अतीत के घावों का केवल दिमागी विश्लेषण:</strong> पुराने दर्द के बारे में लिखते समय भावनाओं को दबाकर केवल तर्क ("वह सब बीत चुका है") का सहारा लेना।',
      '<strong>"अच्छे इंसान" की छवि खोने का डर:</strong> अपनी निजी डायरी में भी स्वार्थी या नाराज दिखने के अपराधबोध से विचारों को सेंसर करना।'
    ],
    scoreUnit: '/ 4 शैडो प्रतिरोध संकेत सक्रिय',
    verdicts: [
      'गहरे आत्म-अन्वेषण के प्रति अपने नर्वस सिस्टम की प्रतिक्रिया जानने के लिए ऊपर चुनें।',
      'अन्वेषण के लिए तैयार (1/4)। आपकी मानसिक रक्षा प्रणाली लचीली है—नीचे सबसे प्रभावी प्रश्न से लिखना शुरू करें।',
      'बौद्धिक सुरक्षा कवच (2/4)। आप भावनाओं को दिमाग से नियंत्रित करते हैं—जर्नलिंग के साथ इमोशन रेगुलेशन प्लानर का उपयोग करें।',
      'उच्च अवचेतन दमन (3/4)। शैडो का सामना करने से तनाव बढ़ रहा है—पहले अपने वर्तमान तनाव स्तर की जाँच करें।',
      'गहरा रक्षात्मक ब्लॉक (4/4)। दबी हुई भावनाएं नर्वस सिस्टम पर भार डाल रही हैं—गहराई में जाने से पहले स्ट्रेस चेक और भावनात्मक संतुलन करें।'
    ],
    primaryBtn: 'मेरा नर्वस सिस्टम स्ट्रेस और भावनात्मक भार जांचें &rarr;',
    subBtn: 'इमोशन रेगुलेशन प्लानर (Emotion Regulation Planner) खोलें &rarr;'
  }
};

const TRAUMA_RESPONSE_GUIDE_LOCALES = {
  en: {
    badge: '30-SECOND AUTONOMIC 4F TRAUMA RESPONSE SCREENER',
    heading: 'Which Survival Mode (Fight, Flight, Freeze, Fawn) Is Driving Your Nervous System?',
    sub: 'Check the automatic body and behavioral reflexes triggered when you face stress or conflict:',
    items: [
      '<strong>Fight Reflex (Combative Tension):</strong> Minor criticism or tone shifts make your jaw clench and push you to argue, control, or defend immediately.',
      '<strong>Flight Reflex (Compulsive Busyness):</strong> Slowing down triggers restlessness, pushing you to overwork, over-plan, or physically leave tense situations.',
      '<strong>Freeze Reflex (Dorsal Shutdown):</strong> When pressure mounts, your mind fogs over, your body feels heavy, and you numb out by scrolling or procrastinating.',
      '<strong>Fawn Reflex (Self-Erasure):</strong> To stop anyone from getting upset, you instantly drop your boundaries, over-apologize, and appease them.'
    ],
    scoreUnit: 'of 4 autonomic 4F reflexes active',
    verdicts: [
      'Check the items above to map which 4F survival reflexes dominate your nervous system under stress.',
      'Focused Single-Mode Reflex (1/4). You have one primary protective reflex—read the guide below to master its specific regulation strategy.',
      'Dual Hybrid Trauma Loop (2/4). Your nervous system oscillates between two survival gears—check your baseline autonomic stress load.',
      'High Autonomic Dysregulation (3/4). Multiple survival reflexes are firing and draining your energy—run the Stress Check and ground your body.',
      'Full 4F Nervous System Overload (4/4). You are cycling between hyperarousal and shutdown—start the Stress Diagnostic and 5-4-3-2-1 Grounding now.'
    ],
    primaryBtn: 'Check My Nervous System Stress &amp; Trauma Load &rarr;',
    subBtn: 'Start 5-4-3-2-1 Sensory Grounding Exercise &rarr;'
  },
  ko: {
    badge: '30초 자율신경계 4F 트라우마 반응 활성도 판별기',
    heading: '지금 내 신경계는 어떤 생존 모드(투쟁·도피·동결·순응)에 묶여 있나요?',
    sub: '스트레스나 갈등 상황에서 무의식적으로 튀어나오는 신체·행동 반사 신호 4가지를 체크해보세요:',
    items: [
      '<strong>투쟁 반응 (Fight - 방어적 공격성):</strong> 사소한 지적이나 말투 변화에도 턱과 어깨가 굳으며 즉시 따지거나 통제하려 듭니다.',
      '<strong>도피 반응 (Flight - 강박적 바쁨):</strong> 가만히 쉬면 불안이 올라와 끊임없이 일거리를 만들거나 불편한 자리를 즉시 피합니다.',
      '<strong>동결 반응 (Freeze - 신경계 셧다운):</strong> 압박감이 커지면 머리가 하얘지고 몸이 무거워져 할 일을 미루며 화면만 멍하니 스크롤합니다.',
      '<strong>순응 반응 (Fawn - 자기 지우기):</strong> 상대가 화를 낼까 봐 내 감정과 경계를 즉시 지우고 습관적으로 사과하며 맞춰줍니다.'
    ],
    scoreUnit: '/ 4개 4F 생존 반사 신호 활성',
    verdicts: [
      '위 항목을 체크해 스트레스 상황에서 작동하는 자율신경계 생존 모드를 확인하세요.',
      '단일 생존 반응 우세 (1/4). 특정 상황에서 하나의 주된 방어 기제가 작동합니다—아래 유형별 회복 가이드를 확인하세요.',
      '이중 하이브리드 트라우마 루프 (2/4). 두 가지 생존 모드가 번갈아 에너지를 소모시킵니다—현재 신경계 스트레스 부하를 점검하세요.',
      '높은 자율신경 조절 이상 (3/4). 다중 생존 반사가 켜져 만성 피로를 유발합니다—스트레스 정밀 진단과 그라운딩이 필요합니다.',
      '복합 4F 신경계 과부하 (4/4). 과각성(투쟁/도피)과 셧다운(동결/순응)이 반복되고 있습니다—즉시 스트레스 진단과 5-4-3-2-1 그라운딩을 시작하세요.'
    ],
    primaryBtn: '내 신경계 스트레스 및 트라우마 부하 진단하기 &rarr;',
    subBtn: '실시간 5-4-3-2-1 감각 그라운딩 시작하기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN AUTONOMER 4F-TRAUMAREAKTIONS-TEST',
    heading: 'Welcher Überlebensmodus (Fight, Flight, Freeze, Fawn) steuert Ihr Nervensystem?',
    sub: 'Markieren Sie die automatischen Körper- und Verhaltensreflexe, die unter Stress oder Konflikten anspringen:',
    items: [
      '<strong>Fight-Reflex (Kampf &amp; Kontrolle):</strong> Kleine Kritik lässt Ihren Kiefer anspannen und drängt Sie sofort zu Gegenwehr oder Kontrolle.',
      '<strong>Flight-Reflex (Flucht in Hektik):</strong> Ruhe löst Unruhe aus, sodass Sie sich in Überarbeitung, Perfektionismus oder Rückzug flüchten.',
      '<strong>Freeze-Reflex (Erstarrung):</strong> Bei starkem Druck wird der Kopf leer, der Körper schwer und Sie betäuben sich durch Scrollen oder Aufschieben.',
      '<strong>Fawn-Reflex (Unterwerfung):</strong> Um Ärger zu vermeiden, löschen Sie sofort eigene Bedürfnisse, entschuldigen sich und passen sich an.'
    ],
    scoreUnit: 'von 4 autonomen 4F-Reflexen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre dominanten 4F-Überlebensreflexe zu erkennen.',
      'Einzelner Schutzreflex (1/4). Ein Hauptmuster dominiert unter Stress – lesen Sie unten die passende Regulationsstrategie.',
      'Hybride 4F-Schleife (2/4). Ihr System wechselt zwischen zwei Überlebensgängen – prüfen Sie Ihre aktuelle Stressbelastung.',
      'Hohe autonome Dysregulation (3/4). Mehrere Schutzreflexe zehren an Ihrer Energie – nutzen Sie Stress-Check und Erdung.',
      'Komplexe 4F-Überlastung (4/4). Ihr Nervensystem pendelt zwischen Alarm und Abschaltung – starten Sie jetzt Stress-Diagnose und 5-4-3-2-1-Erdung.'
    ],
    primaryBtn: 'Nervensystem-Stress &amp; Traumabelastung prüfen &rarr;',
    subBtn: '5-4-3-2-1 Sensorische Erdungsübung starten &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE RESPUESTA AL TRAUMA 4F EN 30 SEGUNDOS',
    heading: '¿Qué modo de supervivencia (Lucha, Huida, Congelación, Complacencia) domina tu sistema nervioso?',
    sub: 'Marca los reflejos corporales y conductuales automáticos que se activan ante el estrés o el conflicto:',
    items: [
      '<strong>Reflejo de Lucha (Fight):</strong> Una crítica leve tensa tu mandíbula y te impulsa a discutir, defenderte o controlar de inmediato.',
      '<strong>Reflejo de Huida (Flight):</strong> Parar a descansar te genera inquietud, empujándote a trabajar de más, hiperplanificar o escapar.',
      '<strong>Reflejo de Congelación (Freeze):</strong> Bajo presión tu mente se nubla, el cuerpo pesa y te anestesias procrastinando con el móvil.',
      '<strong>Reflejo de Complacencia (Fawn):</strong> Para evitar que alguien se enoje, borras tus límites al instante, pides perdón y cedes.'
    ],
    scoreUnit: 'de 4 reflejos autonómicos 4F activos',
    verdicts: [
      'Marca los elementos arriba para identificar qué reflejos de supervivencia 4F gobiernan tu sistema nervioso.',
      'Reflejo único dominante (1/4). Tienes una respuesta protectora principal; revisa abajo su guía de regulación.',
      'Bucle híbrido 4F (2/4). Tu sistema alterna entre dos marchas de supervivencia; evalúa tu carga de estrés basal.',
      'Alta desregulación autonómica (3/4). Varios reflejos consumen tu energía; realiza el test de estrés y aplica grounding.',
      'Sobrecarga 4F completa (4/4). Oscilas entre hiperactivación y apagado; inicia ahora el diagnóstico de estrés y el ejercicio 5-4-3-2-1.'
    ],
    primaryBtn: 'Evaluar Mi Estrés del Sistema Nervioso y Carga de Trauma &rarr;',
    subBtn: 'Iniciar Ejercicio de Grounding Sensorial 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE RÉPONSE AU TRAUMA 4F EN 30 SECONDES',
    heading: 'Quel mode de survie (Fight, Flight, Freeze, Fawn) pilote votre système nerveux ?',
    sub: 'Cochez les réflexes corporels et comportementaux automatiques déclenchés sous stress :',
    items: [
      '<strong>Réflexe Fight (Combat) :</strong> Une remarque mineure crispe votre mâchoire et vous pousse à argumenter ou contrôler immédiatement.',
      '<strong>Réflexe Flight (Fuite) :</strong> Ralentir crée de l’agitation et vous pousse vers l’hyperactivité, le perfectionnisme ou l’esquive.',
      '<strong>Réflexe Freeze (Figement) :</strong> Sous pression, votre esprit s’embrouille, votre corps pèse lourd et vous vous anesthésiez devant l’écran.',
      '<strong>Réflexe Fawn (Complaisance) :</strong> Pour éviter tout conflit, vous effacez vos besoins, vous vous excusez trop et cherchez à plaire.'
    ],
    scoreUnit: 'sur 4 réflexes autonomes 4F actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour repérer vos réflexes de survie 4F dominants.',
      'Réflexe protecteur unique (1/4). Un mode principal s’active sous stress — découvrez sa stratégie de régulation ci-dessous.',
      'Boucle hybride 4F (2/4). Votre système oscille entre deux modes de survie — vérifiez votre charge de stress nerveux.',
      'Forte dérégulation autonome (3/4). Plusieurs réflexes épuisent vos réserves — faites le bilan de stress et d’ancrage.',
      'Surcharge 4F globale (4/4). Vous alternez entre alerte rouge et figement — lancez le diagnostic de stress et l’ancrage 5-4-3-2-1.'
    ],
    primaryBtn: 'Évaluer Mon Stress Nerveux et Ma Charge Traumatique &rarr;',
    subBtn: 'Démarrer l’Exercice d’Ancrage Sensoriel 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒 自律神経4Fトラウマ反応チェック',
    heading: 'あなたの神経系はどの生存モード（闘争・逃走・凍結・迎合）に縛られていますか？',
    sub: 'ストレスや対立時に無意識に出る4つの身体・行動反応をチェックしてください：',
    items: [
      '<strong>闘争反応（Fight）：</strong> 些細な指摘や口調の変化で顎や肩がこわばり、反射的に言い返すか場を支配したくなる。',
      '<strong>逃走反応（Flight）：</strong> 立ち止まって休むと不安が湧き、過剰に予定を詰め込むか気まずい場からすぐ逃げ出したくなる。',
      '<strong>凍結反応（Freeze）：</strong> プレッシャーが強まると頭が真っ白になり体が重くなって、やるべきことを先延ばしにし画面を眺め続ける。',
      '<strong>迎合反応（Fawn）：</strong> 相手が不機嫌にならないよう、自分の本音や境界線を瞬時に消して笑顔で謝り合わせてしまう。'
    ],
    scoreUnit: '/ 4 個の4F生存反応がアクティブ',
    verdicts: [
      '上の項目をチェックして、ストレス下で優位になる4F生存モードを確認しましょう。',
      '単一モード優位（1/4）。特定の場面で1つの防衛反応が作動します。下のタイプ別ケア方法を確認しましょう。',
      'ハイブリッド4Fループ（2/4）。2つの生存モードを行き来して消耗しています。神経系のストレス負荷を測定しましょう。',
      '高い自律神経の乱れ（3/4）。複数の防衛反応が重なり慢性疲労を招いています。ストレス診断とグラウンディングが必要です。',
      '複合4Fオーバーロード（4/4）。過覚醒とシャットダウンが交互に起きています。今すぐストレス診断と5-4-3-2-1グラウンディングを行ってください。'
    ],
    primaryBtn: '神経系のストレス＆トラウマ負荷を診断する &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングを始める &rarr;'
  },
  zh: {
    badge: '30秒 自主神经 4F 创伤反应激活筛查',
    heading: '你的神经系统正被哪种生存模式（战斗/逃跑/冻结/讨好）接管？',
    sub: '勾选在压力或冲突下无意识触发的 4 个身体与行为反射：',
    items: [
      '<strong>战斗反应（Fight - 防御性反击）：</strong> 轻微的批评或语气变化就会让你咬紧牙关，本能地想反驳、争辩或控制局面。',
      '<strong>逃跑反应（Flight - 强迫性忙碌）：</strong> 一旦停下来休息就会心慌，只能靠疯狂工作、过度计划或逃离现场来缓解焦虑。',
      '<strong>冻结反应（Freeze - 神经系统死机）：</strong> 压力变大时大脑一片空白、四肢沉重，只能靠刷手机或拖延来麻木自己。',
      '<strong>讨好反应（Fawn - 自我抹杀）：</strong> 害怕别人不高兴，立刻放弃自己的底线与需求，习惯性道歉并迎合对方。'
    ],
    scoreUnit: '/ 4 个 4F 生存反射已激活',
    verdicts: [
      '勾选上方信号，识别压力下主导你神经系统的 4F 创伤生存模式。',
      '单一生存反射主导（1/4）。你在特定触发点会启动固定防御，请阅读下方指南掌握专属调节策略。',
      '双重混合创伤循环（2/4）。你的神经系统在两种模式间反复横跳，建议检测当前的自主神经压力负荷。',
      '高度自主神经失调（3/4）。多重生存反射正在透支你的精力，请进行压力测评并配合感官着陆练习。',
      '复合 4F 神经系统过载（4/4）。你在过度唤醒与能量关闭间剧烈消耗，请立即开始压力测评与 5-4-3-2-1 着陆练习。'
    ],
    primaryBtn: '测试我的神经系统压力与创伤负荷 &rarr;',
    subBtn: '开始 5-4-3-2-1 感官着陆放松练习 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE RESPOSTA AO TRAUMA 4F EM 30 SEGUNDOS',
    heading: 'Qual modo de sobrevivência (Luta, Fuga, Congelamento, Submissão) governa seu sistema nervoso?',
    sub: 'Marque os reflexos corporais e comportamentais automáticos disparados sob estresse:',
    items: [
      '<strong>Reflexo de Luta (Fight):</strong> Críticas leves travam seu maxilar e fazem você discutir, se defender ou tentar controlar na hora.',
      '<strong>Reflexo de Fuga (Flight):</strong> Desacelerar gera inquietação, empurrando você para o excesso de trabalho, perfeccionismo ou fuga.',
      '<strong>Reflexo de Congelamento (Freeze):</strong> Quando a pressão sobe, dá branco na mente, o corpo pesa e você trava rolando a tela.',
      '<strong>Reflexo de Submissão (Fawn):</strong> Para evitar que alguém se irrite, você apaga suas necessidades, pede desculpas demais e agrada.'
    ],
    scoreUnit: 'de 4 reflexos autonômicos 4F ativos',
    verdicts: [
      'Marque os itens acima para mapear quais reflexos 4F dominam seu sistema nervoso sob estresse.',
      'Reflexo protetor único (1/4). Um modo principal se ativa sob tensão; veja abaixo a estratégia de regulação.',
      'Loop híbrido 4F (2/4). Seu sistema oscila entre dois modos de sobrevivência; avalie sua carga de estresse.',
      'Alta desregulação autonômica (3/4). Múltiplos reflexos drenam sua energia; faça o teste de estresse e grounding.',
      'Sobrecarga 4F completa (4/4). Você alterna entre hiperativação e desligamento; inicie o diagnóstico de estresse e o grounding 5-4-3-2-1.'
    ],
    primaryBtn: 'Avaliar Meu Estresse do Sistema Nervoso e Carga de Trauma &rarr;',
    subBtn: 'Iniciar Exercício de Grounding Sensorial 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ СКРИНЕР 4F-РЕАКЦИЙ НА ТРАВМУ',
    heading: 'Какой режим выживания (Бей, Беги, Замри, Угождай) управляет вашей нервной системой?',
    sub: 'Отметьте автоматические телесные и поведенческие рефлексы, возникающие при стрессе:',
    items: [
      '<strong>Рефлекс «Бей» (Fight):</strong> Малейшая критика вызывает напряжение в теле и желание сразу спорить, защищаться или контролировать.',
      '<strong>Рефлекс «Беги» (Flight):</strong> Пауза и отдых вызывают тревогу, заставляя уходить с головой в работу, суету или избегание.',
      '<strong>Рефлекс «Замри» (Freeze):</strong> При росте давления мысли путаются, тело тяжелеет, и вы замираете в прокрастинации и скроллинге.',
      '<strong>Рефлекс «Угождай» (Fawn):</strong> Чтобы никто не разозлился, вы мгновенно стираете свои границы, извиняетесь и подстраиваетесь.'
    ],
    scoreUnit: 'из 4 вегетативных 4F-рефлексов активны',
    verdicts: [
      'Отметьте пункты выше, чтобы определить доминирующие рефлексы выживания 4F.',
      'Один ведущий рефлекс (1/4). В стрессе включается одна защита — изучите ниже стратегию ее регуляции.',
      'Гибридная петля 4F (2/4). Нервная система мечется между двумя режимами — проверьте уровень стрессовой нагрузки.',
      'Высокая дисрегуляция (3/4). Несколько защитных реакций истощают ресурсы — пройдите тест стресса и заземлитесь.',
      'Полная перегрузка 4F (4/4). Вы качаетесь между тревогой и оцепенением — начните диагностику стресса и практику 5-4-3-2-1.'
    ],
    primaryBtn: 'Проверить стресс нервной системы и травма-нагрузку &rarr;',
    subBtn: 'Начать технику заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING RESPONS TRAUMA 4F SISTEM SARAF 30 DETIK',
    heading: 'Mode Bertahan Hidup Mana (Fight, Flight, Freeze, Fawn) yang Mengendalikan Sistem Saraf Anda?',
    sub: 'Centang refleks tubuh dan perilaku otomatis yang muncul saat menghadapi stres atau konflik:',
    items: [
      '<strong>Refleks Fight (Melawan):</strong> Kritik kecil membuat rahang menegang dan mendorong Anda langsung berdebat atau memegang kendali.',
      '<strong>Refleks Flight (Kabur/Sibuk):</strong> Beristirahat justru memicu gelisah sehingga Anda menyibukkan diri secara kompulsif atau menghindar.',
      '<strong>Refleks Freeze (Membeku):</strong> Saat tekanan naik, pikiran kosong, tubuh terasa berat, dan Anda mematikan rasa dengan scrolling layar.',
      '<strong>Refleks Fawn (Menyenangkan Orang):</strong> Agar orang lain tidak marah, Anda langsung menghapus kebutuhan sendiri dan meminta maaf berlebihan.'
    ],
    scoreUnit: 'dari 4 refleks otonom 4F aktif',
    verdicts: [
      'Centang item di atas untuk memetakan refleks bertahan hidup 4F yang mendominasi sistem saraf Anda.',
      'Refleks Tunggal Dominan (1/4). Satu pola utama aktif saat stres; pelajari strategi regulasinya di bawah.',
      'Lingkar Hibrida 4F (2/4). Sistem saraf Anda berpindah di antara dua mode; cek beban stres otonom Anda.',
      'Disregulasi Otonom Tinggi (3/4). Banyak refleks bertahan hidup menguras energi; jalankan Cek Stres dan grounding.',
      'Beban Berlebih 4F Penuh (4/4). Anda berputar antara hiper-waspada dan mati rasa; mulai diagnostik stres dan grounding 5-4-3-2-1 sekarang.'
    ],
    primaryBtn: 'Cek Beban Stres Sistem Saraf &amp; Trauma Saya &rarr;',
    subBtn: 'Mulai Latihan Grounding Sensorik 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK OTONOM 4F TRAVMA TEPKİSİ TARAMASI',
    heading: 'Sinir Sisteminizi Hangi Hayatta Kalma Modu (Savaş, Kaç, Don, Yaran) Yönetiyor?',
    sub: 'Stres veya çatışma altında tetiklenen otomatik beden ve davranış reflekslerini işaretleyin:',
    items: [
      '<strong>Savaş Refleksi (Fight):</strong> Ufak bir eleştiri çenenizi sıkmanıza, anında savunmaya geçip tartışmanıza veya kontrol kurmanıza yol açıyor.',
      '<strong>Kaç Refleksi (Flight):</strong> Yavaşlamak huzursuzluk yaratıyor; aşırı çalışmaya, sürekli plan yapmaya veya ortamdan uzaklaşmaya itiyor.',
      '<strong>Don Refleksi (Freeze):</strong> Baskı arttığında zihniniz bulanıyor, bedeniniz ağırlaşıyor ve işleri erteleyip ekrana bakarak uyuşuyorsunuz.',
      '<strong>Yaran Refleksi (Fawn):</strong> Kimse kızmasın diye kendi sınırlarınızı anında siliyor, aşırı özür diliyor ve karşı tarafı memnun ediyorsunuz.'
    ],
    scoreUnit: '/ 4 otonom 4F refleksi aktif',
    verdicts: [
      'Stres altında hangi 4F hayatta kalma reflekslerinin baskın olduğunu görmek için yukarıdakileri işaretleyin.',
      'Tekil Koruyucu Refleks (1/4). Stres altında tek bir ana tepkiniz var; aşağıdaki rehberden düzenleme stratejisini inceleyin.',
      'Hibrit 4F Döngüsü (2/4). Sinir sisteminiz iki hayatta kalma vitesi arasında gidip geliyor; stres yükünüzü kontrol edin.',
      'Yüksek Otonom Düzensizlik (3/4). Birden fazla refleks enerjinizi tüketiyor; Stres Kontrolü ve topraklanma uygulayın.',
      'Tam 4F Aşırı Yüklenme (4/4). Aşırı uyarılma ile kapanma arasında sıkışmışsınız; hemen Stres Testini ve 5-4-3-2-1 Topraklanmayı başlatın.'
    ],
    primaryBtn: 'Sinir Sistemi Stresimi ve Travma Yükümü Ölç &rarr;',
    subBtn: '5-4-3-2-1 Duyusal Topraklanma Egzersizini Başlat &rarr;'
  },
  hi: {
    badge: '30-सेकंड ऑटोनोमिक 4F ट्रॉमा रिस्पॉन्स स्क्रीनर',
    heading: 'आपका तंत्रिका तंत्र किस सर्वाइवल मोड (Fight, Flight, Freeze, Fawn) में है?',
    sub: 'तनाव या टकराव में अपने आप सक्रिय होने वाले शारीरिक और व्यवहारिक संकेतों को चुनें:',
    items: [
      '<strong>फाइट रिफ्लेक्स (Fight - आक्रामक बचाव):</strong> थोड़ी सी आलोचना से शरीर अकड़ जाता है और तुरंत बहस या नियंत्रण करने की इच्छा होती है।',
      '<strong>फ्लाइट रिफ्लेक्स (Flight - अत्यधिक व्यस्तता):</strong> शांत बैठने पर बेचैनी होती है, जिससे आप खुद को काम में झोंक देते हैं या स्थिति से भागते हैं।',
      '<strong>फ्रीज रिफ्लेक्स (Freeze - सुन्न पड़ना):</strong> दबाव बढ़ने पर दिमाग सुन्न हो जाता है, शरीर भारी लगता है और आप काम टालकर फोन स्क्रॉल करते हैं।',
      '<strong>फॉन रिफ्लेक्स (Fawn - दूसरों को खुश करना):</strong> सामने वाला नाराज न हो, इस डर से अपनी जरूरतें मिटाकर तुरंत माफी मांगते और समझौता करते हैं।'
    ],
    scoreUnit: '/ 4 ऑटोनोमिक 4F रिफ्लेक्स सक्रिय',
    verdicts: [
      'तनाव में आपके नर्वस सिस्टम पर कौन सा 4F सर्वाइवल मोड हावी रहता है, यह जानने के लिए ऊपर चुनें।',
      'एकल सर्वाइवल मोड (1/4)। तनाव में एक मुख्य रक्षा प्रणाली सक्रिय होती है—नीचे इसके समाधान की गाइड पढ़ें।',
      'हाइब्रिड 4F चक्र (2/4)। आपका तंत्रिका तंत्र दो मोड के बीच झूल रहा है—अपने वर्तमान स्ट्रेस लोड की जाँच करें।',
      'उच्च ऑटोनोमिक असंतुलन (3/4)। कई रक्षा प्रतिक्रियाएं आपकी ऊर्जा सोख रही हैं—स्ट्रेस चेक और ग्राउंडिंग करें।',
      'पूर्ण 4F नर्वस सिस्टम ओवरलोड (4/4)। आप घबराहट और सुन्नपन के बीच फँसे हैं—तुरंत स्ट्रेस टेस्ट और 5-4-3-2-1 ग्राउंडिंग शुरू करें।'
    ],
    primaryBtn: 'मेरा नर्वस सिस्टम स्ट्रेस और ट्रॉमा लोड जांचें &rarr;',
    subBtn: '5-4-3-2-1 सेंसरी ग्राउंडिंग अभ्यास शुरू करें &rarr;'
  }
};

const ANXIETY_TYPES_LOCALES = {
  en: {
    badge: '30-SECOND ANXIETY SPECTRUM DIFFERENTIAL SCREENER',
    heading: 'Where Does Your Anxiety Originate? (Cognitive GAD vs. Somatic Panic vs. Social)',
    sub: 'Check which anxiety channels have been firing over the past 2 weeks to pinpoint your primary profile:',
    items: [
      '<strong>Cognitive GAD Loop:</strong> Uncontrollable "what if" worst-case scenarios spin in your mind even when nothing is immediately wrong.',
      '<strong>Somatic / Autonomic Surge:</strong> Physical symptoms—racing heart, tight chest, shallow breathing, or stomach knots—strike first.',
      '<strong>Social &amp; Evaluative Hypervigilance:</strong> Fear of judgment or making a mistake causes you to rehearse and replay conversations endlessly.',
      '<strong>High-Functioning Exhaustion:</strong> You appear calm and capable on the outside while burning massive nervous system energy to hide inner dread.'
    ],
    scoreUnit: 'of 4 anxiety spectrum channels active',
    verdicts: [
      'Check the items above to identify your dominant anxiety channel and burnout spillover risk.',
      'Single-Channel Anxiety Focus (1/4). Your anxiety concentrates in one primary pathway—match it with the 6 clinical profiles below.',
      'Dual Mind-Body Anxiety Loop (2/4). Mental worry and physical tension are feeding each other—check your nervous system stress load.',
      'Multi-Channel Hyperarousal (3/4). High chronic arousal is draining your reserves—run the Stress Check and Burnout Differential.',
      'Full-Spectrum Anxiety & Burnout Risk (4/4). Cognitive, somatic, and social alarms are firing together—measure your Stress Load and differentiate burnout now.'
    ],
    primaryBtn: 'Check My Nervous System Stress &amp; Anxiety Load &rarr;',
    subBtn: 'Open Burnout vs. Stress Differential Tool &rarr;'
  },
  ko: {
    badge: '30초 불안 유형(인지·신체·관계·고기능) 스펙트럼 감별기',
    heading: '내 불안은 어디에서 시작될까요? (범불안 vs 신체화 vs 사회불안)',
    sub: '최근 2주간 자주 작동한 불안 채널 4가지를 체크해 내 주된 불안 발화 지점을 확인해보세요:',
    items: [
      '<strong>인지적 범불안 루프 (GAD):</strong> 당장 큰 문제가 없는데도 "만약 ~하면 어쩌지?"라는 최악의 시나리오가 머릿속에서 멈추지 않습니다.',
      '<strong>신체·자율신경 급발진:</strong> 생각보다 심장 두근거림, 호흡 답답함, 위장 장애, 어지럼증 같은 신체 증상이 먼저 찾아옵니다.',
      '<strong>사회적 평가 과각성:</strong> 타인의 시선이나 실수에 대한 두려움 때문에 대화 전후로 내 말과 표정을 수십 번 복기합니다.',
      '<strong>고기능 불안과 번아웃 소진:</strong> 겉으로는 침착하고 유능해 보이지만 속으로는 불안을 감추느라 에너지를 극도로 소모합니다.'
    ],
    scoreUnit: '/ 4개 불안 스펙트럼 채널 활성',
    verdicts: [
      '위 항목을 체크해 내 주된 불안 채널과 만성 번아웃 전이 위험도를 확인하세요.',
      '단일 채널 불안 집중 (1/4). 특정 영역에 불안이 집중되어 있습니다—아래 6가지 불안 유형 가이드에서 맞춤 대처법을 확인하세요.',
      '생각-신체 이중 불안 루프 (2/4). 걱정과 신체 긴장이 서로를 증폭시키고 있습니다—신경계 스트레스 부하를 점검해보세요.',
      '다차원 과각성 상태 (3/4). 만성적인 긴장으로 에너지가 빠르게 고갈되고 있습니다—스트레스 진단과 번아웃 감별이 필요합니다.',
      '전방위 불안 및 번아웃 위험 (4/4). 인지·신체·관계 알람이 동시에 울리고 있습니다—즉시 스트레스 부하를 측정하고 번아웃 여부를 감별하세요.'
    ],
    primaryBtn: '내 신경계 스트레스 및 불안 부하 정밀 진단하기 &rarr;',
    subBtn: '스트레스 vs 번아웃 감별 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN ANGSTSPEKTRUM-DIFFERENZIALTEST',
    heading: 'Wo entsteht Ihre Angst? (Kognitives Grübeln vs. Somatische Panik vs. Soziale Angst)',
    sub: 'Markieren Sie, welche Angstkanäle in den letzten 2 Wochen aktiv waren, um Ihr Hauptprofil zu finden:',
    items: [
      '<strong>Kognitive GAS-Schleife:</strong> Unkontrollierbare „Was-wäre-wenn“-Katastrophenszenarien kreisen im Kopf, selbst wenn akut nichts vorliegt.',
      '<strong>Somatischer Alarm:</strong> Körperliche Symptome – Herzrasen, Brustenge, flache Atmung oder Magendruck – treten scheinbar aus dem Nichts auf.',
      '<strong>Soziale Überwachsamkeit:</strong> Aus Angst vor Verurteilung oder Fehlern spielen Sie Gespräche vorher und nachher endlos im Kopf durch.',
      '<strong>Hochfunktionale Erschöpfung:</strong> Nach außen wirken Sie ruhig und leistungsfähig, während Sie innerlich enorme Energie verbrauchen.'
    ],
    scoreUnit: 'von 4 Angstspektrum-Kanälen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihren dominanten Angstkanal und Ihr Burnout-Risiko zu prüfen.',
      'Einkanal-Angstfokus (1/4). Ihre Angst konzentriert sich auf einen Bereich – vergleichen Sie unten die 6 Angstprofile.',
      'Kopf-Körper-Schleife (2/4). Grübeln und körperliche Anspannung verstärken sich – prüfen Sie Ihre Nervensystem-Stresslast.',
      'Mehrdimensionale Übererregung (3/4). Chronischer Alarm zehrt an Ihren Reserven – nutzen Sie Stress-Check und Burnout-Differenzial.',
      'Vollspektrum-Angst & Burnout-Risiko (4/4). Alle Warnsysteme laufen gleichzeitig – testen Sie jetzt Ihre Stresslast und das Burnout-Differenzial.'
    ],
    primaryBtn: 'Nervensystem-Stress &amp; Angstbelastung prüfen &rarr;',
    subBtn: 'Burnout- vs. Stress-Differenzial-Tool öffnen &rarr;'
  },
  es: {
    badge: 'DIFERENCIAL DEL ESPECTRO DE ANSIEDAD EN 30 SEGUNDOS',
    heading: '¿Dónde se origina tu ansiedad? (Preocupación TAG vs. Pánico Somático vs. Social)',
    sub: 'Marca qué canales de ansiedad han estado activos en las últimas 2 semanas para identificar tu perfil:',
    items: [
      '<strong>Bucle cognitivo TAG:</strong> Escenarios catastróficos de «¿y si pasa esto?» giran sin control en tu mente aunque todo esté en calma.',
      '<strong>Descarga somática / autonómica:</strong> Síntomas físicos como taquicardia, falta de aire, opresión o nudo estomacal aparecen primero.',
      '<strong>Hipervigilancia social:</strong> El miedo al juicio o a equivocarte te hace ensayar y repasar conversaciones una y otra vez.',
      '<strong>Agotamiento de alto funcionamiento:</strong> Pareces tranquilo y capaz por fuera mientras gastas enorme energía ocultando la tensión interna.'
    ],
    scoreUnit: 'de 4 canales del espectro de ansiedad activos',
    verdicts: [
      'Marca los puntos arriba para identificar tu canal principal de ansiedad y el riesgo de burnout.',
      'Ansiedad de canal único (1/4). Tu ansiedad se concentra en una vía; compárala con los 6 perfiles clínicos abajo.',
      'Bucle dual mente-cuerpo (2/4). La preocupación y la tensión física se retroalimentan; evalúa tu carga de estrés.',
      'Hiperactivación multicanal (3/4). El estado de alerta crónico agota tus reservas; usa el test de estrés y diferencial de burnout.',
      'Ansiedad de espectro completo (4/4). Las alarmas mentales, físicas y sociales suenan juntas; mide tu estrés y descarta burnout ahora.'
    ],
    primaryBtn: 'Evaluar Mi Estrés del Sistema Nervioso y Carga de Ansiedad &rarr;',
    subBtn: 'Abrir Herramienta Diferencial Burnout vs. Estrés &rarr;'
  },
  fr: {
    badge: 'DIFFÉRENTIEL DU SPECTRE DE L’ANXIÉTÉ EN 30 SECONDES',
    heading: 'D’où vient votre anxiété ? (Inquiétude TAG vs Panique Somatique vs Sociale)',
    sub: 'Cochez les canaux d’anxiété actifs ces 2 dernières semaines pour cibler votre profil dominant :',
    items: [
      '<strong>Boucle cognitive TAG :</strong> Des scénarios catastrophes « et si... » tournent en boucle dans votre tête même sans danger immédiat.',
      '<strong>Décharge somatique :</strong> Des symptômes physiques — cœur qui s’emballe, souffle court, poitrine serrée ou nœud à l’estomac — surgissent d’abord.',
      '<strong>Hypervigilance sociale :</strong> La peur du jugement ou de l’erreur vous pousse à répéter et ressasser les conversations sans fin.',
      '<strong>Épuisement de haut fonctionnement :</strong> Vous semblez calme et performant en surface tout en brûlant une énergie folle pour masquer l’angoisse.'
    ],
    scoreUnit: 'sur 4 canaux du spectre anxieux actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour identifier votre canal d’anxiété principal et le risque d’épuisement.',
      'Anxiété sur un canal (1/4). Votre anxiété est ciblée — découvrez les 6 profils cliniques dans le guide ci-dessous.',
      'Boucle corps-esprit (2/4). Rumination et tension physique s’alimentent — vérifiez votre charge de stress nerveux.',
      'Hyperactivation multicanale (3/4). L’alerte chronique vide vos réserves — faites le bilan de stress et le différentiel burnout.',
      'Anxiété globale & risque de burnout (4/4). Toutes les alarmes sonnent ensemble — mesurez votre stress et différenciez le burnout maintenant.'
    ],
    primaryBtn: 'Évaluer Mon Stress Nerveux et Ma Charge d’Anxiété &rarr;',
    subBtn: 'Ouvrir l’Outil Différentiel Burnout vs Stress &rarr;'
  },
  ja: {
    badge: '30秒 不安タイプ（認知・身体・対人・高機能）スペクトラム鑑別',
    heading: 'あなたの不安はどこから始まる？（全般性心配 vs 身体化パニック vs 社交過覚醒）',
    sub: '過去2週間で頻繁に作動した4つの不安チャネルをチェックしてください：',
    items: [
      '<strong>認知的・全般性不安ループ（GAD）：</strong> 差し迫った問題がないのに「もし〜だったらどうしよう」という最悪の想定が止まらない。',
      '<strong>身体的・自律神経アラーム：</strong> 思考より先に、動悸・息苦しさ・胸の圧迫感・胃腸の不調などの身体症状が突然現れる。',
      '<strong>社交・評価への過覚醒：</strong> 他人の目や失敗への恐れから、会話の前後に自分の発言や態度を頭の中で何十回も反省会してしまう。',
      '<strong>高機能不安による消耗：</strong> 外からは落ち着いて有能に見えるが、内心の焦りを隠すために膨大な神経エネルギーを消費している。'
    ],
    scoreUnit: '/ 4 個の不安スペクトラム・チャネルがアクティブ',
    verdicts: [
      '上の項目をチェックして、主要な不安チャネルとバーンアウト移行リスクを確認しましょう。',
      '単一チャネルの不安集中（1/4）。特定の経路に不安が集まっています。下の6つの不安タイプ解説で対策を確認しましょう。',
      '思考×身体の二重ループ（2/4）。心配と身体緊張が互いを強めています。神経系のストレス負荷をチェックしましょう。',
      '多チャネル過覚醒（3/4）。慢性的な警戒モードでエネルギーが枯渇しています。ストレス診断とバーンアウト鑑別が必要です。',
      '全方位の不安＆バーンアウト危機（4/4）。思考・身体・対人の警報が同時に鳴っています。今すぐストレス診断とバーンアウト鑑別を行ってください。'
    ],
    primaryBtn: '神経系のストレス＆不安負荷を精密診断する &rarr;',
    subBtn: 'ストレス vs バーンアウト鑑別ツールを開く &rarr;'
  },
  zh: {
    badge: '30秒 焦虑光谱鉴别筛查（认知·躯体·社交·高功能）',
    heading: '你的焦虑源于哪个通道？（广泛性担忧 vs 躯体化恐慌 vs 社交高警觉）',
    sub: '勾选过去两周内频繁激活的 4 个焦虑维度，精准定位你的核心焦虑画像：',
    items: [
      '<strong>认知性广泛焦虑循环（GAD）：</strong> 即使当下没有危机，脑海中也会不受控制地循环“万一……怎么办”的最坏剧本。',
      '<strong>躯体与自主神经突袭：</strong> 比起念头，心跳加速、胸闷气短、呼吸变浅或肠胃痉挛等身体症状往往先一步出现。',
      '<strong>社交与评价高警觉：</strong> 害怕被评判或出丑，在对话前后反复在脑中预演和复盘自己的每一句话。',
      '<strong>高功能焦虑与内耗透支：</strong> 表面看起来冷静能干，内心却为了掩饰不安与恐慌而消耗着巨大的神经能量。'
    ],
    scoreUnit: '/ 4 个焦虑光谱通道已激活',
    verdicts: [
      '勾选上方信号，识别你的主导焦虑通道与慢性倦怠风险。',
      '单一通道焦虑聚焦（1/4）。焦虑集中在特定路径，请对照下方 6 种临床焦虑画像查看应对策略。',
      '身心双重焦虑循环（2/4）。精神担忧与躯体紧绷正在相互放大，建议检测当前的神经系统压力负荷。',
      '多维过度唤醒（3/4）。长期的高警觉状态正在掏空精力，请进行压力测评并使用倦怠鉴别工具。',
      '全光谱焦虑与倦怠警报（4/4）。认知、躯体与社交警报同时拉响，请立即测评压力负荷并排查职业/情绪倦怠。'
    ],
    primaryBtn: '测试我的神经系统压力与焦虑负荷 &rarr;',
    subBtn: '打开压力 vs 倦怠鉴别工具 &rarr;'
  },
  pt: {
    badge: 'DIFERENCIAL DO ESPECTRO DE ANSIEDADE EM 30 SEGUNDOS',
    heading: 'Onde sua ansiedade começa? (Preocupação TAG vs. Pânico Somático vs. Social)',
    sub: 'Marque quais canais de ansiedade estiveram ativos nas últimas 2 semanas para identificar seu perfil:',
    items: [
      '<strong>Loop cognitivo TAG:</strong> Cenários catastróficos de "e se..." rodam sem parar na cabeça mesmo quando nada grave está acontecendo.',
      '<strong>Disparo somático / autonômico:</strong> Sintomas físicos — coração acelerado, falta de ar, aperto no peito ou nó no estômago — surgem primeiro.',
      '<strong>Hipervigilância social:</strong> O medo de julgamento ou de errar faz você ensaiar e repassar conversas infinitamente na mente.',
      '<strong>Exaustão de alto funcionamento:</strong> Você parece calmo e produtivo por fora enquanto gasta enorme energia escondendo a tensão interna.'
    ],
    scoreUnit: 'de 4 canais do espectro de ansiedade ativos',
    verdicts: [
      'Marque os itens acima para identificar seu canal principal de ansiedade e o risco de burnout.',
      'Foco em canal único (1/4). Sua ansiedade se concentra em uma via; veja abaixo os 6 perfis de ansiedade.',
      'Loop mente-corpo (2/4). Preocupação e tensão física se alimentam; avalie sua carga de estresse do sistema nervoso.',
      'Hiperativação multicanal (3/4). O alerta constante drena sua energia; faça o teste de estresse e o diferencial de burnout.',
      'Ansiedade global e risco de burnout (4/4). Alarmes mentais, físicos e sociais tocam juntos; meça seu estresse e diferencie do burnout agora.'
    ],
    primaryBtn: 'Avaliar Meu Estresse do Sistema Nervoso e Carga de Ansiedade &rarr;',
    subBtn: 'Abrir Ferramenta Diferencial Burnout vs. Estresse &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ДИФФЕРЕНЦИАЛ СПЕКТРА ТРЕВОГИ',
    heading: 'Где зарождается ваша тревога? (ГТР-беспокойство vs Соматика vs Социальная тревога)',
    sub: 'Отметьте каналы тревоги, активные в последние 2 недели, чтобы определить ваш ведущий профиль:',
    items: [
      '<strong>Когнитивная петля ГТР:</strong> Навязчивые сценарии «а что, если...» крутятся в голове без остановки, даже когда все спокойно.',
      '<strong>Соматический всплеск:</strong> Первыми внезапно появляются телесные симптомы: сердцебиение, нехватка воздуха, спазмы в животе.',
      '<strong>Социальная сверхбдительность:</strong> Из-за страха осуждения или ошибки вы бесконечно репетируете и прокручиваете разговоры.',
      '<strong>Высокофункциональное истощение:</strong> Внешне вы кажетесь спокойным и успешным, но тратите колоссальные силы на скрытие тревоги.'
    ],
    scoreUnit: 'из 4 каналов спектра тревоги активны',
    verdicts: [
      'Отметьте пункты выше, чтобы определить ваш главный канал тревоги и риск выгорания.',
      'Фокус в одном канале (1/4). Тревога сосредоточена в одной сфере — изучите 6 типов тревоги в руководстве ниже.',
      'Двойная петля «ум-тело» (2/4). Мысли и телесный спазм усиливают друг друга — проверьте уровень стресса.',
      'Многомерное гипервозбуждение (3/4). Хроническая тревога истощает ресурсы — пройдите тест стресса и дифференциал выгорания.',
      'Полный спектр тревоги и риск выгорания (4/4). Все системы тревоги работают одновременно — измерьте стресс и отличите его от выгорания.'
    ],
    primaryBtn: 'Проверить уровень стресса и тревожной нагрузки &rarr;',
    subBtn: 'Открыть дифференциал: Выгорание или Стресс &rarr;'
  },
  id: {
    badge: 'DIFERENSIAL SPEKTRUM KECEMASAN 30 DETIK',
    heading: 'Dari Mana Kecemasan Anda Berasal? (Kekhawatiran GAD vs Panik Somatik vs Sosial)',
    sub: 'Centang saluran kecemasan yang aktif selama 2 minggu terakhir untuk menemukan profil utama Anda:',
    items: [
      '<strong>Putaran Kognitif GAD:</strong> Skenario terburuk "bagaimana jika..." terus berputar di kepala meski situasi sedang aman.',
      '<strong>Lonjakan Somatik / Fisik:</strong> Gejala fisik—jantung berdebar, dada sesak, napas pendek, atau perut melilit—muncul lebih dulu.',
      '<strong>Kewaspadaan Sosial Berlebih:</strong> Takut dinilai buruk atau salah bicara membuat Anda terus memutar ulang percakapan di pikiran.',
      '<strong>Kelelahan High-Functioning:</strong> Anda tampak tenang dan kompeten di luar, namun menguras energi besar untuk menyembunyikan cemas.'
    ],
    scoreUnit: 'dari 4 saluran spektrum kecemasan aktif',
    verdicts: [
      'Centang item di atas untuk mengenali saluran kecemasan utama dan risiko burnout Anda.',
      'Fokus Satu Saluran (1/4). Kecemasan terpusat pada satu jalur; cocokkan dengan 6 profil kecemasan di bawah.',
      'Putaran Ganda Pikiran-Tubuh (2/4). Kekhawatiran dan ketegangan fisik saling memperkuat; cek beban stres sistem saraf Anda.',
      'Hiper-Waspada Multisaluran (3/4). Ketegangan kronis menguras cadangan energi; jalankan Cek Stres dan Diferensial Burnout.',
      'Kecemasan Spektrum Penuh (4/4). Alarm kognitif, fisik, dan sosial menyala bersamaan; ukur beban stres dan bedakan dengan burnout sekarang.'
    ],
    primaryBtn: 'Cek Beban Stres Sistem Saraf &amp; Kecemasan Saya &rarr;',
    subBtn: 'Buka Alat Diferensial Burnout vs Stres &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK KAYGI SPEKTRUMU AYIRICI TARAMASI',
    heading: 'Kaygınız Nereden Kaynaklanıyor? (Bilişsel YAB vs. Bedensel Panik vs. Sosyal Kaygı)',
    sub: 'Ana kaygı profilinizi bulmak için son 2 haftada aktif olan kanalları işaretleyin:',
    items: [
      '<strong>Bilişsel YAB Döngüsü:</strong> Ortada acil bir sorun yokken bile "ya şöyle olursa?" şeklindeki en kötü senaryolar zihninizde dönüyor.',
      '<strong>Bedensel / Otonom Dalgalanma:</strong> Kalp çarpıntısı, göğüs sıkışması, nefes darlığı veya mide düğümlenmesi düşünceden önce başlıyor.',
      '<strong>Sosyal Aşırı Tetikte Olma:</strong> Yargılanma veya hata yapma korkusuyla konuşmaları öncesinde ve sonrasında defalarca zihinde tekrar ediyorsunuz.',
      '<strong>Yüksek İşlevli Tükenmişlik:</strong> Dışarıdan sakin ve başarılı görünürken içsel huzursuzluğu gizlemek için devasa enerji harcıyorsunuz.'
    ],
    scoreUnit: '/ 4 kaygı spektrumu kanalı aktif',
    verdicts: [
      'Baskın kaygı kanalınızı ve tükenmişlik riskinizi görmek için yukarıdakileri işaretleyin.',
      'Tek Kanallı Kaygı Odağı (1/4). Kaygınız tek bir alanda yoğunlaşıyor; aşağıdaki 6 klinik profille karşılaştırın.',
      'Zihin-Beden İkili Döngüsü (2/4). Endişe ve bedensel gerginlik birbirini besliyor; sinir sistemi stres yükünüzü ölçün.',
      'Çok Kanallı Aşırı Uyarılma (3/4). Kronik alarm hali enerjinizi tüketiyor; Stres Kontrolü ve Tükenmişlik Ayırıcısını kullanın.',
      'Tam Spektrum Kaygı ve Tükenmişlik Riski (4/4). Zihinsel, bedensel ve sosyal alarmlar aynı anda çalıyor; stres ve tükenmişlik ayrımını hemen yapın.'
    ],
    primaryBtn: 'Sinir Sistemi Stresimi ve Kaygı Yükümü Ölç &rarr;',
    subBtn: 'Tükenmişlik vs. Stres Ayırıcı Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड एंग्जायटी स्पेक्ट्रम डिफरेंशियल स्क्रीनर',
    heading: 'आपकी एंग्जायटी कहाँ से शुरू होती है? (मानसिक GAD बनाम शारीरिक घबराहट बनाम सामाजिक)',
    sub: 'पिछले 2 हफ्तों में सक्रिय रहे एंग्जायटी चैनलों को चुनें और अपना मुख्य प्रोफाइल पहचानें:',
    items: [
      '<strong>मानसिक GAD चिंता चक्र:</strong> सब कुछ सामान्य होने पर भी "अगर ऐसा हो गया तो?" वाले बुरे विचार दिमाग में लगातार घूमते रहते हैं।',
      '<strong>शारीरिक / ऑटोनोमिक उछाल:</strong> विचारों से पहले दिल की धड़कन तेज होना, सीने में जकड़न, उथली साँस या पेट में मरोड़ जैसे लक्षण शुरू होते हैं।',
      '<strong>सामाजिक मूल्यांकन का डर:</strong> दूसरों के जजमेंट या गलती होने के डर से बातचीत के पहले और बाद में अपनी बातों को बार-बार दिमाग में दोहराना।',
      '<strong>हाई-फंक्शनिंग थकान:</strong> बाहर से शांत और सक्षम दिखना, लेकिन भीतर की घबराहट छिपाने में भारी मानसिक ऊर्जा खर्च होना।'
    ],
    scoreUnit: '/ 4 एंग्जायटी स्पेक्ट्रम चैनल सक्रिय',
    verdicts: [
      'अपने मुख्य एंग्जायटी चैनल और बर्नआउट जोखिम को पहचानने के लिए ऊपर चुनें।',
      'एकल-चैनल एंग्जायटी फोकस (1/4)। आपकी चिंता एक मुख्य क्षेत्र में है—नीचे दिए गए 6 एंग्जायटी प्रकारों से मिलान करें।',
      'मन-शरीर दोहरा चक्र (2/4)। मानसिक चिंता और शारीरिक तनाव एक-दूसरे को बढ़ा रहे हैं—अपना नर्वस सिस्टम स्ट्रेस लोड जांचें।',
      'बहु-आयामी अति-सतर्कता (3/4)। लगातार तनाव आपकी ऊर्जा सोख रहा है—स्ट्रेस चेक और बर्नआउट डिफरेंशियल टूल का उपयोग करें।',
      'पूर्ण-स्पेक्ट्रम एंग्जायटी और बर्नआउट जोखिम (4/4)। मानसिक, शारीरिक और सामाजिक अलार्म एक साथ बज रहे हैं—तुरंत स्ट्रेस और बर्नआउट अंतर जांचें।'
    ],
    primaryBtn: 'मेरा नर्वस सिस्टम स्ट्रेस और एंग्जायटी लोड जांचें &rarr;',
    subBtn: 'बर्नआउट बनाम स्ट्रेस डिफरेंशियल टूल खोलें &rarr;'
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

  // 1. shadow-work-journal-prompts.html (12 locales)
  for (const [lang, loc] of Object.entries(SHADOW_JOURNAL_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'shadow-work-journal-prompts.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'shadowJournalScreener',
      chkClass: 'shadjrn-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=shadow_journal_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=shadow_journal_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/shadow-work-journal-prompts.html`);
    console.log(`[PASS] shadow-work-journal-prompts (${lang})`);
  }

  // 2. trauma-response-test-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(TRAUMA_RESPONSE_GUIDE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'trauma-response-test-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'traumaResponseGuideScreener',
      chkClass: 'trguide-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=trauma_response_guide_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=trauma_response_guide_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/trauma-response-test-guide.html`);
    console.log(`[PASS] trauma-response-test-guide (${lang})`);
  }

  // 3. anxiety-types-explained.html (12 locales)
  for (const [lang, loc] of Object.entries(ANXIETY_TYPES_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'anxiety-types-explained.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'anxietyTypesScreener',
      chkClass: 'anxtype-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=anxiety_types_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}&source=anxiety_types_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/anxiety-types-explained.html`);
    console.log(`[PASS] anxiety-types-explained (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 12: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

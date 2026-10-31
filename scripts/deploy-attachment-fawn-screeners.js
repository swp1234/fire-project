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

const ATTACHMENT_QUIZ_GUIDE_LOCALES = {
  en: {
    badge: '30-SECOND 2D ATTACHMENT SCREENER',
    heading: 'Preview Your Attachment Anxiety vs. Avoidance Profile',
    sub: 'Check the relational reflexes you notice most often in close relationships:',
    items: [
      '<strong>Abandonment Vigilance (Anxiety Dimension):</strong> When a partner\'s reply slows or tone shifts, your mind immediately scans for signs of cooling interest.',
      '<strong>Intimacy Suffocation (Avoidance Dimension):</strong> When someone leans on you heavily or pushes for deeper commitment, you feel an urge to pull back for space.',
      '<strong>Push-Pull Ambivalence (Fearful-Avoidant):</strong> You deeply crave closeness, yet once someone gets truly close, your nervous system braces for hurt or betrayal.',
      '<strong>Protest or Shutdown Under Conflict:</strong> During tension, you either seek urgent reassurance right away or go emotionally numb and withdraw.'
    ],
    scoreUnit: 'of 4 insecure attachment signals active',
    verdicts: [
      'Check the items above to preview where you fall on the attachment anxiety and avoidance axes.',
      'Mostly Secure Baseline (1/4). One situational trigger activates under stress—take the full quiz to see your exact 4-style breakdown.',
      'Active Attachment Dimension (2/4). Clear anxious or avoidant protective strategies are shaping how you navigate closeness.',
      'High Relational Activation (3/4). Your attachment alarm fires strongly across both closeness and conflict—map your full profile below.',
      'Strong Fearful-Avoidant / Push-Pull Pattern (4/4). Both anxiety and avoidance systems are active simultaneously. Take the full Attachment Style Test now.'
    ],
    primaryBtn: 'Take the 5-Minute Attachment Style Test &rarr;',
    subBtn: 'Calm Relationship Anxiety with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 2차원 애착 유형 프리뷰 체크',
    heading: '내 애착 불안(Anxiety) vs 회피(Avoidance) 신호는?',
    sub: '가까운 관계나 연애에서 반복되는 나의 무의식적 반응 패턴을 체크해보세요:',
    items: [
      '<strong>유기 불안 및 신호 과민성 (불안 차원):</strong> 상대의 답장이 늦어지거나 말투가 미묘하게 달라지면 마음이 식었는지 즉시 확인하려 합니다.',
      '<strong>친밀감 질식 및 거리두기 (회피 차원):</strong> 상대가 감정적으로 깊이 의존하거나 구속하려 하면 숨이 막히고 혼자만의 공간으로 물러나고 싶습니다.',
      '<strong>밀당과 양가감정 (혼란형/공포-회피):</strong> 깊은 사랑을 갈망하지만 막상 상대가 가까워지면 상처받을까 봐 두려워 벽을 칩니다.',
      '<strong>갈등 시 매달림 또는 셧다운:</strong> 갈등이 생기면 즉각적인 재확인을 요구하거나, 반대로 감정을 닫고 대화를 차단합니다.'
    ],
    scoreUnit: '개 불안정 애착 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 애착 불안·회피 2차원 좌표를 미리 확인해보세요.',
      '비교적 안정적인 애착 기반(1/4). 특정 스트레스 상황에서만 방어 기제가 작동합니다.',
      '뚜렷한 애착 방어 전략 활성화(2/4). 불안형 또는 회피형 차원 중 하나가 관계 패턴을 주도하고 있습니다.',
      '높은 애착 경보 반응(3/4). 친밀감과 갈등 상황에서 신경계가 민감하게 반응합니다. 정밀 진단을 권장합니다.',
      '강한 복합 애착(공포-회피/밀당) 신호(4/4). 불안과 회피가 동시에 작동하고 있습니다. 지금 전체 애착 유형 테스트로 확인하세요.'
    ],
    primaryBtn: '무료 4대 애착 유형 정밀 테스트 시작 &rarr;',
    subBtn: '5-4-3-2-1 관계 불안 그라운딩 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN 2D-BINDUNGSTEST-VORSCHAU',
    heading: 'Prüfen Sie Ihr Bindungsangst- vs. Vermeidungs-Profil',
    sub: 'Wählen Sie die Beziehungsmuster aus, die Sie in engen Partnerschaften an sich beobachten:',
    items: [
      '<strong>Verlassens-Wachsamkeit (Angst-Dimension):</strong> Wenn Antworten länger dauern oder der Tonfall wechselt, suchen Sie sofort nach Zeichen von Distanz.',
      '<strong>Nähe-Einengung (Vermeidungs-Dimension):</strong> Wenn jemand emotional stark klammert, verspüren Sie den Drang nach Rückzug und Autonomie.',
      '<strong>Nähe-Distanz-Ambivalenz (Desorganisiert):</strong> Sie sehnen sich nach tiefer Verbundenheit, rechnen aber gleichzeitig mit Verletzung oder Enttäuschung.',
      '<strong>Protest oder Rückzug bei Konflikten:</strong> Bei Spannungen suchen Sie entweder sofortige Bestätigung oder machen emotional komplett zu.'
    ],
    scoreUnit: 'von 4 unsicheren Bindungssignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre Bindungsdimensionen vorab zu prüfen.',
      'Überwiegend sichere Basis (1/4). Nur einzelne Stressauslöser aktivieren Ihr Bindungssystem.',
      'Aktive Bindungsdimension (2/4). Ängstliche oder vermeidende Schutzstrategien prägen Ihre Beziehungsdynamik.',
      'Hohe Bindungsaktivierung (3/4). Ihr Bindungssystem reagiert stark auf Nähe und Konflikte.',
      'Starkes Nähe-Distanz-Muster (4/4). Angst und Vermeidung wirken gleichzeitig—starten Sie jetzt den vollständigen Bindungstest.'
    ],
    primaryBtn: 'Zum kostenlosen 5-Minuten Bindungsstil-Test &rarr;',
    subBtn: '5-4-3-2-1 Grounding-Tool zur Beruhigung öffnen &rarr;'
  },
  es: {
    badge: 'EVALUACIÓN DE APEGO 2D EN 30 SEGUNDOS',
    heading: 'Descubre tu perfil de Ansiedad vs. Evitación en el Apego',
    sub: 'Marca los reflejos relacionales que notas con más frecuencia en pareja:',
    items: [
      '<strong>Hipervigilancia al abandono (Ansiedad):</strong> Si tardan en responder o cambia el tono, buscas de inmediato señales de desinterés.',
      '<strong>Asfixia ante la intimidad (Evitación):</strong> Cuando alguien depende mucho de ti, sientes el impulso de alejarte y recuperar tu espacio.',
      '<strong>Ambivalencia de acercamiento-huida (Desorganizado):</strong> Anhelas cercanía, pero cuando alguien se acerca de verdad, temes salir herido.',
      '<strong>Protesta o bloqueo en conflictos:</strong> Ante la tensión, exiges confirmación inmediata o te desconectas emocionalmente.'
    ],
    scoreUnit: 'de 4 señales de apego inseguro activas',
    verdicts: [
      'Marca los puntos arriba para previsualizar tus dimensiones de apego.',
      'Base mayormente segura (1/4). Solo ciertos disparadores puntuales activan tu alarma relacional.',
      'Dimensión de apego activa (2/4). Estrategias ansiosas o evitativas están moldeando tus vínculos.',
      'Alta activación relacional (3/4). Tu sistema de apego reacciona con fuerza ante la intimidad y el conflicto.',
      'Patrón intenso de tirón y empuje (4/4). Ansiedad y evitación operan a la vez—haz el test completo de estilo de apego ahora.'
    ],
    primaryBtn: 'Hacer el Test de Estilo de Apego Gratis &rarr;',
    subBtn: 'Abrir Herramienta de Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'APERÇU DU STYLE D\'ATTACHEMENT 2D EN 30 SECONDES',
    heading: 'Évaluez votre profil Anxiété vs Évitement relationnel',
    sub: 'Cochez les réflexes que vous observez le plus souvent dans vos relations proches :',
    items: [
      '<strong>Hypervigilance à l\'abandon (Anxiété) :</strong> Un message tardif ou un changement de ton déclenche une peur immédiate du rejet.',
      '<strong>Sensation d\'étouffement (Évitement) :</strong> Lorsqu\'un partenaire demande plus d\'engagement, vous ressentez le besoin de prendre vos distances.',
      '<strong>Ambivalence attraction-fuite (Désorganisé) :</strong> Vous désirez une proximité profonde tout en redoutant d\'être blessé dès qu\'elle s\'installe.',
      '<strong>Protestation ou fermeture en cas de conflit :</strong> Sous tension, vous cherchez à être rassuré immédiatement ou vous vous fermez émotionnellement.'
    ],
    scoreUnit: 'sur 4 signaux d\'attachement insécure actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour situer votre style d\'attachement.',
      'Base globalement sécure (1/4). Seuls certains stress ponctuels activent votre système d\'alarme.',
      'Dimension d\'attachement active (2/4). Des réflexes anxieux ou évitants influencent votre intimité.',
      'Forte réactivité relationnelle (3/4). Votre système d\'attachement s\'active fortement face à la proximité et aux conflits.',
      'Schéma intense d\'attraction-fuite (4/4). Anxiété et évitement coexistent—passez le test complet dès maintenant.'
    ],
    primaryBtn: 'Faire le Test de Style d\'Attachement &rarr;',
    subBtn: 'Ouvrir l\'Outil d\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・2次元愛着スタイル診断プレビュー',
    heading: 'あなたの「見捨てられ不安」vs「親密さ回避」バランスは？',
    sub: '恋愛や親密な関係で無意識に繰り返している反応をチェックしてください：',
    items: [
      '<strong>見捨てられ警戒（不安次元）：</strong> 返信が遅れたり相手のトーンが変わると、嫌われたのではないかとすぐに不安になる。',
      '<strong>親密さへの息苦しさ（回避次元）：</strong> 相手が感情的に頼ってきたり距離が縮まりすぎると、一人になって距離を置きたくなる。',
      '<strong>接近と回避の葛藤（恐れ・回避型）：</strong> 深く愛されたいのに、本当に近づかれると傷つくのが怖くて壁を作ってしまう。',
      '<strong>衝突時の試し行動またはシャットダウン：</strong> 気まずくなると執拗に愛情確認をするか、心を閉ざして会話をやめてしまう。'
    ],
    scoreUnit: '/ 4 個の不安定型愛着サインが該当',
    verdicts: [
      '上の項目をチェックして、あなたの愛着スタイル（不安×回避軸）を確認しましょう。',
      '比較的安定した愛着ベース（1/4）。強いストレス時のみ防衛反応が出ることがあります。',
      '愛着防衛パターンの活性化（2/4）。不安型または回避型の傾向が人間関係に影響しています。',
      '高い愛着アラーム反応（3/4）。親密さや 갈등の場面で神経系が強く反応しています。',
      '強い恐れ・回避（アンビバレント）傾向（4/4）。不安と回避が同時に働いています。今すぐ精密テストで詳細を確認してください。'
    ],
    primaryBtn: '無料・愛着スタイル精密テストを受ける &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングツールを開く &rarr;'
  },
  zh: {
    badge: '30秒二维依恋风格快速筛查',
    heading: '预览你的“依恋焦虑”与“亲密回避”维度',
    sub: '勾选你在亲密关系或恋爱中最常出现的无意识反应：',
    items: [
      '<strong>被抛弃警觉（焦虑维度）：</strong> 对方回复变慢或语气微变时，你会立刻揣测对方是否冷淡或想离开。',
      '<strong>亲密窒息感（回避维度）：</strong> 当伴侣在情感上高度依赖或要求更深承诺时，你会本能地想后退保留独立空间。',
      '<strong>推拉矛盾心理（恐惧-回避型）：</strong> 内心渴望深刻联结，但一旦关系真正走近，又因害怕受伤而筑起高墙。',
      '<strong>冲突中的抗议或情感关闭：</strong> 发生矛盾时，你要么迫切索取确认，要么瞬间冷漠、拒绝沟通。'
    ],
    scoreUnit: '/ 4 项不安全依恋信号激活',
    verdicts: [
      '勾选上方信号，快速定位你在依恋焦虑与回避坐标中的位置。',
      '较稳定的安全型基线 (1/4)。仅在特定压力下会出现轻微防御反应。',
      '明显的依恋防御维度 (2/4)。焦虑型或回避型策略正在影响你的亲密互动。',
      '高关系警报激活 (3/4)。你的依恋系统对亲密与冲突高度敏感，建议完成完整测评。',
      '强烈的推拉/恐惧-回避模式 (4/4)。焦虑与回避同时运作，立即进行5分钟依恋风格完整测试。'
    ],
    primaryBtn: '开始免费依恋风格完整测试 &rarr;',
    subBtn: '打开 5-4-3-2-1 感官着陆平静工具 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE APEGO 2D EM 30 SEGUNDOS',
    heading: 'Descubra seu perfil de Ansiedade vs. Evitação no Apego',
    sub: 'Marque os reflexos relacionais que você mais nota em relacionamentos próximos:',
    items: [
      '<strong>Vigilância ao abandono (Ansiedade):</strong> Quando a resposta demora ou o tom muda, você logo procura sinais de rejeição.',
      '<strong>Sufocamento na intimidade (Evitação):</strong> Quando alguém depende muito de você, surge o impulso de se afastar para preservar espaço.',
      '<strong>Ambivalência aproximar-afastar (Desorganizado):</strong> Você deseja conexão profunda, mas teme se machucar assim que alguém se aproxima de verdade.',
      '<strong>Protesto ou bloqueio em conflitos:</strong> Na tensão, você busca validação imediata ou se fecha emocionalmente.'
    ],
    scoreUnit: 'de 4 sinais de apego inseguro ativos',
    verdicts: [
      'Marque os itens acima para visualizar suas dimensões de apego.',
      'Base predominantemente segura (1/4). Apenas gatilhos pontuais ativam seu alerta relacional.',
      'Dimensão de apego ativa (2/4). Estratégias ansiosas ou evitativas estão moldando seus vínculos.',
      'Alta ativação relacional (3/4). Seu sistema de apego reage intensamente à proximidade e ao conflito.',
      'Forte padrão de aproximação e fuga (4/4). Ansiedade e evitação atuam juntas—faça o Teste de Estilo de Apego completo agora.'
    ],
    primaryBtn: 'Fazer o Teste de Estilo de Apego Gratuito &rarr;',
    subBtn: 'Abrir Ferramenta de Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ 2D-СКРИНИНГ ТИПА ПРИВЯЗАННОСТИ',
    heading: 'Оцените свой профиль: Тревожность против Избегания',
    sub: 'Отметьте реакции, которые чаще всего проявляются у вас в близких отношениях:',
    items: [
      '<strong>Страх отвержения (Шкала тревожности):</strong> Если партнер долго не отвечает или меняет тон, вы сразу ищете признаки охлаждения.',
      '<strong>Удушье от близости (Шкала избегания):</strong> Когда партнер требует большей эмоциональной вовлеченности, вам хочется дистанцироваться.',
      '<strong>Амбивалентность «тяни-толкай» (Дезорганизованный тип):</strong> Вы жаждете близости, но как только она возникает, ждете боли или предательства.',
      '<strong>Протест или закрытие в конфликтах:</strong> В ссоре вы либо требуете немедленных заверений в любви, либо эмоционально отключаетесь.'
    ],
    scoreUnit: 'из 4 сигналов ненадежной привязанности активно',
    verdicts: [
      'Отметьте пункты выше, чтобы определить координаты вашего типа привязанности.',
      'Преимущественно надежная база (1/4). Защитные реакции включаются только при сильном стрессе.',
      'Активная защитная стратегия (2/4). Тревожные или избегающие паттерны заметно влияют на ваши отношения.',
      'Высокая реактивность привязанности (3/4). Ваша нервная система остро реагирует на сближение и дистанцию.',
      'Выраженный дезорганизованный паттерн (4/4). Тревога и избегание работают одновременно — пройдите полный тест прямо сейчас.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности &rarr;',
    subBtn: 'Открыть практику заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING GAYA KELEKATAN 2D DALAM 30 DETIK',
    heading: 'Cek Profil Kecemasan vs Penghindaran Kelekatan Anda',
    sub: 'Centang pola reaksi yang paling sering muncul dalam hubungan dekat Anda:',
    items: [
      '<strong>Waspada Pengabaian (Dimensi Cemas):</strong> Saat balasan pesan melambat atau nada berubah, Anda langsung mencari tanda penolakan.',
      '<strong>Sesak karena Keintiman (Dimensi Menghindar):</strong> Saat pasangan terlalu bergantung secara emosional, Anda ingin menarik diri demi ruang pribadi.',
      '<strong>Ambivalensi Tarik-Ulur (Disorganized):</strong> Anda sangat merindukan kedekatan, namun takut terluka begitu seseorang benar-benar dekat.',
      '<strong>Protes atau Membeku Saat Konflik:</strong> Saat tegang, Anda menuntut kepastian segera atau justru menutup diri secara emosional.'
    ],
    scoreUnit: 'dari 4 sinyal kelekatan tidak aman aktif',
    verdicts: [
      'Centang poin di atas untuk melihat pratinjau dimensi gaya kelekatan Anda.',
      'Basis Cenderung Aman (1/4). Hanya pemicu stres tertentu yang mengaktifkan alarm relasional Anda.',
      'Dimensi Kelekatan Aktif (2/4). Strategi cemas atau menghindar sedang memengaruhi pola hubungan Anda.',
      'Aktivasi Relasional Tinggi (3/4). Sistem kelekatan Anda bereaksi kuat terhadap keintiman dan konflik.',
      'Pola Tarik-Ulur Kuat (4/4). Kecemasan dan penghindaran aktif bersamaan—ikuti Tes Gaya Kelekatan lengkap sekarang.'
    ],
    primaryBtn: 'Ikuti Tes Gaya Kelekatan Gratis &rarr;',
    subBtn: 'Buka Alat Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK 2B BAĞLANMA STİLİ TARAMASI',
    heading: 'Bağlanma Kaygısı ve Kaçınma Profilinizi Önizleyin',
    sub: 'Yakın ilişkilerde en sık fark ettiğiniz duygusal refleksleri işaretleyin:',
    items: [
      '<strong>Terk Edilme Tetiklenmesi (Kaygı Boyutu):</strong> Mesajlar geciktiğinde veya ses tonu değiştiğinde zihniniz hemen soğuma işaretleri arar.',
      '<strong>Yakınlık Boğulması (Kaçınma Boyutu):</strong> Biri duygusal olarak fazla yaklaştığında alanınızı korumak için geri çekilme冲动 hissedersiniz.',
      '<strong>İtme-Çekme İkilemi (Korkulu-Kaçınmacı):</strong> Derin yakınlık arzularken, biri gerçekten yaklaştığında incinme korkusuyla duvar örersiniz.',
      '<strong>Çatışmada Protesto veya Kapanma:</strong> Gerginlik anında ya anında güvence ararsınız ya da duygusal olarak tamamen kapanırsınız.'
    ],
    scoreUnit: '/ 4 güvensiz bağlanma sinyali aktif',
    verdicts: [
      'Bağlanma kaygısı ve kaçınma boyutlarınızı görmek için yukarıdaki maddeleri işaretleyin.',
      'Çoğunlukla Güvenli Temel (1/4). Yalnızca belirli stres anları bağlanma alarmınızı tetikliyor.',
      'Aktif Bağlanma Savunması (2/4). Kaygılı veya kaçınmacı stratejiler ilişki dinamiklerinizi şekillendiriyor.',
      'Yüksek İlişkisel Aktivasyon (3/4). Bağlanma sisteminiz yakınlık ve çatışmaya güçlü tepki veriyor.',
      'Güçlü İtme-Çekme Döngüsü (4/4). Kaygı ve kaçınma aynı anda aktif—şimdi tam Bağlanma Stili Testini çözün.'
    ],
    primaryBtn: 'Ücretsiz Bağlanma Stili Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड 2D अटैचमेंट स्टाइल स्क्रीनर',
    heading: 'अपनी अटैचमेंट एंग्जायटी बनाम अवॉइडेंस प्रोफाइल जांचें',
    sub: 'करीबी रिश्तों में सबसे अधिक महसूस होने वाले पैटर्न को चुनें:',
    items: [
      '<strong>त्यागे जाने की सतर्कता (चिंता आयाम):</strong> जब पार्टनर का रिप्लाई देर से आता है या टोन बदलता है, तो आप तुरंत अस्वीकृति के संकेत ढूंढने लगते हैं।',
      '<strong>करीबी से घुटन (बचाव आयाम):</strong> जब कोई भावनात्मक रूप से बहुत अधिक निर्भर होता है, तो आपको स्पेस के लिए पीछे हटने की इच्छा होती है।',
      '<strong>पुश-पुल द्वंद्व (भयभीत-अवॉइडेंट):</strong> आप गहरी नजदीकी चाहते हैं, लेकिन जैसे ही कोई करीब आता है, दिल टूटने का डर सक्रिय हो जाता है।',
      '<strong>तनाव में आश्वासन मांगना या सुन्न पड़ना:</strong> झगड़े के दौरान आप या तो तुरंत तसल्ली मांगते हैं या पूरी तरह खामोश हो जाते हैं।'
    ],
    scoreUnit: '/ 4 असुरक्षित अटैचमेंट संकेत सक्रिय',
    verdicts: [
      'अपनी अटैचमेंट शैली का पूर्वावलोकन करने के लिए ऊपर दिए गए विकल्पों को चुनें।',
      'अधिकतर सुरक्षित आधार (1/4)। केवल विशेष तनाव ही आपके रिलेशनशिप अलार्म को ट्रिगर करता है।',
      'सक्रिय अटैचमेंट डिफेंस (2/4)। चिंतित या अवॉइडेंट पैटर्न आपके रिश्तों को प्रभावित कर रहे हैं।',
      'उच्च रिलेशनशिप सक्रियता (3/4)। आपका नर्वस सिस्टम नजदीकी और संघर्ष दोनों पर तीव्र प्रतिक्रिया देता है।',
      'तीव्र पुश-पुल पैटर्न (4/4)। चिंता और बचाव दोनों एक साथ सक्रिय हैं—अभी पूरा अटैचमेंट स्टाइल टेस्ट लें।'
    ],
    primaryBtn: 'मुफ्त अटैचमेंट स्टाइल टेस्ट शुरू करें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग टूल खोलें &rarr;'
  }
};

const FAWN_GUIDE_LOCALES = {
  en: {
    badge: '30-SECOND FAWN & PEOPLE-PLEASING TRIAGE',
    heading: 'Is Your Kindness Actually a Fawn Trauma Response?',
    sub: 'Check the approval and boundary patterns that happen automatically in your body:',
    items: [
      '<strong>Reflexive "Yes" &amp; Delayed Resentment:</strong> You agree to requests before checking your own capacity, then feel drained or quietly resentful later.',
      '<strong>Emotional Barometer Scanning:</strong> You immediately sense changes in someone\'s sigh, posture, or mood and feel responsible for fixing it.',
      '<strong>Somatic Guilt When Setting Boundaries:</strong> Even considering saying "no" triggers chest tightness, stomach drop, or an urgent need to over-explain.',
      '<strong>Self-Erasure to Prevent Conflict:</strong> When tension rises, you instinctively soften your opinions or apologize first just to restore safety.'
    ],
    scoreUnit: 'of 4 fawn response signals active',
    verdicts: [
      'Check the signals above to distinguish healthy empathy from a nervous-system fawn response.',
      'Mild Approval Sensitivity (1/4). You value harmony, though practicing micro-boundaries will protect your energy.',
      'Moderate Fawn Pattern (2/4). Your nervous system treats others\' disappointment as a threat signal.',
      'High Fawn Survival Activation (3/4). Compulsive appeasement is draining your cognitive and emotional bandwidth.',
      'Severe Fawn & Boundary Collapse (4/4). Chronic self-abandonment is overloading your stress system—check your burnout differential now.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Fawn Load Check &rarr;',
    subBtn: 'Run the People-Pleasing Burnout Differential Tool &rarr;'
  },
  ko: {
    badge: '30초 영합(Fawn) 반응 & 착한아이 증후군 판별기',
    heading: '나의 친절함은 배려일까, 생존형 영합(Fawn) 반응일까?',
    sub: '갈등이나 거절 상황에서 몸과 마음이 자동으로 반응하는 패턴을 체크해보세요:',
    items: [
      '<strong>자동 반사적 수락과 뒤늦은 억울함:</strong> 내 여유를 확인하기도 전에 일단 "네"라고 답하고, 나중에 지치거나 속으로 억울해합니다.',
      '<strong>타인의 기분 레이더 가동:</strong> 상대방의 한숨, 표정, 말투 변화를 즉시 감지하고 내가 분위기를 풀어야 한다고 느낍니다.',
      '<strong>거절 시 신체적 죄책감과 과잉 해명:</strong> "아니오"라고 말하는 상상만 해도 가슴이 답답해지고 구구절절 변명을 덧붙이게 됩니다.',
      '<strong>갈등 회피를 위한 자기 지우기:</strong> 분위기가 싸해지면 내 의견이나 감정을 즉시 접고 먼저 사과해 평화를 맞바꿉니다.'
    ],
    scoreUnit: '개 영합(Fawn) 트라우마 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 건강한 배려와 신경계 영합(Fawn) 반응을 구별해보세요.',
      '경미한 눈치 및 조화 추구(1/4). 작은 거절 연습만으로도 에너지 소모를 크게 줄일 수 있습니다.',
      '중등도 영합 반응 패턴(2/4). 타인의 실망을 신경계가 위협 신호로 인식하고 있습니다.',
      '높은 생존형 영합 고착(3/4). 타인의 기분을 맞추느라 정작 내 자율신경계와 감정 에너지가 고갈되고 있습니다.',
      '심각한 경계 붕괴 및 자기 소진(4/4). 만성적인 자기 포기가 번아웃을 유발하고 있습니다. 지금 스트레스 및 번아웃 감별 진단을 시작하세요.'
    ],
    primaryBtn: '무료 스트레스 &amp; 신경계 과부하 체크하기 &rarr;',
    subBtn: '감정 소진 vs 번아웃 감별 진단 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN FAWN-RESPONSE & PEOPLE-PLEASING-CHECK',
    heading: 'Ist Ihre Hilfsbereitschaft eine Fawn-Traumareaktion?',
    sub: 'Wählen Sie die Muster aus, die in Ihrem Körper automatisch ablaufen:',
    items: [
      '<strong>Reflexartiges „Ja“ &amp; späterer Groll:</strong> Sie stimmen Bitten sofort zu und fühlen sich danach ausgelaugt oder innerlich verärgert.',
      '<strong>Stimmungs-Radar im Raum:</strong> Sie registrieren jedes Seufzen oder Stirnrunzeln sofort und fühlen sich für die Harmonie verantwortlich.',
      '<strong>Körperliche Schuldgefühle beim Nein-Sagen:</strong> Schon der Gedanke an eine Absage löst Enge in der Brust oder Rechtfertigungsdruck aus.',
      '<strong>Selbstaufgabe bei Konflikten:</strong> Um Ärger zu vermeiden, nehmen Sie eigene Bedürfnisse zurück oder entschuldigen sich vorschnell.'
    ],
    scoreUnit: 'von 4 Fawn-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um gesunde Empathie von einer Fawn-Reaktion zu unterscheiden.',
      'Leichte Harmoniebedürftigkeit (1/4). Kleine Mikro-Grenzen schützen Ihre tägliche Energie.',
      'Mittleres Fawn-Muster (2/4). Ihr Nervensystem bewertet Enttäuschung anderer als Gefahr.',
      'Hohe Fawn-Aktivierung (3/4). Zwanghaftes Anpassen zehrt stark an Ihrer mentalen Kapazität.',
      'Schwere Grenzauflösung (4/4). Chronische Selbstaufgabe führt in den Burnout—prüfen Sie jetzt Ihr Stressprofil.'
    ],
    primaryBtn: 'Zum 3-Minuten Stress- &amp; Nervensystem-Check &rarr;',
    subBtn: 'Stress- vs. Burnout-Differential-Tool öffnen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE RESPUESTA FAWN Y COMPLACENCIA EN 30 SEGUNDOS',
    heading: '¿Tu amabilidad es empatía o una respuesta traumática Fawn?',
    sub: 'Marca las reacciones automáticas que experimentas ante posibles desacuerdos:',
    items: [
      '<strong>"Sí" automático y resentimiento posterior:</strong> Aceptas favores sin medir tu energía y luego te sientes agotado o frustrado.',
      '<strong>Radar emocional constante:</strong> Detectas al instante cualquier cambio de humor ajeno y sientes que debes arreglarlo.',
      '<strong>Culpa física al poner límites:</strong> Solo pensar en decir "no" te genera opresión en el pecho o necesidad de justificarte de más.',
      '<strong>Autoanulación ante el conflicto:</strong> Para evitar que alguien se moleste, callas tus necesidades o pides perdón primero.'
    ],
    scoreUnit: 'de 4 señales de respuesta Fawn activas',
    verdicts: [
      'Marca las señales arriba para distinguir la empatía sana de una respuesta de supervivencia Fawn.',
      'Sensibilidad leve a la aprobación (1/4). Practicar micro-límites protegerá tu bienestar.',
      'Patrón Fawn moderado (2/4). Tu sistema nervioso interpreta la decepción ajena como peligro.',
      'Alta activación de apaciguamiento (3/4). Complacer compulsivamente está drenando tu energía vital.',
      'Colapso severo de límites (4/4). El autoabandono crónico sobrecarga tu cuerpo—evalúa tu diferencial de burnout ahora.'
    ],
    primaryBtn: 'Hacer el Chequeo de Estrés en 3 Minutos &rarr;',
    subBtn: 'Abrir Diferencial de Estrés vs. Burnout &rarr;'
  },
  fr: {
    badge: 'TRIAGE RÉPONSE FAWN & SUR-ADAPTATION EN 30 SECONDES',
    heading: 'Votre gentillesse est-elle une réponse traumatique Fawn ?',
    sub: 'Cochez les réactions automatiques que vous observez face aux demandes des autres :',
    items: [
      '<strong>« Oui » réflexe et ressentiment différé :</strong> Vous acceptez avant d\'évaluer votre fatigue, puis vous vous sentez vidé ou amer.',
      '<strong>Radar émotionnel permanent :</strong> Vous captez la moindre tension chez autrui et vous sentez obligé d\'apaiser l\'atmosphère.',
      '<strong>Culpabilité somatique face au « non » :</strong> Poser une limite déclenche une boule au ventre ou un besoin de trop vous justifier.',
      '<strong>Effacement de soi en cas de conflit :</strong> Pour éviter la désapprobation, vous taisez vos besoins ou présentez des excuses réflexes.'
    ],
    scoreUnit: 'sur 4 signaux de réponse Fawn actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour différencier l\'empathie saine du réflexe Fawn.',
      'Sensibilité légère à l\'approbation (1/4). Des micro-limites suffiront à préserver votre énergie.',
      'Schéma Fawn modéré (2/4). Votre système nerveux perçoit la déception d\'autrui comme une menace.',
      'Forte sur-adaptation de survie (3/4). L\'apaisement compulsif épuise vos ressources mentales.',
      'Effondrement sévère des limites (4/4). L\'oubli de soi chronique mène à l\'épuisement—évaluez votre charge dès maintenant.'
    ],
    primaryBtn: 'Faire le Bilan de Stress en 3 Minutes &rarr;',
    subBtn: 'Ouvrir l\'Outil Différentiel Stress vs Burnout &rarr;'
  },
  ja: {
    badge: '30秒・フォーン（迎合）反応＆過剰適応チェック',
    heading: 'その優しさは共感？それとも「フォーン（迎合）」防衛反応？',
    sub: '人間関係で無意識に働いている自己犠牲パターンをチェックしてください：',
    items: [
      '<strong>反射的な「イエス」と後のモヤモヤ：</strong> 自分の余裕を確かめる前に引き受け、後でぐったり疲れたり不満を抱える。',
      '<strong>過剰な機嫌センサー：</strong> 相手のため息や表情の曇りを瞬時に察知し、自分がフォローしなければと焦る。',
      '<strong>断る時の身体的な罪悪感：</strong> 「NO」と言おうとすると胸が苦しくなり、過剰に言い訳や謝罪を重ねてしまう。',
      '<strong>衝突回避のための自己消去：</strong> 空気が悪くなるのを防ぐため、自分の本音を飲み込んで真っ先に謝ってしまう。'
    ],
    scoreUnit: '/ 4 個のフォーン（迎合）反応サインが該当',
    verdicts: [
      '上の項目をチェックして、健全な思いやりと神経系の迎合反応を見分けましょう。',
      '軽度の調和志向（1/4）。小さな場面で自分の希望を伝える練習でエネルギーを守れます。',
      '中程度のフォーン傾向（2/4）。他人の失望を、脳が「安全への脅威」として処理しています。',
      '高い迎合サバイバル反応（3/4）。過剰適応によって自律神経と心のバッテリーが消耗しています。',
      '深刻な境界線の崩壊（4/4）。慢性的な自己犠牲が燃え尽きを引き起こしています。今すぐストレス＆バーンアウト診断を行ってください。'
    ],
    primaryBtn: '3分間の無料ストレス＆神経系チェック &rarr;',
    subBtn: 'ストレス vs 燃え尽き症候群・鑑別ツールを開く &rarr;'
  },
  zh: {
    badge: '30秒讨好型（Fawn）创伤反应筛查',
    heading: '你的善良是共情，还是神经系统的“讨好（Fawn）”防御？',
    sub: '勾选你在面对他人请求或潜在冲突时的本能身体反应：',
    items: [
      '<strong>反射性答应与事后委屈：</strong> 还没评估自己的精力就脱口说出“好”，事后却感到精疲力竭或暗自憋屈。',
      '<strong>全天候情绪雷达：</strong> 瞬间捕捉房间里任何人的叹气、脸色或语气变化，并觉得有责任去安抚气氛。',
      '<strong>拒绝时的躯体化内疚：</strong> 哪怕只是想要说“不”，也会立刻胸口发紧、心跳加速，并拼命找理由解释。',
      '<strong>冲突中的自我抹除：</strong> 为了平息他人的不满或愤怒，本能地压抑真实需求、放弃底线甚至抢先道歉。'
    ],
    scoreUnit: '/ 4 项讨好（Fawn）防御信号激活',
    verdicts: [
      '勾选上方信号，区分健康的温和共情与创伤性讨好（Fawn）反应。',
      '轻度认可敏感 (1/4)。练习在低风险小事上表达真实偏好即可保护能量。',
      '中度讨好反应模式 (2/4)。你的杏仁核正将他人的失望识别为生存威胁。',
      '高度顺从防御激活 (3/4)。强迫性迎合正在持续透支你的前额叶与情绪带宽。',
      '严重的边界崩塌与自我耗竭 (4/4)。长期自我放弃正将你推向倦怠，建议立即测算压力与倦怠鉴别指数。'
    ],
    primaryBtn: '开始3分钟免费压力与神经负荷测试 &rarr;',
    subBtn: '打开讨好型耗竭 vs 压力鉴别工具 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE RESPOSTA FAWN E AGRADAR DEMAIS EM 30 SEGUNDOS',
    heading: 'Sua gentileza é empatia ou uma resposta ao trauma (Fawn)?',
    sub: 'Marque os padrões automáticos que surgem quando você precisa impor limites:',
    items: [
      '<strong>"Sim" automático e ressentimento depois:</strong> Você aceita pedidos no impulso e depois se sente esgotado ou frustrado.',
      '<strong>Radar emocional constante:</strong> Você percebe qualquer mudança de humor no ambiente e sente que precisa consertar o clima.',
      '<strong>Culpa física ao dizer "não":</strong> Só pensar em recusar algo causa aperto no peito e necessidade de dar muitas explicações.',
      '<strong>Autoapagamento em conflitos:</strong> Para evitar desaprovação, você engole suas opiniões ou pede desculpas mesmo sem ter culpa.'
    ],
    scoreUnit: 'de 4 sinais de resposta Fawn ativos',
    verdicts: [
      'Marque os itens acima para diferenciar empatia saudável de submissão traumática (Fawn).',
      'Sensibilidade leve à aprovação (1/4). Praticar micro-limites preservará sua energia.',
      'Padrão Fawn moderado (2/4). Seu sistema nervioso trata a decepção alheia como ameaça.',
      'Alta ativação de apaziguamento (3/4). Agradar compulsivamente está drenando sua saúde emocional.',
      'Colapso severo de limites (4/4). O autoabandono crônico gera esgotamento—avalie seu diferencial de burnout agora.'
    ],
    primaryBtn: 'Fazer o Check-up de Estresse em 3 Minutos &rarr;',
    subBtn: 'Abrir Ferramenta Diferencial Estresse vs. Burnout &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА FAWN-РЕАКЦИЮ (УГОЖДЕНИЕ)',
    heading: 'Ваша доброта — это эмпатия или травматическая реакция Fawn?',
    sub: 'Отметьте автоматические телесные и эмоциональные реакции на чужие просьбы:',
    items: [
      '<strong>Автоматическое «Да» и скрытая обида:</strong> Вы соглашаетесь помочь в ущерб себе, а затем чувствуете истощение и раздражение.',
      '<strong>Эмоциональный радар:</strong> Вы мгновенно считываете малейшее недовольство окружающих и берете на себя ответственность за их настроение.',
      '<strong>Телесная вина при отказе:</strong> Даже мысль о слове «нет» вызывает сжатие в груди, тревогу и поток оправданий.',
      '<strong>Стирание себя ради мира:</strong> При намеке на конфликт вы отказываетесь от своего мнения и извиняетесь первыми.'
    ],
    scoreUnit: 'из 4 сигналов Fawn-реакции активно',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить здоровую доброту от защитной реакции угождения.',
      'Легкая чувствительность к одобрению (1/4). Практика микро-границ поможет сохранить ресурс.',
      'Умеренный паттерн угождения (2/4). Ваша нервная система воспринимает чужое разочарование как угрозу.',
      'Высокая активация Fawn-защиты (3/4). Компульсивное умиротворение других истощает вашу психику.',
      'Критический распад личных границ (4/4). Хронический отказ от себя ведет к выгоранию — проверьте свой уровень стресса сейчас.'
    ],
    primaryBtn: 'Пройти 3-минутную проверку уровня стресса &rarr;',
    subBtn: 'Открыть дифференциал Стресс vs Выгорание &rarr;'
  },
  id: {
    badge: 'SKRINING RESPONS FAWN & PEOPLE PLEASING 30 DETIK',
    heading: 'Apakah Kebaikan Anda Empati atau Respons Trauma Fawn?',
    sub: 'Centang pola otomatis yang muncul saat Anda menghadapi permintaan atau potensi konflik:',
    items: [
      '<strong>Refleks Berkata "Ya" &amp; Menyesal Kemudian:</strong> Anda langsung menyanggupi permintaan orang lain lalu merasa terkuras atau kesal sendiri.',
      '<strong>Radar Suasana Hati:</strong> Anda langsung peka terhadap helaan napas atau perubahan wajah orang lain dan merasa wajib memperbaikinya.',
      '<strong>Rasa Bersalah Fisik Saat Menolak:</strong> Sekadar ingin berkata "tidak" sudah memicu dada sesak dan dorongan memberi banyak alasan.',
      '<strong>Menghapus Diri Demi Hindari Konflik:</strong> Agar orang lain tidak marah, Anda menekan kebutuhan sendiri atau meminta maaf lebih dulu.'
    ],
    scoreUnit: 'dari 4 sinyal respons Fawn aktif',
    verdicts: [
      'Centang poin di atas untuk membedakan empati sehat dari respons bertahan hidup Fawn.',
      'Sensitivitas Persetujuan Ringan (1/4). Latihan batasan kecil akan menjaga energi harian Anda.',
      'Pola Fawn Sedang (2/4). Sistem saraf Anda membaca kekecewaan orang lain sebagai ancaman.',
      'Aktivasi Fawn Tinggi (3/4). Kebiasaan menyenangkan semua orang sedang menguras kapasitas mental Anda.',
      'Runtuhnya Batasan Diri (4/4). Pengabaian diri kronis memicu burnout—cek diferensial stres vs burnout Anda sekarang.'
    ],
    primaryBtn: 'Cek Beban Stres &amp; Sistem Saraf (3 Menit) &rarr;',
    subBtn: 'Buka Alat Diferensial Stres vs Burnout &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK FAWN (MEMNUN ETME) TEPKİSİ TARAMASI',
    heading: 'Nezaketiniz Empati mi Yoksa Fawn Travma Tepkisi mi?',
    sub: 'Hayır demeniz gerektiğinde bedeninizde otomatik gelişen tepkileri işaretleyin:',
    items: [
      '<strong>Refleks "Evet" ve Sonradan Gelen Öfke:</strong> Kendi enerjinizi düşünmeden kabul ediyor, sonra tükenmiş ve kırgın hissediyorsunuz.',
      '<strong>Duygusal Barometre Taraması:</strong> Ortamdaki en ufak yüz ifadesi veya ses değişimini anında sezerek düzeltme sorumluluğu alıyorsunuz.',
      '<strong>Sınır Koyarken Bedensel Suçluluk:</strong> "Hayır" demeyi düşünmek bile göğüste sıkışma ve aşırı açıklama yapma ihtiyacı doğuruyor.',
      '<strong>Çatışmadan Kaçmak İçin Kendini Silme:</strong> Karşı tarafın öfkesini önlemek için kendi ihtiyaçlarınızı bastırıp ilk özür dileyen oluyorsunuz.'
    ],
    scoreUnit: '/ 4 Fawn tepkisi sinyali aktif',
    verdicts: [
      'Sağlıklı nezaket ile sinir sistemi Fawn tepkisini ayırt etmek için yukarıdakileri işaretleyin.',
      'Hafif Onay Hassasiyeti (1/4). Küçük mikro-sınırlar enerjinizi korumanıza yardımcı olacaktır.',
      'Orta Düzey Fawn Modeli (2/4). Sinir sisteminiz başkalarının hayal kırıklığını tehdit olarak algılıyor.',
      'Yüksek Yatıştırma Aktivasyonu (3/4). Sürekli başkalarını memnun etmek zihinsel kapasitenizi tüketiyor.',
      'Ciddi Sınır Çöküşü (4/4). Kronik kendini ihmal tükenmişliğe yol açıyor—stres ve tükenmişlik farkınızı hemen ölçün.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Sinir Sistemi Testini Çöz &rarr;',
    subBtn: 'Stres vs Tükenmişlik Ayırıcı Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड फ़ॉन (Fawn) और पीपल-प्लीजिंग स्क्रीनर',
    heading: 'क्या आपकी विनम्रता सहानुभूति है या फ़ॉन (Fawn) ट्रॉमा रिस्पॉन्स?',
    sub: 'दूसरों की उम्मीदों या संभावित टकराव के समय होने वाली स्वचालित प्रतिक्रियाओं को चुनें:',
    items: [
      '<strong>तुरंत "हाँ" कहना और बाद में पछताना:</strong> अपनी क्षमता देखे बिना आप अनुरोध स्वीकार कर लेते हैं और बाद में थका हुआ या भीतर से नाराज़ महसूस करते हैं।',
      '<strong>मूड रडार की तरह काम करना:</strong> कमरे में किसी के भी चेहरे के तनाव या आह को तुरंत भांपकर उसे ठीक करने की जिम्मेदारी महसूस करना।',
      '<strong>"ना" कहने पर शारीरिक अपराधबोध:</strong> सीमाएं तय करने के विचार मात्र से सीने में जकड़न और लंबी सफाई देने की मजबूरी महसूस होना।',
      '<strong>विवाद टालने के लिए खुद को मिटाना:</strong> सामने वाले की नाराज़गी से बचने के लिए अपनी ज़रूरतें दबा देना या बिना गलती के पहले माफ़ी मांगना।'
    ],
    scoreUnit: '/ 4 फ़ॉन रिस्पॉन्स संकेत सक्रिय',
    verdicts: [
      'स्वस्थ सहानुभूति और फ़ॉन ट्रॉमा रिस्पॉन्स में अंतर जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'हल्की स्वीकृति संवेदनशीलता (1/4)। छोटी सीमाओं का अभ्यास आपकी ऊर्जा को सुरक्षित रखेगा।',
      'मध्यम फ़ॉन पैटर्न (2/4)। आपका नर्वस सिस्टम दूसरों की निराशा को खतरे के रूप में देखता है।',
      'उच्च फ़ॉन सर्वाइवल एक्टिवेशन (3/4)। सबको खुश रखने की आदत आपकी मानसिक ऊर्जा को खत्म कर रही है।',
      'गंभीर बाउंड्री कोलैप्स (4/4)। खुद को लगातार नज़रअंदाज़ करना बर्नआउट पैदा कर रहा है—अपना स्ट्रेस और बर्नआउट अंतर अभी जांचें।'
    ],
    primaryBtn: '3-मिनट का मुफ्त स्ट्रेस चेक शुरू करें &rarr;',
    subBtn: 'स्ट्रेस बनाम बर्नआउट डिफरेंशियल टूल खोलें &rarr;'
  }
};

const ABANDONMENT_LOCALES = {
  en: {
    badge: '30-SECOND ABANDONMENT SCHEMA SCREENER',
    heading: 'Is an Unhealed Abandonment Wound Running Your Relationships?',
    sub: 'Check the separation alarms and protective behaviors that feel most familiar:',
    items: [
      '<strong>Separation Panic &amp; Silence Alarm:</strong> Delayed texts, canceled plans, or minor emotional distance trigger a physical wave of dread.',
      '<strong>Self-Abandonment to Keep Connection:</strong> You silence your needs or tolerate painful dynamics because losing the person feels worse than staying hurt.',
      '<strong>Preemptive Sabotage or Loyalty Testing:</strong> When things go well, you unconsciously test your partner or pull away first before they can leave you.',
      '<strong>Core Unworthiness Fear:</strong> Deep down you worry that once someone sees your real flaws or needs, they will inevitably walk away.'
    ],
    scoreUnit: 'of 4 abandonment schema signals active',
    verdicts: [
      'Check the signals above to assess how strongly abandonment schemas affect your nervous system.',
      'Mild Separation Sensitivity (1/4). Normal attachment care and clear communication keep you grounded.',
      'Moderate Abandonment Schema (2/4). Past relational losses are amplifying present-day relationship uncertainty.',
      'High Abandonment Alarm Activation (3/4). Your amygdala treats minor distance as an attachment emergency.',
      'Deep Core Abandonment Wound (4/4). Your nervous system is trapped in approach-avoidance panic—map your attachment style and ground your body now.'
    ],
    primaryBtn: 'Discover Your Attachment Style Profile &rarr;',
    subBtn: 'Calm Separation Panic with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 유기 불안(Abandonment Schema) 자가 스크리너',
    heading: '내 연애와 인간관계를 지배하는 건 "버림받을지 모른다"는 상처일까?',
    sub: '관계에서 거리감이 느껴질 때 나타나는 신체·감정 경보 신호를 체크해보세요:',
    items: [
      '<strong>연락 공백과 거리감에 대한 공황:</strong> 답장이 늦어지거나 약속이 취소되면 가슴이 철렁 내려앉고 버림받았다는 공포가 밀려옵니다.',
      '<strong>관계를 지키기 위한 자기 포기:</strong> 상대가 떠나는 것이 너무 두려워 부당한 대우를 참거나 내 진짜 욕구를 숨깁니다.',
      '<strong>선제적 손절 또는 애정 테스트:</strong> 관계가 평화로울 때 오히려 상대의 사랑을 시험하거나, 상처받기 전에 내가 먼저 밀어냅니다.',
      '<strong>근원적 무가치감 두려움:</strong> 상대가 내 진짜 모습과 약점을 알게 되면 결국 실망하고 떠날 것이라는 불안이 늘 깔려 있습니다.'
    ],
    scoreUnit: '개 유기 도식(Abandonment Schema) 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내면의 유기 불안 도식이 얼마나 활성화되어 있는지 확인해보세요.',
      '경미한 분리 민감성(1/4). 솔직한 의사소통과 자기 돌봄으로 충분히 안정감을 유지할 수 있습니다.',
      '중등도 유기 도식 활성화(2/4). 과거의 상실 경험이 현재 관계의 작은 불확실성을 증폭시키고 있습니다.',
      '높은 유기 경보 반응(3/4). 편도체가 사소한 거리감도 생존 위협처럼 처리하고 있습니다.',
      '깊은 핵심 유기 상처 활성화(4/4). 집착과 밀어내기가 반복되어 신경계가 지쳐 있습니다. 지금 애착 유형 진단과 그라운딩을 시작하세요.'
    ],
    primaryBtn: '무료 애착 유형 &amp; 유기 불안 정밀 테스트 &rarr;',
    subBtn: '5-4-3-2-1 분리 불안 진정 그라운딩 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN VERLASSENSANGST-SCHEMA-CHECK',
    heading: 'Steuert eine alte Verlassenswunde Ihre heutigen Beziehungen?',
    sub: 'Wählen Sie die Trennungsalarme und Schutzmuster aus, die Sie wiedererkennen:',
    items: [
      '<strong>Panik bei Funkstille:</strong> Verspätete Nachrichten, abgesagte Treffen oder kleine Distanz lösen körperliche Angstwellen aus.',
      '<strong>Selbstaufgabe aus Verlustangst:</strong> Sie schlucken eigene Bedürfnisse herunter, weil das Verlassenwerden schlimmer wirkt als eine ungesunde Dynamik.',
      '<strong>Präventive Sabotage oder Beziehungstests:</strong> Wenn es gut läuft, testen Sie Ihren Partner unbewusst oder ziehen sich zuerst zurück.',
      '<strong>Tiefe Unzulänglichkeitsangst:</strong> Innerlich fürchten Sie, dass andere gehen, sobald sie Ihre wahren Schwächen erkennen.'
    ],
    scoreUnit: 'von 4 Verlassens-Schemata aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre Verlassensangst-Aktivierung zu prüfen.',
      'Leichte Trennungssensibilität (1/4). Offene Kommunikation hält Ihr Bindungssystem stabil.',
      'Mittleres Verlassens-Schema (2/4). Frühere Verluste verstärken heutige Beziehungsunsicherheiten.',
      'Hoher Trennungsalarm (3/4). Ihre Amygdala reagiert auf kleine Distanz wie auf einen Notfall.',
      'Tiefe Kernwunde Verlassenwerden (4/4). Ihr Nervensystem steckt im Alarmmodus—prüfen Sie jetzt Ihren Bindungsstil.'
    ],
    primaryBtn: 'Jetzt Bindungsstil-Profil kostenlos testen &rarr;',
    subBtn: '5-4-3-2-1 Grounding gegen Verlustpanik starten &rarr;'
  },
  es: {
    badge: 'EVALUACIÓN DE HERIDA DE ABANDONO EN 30 SEGUNDOS',
    heading: '¿Está una herida de abandono dirigiendo tus relaciones?',
    sub: 'Marca las alarmas de separación y defensas que sientes con más frecuencia:',
    items: [
      '<strong>Pánico ante el silencio o la distancia:</strong> Mensajes tardíos o planes cancelados disparan una ola física de angustia.',
      '<strong>Autoabandono para evitar que se vayan:</strong> Callas tus necesidades o toleras malos tratos porque perder al otro te aterra más.',
      '<strong>Autosabotaje o pruebas de amor:</strong> Cuando todo va bien, pones a prueba a tu pareja o te alejas primero antes de que te dejen.',
      '<strong>Miedo profundo a no ser suficiente:</strong> Temes que cuando conozcan tus defectos reales, inevitablemente se marcharán.'
    ],
    scoreUnit: 'de 4 señales de herida de abandono activas',
    verdicts: [
      'Marca las señales arriba para evaluar cómo influye la herida de abandono en tus vínculos.',
      'Sensibilidad leve a la separación (1/4). La comunicación directa mantiene tu seguridad emocional.',
      'Esquema de abandono moderado (2/4). Heridas pasadas amplifican la incertidumbre en tus relaciones actuales.',
      'Alta alarma de abandono (3/4). Tu amígdala interpreta pequeñas distancias como una amenaza inminente.',
      'Herida profunda de abandono activa (4/4). Tu sistema nervioso vive en alerta—descubre tu estilo de apego y regula tu cuerpo ahora.'
    ],
    primaryBtn: 'Descubrir mi Estilo de Apego Gratis &rarr;',
    subBtn: 'Calmar la Ansiedad con Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'TRIAGE BLESSURE D\'ABANDON EN 30 SECONDES',
    heading: 'Une blessure d\'abandon guide-t-elle vos relations actuelles ?',
    sub: 'Cochez les signaux d\'alarme et réflexes de protection qui vous semblent familiers :',
    items: [
      '<strong>Panique face au silence ou à la distance :</strong> Un retard de réponse ou un projet annulé déclenche une vague physique d\'angoisse.',
      '<strong>Abandon de soi par peur de perdre l\'autre :</strong> Vous taisez vos besoins ou tolérez l\'inacceptable car la solitude vous terrifie.',
      '<strong>Auto-sabotage ou tests d\'amour :</strong> Quand tout va bien, vous testez inconsciemment votre partenaire ou partez avant d\'être quitté.',
      '<strong>Peur profonde d\'être indigne d\'amour :</strong> Vous craignez que l\'autre ne finisse par partir s\'il découvre vos vraies vulnérabilités.'
    ],
    scoreUnit: 'sur 4 signaux de blessure d\'abandon actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer l\'impact du schéma d\'abandon.',
      'Sensibilité légère à la séparation (1/4). Une communication claire suffit à vous rassurer.',
      'Schéma d\'abandon modéré (2/4). Les blessures passées amplifient vos doutes relationnels actuels.',
      'Forte alarme d\'abandon (3/4). Votre amygdale interprète le moindre recul comme une urgence.',
      'Blessure d\'abandon profonde (4/4). Votre système nerveux oscille entre panique et fuite—faites le test d\'attachement maintenant.'
    ],
    primaryBtn: 'Découvrir mon Style d\'Attachement &rarr;',
    subBtn: 'Apaiser la Panique avec l\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・見捨てられスキーマ（愛着の傷）チェック',
    heading: 'あなたの恋愛を苦しめているのは「見捨てられ不安」の古傷？',
    sub: '人との距離感に揺らぎが生じたときの反応をチェックしてください：',
    items: [
      '<strong>沈黙や距離に対するパニック：</strong> 返信の遅れや予定変更があると、見捨てられたような強い動悸や不安に襲われる。',
      '<strong>嫌われないための自己犠牲：</strong> 相手を失う恐怖から、自分の本音を押し殺したり苦しい関係に耐え続けてしまう。',
      '<strong>先回りの自己破壊や試し行動：</strong> 関係が順調なときほど相手を試したり、傷つく前に自分から関係を壊したくなる。',
      '<strong>根本的な無価値感：</strong> 本当の自分や弱みを見せたら、いつか必ず相手は去っていくと心の奥で信じている。'
    ],
    scoreUnit: '/ 4 個の見捨てられスキーマ反応が該当',
    verdicts: [
      '上の項目をチェックして、見捨てられ不安の深さを確認しましょう。',
      '軽度の分離への敏感さ（1/4）。率直な対話とセルフケアで安心感を保てます。',
      '中程度の見捨てられスキーマ（2/4）。過去の喪失体験が現在の人間関係の不安を増폭させています。',
      '高い見捨てられアラーム反応（3/4）。些細なすれ違いも脳が重大な危機として処理しています。',
      '深い中核的トラウマ反応（4/4）。執着と回避のループで神経系が疲弊しています。今すぐ愛着スタイル診断とグラウンディングを行ってください。'
    ],
    primaryBtn: '無料・愛着スタイル診断で自分の型を知る &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで不安を鎮める &rarr;'
  },
  zh: {
    badge: '30秒被抛弃创伤图式（Abandonment Schema）筛查',
    heading: '是未愈合的“被抛弃创伤”在操控你的亲密关系吗？',
    sub: '勾选你在面对分离、冷淡或关系不确定性时的典型反应：',
    items: [
      '<strong>失联恐慌与沉默警报：</strong> 消息回复变慢、计划取消或短暂冷淡，都会引发强烈的生理性恐慌与心慌。',
      '<strong>为留住关系而放弃自我：</strong> 因为极度恐惧失去，你宁可委曲求全、压抑真实需求，甚至忍受不健康的对待。',
      '<strong>先发制人的自我破坏或试探：</strong> 当关系稳定顺利时，你会无意识地试探对方，或在对方离开前先推开对方。',
      '<strong>底层的不配得感：</strong> 内心深处总担心一旦对方看到你真实的脆弱与缺点，最终一定会离开你。'
    ],
    scoreUnit: '/ 4 项被抛弃图式信号激活',
    verdicts: [
      '勾选上方信号，评估被抛弃图式对你神经系统的影响程度。',
      '轻度分离敏感 (1/4)。坦诚沟通与日常自我关怀即可维持内心安全感。',
      '中度被抛弃图式激活 (2/4)。过往的情感缺失正在放大当前关系中的不确定感。',
      '高度分离警报反应 (3/4)。你的杏仁核将微小的距离变化识别为关系生存危机。',
      '深层核心被抛弃创伤 (4/4)。你的神经系统长期处于渴望又恐惧的内耗中，建议立即测试依恋风格并进行感官着陆。'
    ],
    primaryBtn: '免费测试你的依恋风格与安全感基线 &rarr;',
    subBtn: '使用 5-4-3-2-1 着陆工具平复分离恐慌 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE FERIDA DE ABANDONO EM 30 SEGUNDOS',
    heading: 'Uma ferida de abandono está guiando seus relacionamentos?',
    sub: 'Marque os sinais de alarme e comportamentos protetores que parecem mais familiares:',
    items: [
      '<strong>Pânico com silêncio ou distância:</strong> Mensagens atrasadas ou planos cancelados disparam uma onda física de angústia.',
      '<strong>Autoabandono para manter o vínculo:</strong> Você cala suas necessidades porque o pavor de ficar só parece pior que sofrer.',
      '<strong>Autossabotagem ou testes de amor:</strong> Quando tudo vai bem, você testa o parceiro ou se afasta primeiro antes de ser deixado.',
      '<strong>Medo profundo de desvalor:</strong> No fundo, você teme que quando virem suas falhas reais, inevitavelmente irão embora.'
    ],
    scoreUnit: 'de 4 sinais de esquema de abandono ativos',
    verdicts: [
      'Marque os sinais acima para avaliar o impacto da ferida de abandono.',
      'Sensibilidade leve à separação (1/4). Comunicação clara mantém sua segurança emocional.',
      'Esquema de abandono moderado (2/4). Perdas passadas estão amplificando inseguranças atuais.',
      'Alto alarme de abandono (3/4). Sua amígdala trata pequenas distâncias como emergência.',
      'Ferida profunda de abandono ativa (4/4). Seu sistema nervoso está em alerta—descubra seu estilo de apego agora.'
    ],
    primaryBtn: 'Descobrir meu Estilo de Apego Gratuito &rarr;',
    subBtn: 'Acalmar a Ansiedade com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ТРАВМУ ОТВЕРЖЕНИЯ И ПОКИНУТОСТИ',
    heading: 'Управляет ли страх быть брошенным вашими отношениями?',
    sub: 'Отметьте реакции на дистанцию и разлуку, которые вам знакомы:',
    items: [
      '<strong>Паника из-за молчания:</strong> Долгий ответ на сообщение или отмена встречи вызывают физическую волну тревоги.',
      '<strong>Отказ от себя ради сохранения связи:</strong> Вы терпите боль и молчите о потребностях, лишь бы не остаться в одиночестве.',
      '<strong>Самосаботаж и проверки на прочность:</strong> Когда всё хорошо, вы устраиваете проверки или уходите первыми, чтобы не бросили вас.',
      '<strong>Глубинное чувство собственной неценности:</strong> Вам кажется, что если партнер узнает вас настоящего, он неизбежно уйдет.'
    ],
    scoreUnit: 'из 4 сигналов схемы покинутости активно',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить влияние травмы покинутости.',
      'Легкая чувствительность к разлуке (1/4). Открытый диалог помогает сохранять спокойствие.',
      'Умеренная схема покинутости (2/4). Прошлый опыт потерь усиливает тревогу в настоящем.',
      'Высокая тревога отвержения (3/4). Миндалевидное тело воспринимает любую дистанцию как катастрофу.',
      'Глубокая травма покинутости (4/4). Ваша нервная система истощена страхом потери — определите свой тип привязанности сейчас.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности &rarr;',
    subBtn: 'Снять панику техникой заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING LUKA PENGABAIAN (ABANDONMENT) 30 DETIK',
    heading: 'Apakah Luka Takut Ditinggalkan Mengendalikan Hubungan Anda?',
    sub: 'Centang sinyal alarm perpisahan dan pola bertahan yang paling sering Anda rasakan:',
    items: [
      '<strong>Panik Saat Hening atau Berjarak:</strong> Balasan pesan yang lama atau rencana batal memicu gelombang cemas di tubuh.',
      '<strong>Mengabaikan Diri Demi Pertahankan Hubungan:</strong> Anda memendam kebutuhan sendiri karena takut ditinggalkan terasa lebih menyakitkan.',
      '<strong>Sabotase Diri atau Menguji Pasangan:</strong> Saat hubungan stabil, Anda tanpa sadar menguji kesetiaan pasangan atau menjauh lebih dulu.',
      '<strong>Ketakutan Tidak Layak Dicintai:</strong> Jauh di dalam hati Anda takut jika orang tahu kekurangan asli Anda, mereka pasti pergi.'
    ],
    scoreUnit: 'dari 4 sinyal skema pengabaian aktif',
    verdicts: [
      'Centang poin di atas untuk mengukur seberapa kuat luka pengabaian memengaruhi Anda.',
      'Sensitivitas Perpisahan Ringan (1/4). Komunikasi jujur sudah cukup menjaga rasa aman Anda.',
      'Skema Pengabaian Sedang (2/4). Kehilangan di masa lalu memperbesar rasa tidak pasti saat ini.',
      'Alarm Pengabaian Tinggi (3/4). Amigdala Anda membaca jarak kecil sebagai darurat hubungan.',
      'Luka Pengabaian Inti Aktif (4/4). Sistem saraf Anda terjebak panik tarik-ulur—cek gaya kelekatan Anda sekarang.'
    ],
    primaryBtn: 'Cek Profil Gaya Kelekatan Gratis &rarr;',
    subBtn: 'Tenangkan Panik dengan Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK TERK EDİLME ŞEMASI TARAMASI',
    heading: 'İlişkilerinizi İyileşmemiş Bir Terk Edilme Yarası mı Yönetiyor?',
    sub: 'Size en tanıdık gelen ayrılık alarmlarını ve koruma davranışlarını işaretleyin:',
    items: [
      '<strong>Sessizlik ve Mesafe Paniği:</strong> Geç gelen mesajlar veya iptal edilen planlar bedensel bir korku dalgası yaratıyor.',
      '<strong>Bağı Korumak İçin Kendini Terk Etme:</strong> Kaybetme korkusu yüzünden kendi ihtiyaçlarınızı susturuyor veya sağlıksız durumlara katlanıyorsunuz.',
      '<strong>Önleyici Sabotaj veya Sadakat Testleri:</strong> İlişki iyi giderken bilinçsizce partnerinizi test ediyor ya da terk edilmeden önce siz uzaklaşıyorsunuz.',
      '<strong>Temel Değersizlik Korkusu:</strong> Gerçek kusurlarınız ve ihtiyaçlarınız görüldüğünde insanların kaçınılmaz olarak gideceğinden korkuyorsunuz.'
    ],
    scoreUnit: '/ 4 terk edilme şeması sinyali aktif',
    verdicts: [
      'Terk edilme şemasının sinir sisteminizi ne kadar etkilediğini görmek için yukarıdakileri işaretleyin.',
      'Hafif Ayrılık Hassasiyeti (1/4). Açık iletişim ve öz-şefkat dengenizi korumanıza yeter.',
      'Orta Düzey Terk Edilme Şeması (2/4). Geçmiş kayıplar bugünkü ilişki belirsizliklerini büyütüyor.',
      'Yüksek Terk Edilme Alarmı (3/4). Amigdalanız küçük mesafeleri bile acil tehdit olarak kodluyor.',
      'Derin Terk Edilme Yarası (4/4). Sinir sisteminiz yaklaşma-kaçınma paniğinde—bağlanma stilinizi hemen keşfedin.'
    ],
    primaryBtn: 'Bağlanma Stili Profilini Ücretsiz Keşfet &rarr;',
    subBtn: '5-4-3-2-1 Topraklama ile Kaygıyı Yatıştır &rarr;'
  },
  hi: {
    badge: '30-सेकंड अबैंडनमेंट वूंड (त्यागे जाने का डर) स्क्रीनर',
    heading: 'क्या अधूरा "त्यागे जाने का घाव" आपके रिश्तों को चला रहा है?',
    sub: 'उन संकेतों को चुनें जो रिश्तों में दूरी महसूस होने पर तुरंत सक्रिय हो जाते हैं:',
    items: [
      '<strong>चुप्पी और दूरी से घबराहट:</strong> देर से रिप्लाई आने या प्लान कैंसिल होने पर शरीर में अचानक डर और बेचैनी की लहर दौड़ जाती है।',
      '<strong>रिश्ता बचाने के लिए खुद को छोड़ देना:</strong> अकेले रह जाने के डर से आप अपनी ज़रूरतें दबाते हैं या गलत व्यवहार भी सहन कर लेते हैं।',
      '<strong>सेल्फ-सैबोटाज या प्यार की परीक्षा लेना:</strong> जब रिश्ता अच्छा चल रहा हो, तब आप अनजाने में पार्टनर को परखते हैं या छोड़ दिए जाने के डर से पहले ही दूर हो जाते हैं।',
      '<strong>अयोग्यता का गहरा डर:</strong> मन के भीतर यह डर रहता है कि अगर किसी ने आपकी असली कमियां देख लीं, तो वह ज़रूर छोड़कर चला जाएगा।'
    ],
    scoreUnit: '/ 4 अबैंडनमेंट स्कीमा संकेत सक्रिय',
    verdicts: [
      'त्यागे जाने के डर का अपने नर्वस सिस्टम पर प्रभाव जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'हल्की अलगाव संवेदनशीलता (1/4)। स्पष्ट संवाद और आत्म-देखभाल से आप सुरक्षित महसूस कर सकते हैं।',
      'मध्यम अबैंडनमेंट स्कीमा (2/4)। अतीत के घाव वर्तमान रिश्तों की अनिश्चितता को बढ़ा रहे हैं।',
      'उच्च अलगाव अलार्म (3/4)। आपका मस्तिष्क छोटी सी दूरी को भी बड़े खतरे के रूप में देखता है।',
      'गहरा मुख्य अबैंडनमेंट घाव (4/4)। आपका नर्वस सिस्टम लगातार डर में है—अपना अटैचमेंट स्टाइल अभी जांचें।'
    ],
    primaryBtn: 'अपना अटैचमेंट स्टाइल प्रोफाइल जानें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग से घबराहट शांत करें &rarr;'
  }
};

const AVOIDANT_PATTERNS_EN_SPEC = {
  lang: 'en',
  id: 'avoidantPatternScreener',
  chkClass: 'avpat-screener-chk',
  badge: '30-SECOND INTIMACY DEACTIVATION SCREENER',
  heading: 'Are Deactivating Strategies Running Your Dating Life?',
  sub: 'Check the avoidant attachment reflexes you notice when someone gets emotionally close:',
  items: [
    '<strong>Post-Closeness Suffocation:</strong> After an intimate weekend or vulnerable conversation, you feel a sudden urge to pull back and reclaim solitude.',
    '<strong>Flaw-Finding &amp; "Phantom Ex" Comparisons:</strong> Once a partner wants commitment, you start fixating on minor habits or idealizing a past connection.',
    '<strong>Compulsive Self-Reliance:</strong> Asking for emotional support feels unsafe or burdensome; you default to regulating stress completely alone.',
    '<strong>Exit-Route Preservation:</strong> You keep future plans or labels slightly ambiguous so you never feel trapped inside someone else\'s expectations.'
  ],
  scoreUnit: 'of 4 avoidant deactivating strategies active',
  verdicts: [
    'Check the patterns above to see if your nervous system uses distance to regulate intimacy.',
    'Healthy Autonomy Baseline (1/4). You value personal space while remaining capable of emotional presence.',
    'Moderate Deactivating Reflex (2/4). Your attachment system dampens closeness when vulnerability rises.',
    'High Avoidant Protection (3/4). Unconscious deactivating strategies are blocking deeper relationship security.',
    'Strong Dismissive-Avoidant Pattern (4/4). Your nervous system equates dependency with danger—take the full Attachment Style Test now.'
  ],
  primaryHref: '/attachment-style/?lang=en&source=en_avoidant_patterns_screener',
  primaryTargetSlug: 'attachment-style',
  primaryBtn: 'Take the Full Attachment Style Test &rarr;',
  subHref: '/portal/tools/burnout-stress-differential.html?lang=en&source=en_avoidant_patterns_screener',
  subBtn: 'Check Relational Burnout vs. Stress Differential &rarr;'
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

function applyScreenerToFile(filePath, cfg, mode = 'replace-cta') {
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
  } else if (mode === 'after-first-highlight') {
    const updated = replaceFirstBodyDivByClass(content, 'highlight-box', markup, true);
    if (updated) {
      content = updated;
    } else {
      console.warn(`[WARN] No .highlight-box found in ${filePath}`);
    }
  } else {
    const updated = replaceFirstBodyDivByClass(content, 'cta-box', markup, false);
    if (updated) {
      content = updated;
    } else {
      console.warn(`[WARN] No .cta-box found in ${filePath}`);
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

  // 1. attachment-style-quiz-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(ATTACHMENT_QUIZ_GUIDE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'attachment-style-quiz-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'attachmentDimensionScreener',
      chkClass: 'attdim-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=attachment_quiz_guide_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=attachment_quiz_guide_screener`,
      subBtn: loc.subBtn
    }, 'replace-cta');
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/attachment-style-quiz-guide.html`);
    console.log(`[PASS] attachment-style-quiz-guide (${lang})`);
  }

  // 2. people-pleasing-fawn-response-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(FAWN_GUIDE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'people-pleasing-fawn-response-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'fawnResponseScreener',
      chkClass: 'fawn-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=fawn_guide_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}&source=fawn_guide_screener`,
      subBtn: loc.subBtn
    }, 'replace-cta');
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/people-pleasing-fawn-response-guide.html`);
    console.log(`[PASS] people-pleasing-fawn-response-guide (${lang})`);
  }

  // 3. abandonment-issues-attachment-healing.html (12 locales)
  for (const [lang, loc] of Object.entries(ABANDONMENT_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'abandonment-issues-attachment-healing.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'abandonmentWoundScreener',
      chkClass: 'aband-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=abandonment_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=abandonment_screener`,
      subBtn: loc.subBtn
    }, 'after-first-highlight');
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/abandonment-issues-attachment-healing.html`);
    console.log(`[PASS] abandonment-issues-attachment-healing (${lang})`);
  }

  // 4. en/avoidant-attachment-dating-patterns.html (1 page)
  const avoidantEnPath = path.join(PORTAL_BLOG, 'en', 'avoidant-attachment-dating-patterns.html');
  if (fs.existsSync(avoidantEnPath)) {
    applyScreenerToFile(avoidantEnPath, AVOIDANT_PATTERNS_EN_SPEC, 'replace-cta');
    changedUrls.push('https://dopabrain.com/portal/blog/en/avoidant-attachment-dating-patterns.html');
    console.log('[PASS] en/avoidant-attachment-dating-patterns.html');
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 1: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

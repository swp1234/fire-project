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

const DISORGANIZED_ATTACH_LOCALES = {
  en: {
    badge: '30-SECOND FEARFUL-AVOIDANT (DISORGANIZED) SCREENER',
    heading: 'Are You Caught in the "Come Here, Go Away" Attachment Paradox?',
    sub: 'Check the push-pull attachment reflexes you notice when a relationship gets close:',
    items: [
      '<strong>Simultaneous Craving &amp; Terror:</strong> You deeply want emotional intimacy, yet the moment someone gets truly close, your body braces for danger.',
      '<strong>Push-Pull Oscillation:</strong> You pull away when a partner approaches, then panic with abandonment anxiety the moment they step back.',
      '<strong>Intimacy Sabotage Under Safety:</strong> Calm, consistent relationships feel strangely unsafe or "too good to be true," tempting you to pick fights or flee.',
      '<strong>Hypervigilance to Micro-Shifts:</strong> You read every facial expression, sigh, or pause for hidden signs of betrayal, anger, or sudden loss.'
    ],
    scoreUnit: 'of 4 disorganized attachment signals active',
    verdicts: [
      'Check the signals above to see if fearful-avoidant (disorganized) patterns are active in your relationships.',
      'Mild Ambivalence (1/4). Situational trust fears arise under stress—take the full Attachment Style Test to map your baseline.',
      'Moderate Push-Pull Dynamic (2/4). Both anxious and avoidant protective circuits are competing in your nervous system.',
      'High Fearful-Avoidant Activation (3/4). Your attachment system simultaneously seeks connection and sounds the threat alarm.',
      'Core Disorganized Attachment Pattern (4/4). Your nervous system is trapped between longing and fear—take the full Attachment Style Test and ground your body now.'
    ],
    primaryBtn: 'Take the Free Attachment Style Test &rarr;',
    subBtn: 'Soothe Push-Pull Panic with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 혼란형(공포-회피형) 애착 판별기',
    heading: '"다가오지 마, 하지만 떠나지 마" 밀당의 덫에 갇혀 있나요?',
    sub: '가까운 관계에서 동시에 작동하는 갈망과 공포 신호를 체크해보세요:',
    items: [
      '<strong>친밀감에 대한 갈망과 공포의 동시 작동:</strong> 깊은 사랑을 간절히 원하지만, 막상 상대가 가까워지면 몸과 마음이 경계 태세에 들어갑니다.',
      '<strong>밀어내기와 매달리기의 반복 (Push-Pull):</strong> 상대가 다가오면 숨이 막혀 밀어내고, 상대가 물러서면 버림받을까 봐 극심한 불안에 빠집니다.',
      '<strong>안전한 관계에서의 선제적 자기 파괴:</strong> 관계가 평온하고 안정적일수록 오히려 불안해져서 괜히 트집을 잡거나 먼저 도망치고 싶어집니다.',
      '<strong>미세한 변화에 대한 과잉 경계:</strong> 상대의 표정, 한숨, 말투 변화를 실시간으로 스캔하며 배신이나 공격의 징조를 찾습니다.'
    ],
    scoreUnit: '개 혼란형(공포-회피) 애착 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내 관계 속에 혼란형(공포-회피) 애착 패턴이 있는지 확인해보세요.',
      '경미한 양가감정(1/4). 과거의 상처 기억이 특정 스트레스 상황에서만 방어 기제를 자극하고 있습니다.',
      '중등도 밀당·양가감정 패턴(2/4). 애착 불안 회로와 회피 회로가 번갈아 켜지며 에너지를 소모하고 있습니다.',
      '높은 공포-회피 애착 활성화(3/4). 사랑받고 싶은 욕구와 상처받지 않으려는 생존 본능이 정면 충돌하고 있습니다.',
      '강한 핵심 혼란형 애착 패턴(4/4). 친밀감 자체가 신경계에 경보를 울리고 있습니다. 지금 전체 애착 유형 진단과 그라운딩을 시작하세요.'
    ],
    primaryBtn: '무료 4대 애착 유형 정밀 테스트 시작 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 공황 진정하기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN DESORGANISIERTER BINDUNGS-CHECK',
    heading: 'Stecken Sie im „Komm her, geh weg“-Bindungsparadox?',
    sub: 'Wählen Sie die Nähe-Distanz-Muster aus, die Sie in engen Beziehungen erleben:',
    items: [
      '<strong>Gleichzeitige Sehnsucht &amp; Angst:</strong> Sie wünschen sich tiefe Nähe, doch sobald sie entsteht, schlägt Ihr Körper Alarm.',
      '<strong>Push-Pull-Dynamik:</strong> Sie ziehen sich bei Nähe zurück, geraten aber sofort in Verlustpanik, wenn der Partner auf Abstand geht.',
      '<strong>Sabotage bei Sicherheit:</strong> Ruhige, stabile Beziehungen wirken ungewohnt oder bedrohlich, sodass Sie unbewusst Streit oder Flucht auslösen.',
      '<strong>Hypervigilanz für Mikro-Signale:</strong> Sie scannen jeden Blick und Tonfall auf Anzeichen von Verrat oder Ablehnung.'
    ],
    scoreUnit: 'von 4 desorganisierten Bindungssignalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um ängstlich-vermeidende Bindungsmuster zu prüfen.',
      'Leichte Ambivalenz (1/4). Einzelne Stressmomente aktivieren alte Schutzmechanismen.',
      'Mittleres Push-Pull-Muster (2/4). Angst- und Vermeidungssysteme konkurrieren in Ihrem Nervensystem.',
      'Hohe desorganisierte Aktivierung (3/4). Nähe löst gleichzeitig Bindungswunsch und Gefahrenalarm aus.',
      'Starkes desorganisiertes Bindungsmuster (4/4). Machen Sie jetzt den vollständigen Bindungstest und nutzen Sie das Grounding-Tool.'
    ],
    primaryBtn: 'Zum kostenlosen Bindungsstil-Test &rarr;',
    subBtn: '5-4-3-2-1 Grounding-Tool gegen Panik starten &rarr;'
  },
  es: {
    badge: 'TRIAJE DE APEGO DESORGANIZADO EN 30 SEGUNDOS',
    heading: '¿Vives atrapado entre "acércate" y "aléjate"?',
    sub: 'Marca los reflejos de acercamiento y huida que sientes cuando alguien se acerca de verdad:',
    items: [
      '<strong>Anhelo y terror simultáneos:</strong> Deseas intimidad profunda, pero cuando ocurre, tu cuerpo se tensa esperando peligro.',
      '<strong>Ciclo de empuje y tirón (Push-Pull):</strong> Te alejas cuando tu pareja se acerca, pero entras en pánico si toma distancia.',
      '<strong>Sabotaje ante la estabilidad:</strong> Cuando una relación es tranquila y segura, desconfías o buscas escapar antes de salir herido.',
      '<strong>Hipervigilancia a micro-cambios:</strong> Escaneas cada gesto o silencio buscando señales ocultas de traición o abandono.'
    ],
    scoreUnit: 'de 4 señales de apego desorganizado activas',
    verdicts: [
      'Marca los puntos arriba para evaluar si tienes un patrón temeroso-evitativo.',
      'Ambivalencia leve (1/4). Solo ciertos momentos de estrés activan defensas relacionales.',
      'Dinámica moderada de tirón y empuje (2/4). Ansiedad y evitación compiten dentro de tu sistema nervioso.',
      'Alta activación temeroso-evitativa (3/4). Tu cerebro asocia el amor profundo con una amenaza inminente.',
      'Patrón de apego desorganizado profundo (4/4). Haz el Test de Estilo de Apego completo y regula tu sistema nervioso ahora.'
    ],
    primaryBtn: 'Hacer el Test de Estilo de Apego Gratis &rarr;',
    subBtn: 'Calmar la Alarma con Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'TRIAGE ATTACHEMENT DÉSORGANISÉ EN 30 SECONDES',
    heading: 'Êtes-vous pris dans le paradoxe « viens ici, va-t\'en » ?',
    sub: 'Cochez les réactions d\'attraction-fuite que vous vivez dans vos relations intimes :',
    items: [
      '<strong>Désir et terreur simultanés :</strong> Vous rêvez de fusion, mais dès que l\'autre s\'approche vraiment, votre corps se met en alerte.',
      '<strong>Cycle attraction-répulsion (Push-Pull) :</strong> Vous fuyez quand le partenaire avance, puis paniquez dès qu\'il prend du recul.',
      '<strong>Auto-sabotage face à la sécurité :</strong> Une relation calme vous semble suspecte ou étouffante, vous poussant à provoquer une rupture.',
      '<strong>Hypervigilance aux micro-signaux :</strong> Vous scrutez chaque soupir ou silence par peur d\'une trahison soudaine.'
    ],
    scoreUnit: 'sur 4 signaux d\'attachement désorganisé actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer le profil craintif-évitant.',
      'Ambivalence légère (1/4). Seuls certains stress ponctuels réveillent vos défenses.',
      'Dynamique push-pull modérée (2/4). Anxiété et évitement s\'affrontent dans votre système nerveux.',
      'Forte activation désorganisée (3/4). La proximité active simultanément votre besoin d\'amour et votre alarme de survie.',
      'Schéma désorganisé profond (4/4). Passez le Test de Style d\'Attachement complet et apaisez votre corps maintenant.'
    ],
    primaryBtn: 'Faire le Test de Style d\'Attachement &rarr;',
    subBtn: 'Ouvrir l\'Outil d\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・無秩序型（恐れ・回避型）愛着チェック',
    heading: '「近づきたいのに逃げたくなる」愛着のジレンマに陥っていませんか？',
    sub: '親密な関係で同時に起きるアクセルとブレーキの反応をチェックしてください：',
    items: [
      '<strong>渇望と恐怖の同時発火：</strong> 深い繋がりを強く求めているのに、相手が本気で近づくと心身が危険信号を出す。',
      '<strong>押し引き（プッシュ＆プル）のループ：</strong> 相手が迫ると逃げたくなり、相手が離れると見捨てられ不安でパニックになる。',
      '<strong>安心感への自己破壊衝動：</strong> 関係が穏やかで安定しているほど居心地が悪くなり、自分から壊したり逃げ出したくなる。',
      '<strong>微細な変化への過覚醒：</strong> 相手の表情や声のトーンを常に監視し、裏切りや拒絶の兆候を探してしまう。'
    ],
    scoreUnit: '/ 4 個の無秩序型（恐れ・回避）サインが該当',
    verdicts: [
      '上の項目をチェックして、無秩序型（恐れ・回避型）の愛着傾向を確認しましょう。',
      '軽度のアンビバレント傾向（1/4）。強いストレス時のみ警戒心が働く状態です。',
      '中程度のプッシュ＆プル傾向（2/4）。不安型と回避型のブレーキが交互に作動しています。',
      '高い恐れ・回避反応（3/4）。愛されたい欲求と傷つきたくない防衛本能が激しく衝突しています。',
      '深い無秩序型愛着パターン（4/4）。神経系が常に緊張しています。今すぐ愛着スタイル精密テストとグラウンディングを行ってください。'
    ],
    primaryBtn: '無料・愛着スタイル精密テストを受ける &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで鎮静する &rarr;'
  },
  zh: {
    badge: '30秒混乱型（恐惧-回避型）依恋筛查',
    heading: '你是否困在“渴望靠近又拼命推开”的依恋悖论中？',
    sub: '勾选你在亲密关系深入时同时出现的渴望与恐惧反应：',
    items: [
      '<strong>渴望与恐惧同时爆发：</strong> 内心极度渴望深刻联结，但一旦有人真正走近，身体每一寸都在发出危险警报。',
      '<strong>推拉摆荡循环（Push-Pull）：</strong> 对方靠近时你感到窒息想逃，可对方一旦后退，你又瞬间陷入被抛弃的恐慌。',
      '<strong>安全感下的自我破坏：</strong> 当关系平稳温和时反而觉得“不真实”或不安，忍不住挑起争端或想要逃离。',
      '<strong>对微小信号过度警觉：</strong> 时刻扫描伴侣的眼神、叹气或停顿，提防随时可能降临的背叛或突然离开。'
    ],
    scoreUnit: '/ 4 项混乱型（恐惧-回避）依恋信号激活',
    verdicts: [
      '勾选上方信号，评估你是否存在混乱型（恐惧-回避型）依恋模式。',
      '轻度矛盾心理 (1/4)。仅在高压或特定情境下会触发防御机制。',
      '中度推拉内耗模式 (2/4)。焦虑与回避两套防御回路正在你的神经系统中拉锯。',
      '高度恐惧-回避激活 (3/4)。你的依恋系统在渴望爱的同时不断拉响生存警报。',
      '深层混乱型依恋模式 (4/4)。油门与刹车同时踩到底正在耗尽你的精力，建议立即完成依恋风格测评并进行感官着陆。'
    ],
    primaryBtn: '开始免费依恋风格完整测试 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆平复推拉恐慌 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE APEGO DESORGANIZADO EM 30 SEGUNDOS',
    heading: 'Você vive preso entre "vem cá" e "vai embora"?',
    sub: 'Marque os reflexos de aproximação e fuga que surgem quando alguém se aproxima:',
    items: [
      '<strong>Desejo e pavor simultâneos:</strong> Você quer intimidade profunda, mas seu corpo entra em alerta assim que alguém chega perto.',
      '<strong>Ciclo de puxar e empurrar (Push-Pull):</strong> Você se afasta quando o parceiro avança, mas entra em pânico se ele recua.',
      '<strong>Autossabotagem na segurança:</strong> Relações calmas parecem estranhas ou perigosas, dando vontade de fugir antes de se ferir.',
      '<strong>Hipervigilância a micro-sinais:</strong> Você monitora cada olhar ou silêncio procurando sinais de traição ou rejeição.'
    ],
    scoreUnit: 'de 4 sinais de apego desorganizado ativos',
    verdicts: [
      'Marque os itens acima para avaliar padrões de apego temeroso-evitativo.',
      'Ambivalência leve (1/4). Apenas gatilhos pontuais ativam suas defesas.',
      'Dinâmica push-pull moderada (2/4). Ansiedade e evitação competem no seu sistema nervoso.',
      'Alta ativação desorganizada (3/4). Seu cérebro associa proximidade com perigo iminente.',
      'Padrão desorganizado profundo (4/4). Faça o Teste de Estilo de Apego completo e regule seu corpo agora.'
    ],
    primaryBtn: 'Fazer o Teste de Estilo de Apego Gratuito &rarr;',
    subBtn: 'Acalmar o Pânico com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ДЕЗОРГАНИЗОВАННУЮ ПРИВЯЗАННОСТЬ',
    heading: 'Застряли ли вы в ловушке «подойди ближе — уходи прочь»?',
    sub: 'Отметьте противоречивые реакции, которые возникают при сближении с партнером:',
    items: [
      '<strong>Одновременная тяга и ужас:</strong> Вы жаждете глубокой близости, но когда она наступает, тело ждет удара.',
      '<strong>Качели «тяни-толкай» (Push-Pull):</strong> Вы отстраняетесь, когда партнер тянется к вам, и паникуете, когда он отдаляется.',
      '<strong>Саботаж в спокойных отношениях:</strong> Стабильность кажется подозрительной, вызывая импульс спровоцировать ссору или сбежать.',
      '<strong>Гипербдительность к мелочам:</strong> Вы считываете каждый взгляд и паузу в поисках скрытого предательства.'
    ],
    scoreUnit: 'из 4 признаков дезорганизованной привязанности активно',
    verdicts: [
      'Отметьте пункты выше, чтобы проверить наличие тревожно-избегающего паттерна.',
      'Легкая амбивалентность (1/4). Защитные реакции включаются только в моменты сильного стресса.',
      'Умеренные эмоциональные качели (2/4). В вашей нервной системе борются тревога и избегание.',
      'Высокая дезорганизованная активация (3/4). Потребность в любви запускает сигнал опасности.',
      'Глубокий дезорганизованный паттерн (4/4). Пройдите полный тест на тип привязанности и выполните заземление сейчас.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности &rarr;',
    subBtn: 'Снять тревогу практикой заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING KELEKATAN DISORGANIZED (TARIK-ULUR) 30 DETIK',
    heading: 'Apakah Anda Terjebak Paradoks "Mendekatlah, Tapi Pergi"?',
    sub: 'Centang reaksi tarik-ulur yang muncul saat hubungan mulai terasa sangat dekat:',
    items: [
      '<strong>Rindu Sekaligus Takut:</strong> Anda sangat menginginkan keintiman, namun tubuh langsung tegang saat seseorang benar-benar dekat.',
      '<strong>Siklus Tarik-Ulur (Push-Pull):</strong> Anda menjauh saat pasangan mendekat, lalu panik takut ditinggalkan saat ia mundur.',
      '<strong>Sabotase Saat Hubungan Tenang:</strong> Hubungan yang stabil justru terasa asing atau mencurigakan hingga memicu dorongan kabur.',
      '<strong>Waspada Berlebih pada Perubahan Kecil:</strong> Anda memindai setiap ekspresi dan jeda bicara demi mencari tanda pengkhianatan.'
    ],
    scoreUnit: 'dari 4 sinyal kelekatan disorganized aktif',
    verdicts: [
      'Centang poin di atas untuk melihat apakah pola fearful-avoidant aktif dalam hubungan Anda.',
      'Ambivalensi Ringan (1/4). Hanya pemicu stres tertentu yang mengaktifkan pertahanan Anda.',
      'Dinamika Tarik-Ulur Sedang (2/4). Sirkuit cemas dan menghindar saling berebut kendali di sistem saraf Anda.',
      'Aktivasi Fearful-Avoidant Tinggi (3/4). Sistem kelekatan Anda menginginkan koneksi sekaligus membunyikan alarm bahaya.',
      'Pola Disorganized Inti (4/4). Ikuti Tes Gaya Kelekatan lengkap dan tenangkan sistem saraf Anda sekarang.'
    ],
    primaryBtn: 'Ikuti Tes Gaya Kelekatan Gratis &rarr;',
    subBtn: 'Tenangkan Panik dengan Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİKDEZORGANİZE (KORKULU-KAÇINMACI) BAĞLANMA TARAMASI',
    heading: '"Yaklaş Ama Uzak Dur" İlişki Çıkmazında mısınız?',
    sub: 'Bir ilişki ciddileştiğinde ortaya çıkan itme-çekme reflekslerini işaretleyin:',
    items: [
      '<strong>Aynı Anda Özlem ve Korku:</strong> Derin yakınlık istiyorsunuz ama biri gerçekten yaklaştığında bedeniniz tehlike alarmı veriyor.',
      '<strong>İtme-Çekme Döngüsü (Push-Pull):</strong> Partneriniz yaklaşınca geri çekiliyor, o uzaklaşınca terk edilme paniği yaşıyorsunuz.',
      '<strong>Güvenli İlişkide Sabotaj:</strong> Sakin ve tutarlı ilişkiler yabancı veya "fazla iyi" hissettirerek kaçma dürtüsü uyandırıyor.',
      '<strong>Mikro Değişimlere Aşırı Tetikte Olma:</strong> Her bakışı, iç çekişi veya sessizliği ihanet ya da reddedilme işareti için tarıyorsunuz.'
    ],
    scoreUnit: '/ 4 dezorganize bağlanma sinyali aktif',
    verdicts: [
      'Korkulu-kaçınmacı bağlanma örüntülerinizi görmek için yukarıdaki maddeleri işaretleyin.',
      'Hafif İkilem (1/4). Yalnızca yoğun stres anlarında güven savunmalarınız tetikleniyor.',
      'Orta Düzey İtme-Çekme (2/4). Kaygılı ve kaçınmacı devreler sinir sisteminizde çatışıyor.',
      'Yüksek Korkulu-Kaçınmacı Aktivasyon (3/4). Bağlanma sisteminiz yakınlığı hem arzuluyor hem tehdit sayıyor.',
      'Derin Dezorganize Bağlanma (4/4). Şimdi tam Bağlanma Stili Testini çözün ve 5-4-3-2-1 topraklama yapın.'
    ],
    primaryBtn: 'Ücretsiz Bağlanma Stili Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड डिसऑर्गनाइज्ड (भयभीत-अवॉइडेंट) अटैचमेंट स्क्रीनर',
    heading: 'क्या आप "पास आओ, लेकिन दूर रहो" के विरोधाभास में फंसे हैं?',
    sub: 'जब कोई रिश्ता गहरा होता है, तब महसूस होने वाले पुश-पुल संकेतों को चुनें:',
    items: [
      '<strong>चाहत और डर एक साथ:</strong> आप गहरा प्यार चाहते हैं, लेकिन जैसे ही कोई करीब आता है, आपका शरीर खतरे के लिए तैयार हो जाता है।',
      '<strong>पुश-पुल चक्र (Push-Pull):</strong> पार्टनर के करीब आने पर आप पीछे हटते हैं, और उसके दूर जाने पर घबरा जाते हैं।',
      '<strong>सुरक्षित रिश्ते में सेल्फ-सैबोटाज:</strong> शांत और स्थिर रिश्ता अजीब या असुरक्षित लगता है, जिससे भागने या झगड़ा करने का मन करता है।',
      '<strong>सूक्ष्म बदलावों पर अति-सतर्कता:</strong> धोखे या अस्वीकृति के संकेतों के लिए आप हर चेहरे के भाव और चुप्पी को स्कैन करते हैं।'
    ],
    scoreUnit: '/ 4 डिसऑर्गनाइज्ड अटैचमेंट संकेत सक्रिय',
    verdicts: [
      'भयभीत-अवॉइडेंट पैटर्न की जांच के लिए ऊपर दिए गए विकल्पों को चुनें।',
      'हल्का द्वंद्व (1/4)। केवल विशेष तनाव में ही आपकी सुरक्षा प्रणाली सक्रिय होती है।',
      'मध्यम पुश-पुल पैटर्न (2/4)। आपके नर्वस सिस्टम में चिंता और बचाव दोनों एक साथ लड़ रहे हैं।',
      'उच्च डिसऑर्गनाइज्ड सक्रियता (3/4)। आपका मन प्यार भी चाहता है और उसे खतरा भी मानता है।',
      'गहरा डिसऑर्गनाइज्ड अटैचमेंट पैटर्न (4/4)। अभी पूरा अटैचमेंट स्टाइल टेस्ट लें और 5-4-3-2-1 ग्राउंडिंग करें।'
    ],
    primaryBtn: 'मुफ्त अटैचमेंट स्टाइल टेस्ट शुरू करें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग से घबराहट शांत करें &rarr;'
  }
};

const CODEPENDENCY_LOCALES = {
  en: {
    badge: '30-SECOND CODEPENDENCY & ENMESHMENT SCREENER',
    heading: 'Are You Loving Deeply—or Losing Yourself in Codependency?',
    sub: 'Check the relational over-functioning patterns that drain your identity:',
    items: [
      '<strong>Worth Tied to Being Needed:</strong> You feel valuable and secure mainly when you are fixing, rescuing, or carrying someone else\'s problems.',
      '<strong>Emotional Enmeshment:</strong> If your partner or family member is stressed or unhappy, you cannot relax until you have fixed their mood.',
      '<strong>Chronic Over-Functioning:</strong> You anticipate others\' needs before they ask, while hiding your own exhaustion, hurts, or desires.',
      '<strong>Guilt &amp; Anxiety When Focusing on Yourself:</strong> Spending time, energy, or money on your own goals feels selfish or triggers fear of rejection.'
    ],
    scoreUnit: 'of 4 codependency signals active',
    verdicts: [
      'Check the items above to distinguish healthy interdependence from codependent enmeshment.',
      'Healthy Caregiving Balance (1/4). You care deeply while maintaining a solid sense of your own identity.',
      'Moderate Over-Functioning (2/4). You are taking on emotional labor that belongs to others.',
      'High Codependent Enmeshment (3/4). Your self-worth and nervous system are tethered to managing others.',
      'Severe Self-Abandonment & Burnout Risk (4/4). Chronic rescuing is exhausting your body—check your Attachment Style and Burnout Differential now.'
    ],
    primaryBtn: 'Check Your Relational Attachment Style &rarr;',
    subBtn: 'Run the Caregiver Burnout vs. Stress Differential &rarr;'
  },
  ko: {
    badge: '30초 공의존(Codependency) & 관계 밀착 판별기',
    heading: '깊은 사랑일까, 나를 잃어가는 "공의존(Codependency)"일까?',
    sub: '관계에서 내 정체성과 에너지를 갉아먹는 과잉 돌봄 신호를 체크해보세요:',
    items: [
      '<strong>필요한 존재가 되어야만 느끼는 가치감:</strong> 누군가의 문제를 해결해주거나 구원자 역할을 할 때만 내 존재 가치를 느낍니다.',
      '<strong>감정 경계 융합 (Enmeshment):</strong> 파트너나 가족의 기분이 안 좋으면 내 일처럼 불안해져서 그 기분을 해결하기 전까지 쉬지 못합니다.',
      '<strong>만성적 과잉 기능과 자기 욕구 은폐:</strong> 상대가 말하기도 전에 필요한 것을 챙겨주면서, 정작 내 피로와 상처는 말하지 못합니다.',
      '<strong>나를 챙길 때 밀려오는 죄책감:</strong> 내 목표나 휴식을 우선순위에 두면 이기적인 사람처럼 느껴지거나 버림받을까 봐 두렵습니다.'
    ],
    scoreUnit: '개 공의존 관계 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 건강한 상호의존과 공의존(자기 상실)을 구별해보세요.',
      '건강한 돌봄 균형(1/4). 타인을 배려하면서도 나 자신의 경계와 정체성을 잘 지키고 있습니다.',
      '중등도 과잉 책임 패턴(2/4). 타인이 감당해야 할 감정적 짐까지 대신 짊어지고 있습니다.',
      '높은 공의존 밀착 상태(3/4). 자존감과 신경계의 평온함이 타인의 기분 상태에 묶여 있습니다.',
      '심각한 자기 상실 및 관계 번아웃 위험(4/4). 만성적인 구원자 역할이 당신을 고갈시키고 있습니다. 지금 애착 유형과 번아웃 감별 진단을 확인하세요.'
    ],
    primaryBtn: '무료 애착 유형 &amp; 관계 패턴 진단하기 &rarr;',
    subBtn: '관계 소진 vs 번아웃 감별 진단 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN CO-ABHÄNGIGKEITS-CHECK',
    heading: 'Gesunde Nähe oder Selbstverlust durch Co-Abhängigkeit?',
    sub: 'Wählen Sie die Beziehungsmuster aus, die Ihre eigene Identität schwächen:',
    items: [
      '<strong>Selbstwert durch Gebrauchtwerden:</strong> Sie fühlen sich vor allem dann wertvoll, wenn Sie andere retten oder deren Probleme lösen.',
      '<strong>Emotionale Verschmelzung:</strong> Wenn Ihr Partner schlechte Laune hat, finden Sie keine Ruhe, bis Sie die Stimmung repariert haben.',
      '<strong>Chronisches Überfunktionieren:</strong> Sie erfüllen Wünsche ungefragt im Voraus, während Sie eigene Erschöpfung verbergen.',
      '<strong>Schuldgefühle bei Selbstfürsorge:</strong> Eigene Bedürfnisse an erste Stelle zu setzen fühlt sich egoistisch oder gefährlich an.'
    ],
    scoreUnit: 'von 4 Co-Abhängigkeits-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um gesunde Verbundenheit von Co-Abhängigkeit zu unterscheiden.',
      'Gesunde Balance (1/4). Sie sind hilfsbereit, wahren aber Ihre eigene Identität.',
      'Mittlere Überverantwortung (2/4). Sie übernehmen emotionale Lasten, die anderen gehören.',
      'Hohe Co-Abhängigkeit (3/4). Ihr innerer Frieden hängt stark vom Zustand anderer ab.',
      'Schwere Selbstaufgabe & Burnout-Gefahr (4/4). Prüfen Sie jetzt Ihren Bindungsstil und Ihr Burnout-Differential.'
    ],
    primaryBtn: 'Jetzt Bindungsstil-Profil kostenlos testen &rarr;',
    subBtn: 'Stress- vs. Burnout-Differential-Tool öffnen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE CODEPENDENCIA EMOCIONAL EN 30 SEGUNDOS',
    heading: '¿Es amor profundo o te estás perdiendo en la codependencia?',
    sub: 'Marca los patrones de sobre-cuidado que drenan tu identidad y energía:',
    items: [
      '<strong>Valor ligado a ser necesitado:</strong> Sientes que vales principalmente cuando resuelves problemas o rescatas a otros.',
      '<strong>Fusión emocional:</strong> Si tu pareja o familiar está mal, no puedes relajarte hasta arreglar su estado de ánimo.',
      '<strong>Sobrefuncionamiento crónico:</strong> Adivinas y cubres necesidades ajenas mientras ocultas tu propio cansancio.',
      '<strong>Culpa al priorizarte:</strong> Dedicar tiempo o energía a ti mismo te hace sentir egoísta o con miedo al rechazo.'
    ],
    scoreUnit: 'de 4 señales de codependencia activas',
    verdicts: [
      'Marca los puntos arriba para distinguir la interdependencia sana de la codependencia.',
      'Equilibrio relacional sano (1/4). Cuidas a los demás manteniendo tu propia identidad.',
      'Sobrerresponsabilidad moderada (2/4). Estás cargando mochilas emocionales que no te corresponden.',
      'Alta fusión codependiente (3/4). Tu autoestima y calma dependen de gestionar a los demás.',
      'Riesgo severo de agotamiento relacional (4/4). Evalúa tu Estilo de Apego y tu Diferencial de Burnout ahora.'
    ],
    primaryBtn: 'Descubrir mi Estilo de Apego Relacional &rarr;',
    subBtn: 'Abrir Diferencial de Estrés vs. Burnout &rarr;'
  },
  fr: {
    badge: 'TRIAGE CODÉPENDANCE RELATIONNELLE EN 30 SECONDES',
    heading: 'Amour profond ou oubli de soi dans la codépendance ?',
    sub: 'Cochez les réflexes de sur-responsabilité qui épuisent votre identité :',
    items: [
      '<strong>Valeur liée au rôle de sauveur :</strong> Vous vous sentez légitime surtout lorsque vous réparez ou portez les problèmes d\'autrui.',
      '<strong>Fusion émotionnelle :</strong> Si votre proche est tendu ou triste, il vous est impossible de vous détendre sans avoir réglé son humeur.',
      '<strong>Sur-fonctionnement chronique :</strong> Vous anticipez les besoins des autres tout en taisant votre propre épuisement.',
      '<strong>Culpabilité à penser à soi :</strong> Prendre du temps pour vos propres besoins vous donne l\'impression d\'être égoïste.'
    ],
    scoreUnit: 'sur 4 signaux de codépendance actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour différencier l\'interdépendance saine de la codépendance.',
      'Équilibre relationnel sain (1/4). Vous soutenez vos proches sans perdre votre axe.',
      'Sur-responsabilité modérée (2/4). Vous portez une charge émotionnelle qui appartient à l\'autre.',
      'Forte fusion codépendante (3/4). Votre estime de soi dépend excessivement du besoin qu\'on a de vous.',
      'Épuisement relationnel sévère (4/4). Faites le test de Style d\'Attachement et évaluez votre Burnout maintenant.'
    ],
    primaryBtn: 'Faire le Test de Style d\'Attachement &rarr;',
    subBtn: 'Ouvrir le Différentiel Stress vs Burnout &rarr;'
  },
  ja: {
    badge: '30秒・共依存（コードペンデンシー）度チェック',
    heading: 'それは深い愛情？それとも自分を見失う「共依存」？',
    sub: '人間関係で自分をすり減らしてしまう過剰な世話焼きパターンをチェックしてください：',
    items: [
      '<strong>「必要とされること」への価値依存：</strong> 誰かの問題を解決したり尽くしているときだけ、自分の存在価値を感じられる。',
      '<strong>感情の境界線の融合：</strong> パートナーや家族の機嫌が悪いと、自分のことのように不安になり解決するまで休めない。',
      '<strong>慢性的な過剰適応と自己抑圧：</strong> 相手の要求を先回りして満たす一方で、自分の疲れやSOSは決して言えない。',
      '<strong>自分を優先することへの罪悪感：</strong> 自分の時間や希望を優先しようとすると「わがままだ」と強い罪悪感に襲われる。'
    ],
    scoreUnit: '/ 4 個の共依存サインが該当',
    verdicts: [
      '上の項目をチェックして、健全な支え合いと「共依存」を見分けましょう。',
      '健全なバランス（1/4）。相手を大切にしつつ、自分の軸もしっかり保てています。',
      '中程度の過剰責任（2/4）。相手が背負うべき感情の課題まで自分が肩代わりしています。',
      '高い共依存傾向（3/4）。自分の心の平穏と自尊心が、他人の状態に強く縛られています。',
      '深刻な自己喪失＆燃え尽きリスク（4/4）。救済者役で心身が限界です。今すぐ愛着スタイル診断とバーンアウト鑑別を行ってください。'
    ],
    primaryBtn: '無料・愛着スタイル＆関係パターン診断 &rarr;',
    subBtn: 'ストレス vs 燃え尽き症候群・鑑別ツールを開く &rarr;'
  },
  zh: {
    badge: '30秒关系共生与“共同依赖（Codependency）”筛查',
    heading: '你是爱得深沉，还是在“共同依赖”中弄丢了自己？',
    sub: '勾选你在亲密关系或家庭中过度承担、自我消耗的信号：',
    items: [
      '<strong>价值感绑定于“被需要”：</strong> 只有在替别人解决问题、扮演拯救者或照顾者时，你才觉得自己有价值。',
      '<strong>情绪共生与边界模糊：</strong> 只要伴侣或家人情绪低落，你就无法安心休息，必须把对方的心情哄好才算解脱。',
      '<strong>慢性过度负责：</strong> 总是提前预判并包揽他人的需求，却习惯性隐藏自己的疲惫、委屈与真实渴望。',
      '<strong>把精力留给自己时的负罪感：</strong> 一旦把时间或精力优先花在自己身上，就会感到自私、内疚或害怕被疏远。'
    ],
    scoreUnit: '/ 4 项共同依赖（共生）信号激活',
    verdicts: [
      '勾选上方信号，区分健康的相互依恋与透支自我的“共同依赖”。',
      '健康的关怀边界 (1/4)。你富有同理心，同时保有清晰的自我中心。',
      '中度过度承担 (2/4)。你正在背负原本属于他人的情绪课题与人生责任。',
      '高度关系共生模式 (3/4)。你的自尊与神经系统稳定度已过度捆绑在他人身上。',
      '严重的自我迷失与耗竭风险 (4/4)。长期扮演拯救者正在掏空你，建议立即测评依恋风格与倦怠鉴别指数。'
    ],
    primaryBtn: '免费测试你的依恋风格与关系边界 &rarr;',
    subBtn: '打开关系耗竭 vs 压力鉴别工具 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE CODEPENDÊNCIA EMOCIONAL EM 30 SEGUNDOS',
    heading: 'É amor profundo ou você está se perdendo na codependência?',
    sub: 'Marque os padrões de excesso de cuidado que drenam sua identidade:',
    items: [
      '<strong>Valor ligado a ser necessário:</strong> Você só se sente valioso quando está salvando ou resolvendo problemas alheios.',
      '<strong>Fusão emocional:</strong> Se seu parceiro está mal-humorado, você não consegue relaxar até consertar o humor dele.',
      '<strong>Hiperfuncionamento crônico:</strong> Você antecipa as necessidades de todos enquanto esconde seu próprio cansaço.',
      '<strong>Culpa ao se priorizar:</strong> Cuidar dos próprios objetivos parece egoísmo ou gera medo de rejeição.'
    ],
    scoreUnit: 'de 4 sinais de codependência ativos',
    verdicts: [
      'Marque os itens acima para diferenciar interdependência saudável de codependência.',
      'Equilíbrio saudável (1/4). Você apoia os outros sem abrir mão de quem é.',
      'Sobrerresponsabilidade moderada (2/4). Você está assumindo cargas emocionais que pertencem ao outro.',
      'Alta fusão codependente (3/4). Sua autoestima depende excessivamente de cuidar dos outros.',
      'Risco severo de esgotamento relacional (4/4). Faça o Teste de Estilo de Apego e o Diferencial de Burnout agora.'
    ],
    primaryBtn: 'Descobrir meu Estilo de Apego Gratuito &rarr;',
    subBtn: 'Abrir Ferramenta Diferencial Estresse vs. Burnout &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА СОЗАВИСИМОСТЬ В ОТНОШЕНИЯХ',
    heading: 'Это глубокая любовь или потеря себя в созависимости?',
    sub: 'Отметьте признаки гиперответственности, которые истощают вашу личность:',
    items: [
      '<strong>Ценность через «нужность»:</strong> Вы чувствуете свою значимость только тогда, когда спасаете других или решаете их проблемы.',
      '<strong>Эмоциональное слияние:</strong> Если близкий человек расстроен, вы не можете успокоиться, пока не исправите его настроение.',
      '<strong>Хроническая сверхзабота:</strong> Вы предугадываете чужие желания, полностью игнорируя собственную усталость.',
      '<strong>Вина за заботу о себе:</strong> Любая попытка поставить свои интересы на первое место вызывает чувство эгоизма и тревогу.'
    ],
    scoreUnit: 'из 4 признаков созависимости активно',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить здоровую близость от созависимого слияния.',
      'Здоровый баланс (1/4). Вы умеете заботиться о близких, сохраняя собственные границы.',
      'Умеренная гиперответственность (2/4). Вы берете на себя чужую эмоциональную работу.',
      'Высокая созависимость (3/4). Ваша самооценка и покой полностью зависят от состояния партнера.',
      'Риск глубокого выгорания в отношениях (4/4). Пройдите тест на тип привязанности и проверьте индекс выгорания сейчас.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности &rarr;',
    subBtn: 'Открыть дифференциал Стресс vs Выгорание &rarr;'
  },
  id: {
    badge: 'SKRINING KODEPENDENSI HUBUNGAN DALAM 30 DETIK',
    heading: 'Cinta yang Dalam atau Kehilangan Diri dalam Kodependensi?',
    sub: 'Centang pola pengorbanan berlebih yang menguras identitas dan energi Anda:',
    items: [
      '<strong>Harga Diri Bergantung pada "Dibutuhkan":</strong> Anda merasa berharga terutama saat menyelamatkan atau menyelesaikan masalah orang lain.',
      '<strong>Leburnya Batas Emosi:</strong> Jika pasangan atau keluarga sedang murung, Anda tidak bisa tenang sebelum memperbaiki suasana hati mereka.',
      '<strong>Terlalu Mengurus Orang Lain:</strong> Anda selalu menebak kebutuhan orang lain sambil menyembunyikan kelelahan sendiri.',
      '<strong>Rasa Bersalah Saat Mengutamakan Diri:</strong> Meluangkan waktu untuk diri sendiri terasa egois atau memicu takut ditolak.'
    ],
    scoreUnit: 'dari 4 sinyal kodependensi aktif',
    verdicts: [
      'Centang poin di atas untuk membedakan saling ketergantungan sehat dari kodependensi.',
      'Keseimbangan Peduli Sehat (1/4). Anda peduli tanpa kehilangan jati diri.',
      'Tanggung Jawab Berlebih Sedang (2/4). Anda memikul beban emosi yang seharusnya milik orang lain.',
      'Kodependensi Tinggi (3/4). Ketenangan saraf dan harga diri Anda terlalu terikat pada orang lain.',
      'Risiko Berat Kehilangan Diri &amp; Burnout (4/4). Cek Gaya Kelekatan dan Diferensial Burnout Anda sekarang.'
    ],
    primaryBtn: 'Cek Profil Gaya Kelekatan Gratis &rarr;',
    subBtn: 'Buka Alat Diferensial Stres vs Burnout &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İLİŞKİSEL EŞ-BAĞIMLILIK (CODEPENDENCY) TARAMASI',
    heading: 'Derin Sevgi mi Yoksa Eş-Bağımlılıkta Kendini Kaybetmek mi?',
    sub: 'Kimliğinizi ve enerjinizi tüketen aşırı sorumluluk örüntülerini işaretleyin:',
    items: [
      '<strong>İhtiyaç Duyulmaya Bağlı Değer:</strong> Kendinizi en çok başkalarının sorunlarını çözerken veya onları kurtarırken değerli hissediyorsunuz.',
      '<strong>Duygusal İç İçe Geçme:</strong> Partneriniz veya aileniz mutsuzsa, onların modunu düzeltmeden rahatlayamıyorsunuz.',
      '<strong>Kronik Aşırı Vericilik:</strong> Kendi yorgunluğunuzu gizlerken başkalarının ihtiyaçlarını onlar söylemeden karşılıyorsunuz.',
      '<strong>Kendine Odaklanınca Suçluluk:</strong> Kendi hedeflerinize zaman ayırmak bencilce geliyor veya terk edilme kaygısı yaratıyor.'
    ],
    scoreUnit: '/ 4 eş-bağımlılık sinyali aktif',
    verdicts: [
      'Sağlıklı bağlılık ile eş-bağımlılığı ayırt etmek için yukarıdaki maddeleri işaretleyin.',
      'Sağlıklı Bakım Dengesi (1/4). Kendi sınırlarınızı koruyarak değer veriyorsunuz.',
      'Orta Düzey Aşırı Sorumluluk (2/4). Başkalarına ait duygusal yükleri sırtlanıyorsunuz.',
      'Yüksek Eş-Bağımlılık (3/4). Öz-değeriniz başkalarını yönetmeye aşırı bağlanmış durumda.',
      'Ciddi Tükenmişlik ve Kendini İhmal Riski (4/4). Bağlanma Stilinizi ve Tükenmişlik Farkınızı hemen ölçün.'
    ],
    primaryBtn: 'Ücretsiz Bağlanma Stili Testini Çöz &rarr;',
    subBtn: 'Stres vs Tükenmişlik Ayırıcı Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड कोडिपेंडेंसी (सह-निर्भरता) स्क्रीनर',
    heading: 'क्या यह गहरा प्यार है या आप कोडिपेंडेंसी में खुद को खो रहे हैं?',
    sub: 'रिश्तों में अपनी पहचान और ऊर्जा खत्म करने वाले पैटर्न को चुनें:',
    items: [
      '<strong>"ज़रूरत" बनने से जुड़ा आत्म-मूल्य:</strong> आप खुद को तभी महत्वपूर्ण मानते हैं जब आप किसी की समस्याएं सुलझा रहे हों या उन्हें बचा रहे हों।',
      '<strong>भावनात्मक उलझाव (Enmeshment):</strong> यदि पार्टनर या परिवार का मूड खराब है, तो उसे ठीक किए बिना आप शांत नहीं बैठ पाते।',
      '<strong>अपनी थकान छिपाकर दूसरों की सेवा:</strong> आप अपनी ज़रूरतें दबाकर दूसरों की बिन-मांगी ज़रूरतें पूरी करने में लगे रहते हैं।',
      '<strong>खुद को प्राथमिकता देने पर अपराधबोध:</strong> अपने लक्ष्यों या आराम पर ध्यान देना स्वार्थी लगता है या अस्वीकृति का डर पैदा करता है।'
    ],
    scoreUnit: '/ 4 कोडिपेंडेंसी संकेत सक्रिय',
    verdicts: [
      'स्वस्थ आपसी निर्भरता और कोडिपेंडेंसी में अंतर जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'स्वस्थ संतुलन (1/4)। आप अपनी पहचान खोए बिना दूसरों की परवाह करते हैं।',
      'मध्यम अति-ज़िम्मेदारी (2/4)। आप दूसरों के भावनात्मक बोझ को अपने कंधों पर ले रहे हैं।',
      'उच्च कोडिपेंडेंसी (3/4)। आपकी मानसिक शांति पूरी तरह दूसरों के मूड पर टिकी है।',
      'गंभीर आत्म-त्याग और बर्नआउट जोखिम (4/4)। अभी अपना अटैचमेंट स्टाइल और बर्नआउट डिफरेंशियल जांचें।'
    ],
    primaryBtn: 'अपना अटैचमेंट स्टाइल प्रोफाइल जानें &rarr;',
    subBtn: 'स्ट्रेस बनाम बर्नआउट डिफरेंशियल टूल खोलें &rarr;'
  }
};

const BOUNDARIES_GUIDE_LOCALES = {
  en: {
    badge: '30-SECOND BOUNDARY LEAK & POROSITY SCREENER',
    heading: 'Where Are Your Personal Boundaries Leaking Energy Right Now?',
    sub: 'Check the boundary collapse patterns you experienced over the past 2 weeks:',
    items: [
      '<strong>The Guilt-Driven "Yes":</strong> You agreed to a favor, meeting, or plan you didn\'t have bandwidth for because saying no felt too uncomfortable.',
      '<strong>Over-Explaining &amp; Justifying Limits:</strong> When you do decline something, you write long paragraphs of apologies and excuses to soften the blow.',
      '<strong>Emotional Sponge Absorption:</strong> You regularly absorb friends\', coworkers\', or partners\' venting until your own nervous system is exhausted.',
      '<strong>After-Hours Digital &amp; Time Bleed:</strong> You answer messages, requests, or work pings immediately during rest hours so no one thinks you\'re difficult.'
    ],
    scoreUnit: 'of 4 boundary leak zones active',
    verdicts: [
      'Check the items above to pinpoint where your time, emotional, and energy boundaries are leaking.',
      'Solid Boundary Architecture (1/4). Only occasional high-pressure requests breach your limits.',
      'Moderate Boundary Porosity (2/4). Guilt is overriding your capacity limits in key areas of life.',
      'High Energy Leak & Resentment Risk (3/4). Porous limits are draining your nervous system—use ready-made boundary scripts below.',
      'Severe Boundary Collapse (4/4). Your time and emotional energy are unprotected—check your stress load and generate boundary scripts now.'
    ],
    primaryBtn: 'Check Your Boundary &amp; Nervous System Stress Load &rarr;',
    subBtn: 'Open the Interactive Boundary &amp; Refusal Script Builder &rarr;'
  },
  ko: {
    badge: '30초 심리적 경계(Boundary) 누수 지점 판별기',
    heading: '지금 내 시간과 감정 에너지는 어디서 새어나가고 있을까?',
    sub: '최근 2주간 거절하지 못해 에너지가 고갈되었던 경계 누수 신호를 체크해보세요:',
    items: [
      '<strong>죄책감에 떠밀린 수락:</strong> 내 여유가 없는데도 거절할 때의 어색함과 죄책감이 싫어 부탁이나 약속을 수락했습니다.',
      '<strong>거절할 때 과잉 해명과 사과:</strong> 거절을 할 때마다 상대가 기분 나빠할까 봐 구구절절 긴 변명과 사과를 덧붙입니다.',
      '<strong>감정 쓰레기통 역할 (정서적 경계 누수):</strong> 주변 사람들의 하소연과 부정적 감정을 그대로 흡수해 정작 내 신경계가 지쳐버립니다.',
      '<strong>퇴근 후·휴식 시간의 디지털 경계 침범:</strong> 까다로운 사람으로 보이기 싫어 쉬는 시간에도 연락이나 요청에 즉각 답장합니다.'
    ],
    scoreUnit: '개 경계(Boundary) 누수 영역 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내 시간·감정·에너지 경계가 얼마나 보호받고 있는지 확인해보세요.',
      '건강한 경계 아키텍처(1/4). 대체로 내 선을 잘 지키며 필요한 순간에만 유연하게 대처하고 있습니다.',
      '중등도 경계 느슨함(2/4). 죄책감 회로가 내 에너지 한계선보다 먼저 작동하고 있습니다.',
      '높은 에너지 누수 및 번아웃 위험(3/4). 느슨한 경계로 인해 만성 피로와 억울함이 쌓이고 있습니다.',
      '심각한 경계 붕괴 상태(4/4). 시간과 감정 에너지가 무방비로 소진되고 있습니다. 지금 스트레스 체크와 거절 스크립트 도구를 활용하세요.'
    ],
    primaryBtn: '무료 스트레스 &amp; 경계 피로도 진단하기 &rarr;',
    subBtn: '상황별 거절·경계 설정 대화 스크립트 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN GRENZEN- & ENERGIELECK-CHECK',
    heading: 'Wo verlieren Ihre persönlichen Grenzen aktuell Energie?',
    sub: 'Wählen Sie die Situationen aus, die Sie in den letzten 2 Wochen erlebt haben:',
    items: [
      '<strong>Das schuldgetriebene „Ja“:</strong> Sie haben einer Bitte oder einem Treffen zugestimmt, obwohl Sie keine Kapazität hatten.',
      '<strong>Übermäßiges Rechtfertigen:</strong> Wenn Sie absagen, liefern Sie lange Erklärungen und Entschuldigungen mit.',
      '<strong>Emotionaler Schwamm:</strong> Sie nehmen den Frust und die Sorgen anderer so stark auf, dass Ihr eigenes Nervensystem erschöpft ist.',
      '<strong>Digitale Entgrenzung am Feierabend:</strong> Sie antworten auch in Ruhezeiten sofort auf Nachrichten, um niemanden zu verärgern.'
    ],
    scoreUnit: 'von 4 Grenz-Lecks aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre Zeit- und Energiegrenzen zu prüfen.',
      'Stabile Grenzarchitektur (1/4). Ihre Grenzen schützen Ihre Energie im Alltag zuverlässig.',
      'Mittlere Durchlässigkeit (2/4). Schuldgefühle weichen Ihre Belastungsgrenzen auf.',
      'Hoher Energieverlust (3/4). Durchlässige Grenzen belasten Ihr Nervensystem spürbar.',
      'Schwere Grenzauflösung (4/4). Prüfen Sie jetzt Ihre Stressbelastung und nutzen Sie fertige Abgrenzungs-Skripte.'
    ],
    primaryBtn: 'Zum 3-Minuten Stress- &amp; Belastungs-Check &rarr;',
    subBtn: 'Interaktiven Abgrenzungs-Skript-Generator öffnen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE FUGAS DE LÍMITES Y ENERGÍA EN 30 SEGUNDOS',
    heading: '¿Por dónde se está escapando tu energía por falta de límites?',
    sub: 'Marca las situaciones que has vivido en las últimas 2 semanas:',
    items: [
      '<strong>El "sí" por culpa:</strong> Aceptaste un favor o plan sin tener energía porque decir "no" te resultaba demasiado incómodo.',
      '<strong>Sobre-justificar tus negativas:</strong> Cuando rechazas algo, das largas explicaciones y disculpas para suavizarlo.',
      '<strong>Esponja emocional:</strong> Absorbes las quejas y crisis ajenas hasta quedar mentalmente drenado.',
      '<strong>Invasión digital y de tiempo libre:</strong> Respondes mensajes o pedidos fuera de horario al instante para no parecer difícil.'
    ],
    scoreUnit: 'de 4 fugas de límites activas',
    verdicts: [
      'Marca los puntos arriba para detectar dónde tus límites son demasiado porosos.',
      'Arquitectura de límites sólida (1/4). Proteges bien tu tiempo y energía vital.',
      'Porosidad moderada (2/4). La culpa está debilitando tus límites personales.',
      'Alta fuga de energía y resentimiento (3/4). Necesitas guiones claros para proteger tu sistema nervioso.',
      'Colapso severo de límites (4/4). Evalúa tu carga de estrés y genera tus frases de límites ahora mismo.'
    ],
    primaryBtn: 'Hacer el Chequeo de Estrés y Límites &rarr;',
    subBtn: 'Abrir Generador de Guiones para Poner Límites &rarr;'
  },
  fr: {
    badge: 'TRIAGE FUITES D\'ÉNERGIE & LIMITES EN 30 SECONDES',
    heading: 'Où vos limites personnelles laissent-elles fuir votre énergie ?',
    sub: 'Cochez les situations vécues au cours des 2 dernières semaines :',
    items: [
      '<strong>Le « oui » par culpabilité :</strong> Vous avez accepté une demande sans avoir l\'énergie, par peur de dire non.',
      '<strong>Sur-justification :</strong> Lorsque vous refusez, vous multipliez les excuses et les longues explications.',
      '<strong>Éponge émotionnelle :</strong> Vous absorbez les plaintes et le stress des autres jusqu\'à l\'épuisement.',
      '<strong>Débordement numérique et horaire :</strong> Vous répondez immédiatement aux sollicitations pendant votre repos pour ne froisser personne.'
    ],
    scoreUnit: 'sur 4 zones de fuite de limites actives',
    verdicts: [
      'Cochez les éléments ci-dessus pour repérer vos fuites d\'énergie.',
      'Architecture de limites solide (1/4). Vous protégez efficacement votre espace vital.',
      'Porosité modérée (2/4). La culpabilité fragilise vos limites de temps et d\'énergie.',
      'Forte fuite d\'énergie (3/4). Vos limites poreuses épuisent votre système nerveux.',
      'Effondrement sévère des limites (4/4). Faites votre bilan de stress et utilisez nos scripts de refus prêts à l\'emploi.'
    ],
    primaryBtn: 'Faire le Bilan de Stress en 3 Minutes &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts de Limites &rarr;'
  },
  ja: {
    badge: '30秒・バウンダリー（心の境界線）エネルギー漏れチェック',
    heading: 'あなたの時間と心のエネルギー、どこから漏れていますか？',
    sub: '過去2週間で経験した「境界線のゆるみ」パターンをチェックしてください：',
    items: [
      '<strong>罪悪感からの「イエス」：</strong> 余裕がないのに、断る気まずさや罪悪感に負けて頼み事や予定を引き受けた。',
      '<strong>断る時の過剰な言い訳：</strong> 断る際、相手を傷つけないよう長々とした理由や謝罪を並べてしまう。',
      '<strong>感情のスポンジ状態：</strong> 周囲の愚痴や不機嫌をそのまま吸い取ってしまい、自分の神経がぐったり疲れる。',
      '<strong>休息時間のデジタル侵食：</strong> 感じが悪いと思われたくなくて、休日や夜間でも連絡にすぐ返信してしまう。'
    ],
    scoreUnit: '/ 4 個の境界線エネルギー漏れサインが該当',
    verdicts: [
      '上の項目をチェックして、あなたの境界線（バウンダリー）の強度を確認しましょう。',
      '健全なバウンダリー（1/4）。自分の時間と心のスペースを適切に守れています。',
      '中程度の境界線のゆるみ（2/4）。罪悪感があなたのキャパシティ管理を邪魔しています。',
      '高いエネルギー漏出リスク（3/4）。境界線の曖昧さが慢性的な疲労と不満を生んでいます。',
      '深刻なバウンダリー崩壊（4/4）。今すぐストレス負荷をチェックし、実践的な「断り方スクリプト」を活用してください。'
    ],
    primaryBtn: '無料ストレス＆境界線疲労チェックを受ける &rarr;',
    subBtn: '場面別の断り方・境界線スクリプトツールを開く &rarr;'
  },
  zh: {
    badge: '30秒个人边界（Boundaries）能量漏斗筛查',
    heading: '你的时间与情绪能量，正从哪条边界裂缝中流失？',
    sub: '勾选你在过去两周内频繁出现的“边界失守”信号：',
    items: [
      '<strong>被内疚绑架的“好吧”：</strong> 明明自己已经精力透支，却因为害怕拒绝带来的尴尬或内疚而勉强答应。',
      '<strong>拒绝时的过度解释与道歉：</strong> 每次说“不”都要附上长篇大论的理由和反复道歉，生怕对方不高兴。',
      '<strong>情绪海绵体质：</strong> 习惯性吸收朋友、同事或伴侣的抱怨与负能量，导致自己的神经系统被抽干。',
      '<strong>休息时间的数字边界失守：</strong> 在下班或休息时间依然秒回消息和请求，生怕别人觉得自己难相处。'
    ],
    scoreUnit: '/ 4 个边界漏能区域激活',
    verdicts: [
      '勾选上方信号，定位你的时间、情绪与精力边界在哪里失守。',
      '稳固的边界架构 (1/4)。你能清晰守护个人空间，仅在少数高压情境下略有妥协。',
      '中度边界松动 (2/4)。内疚感正在凌驾于你的真实精力上限之上。',
      '高能量流失与怨气积累 (3/4)。过于松散的边界正让你的神经系统长期超负荷运转。',
      '严重的边界崩塌状态 (4/4)。你的时间与心理空间毫无防备，建议立即检测压力负荷并获取现成的温和拒绝话术。'
    ],
    primaryBtn: '开始3分钟免费压力与边界负荷测试 &rarr;',
    subBtn: '打开互动式温和拒绝与边界话术生成器 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE VAZAMENTO DE LIMITES E ENERGIA EM 30S',
    heading: 'Por onde seus limites pessoais estão vazando energia?',
    sub: 'Marque os padrões de falta de limites que você viveu nas últimas 2 semanas:',
    items: [
      '<strong>O "sim" movido pela culpa:</strong> Você aceitou um pedido ou compromisso sem ter energia porque dizer não parecia difícil demais.',
      '<strong>Excesso de justificativas:</strong> Ao recusar algo, você escreve longas desculpas e explicações para amenizar.',
      '<strong>Esponja emocional:</strong> Você absorve desabafos e crises alheias até seu próprio sistema nervoso ficar exausto.',
      '<strong>Invasão digital fora de hora:</strong> Você responde mensagens e demandas imediatamente no seu descanso para agradar.'
    ],
    scoreUnit: 'de 4 zonas de vazamento de limites ativas',
    verdicts: [
      'Marque os itens acima para identificar onde seus limites estão frágeis.',
      'Arquitetura de limites sólida (1/4). Você protege bem seu tempo e energia.',
      'Limites moderadamente porosos (2/4). A culpa está enfraquecendo sua proteção pessoal.',
      'Alto vazamento de energia (3/4). Limites frágeis estão drenando seu sistema nervoso.',
      'Colapso severo de limites (4/4). Faça o Check-up de Estresse e use o Construtor de Scripts de Limites agora.'
    ],
    primaryBtn: 'Fazer o Check-up de Estresse e Limites &rarr;',
    subBtn: 'Abrir Construtor de Scripts para Dizer Não &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ПРОНИЦАЕМОСТЬ ЛИЧНЫХ ГРАНИЦ',
    heading: 'Через какие бреши в границах утекает ваша энергия?',
    sub: 'Отметьте ситуации нарушения границ, которые происходили за последние 2 недели:',
    items: [
      '<strong>«Да» из чувства вины:</strong> Вы соглашались на просьбы в ущерб себе, потому что отказать было слишком неловко.',
      '<strong>Долгие оправдания при отказе:</strong> Говоря «нет», вы подробно объясняетесь и извиняетесь, чтобы никого не обидеть.',
      '<strong>Эмоциональная губка:</strong> Вы впитываете чужие жалобы и негатив, пока ваша собственная нервная система не истощится.',
      '<strong>Размытие цифровых и временных границ:</strong> Вы мгновенно отвечаете на рабочие и личные запросы в часы отдыха.'
    ],
    scoreUnit: 'из 4 зон утечки энергии через границы активно',
    verdicts: [
      'Отметьте пункты выше, чтобы понять, где ваши личные границы требуют укрепления.',
      'Надежные границы (1/4). Вы уверенно защищаете свое время и эмоциональный ресурс.',
      'Умеренная проницаемость границ (2/4). Чувство вины заставляет вас уступать там, где нужен отказ.',
      'Сильная утечка энергии (3/4). Размытые границы перегружают вашу нервную систему.',
      'Критический распад границ (4/4). Проверьте свой уровень стресса и используйте готовые скрипты мягкого отказа.'
    ],
    primaryBtn: 'Пройти 3-минутную проверку уровня стресса &rarr;',
    subBtn: 'Открыть конструктор скриптов личных границ &rarr;'
  },
  id: {
    badge: 'SKRINING KEBOCORAN BATASAN DIRI (BOUNDARIES) 30 DETIK',
    heading: 'Di Mana Batasan Pribadi Anda Membocorkan Energi Saat Ini?',
    sub: 'Centang pola runtuhnya batasan yang Anda alami selama 2 minggu terakhir:',
    items: [
      '<strong>Kata "Ya" karena Rasa Bersalah:</strong> Anda menyanggupi permintaan saat sudah lelah karena tidak enak hati untuk menolak.',
      '<strong>Alasan Berlebihan Saat Menolak:</strong> Saat berkata tidak, Anda memberikan penjelasan panjang lebar dan meminta maaf berulang kali.',
      '<strong>Spons Emosi Orang Lain:</strong> Anda menyerap curhatan dan krisis emosi orang sekitar hingga saraf Anda sendiri terkuras.',
      '<strong>Bocornya Waktu Istirahat &amp; Digital:</strong> Anda langsung membalas pesan atau tugas di jam istirahat agar tidak dianggap sulit.'
    ],
    scoreUnit: 'dari 4 titik kebocoran batasan aktif',
    verdicts: [
      'Centang poin di atas untuk menemukan di mana batasan waktu dan emosi Anda bocor.',
      'Fondasi Batasan Kuat (1/4). Anda mampu menjaga ruang pribadi dengan sehat.',
      'Batasan Cukup Rapuh (2/4). Rasa bersalah sering mengalahkan batas kapasitas Anda.',
      'Kebocoran Energi Tinggi (3/4). Batasan yang terlalu longgar sedang menguras sistem saraf Anda.',
      'Runtuhnya Batasan Diri (4/4). Cek beban stres Anda dan gunakan Pembuat Skrip Penolakan sekarang.'
    ],
    primaryBtn: 'Ikuti Cek Beban Stres &amp; Batasan (3 Menit) &rarr;',
    subBtn: 'Buka Alat Pembuat Skrip Menolak dengan Sopan &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK KİŞİSEL SINIR VE ENERJİ KAÇAĞI TARAMASI',
    heading: 'Kişisel Sınırlarınız Nereden Enerji Kaçırıyor?',
    sub: 'Son 2 haftada yaşadığınız sınır ihlali örüntülerini işaretleyin:',
    items: [
      '<strong>Suçluluk Kaynaklı "Evet":</strong> Enerjiniz olmadığı halde hayır demek rahatsız hissettirdiği için bir isteği kabul ettiniz.',
      '<strong>Reddederken Aşırı Açıklama:</strong> Hayır dediğinizde karşı taraf kırılmasın diye uzun bahaneler ve özürler sıralıyorsunuz.',
      '<strong>Duygusal Sünger Olma:</strong> Çevrenizdekilerin dertlerini ve öfkesini kendi sinir sisteminiz tükenene kadar emiyorsunuz.',
      '<strong>Mesai Dışı Dijital Sınır İhlali:</strong> Zor biri gibi görünmemek için dinlenme saatlerinizde bile mesajlara anında dönüyorsunuz.'
    ],
    scoreUnit: '/ 4 sınır kaçağı bölgesi aktif',
    verdicts: [
      'Zaman, duygu ve enerji sınırlarınızın nerede zorlandığını görmek için yukarıdakileri işaretleyin.',
      'Sağlam Sınır Mimarisi (1/4). Kişisel alanınızı ve enerjinizi dengeli biçimde koruyorsunuz.',
      'Orta Düzey Sınır Geçirgenliği (2/4). Suçluluk duygusu kapasite sınırlarınızı aşmanıza neden oluyor.',
      'Yüksek Enerji Kaçağı (3/4). Gevşek sınırlar sinir sisteminizi ve sabrınızı tüketiyor.',
      'Ciddi Sınır Çöküşü (4/4). Stres yükünüzü hemen ölçün ve hazır sınır koyma cümlelerini kullanın.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Sınır Yükü Testini Çöz &rarr;',
    subBtn: 'Sınır Koyma ve Hayır Deme Skript Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड पर्सनल बाउंड्री और एनर्जी लीक स्क्रीनर',
    heading: 'आपकी व्यक्तिगत सीमाओं (Boundaries) से ऊर्जा कहाँ रिस रही है?',
    sub: 'पिछले 2 हफ्तों में अनुभव किए गए बाउंड्री पैटर्न को चुनें:',
    items: [
      '<strong>अपराधबोध के कारण "हाँ" कहना:</strong> क्षमता न होने पर भी आपने सिर्फ इसलिए हामी भरी क्योंकि "ना" कहना असहज लग रहा था।',
      '<strong>मना करते समय लंबी सफाई देना:</strong> जब आप किसी काम के लिए मना करते हैं, तो बुरा न लगे इसलिए ढेरों बहाने और माफ़ी जोड़ते हैं।',
      '<strong>इमोशनल स्पंज बनना:</strong> दूसरों की शिकायतों और तनाव को इतना सोख लेना कि आपका अपना नर्वस सिस्टम थक जाए।',
      '<strong>आराम के समय डिजिटल सीमा टूटना:</strong> लोग आपको कठिन न समझें, इसलिए आराम के घंटों में भी मैसेज और काम का तुरंत जवाब देना।'
    ],
    scoreUnit: '/ 4 बाउंड्री लीक क्षेत्र सक्रिय',
    verdicts: [
      'अपने समय और भावनात्मक ऊर्जा के रिसाव को पहचानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'मजबूत बाउंड्री संरचना (1/4)। आप अपनी ऊर्जा और व्यक्तिगत स्पेस की अच्छी तरह रक्षा कर रहे हैं।',
      'मध्यम बाउंड्री कमजोरी (2/4)। अपराधबोध आपकी क्षमता की सीमाओं को कमजोर कर रहा है।',
      'उच्च ऊर्जा रिसाव (3/4)। कमजोर सीमाएं आपके नर्वस सिस्टम को थका रही हैं।',
      'गंभीर बाउंड्री कोलैप्स (4/4)। अभी अपना स्ट्रेस लोड जांचें और बाउंड्री स्क्रिप्ट बिल्डर का उपयोग करें।'
    ],
    primaryBtn: '3-मिनट का मुफ्त स्ट्रेस और बाउंड्री चेक लें &rarr;',
    subBtn: 'बाउंड्री और "ना" कहने की स्क्रिप्ट टूल खोलें &rarr;'
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

  // 1. disorganized-attachment-style.html (12 locales)
  for (const [lang, loc] of Object.entries(DISORGANIZED_ATTACH_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'disorganized-attachment-style.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'disorganizedAttachScreener',
      chkClass: 'disatt-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=disorganized_attach_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=disorganized_attach_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/disorganized-attachment-style.html`);
    console.log(`[PASS] disorganized-attachment-style (${lang})`);
  }

  // 2. codependency-signs-relationship.html (12 locales)
  for (const [lang, loc] of Object.entries(CODEPENDENCY_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'codependency-signs-relationship.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'codependencyScreener',
      chkClass: 'codep-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=codependency_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}&source=codependency_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/codependency-signs-relationship.html`);
    console.log(`[PASS] codependency-signs-relationship (${lang})`);
  }

  // 3. boundaries-setting-complete-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(BOUNDARIES_GUIDE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'boundaries-setting-complete-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'boundaryLeakScreener',
      chkClass: 'bound-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=boundaries_guide_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=boundaries_guide_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/boundaries-setting-complete-guide.html`);
    console.log(`[PASS] boundaries-setting-complete-guide (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 3: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

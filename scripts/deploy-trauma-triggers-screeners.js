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

const STRESS_4F_LOCALES = {
  en: {
    badge: '30-SECOND 4F SURVIVAL RESPONSE SCREENER',
    heading: 'Which 4F Survival Mode Fires First Under Pressure?',
    sub: 'Check the automatic nervous system reactions you recognize when stress or conflict hits:',
    items: [
      '<strong>Fight (Sympathetic Control Surge):</strong> Jaw clenching, heat in the chest, and an immediate urge to push back, critique, or regain control.',
      '<strong>Flight (Compulsive Busyness &amp; Escape):</strong> Restless energy, over-planning, overworking, or needing to stay constantly busy so you don\'t feel anxious.',
      '<strong>Freeze (Dorsal Vagal Shutdown):</strong> Brain fog, physical heaviness, procrastination paralysis, or zoning out into screens when overwhelmed.',
      '<strong>Fawn (Compulsive Appeasement):</strong> Automatically apologizing, smoothing over tension, or erasing your own needs to keep others calm.'
    ],
    scoreUnit: 'of 4 trauma survival modes active',
    verdicts: [
      'Check the 4F patterns above to see how your autonomic nervous system handles perceived threat.',
      'Single Dominant 4F Reflex (1/4). You have one primary protective mode under acute pressure—take the full test to see your exact profile.',
      'Dual 4F Hybrid Pattern (2/4). Like many adults, you oscillate between two survival modes (such as Flight-Fawn or Fight-Freeze).',
      'Multi-Mode Autonomic Strain (3/4). Your nervous system is cycling through multiple survival defenses to manage chronic stress.',
      'Full 4F Nervous System Overload (4/4). All four survival circuits are firing—take the Stress Check and run a 5-4-3-2-1 grounding reset now.'
    ],
    primaryBtn: 'Take the Free 4F Stress Response Check &rarr;',
    subBtn: 'Exit Survival Mode with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 4F 투쟁·도피·동결·영합 반응 스크리너',
    heading: '위기나 갈등 순간, 내 신경계는 어떤 4F 생존 모드를 켤까?',
    sub: '스트레스나 비판에 직면했을 때 몸과 마음이 자동으로 반응하는 방식을 체크해보세요:',
    items: [
      '<strong>투쟁 (Fight · 통제와 맞서기):</strong> 턱에 힘이 들어가고 가슴이 뜨거워지며, 반박하거나 상황을 주도해 통제권을 되찾으려 합니다.',
      '<strong>도피 (Flight · 과잉 활동과 회피):</strong> 가만히 있으면 불안해서 일에 몰두하거나 계획을 과하게 세우며 쉴 새 없이 움직입니다.',
      '<strong>동결 (Freeze · 셧다운과 마비):</strong> 압도되면 머릿속이 하얘지고 몸이 무거워지며, 할 일을 미루거나 스마트폰 속으로 숨어버립니다.',
      '<strong>영합 (Fawn · 비위 맞추기와 자기 포기):</strong> 상대의 눈치를 살피며 먼저 사과하고, 내 욕구를 지워서라도 분위기를 부드럽게 만듭니다.'
    ],
    scoreUnit: '개 4F 생존 방어 모드 활성화 (총 4개)',
    verdicts: [
      '위 4F 항목을 체크하여 자율신경계의 주된 생존 방어 유형을 확인해보세요.',
      '단일 주도형 4F 반응(1/4). 압박 상황에서 하나의 뚜렷한 방어 기제가 우선 작동합니다.',
      '이중 복합형 4F 패턴(2/4). 도피-영합(Flight-Fawn)이나 투쟁-동결처럼 두 가지 모드를 오가며 에너지를 소모하고 있습니다.',
      '다중 생존 모드 과부하(3/4). 만성 스트레스로 인해 신경계가 여러 방어 기제를 번갈아 가동하고 있습니다.',
      '전면적 4F 자율신경계 경보 상태(4/4). 네 가지 생존 회로가 모두 지쳐 있습니다. 지금 스트레스 진단과 5-4-3-2-1 그라운딩을 시작하세요.'
    ],
    primaryBtn: '무료 스트레스 &amp; 4F 신경계 반응 테스트 &rarr;',
    subBtn: '5-4-3-2-1 생존 모드 해제 그라운딩 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN 4F-STRESSREAKTIONS-CHECK',
    heading: 'Welcher 4F-Überlebensmodus feuert bei Ihnen zuerst?',
    sub: 'Wählen Sie die automatischen Reaktionen Ihres Nervensystems unter Druck oder Konflikten:',
    items: [
      '<strong>Fight (Kampf &amp; Kontrolle):</strong> Kieferpressen, innere Hitze und der sofortige Drang, gegenzuhalten oder die Kontrolle zu übernehmen.',
      '<strong>Flight (Flucht &amp; Rastlosigkeit):</strong> Innere Unruhe, Perfektionismus oder ständige Beschäftigung, um Angst nicht zu spüren.',
      '<strong>Freeze (Erstarrung &amp; Shutdown):</strong> Gehirnnebel, körperliche Schwere, Aufschieben oder inneres Abschalten bei Überforderung.',
      '<strong>Fawn (Unterwerfung &amp; Anpassen):</strong> Sofortiges Entschuldigen, Beschwichtigen und Zurückstellen eigener Bedürfnisse.'
    ],
    scoreUnit: 'von 4 Überlebensmodi aktiv',
    verdicts: [
      'Wählen Sie die 4F-Muster oben aus, um Ihre dominante Stressreaktion zu erkennen.',
      'Einzelner 4F-Hauptreflex (1/4). Sie nutzen unter akutem Druck vor allem eine primäre Schutzstrategie.',
      'Duales 4F-Hybridmuster (2/4). Ihr Nervensystem pendelt je nach Situation zwischen zwei Überlebensmodi.',
      'Hohe autonome Belastung (3/4). Drei Schutzprogramme laufen parallel und kosten viel Energie.',
      'Vollständige 4F-Überlastung (4/4). Alle vier Überlebensschaltkreise sind aktiv—starten Sie jetzt den Stress-Check.'
    ],
    primaryBtn: 'Zum kostenlosen Stress- &amp; 4F-Reaktions-Check &rarr;',
    subBtn: '5-4-3-2-1 Grounding-Tool zur Beruhigung öffnen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE RESPUESTA 4F EN 30 SEGUNDOS',
    heading: '¿Qué modo de supervivencia 4F activa primero tu cuerpo?',
    sub: 'Marca las reacciones automáticas que notas cuando enfrentas presión o conflicto:',
    items: [
      '<strong>Lucha (Fight · Control e impulso):</strong> Tensión en la mandíbula, calor en el pecho y necesidad inmediata de discutir o tomar el control.',
      '<strong>Huida (Flight · Hiperactividad):</strong> Inquietud constante, exceso de trabajo o necesidad de estar ocupado para no sentir ansiedad.',
      '<strong>Congelación (Freeze · Bloqueo):</strong> Mente en blanco, pesadez física, parálisis por análisis o desconexión frente a la pantalla.',
      '<strong>Complacencia (Fawn · Apaciguamiento):</strong> Pedir perdón al instante, ceder y borrar tus necesidades para calmar a los demás.'
    ],
    scoreUnit: 'de 4 modos de supervivencia 4F activos',
    verdicts: [
      'Marca los patrones 4F arriba para identificar tu respuesta autonómica dominante.',
      'Reflejo 4F único dominante (1/4). Tienes una estrategia protectora principal bajo presión aguda.',
      'Patrón híbrido 4F (2/4). Oscilas entre dos modos de supervivencia (como Huida-Complacencia).',
      'Alta tensión autonómica (3/4). Tu sistema nervioso alterna múltiples defensas ante el estrés crónico.',
      'Sobrecarga total de los 4F (4/4). Tus cuatro circuitos de alarma están activos—haz el test de estrés y usa el anclaje 5-4-3-2-1 ahora.'
    ],
    primaryBtn: 'Hacer el Test de Respuesta al Estrés 4F &rarr;',
    subBtn: 'Salir del Modo Alerta con Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'TRIAGE DES 4F (FIGHT, FLIGHT, FREEZE, FAWN) EN 30 SECONDES',
    heading: 'Quel mode de survie 4F s\'active en premier sous pression ?',
    sub: 'Cochez les réflexes automatiques de votre système nerveux face au stress ou aux critiques :',
    items: [
      '<strong>Combat (Fight · Contrôle) :</strong> Mâchoire serrée, montée d\'adrénaline et besoin immédiat de riposter ou de reprendre le contrôle.',
      '<strong>Fuite (Flight · Hyperactivité) :</strong> Agitation, perfectionnisme ou besoin de rester constamment occupé pour éviter l\'anxiété.',
      '<strong>Sidération (Freeze · Figement) :</strong> Brouillard mental, lourdeur physique, paralysie de l\'action ou dissociation.',
      '<strong>Complaisance (Fawn · Apaisement) :</strong> Excuses réflexes, effacement de soi et priorité absolue au calme de l\'autre.'
    ],
    scoreUnit: 'sur 4 modes de survie 4F actifs',
    verdicts: [
      'Cochez les schémas 4F ci-dessus pour repérer votre réflexe autonome dominant.',
      'Réflexe 4F dominant unique (1/4). Vous utilisez un mode de protection principal sous pression.',
      'Profil hybride 4F (2/4). Vous alternez entre deux réponses de survie selon le contexte.',
      'Forte sollicitation nerveuse (3/4). Votre système nerveux mobilise plusieurs défenses coûteuses en énergie.',
      'Surcharge complète des 4F (4/4). Les quatre circuits d\'alarme sont actifs—faites le bilan de stress dès maintenant.'
    ],
    primaryBtn: 'Faire le Bilan de Stress &amp; Réponse 4F &rarr;',
    subBtn: 'Ouvrir l\'Outil d\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・4F（闘争・逃走・凍結・迎合）ストレス反応チェック',
    heading: 'プレッシャーや衝突時、あなたの神経系はどの「4Fモード」になる？',
    sub: 'ストレスや批判に直面したとき、無意識に起きる反応をチェックしてください：',
    items: [
      '<strong>闘争（Fight・コントロール）：</strong> 奥歯を噛み締めたり胸が熱くなり、すぐ言い返すか主導権を握ろうとする。',
      '<strong>逃走（Flight・過剰な忙しさ）：</strong> じっとしていると不安なため、仕事や予定を詰め込んで常に動き続けようとする。',
      '<strong>凍結（Freeze・シャットダウン）：</strong> キャパを超えると頭が真っ白になり、体が重くなって先延ばしや思考停止に陥る。',
      '<strong>迎合（Fawn・過剰な気遣い）：</strong> 不穏な空気を察知すると反射的に謝り、自分の本音を消して相手をなだめる。'
    ],
    scoreUnit: '/ 4 個の4Fサバイバル反応が該当',
    verdicts: [
      '上の項目をチェックして、あなたの自律神経が使いやすい4F防衛パターンを確認しましょう。',
      '単一メインの4F反応（1/4）。強いプレッシャー時に特定の防衛モードが優先的に働きます。',
      '複合ハイブリッド4F型（2/4）。「逃走×迎合」など2つのサバイバル反応を行き来しています。',
      '高い自律神経負荷（3/4）。複数の防衛モードが入れ替わり立ち替わり作動し、エネルギーを消耗しています。',
      '全4Fモードの過負荷状態（4/4）。4つすべての警報回路がフル稼働しています。今すぐストレス診断とグラウンディングを行ってください。'
    ],
    primaryBtn: '無料ストレス＆4F反応チェックを受ける &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで鎮静する &rarr;'
  },
  zh: {
    badge: '30秒 4F（战/逃/僵/讨好）应激反应筛查',
    heading: '面对压力或冲突时，你的神经系统最先启动哪种 4F 模式？',
    sub: '勾选你在面对批评、冲突或高压任务时的本能生理与行为反应：',
    items: [
      '<strong>战斗（Fight · 控制与反击）：</strong> 下巴紧绷、胸口燥热，本能地想要反驳、据理力争或立刻夺回局面控制权。',
      '<strong>逃跑（Flight · 强迫性忙碌）：</strong> 一停下来就焦虑，用疯狂工作、完美主义或不断刷手机来逃避内在紧绷。',
      '<strong>僵住（Freeze · 宕机与麻木）：</strong> 压力过大时大脑一片空白、身体沉重，陷入拖延瘫痪或解离发呆。',
      '<strong>讨好（Fawn · 顺从与安抚）：</strong> 察觉到一丝火药味就立刻道歉、迎合，抹除自己的需求来平息对方情绪。'
    ],
    scoreUnit: '/ 4 种 4F 生存防御模式激活',
    verdicts: [
      '勾选上方 4F 信号，查看你的自主神经系统最常使用的生存防御策略。',
      '单一主导 4F 模式 (1/4)。你在高压下有明确的首选防御机制，完成完整测试查看详细解析。',
      '双重混合 4F 模式 (2/4)。你常在两种模式间切换（如“逃跑-讨好”或“战斗-僵住”）。',
      '多重生存神经负荷 (3/4)。你的神经系统正轮番启动多种防御，持续消耗心理带宽。',
      '全 4F 生存回路过载 (4/4)。四种警报系统全面激活，建议立即进行压力检测并用 5-4-3-2-1 着陆法平复身体。'
    ],
    primaryBtn: '开始免费压力与 4F 应激反应测评 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆退出生存模式 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE RESPOSTA 4F (LUTA, FUGA, CONGELAMENTO, FAWN) 30S',
    heading: 'Qual modo de sobrevivência 4F seu corpo ativa primeiro?',
    sub: 'Marque as reações automáticas do seu sistema nervoso sob pressão ou conflito:',
    items: [
      '<strong>Luta (Fight · Controle):</strong> Mandíbula presa, calor no peito e impulso imediato de rebater ou assumir o controle.',
      '<strong>Fuga (Flight · Hiperatividade):</strong> Inquietação, excesso de trabalho ou necessidade de estar sempre ocupado para não sentir ansiedade.',
      '<strong>Congelamento (Freeze · Paralisia):</strong> Névoa mental, peso no corpo, procrastinação paralisante ou desconexão.',
      '<strong>Submissão (Fawn · Agradar):</strong> Pedir desculpas no reflexo e anular suas necessidades para manter os outros calmos.'
    ],
    scoreUnit: 'de 4 modos de sobrevivência 4F ativos',
    verdicts: [
      'Marque os padrões 4F acima para identificar sua resposta autonômica dominante.',
      'Reflexo 4F dominante único (1/4). Você possui uma estratégia principal sob pressão aguda.',
      'Padrão híbrido 4F (2/4). Você alterna entre dois modos de sobrevivência conforme o estresse.',
      'Alta tensão autonômica (3/4). Seu sistema nervoso aciona múltiplas defesas que drenam energia.',
      'Sobrecarga total dos 4F (4/4). Todos os quatro circuitos de alarme estão ativos—faça o Check-up de Estresse agora.'
    ],
    primaryBtn: 'Fazer o Teste Gratuito de Estresse e 4F &rarr;',
    subBtn: 'Sair do Modo Alerta com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ СКРИНИНГ 4F-РЕАКЦИЙ (БЕЙ, БЕГИ, ЗАМРИ, УГОЖДАЙ)',
    heading: 'Какой режим выживания 4F включается у вас первым?',
    sub: 'Отметьте автоматические реакции нервной системы на стресс, критику или конфликт:',
    items: [
      '<strong>Бей (Fight · Контроль и напор):</strong> Сжатые челюсти, прилив жара и мгновенное желание спорить или взять ситуацию под контроль.',
      '<strong>Беги (Flight · Гиперактивность):</strong> Невозможность усидеть на месте, трудоголизм или суета, чтобы заглушить тревогу.',
      '<strong>Замри (Freeze · Оцепенение):</strong> Туман в голове, тяжесть в теле, паралич прокрастинации или «выпадение» из реальности.',
      '<strong>Угождай (Fawn · Сглаживание углов):</strong> Автоматические извинения и отказ от своих границ ради спокойствия других.'
    ],
    scoreUnit: 'из 4 режимов выживания 4F активно',
    verdicts: [
      'Отметьте пункты выше, чтобы определить ведущую защитную реакцию вашей нервной системы.',
      'Один ведущий 4F-рефлекс (1/4). У вас есть основная стратегия защиты при остром стрессе.',
      'Гибридный 4F-паттерн (2/4). Вы переключаетесь между двумя режимами (например, «Беги-Угождай»).',
      'Высокая вегетативная нагрузка (3/4). Нервная система задействует сразу несколько энергозатратных защит.',
      'Полная перегрузка 4F-системы (4/4). Все четыре контура тревоги активны — пройдите тест на стресс и практику заземления сейчас.'
    ],
    primaryBtn: 'Пройти бесплатный тест на стресс и 4F-реакцию &rarr;',
    subBtn: 'Выйти из режима тревоги с практикой 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING RESPONS STRES 4F (FIGHT, FLIGHT, FREEZE, FAWN) 30 DETIK',
    heading: 'Mode Bertahan Hidup 4F Mana yang Paling Cepat Aktif?',
    sub: 'Centang reaksi otomatis sistem saraf Anda saat menghadapi tekanan atau konflik:',
    items: [
      '<strong>Fight (Lawan &amp; Kendali):</strong> Rahang mengeras, dada panas, dan dorongan langsung untuk mendebat atau memegang kendali.',
      '<strong>Flight (Kabur &amp; Sibuk Berlebih):</strong> Gelisah, perfeksionis, atau terus menyibukkan diri agar tidak merasakan cemas.',
      '<strong>Freeze (Membeku &amp; Shutdown):</strong> Pikiran kosong, tubuh terasa berat, menunda pekerjaan karena lumpuh, atau melamun.',
      '<strong>Fawn (Menyenangkan &amp; Mengalah):</strong> Refleks meminta maaf dan menghapus kebutuhan sendiri demi menjaga suasana tetap damai.'
    ],
    scoreUnit: 'dari 4 mode bertahan hidup 4F aktif',
    verdicts: [
      'Centang pola 4F di atas untuk mengenali respons saraf otonom dominan Anda.',
      'Satu Refleks 4F Dominan (1/4). Anda memiliki satu pola pelindung utama saat tertekan.',
      'Pola Hibrida 4F (2/4). Anda berpindah di antara dua mode bertahan hidup (seperti Flight-Fawn).',
      'Ketegangan Otonom Tinggi (3/4). Sistem saraf Anda mengaktifkan banyak pertahanan yang menguras energi.',
      'Overload 4F Penuh (4/4). Keempat sirkuit darurat menyala—ikuti Cek Stres dan lakukan grounding 5-4-3-2-1 sekarang.'
    ],
    primaryBtn: 'Ikuti Tes Respons Stres &amp; 4F Gratis &rarr;',
    subBtn: 'Buka Alat Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK 4F (SAVAŞ, KAÇ, DON, YATIŞTIR) TARAMASI',
    heading: 'Baskı Altında İlk Hangi 4F Hayatta Kalma Modunuz Ateşleniyor?',
    sub: 'Stres veya çatışma anında bedeninizin verdiği otomatik tepkileri işaretleyin:',
    items: [
      '<strong>Savaş (Fight · Kontrol ve Karşı Çıkış):</strong> Çene sıkma, göğüste sıcaklık ve anında karşılık verme ya da kontrolü alma dürtüsü.',
      '<strong>Kaç (Flight · Aşırı Meşguliyet):</strong> Huzursuzluk, aşırı planlama veya kaygıyı hissetmemek için sürekli çalışıp meşgul olma.',
      '<strong>Don (Freeze · Kapanma ve Felç):</strong> Zihin bulanıklığı, bedensel ağırlık, erteleme felci veya ekran karşısında kopma.',
      '<strong>Yatıştır (Fawn · Memnun Etme):</strong> Gerginliği önlemek için refleks olarak özür dileme ve kendi sınırlarını silme.'
    ],
    scoreUnit: '/ 4 hayatta kalma modu aktif',
    verdicts: [
      'Otonom sinir sisteminizin baskın savunma biçimini görmek için yukarıdakileri işaretleyin.',
      'Tek Baskın 4F Refleksi (1/4). Akut stres altında belirgin bir एकincil koruma modunuz var.',
      'İkili Hibrit 4F Modeli (2/4). Kaç-Yatıştır veya Savaş-Don gibi iki hayatta kalma modu arasında geçiş yapıyorsunuz.',
      'Çoklu Otonom Yüklenme (3/4). Sinir sisteminiz kronik stresle başa çıkmak için birden fazla savunma harcıyor.',
      'Tam 4F Sistem Aşırı Yükü (4/4). Dört alarm devresi de aktif—şimdi Stres Testini çözün ve 5-4-3-2-1 topraklama yapın.'
    ],
    primaryBtn: 'Ücretsiz Stres ve 4F Tepki Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड 4F (फाइट, फ्लाइट, फ्रीज, फ़ॉन) स्क्रीनर',
    heading: 'तनाव या टकराव में आपका कौन सा 4F सर्वाइवल मोड सबसे पहले सक्रिय होता है?',
    sub: 'दबाव के समय अपने नर्वस सिस्टम की स्वचालित प्रतिक्रियाओं को चुनें:',
    items: [
      '<strong>फाइट (Fight · नियंत्रण और पलटवार):</strong> जबड़े भिंचना, सीने में गर्मी और तुरंत बहस करने या नियंत्रण लेने की तीव्र इच्छा।',
      '<strong>फ्लाइट (Flight · अति-व्यस्तता और बचाव):</strong> बेचैनी, ओवर-प्लानिंग, या चिंता से बचने के लिए खुद को लगातार काम में व्यस्त रखना।',
      '<strong>फ्रीज (Freeze · सुन्न पड़ना और शटडाउन):</strong> दिमाग सुन्न होना, शरीर भारी लगना, काम टालते रहना या स्क्रीन में खो जाना।',
      '<strong>फ़ॉन (Fawn · खुशामद और आत्म-त्याग):</strong> तनाव भांपते ही तुरंत माफ़ी मांगना और दूसरों को शांत रखने के लिए अपनी ज़रूरतें भुला देना।'
    ],
    scoreUnit: '/ 4 सर्वाइवल मोड सक्रिय',
    verdicts: [
      'अपने नर्वस सिस्टम के मुख्य 4F पैटर्न को पहचानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'एकल मुख्य 4F रिफ्लेक्स (1/4)। तीव्र दबाव में आपका एक प्राथमिक सुरक्षा मोड सक्रिय होता है।',
      'हाइब्रिड 4F पैटर्न (2/4)। आप परिस्थिति के अनुसार दो सर्वाइवल मोड्स के बीच स्विच करते हैं।',
      'उच्च नर्वस सिस्टम तनाव (3/4)। आपका शरीर तनाव झेलने के लिए कई सुरक्षा तंत्रों में ऊर्जा खर्च कर रहा है।',
      'पूर्ण 4F ओवरलोड (4/4)। चारों सर्वाइवल सर्किट सक्रिय हैं—अभी स्ट्रेस चेक करें और 5-4-3-2-1 ग्राउंडिंग अपनाएं।'
    ],
    primaryBtn: 'मुफ्त 4F स्ट्रेस रिस्पॉन्स चेक शुरू करें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग टूल से शांत हों &rarr;'
  }
};

const EMOTIONAL_TRIGGERS_LOCALES = {
  en: {
    badge: '30-SECOND AMYGDALA HIJACK & TRIGGER SCREENER',
    heading: 'Are You Experiencing an Amygdala Hijack or Normal Stress?',
    sub: 'Check the signs that show your reactions are hitting an unresolved emotional trigger:',
    items: [
      '<strong>0-to-100 Disproportionate Surge:</strong> A minor comment, tone shift, or delay sparks a 9/10 wave of anger, panic, or shame.',
      '<strong>Somatic Alarm Before Thought:</strong> Your heart pounds, throat tightens, or stomach drops before your rational brain can even process why.',
      '<strong>Age Regression (Feeling Small):</strong> In the triggered moment, you suddenly feel younger, powerless, unseen, or cornered like in the past.',
      '<strong>Beyond-90-Second Story Replay:</strong> Long after the initial 90-second neurochemical wave, your mind keeps replaying the scene for hours.'
    ],
    scoreUnit: 'of 4 amygdala hijack signals active',
    verdicts: [
      'Check the items above to distinguish proportionate frustration from an amygdala trigger hijack.',
      'Mild Situational Reactivity (1/4). Pausing for 90 seconds of slow breathing will quickly restore prefrontal clarity.',
      'Active Emotional Trigger Pattern (2/4). Past relational wounds are amplifying present-day interactions.',
      'High Amygdala Hijack Frequency (3/4). Your threat detector is firing before your prefrontal cortex can intervene.',
      'Severe Trigger Flooding (4/4). Your nervous system is locked in past-threat replay—build your STOPAR regulation plan right now.'
    ],
    primaryBtn: 'Build Your Custom STOPAR Plan in the Regulation Planner &rarr;',
    subBtn: 'Take the 3-Minute Stress &amp; Trigger Load Check &rarr;'
  },
  ko: {
    badge: '30초 편도체 납치(Amygdala Hijack) & 감정 트리거 판별기',
    heading: '지금 내 반응은 일반 스트레스일까, 과거 상처가 건드려진 트리거일까?',
    sub: '최근 감정이 급격히 흔들렸던 순간의 신체·인지 반응을 체크해보세요:',
    items: [
      '<strong>0에서 100으로 치솟는 과잉 반응:</strong> 사소한 말투나 표정 하나에 상황보다 훨씬 큰 분노, 수치심, 공포(10점 만점에 8점 이상)가 폭발합니다.',
      '<strong>생각보다 빠른 신체 경보:</strong> 이성적으로 판단하기도 전에 심장이 뛰고 목이 막히거나 속이 철렁 내려앉습니다.',
      '<strong>심리적 퇴행 (작고 무력해지는 느낌):</strong> 그 순간 마치 어린 시절로 돌아간 것처럼 무력하고 억울하거나 구석에 몰린 기분이 듭니다.',
      '<strong>90초 이후에도 멈추지 않는 생각 재생:</strong> 호르몬 파도(90초)가 지나간 뒤에도 머릿속으로 그 장면을 몇 시간씩 되감기하며 재점화합니다.'
    ],
    scoreUnit: '개 편도체 납치·트리거 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 일반 감정 반응과 편도체 납치(감정 트리거)를 구별해보세요.',
      '경미한 상황적 반응(1/4). 90초 날숨 호흡만으로도 전두엽의 이성적 브레이크를 쉽게 회복할 수 있습니다.',
      '중등도 감정 트리거 활성화(2/4). 현재의 작은 자극이 과거의 미해결된 상처 기억을 건드리고 있습니다.',
      '높은 편도체 납치 빈도(3/4). 전두엽이 상황을 파악하기 전에 편도체가 먼저 생존 경보를 울리고 있습니다.',
      '심각한 감정 범람(Flooding) 상태(4/4). 과거의 상처 회로가 반복 재점화되고 있습니다. 지금 감정 조절 플래너로 STOPAR 대응 프로토콜을 설계하세요.'
    ],
    primaryBtn: '맞춤형 감정 조절 플래너 도구 열기 &rarr;',
    subBtn: '3분 스트레스 &amp; 신경계 반응 정밀 체크 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN AMYGDALA-HIJACK & TRIGGER-CHECK',
    heading: 'Normale Reaktion oder emotionaler Trigger (Amygdala-Hijack)?',
    sub: 'Wählen Sie die Anzeichen aus, die bei starken emotionalen Momenten auftreten:',
    items: [
      '<strong>Von 0 auf 100 (Unverhältnismäßigkeit):</strong> Ein kleiner Kommentar oder Tonfall löst sofort eine Welle der Wut, Angst oder Scham aus.',
      '<strong>Körperalarm vor dem Denken:</strong> Herzrasen, Kloß im Hals oder Magendruck setzen ein, bevor der Verstand reagieren kann.',
      '<strong>Emotionale Regression:</strong> Im Akutmoment fühlen Sie sich plötzlich klein, ohnmächtig oder in die Enge getrieben wie früher.',
      '<strong>Gedankenkarussell nach 90 Sekunden:</strong> Lange nach der ersten Gefühlswelle spielen Sie die Szene stundenlang im Kopf weiter durch.'
    ],
    scoreUnit: 'von 4 Trigger-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um einen Amygdala-Hijack zu erkennen.',
      'Leichte situative Reaktivität (1/4). 90 Sekunden ruhiges Ausatmen bringt den präfrontalen Kortex schnell zurück.',
      'Aktives Trigger-Muster (2/4). Alte Wunden verstärken aktuelle Alltags- oder Beziehungskonflikte.',
      'Häufiger Amygdala-Hijack (3/4). Ihr Alarmsystem feuert schneller als Ihre rationale Impulskontrolle.',
      'Starke emotionale Überflutung (4/4). Erstellen Sie jetzt Ihren persönlichen STOPAR-Notfallplan im Emotions-Planer.'
    ],
    primaryBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;',
    subBtn: 'Zum 3-Minuten Stress- &amp; Trigger-Check &rarr;'
  },
  es: {
    badge: 'TRIAJE DE SECUESTRO AMIGDALINO Y DISPARADORES EN 30S',
    heading: '¿Es una reacción normal o un disparador emocional (Trigger)?',
    sub: 'Marca las señales que ocurren cuando una situación te desborda emocionalmente:',
    items: [
      '<strong>Subida de 0 a 100 desproporcionada:</strong> Un comentario o gesto menor desata una ola intensa de rabia, miedo o vergüenza.',
      '<strong>Alarma corporal antes que el pensamiento:</strong> El corazón se acelera o el estómago se cierra antes de poder razonar.',
      '<strong>Regresión emocional (sentirse pequeño):</strong> En ese instante te sientes indefenso, invisible o acorralado como en el pasado.',
      '<strong>Bucle mental tras los 90 segundos:</strong> Horas después del pico químico inicial, tu mente sigue repitiendo la escena.'
    ],
    scoreUnit: 'de 4 señales de secuestro amigdalino activas',
    verdicts: [
      'Marca los puntos arriba para distinguir un enfado normal de una herida emocional activada.',
      'Reactividad situacional leve (1/4). Aplicar la pausa de 90 segundos devolverá el control a tu corteza prefrontal.',
      'Patrón de disparador activo (2/4). Heridas antiguas están amplificando tus reacciones presentes.',
      'Alta frecuencia de secuestro amigdalino (3/4). Tu alarma de amenaza se dispara antes de que puedas pensar.',
      'Inundación por disparadores severa (4/4). Diseña ahora tu protocolo STOPAR en el Planificador de Regulación Emocional.'
    ],
    primaryBtn: 'Abrir Planificador de Regulación Emocional &rarr;',
    subBtn: 'Hacer el Chequeo de Estrés en 3 Minutos &rarr;'
  },
  fr: {
    badge: 'TRIAGE DÉCLENCHEURS ÉMOTIONNELS & AMYGDALE EN 30S',
    heading: 'Réaction normale ou déclencheur émotionnel (Trigger) ?',
    sub: 'Cochez les signes que vous observez lors de vos réactions émotionnelles intenses :',
    items: [
      '<strong>Montée disproportionnée de 0 à 100 :</strong> Une remarque ou un silence mineur provoque une vague immédiate de colère ou de panique.',
      '<strong>Alarme corporelle avant la pensée :</strong> Cœur qui bat, gorge serrée ou nœud à l\'estomac avant même d\'avoir pu réfléchir.',
      '<strong>Régression émotionnelle :</strong> Sur le moment, vous vous sentez soudain petit, impuissant ou piégé comme dans le passé.',
      '<strong>Rumination au-delà des 90 secondes :</strong> Des heures après le pic chimique initial, votre esprit rejoue la scène en boucle.'
    ],
    scoreUnit: 'sur 4 signaux de piratage de l\'amygdale actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour distinguer une réaction normale d\'un trigger émotionnel.',
      'Réactivité ponctuelle légère (1/4). La règle des 90 secondes suffit à réactiver votre cortex préfrontal.',
      'Déclencheur émotionnel actif (2/4). Des blessures passées amplifient vos tensions actuelles.',
      'Piratage fréquent de l\'amygdale (3/4). Votre système d\'alarme court-circuite votre réflexion rationnelle.',
      'Submersion émotionnelle sévère (4/4). Créez votre protocole STOPAR personnalisé dans le Planificateur Émotionnel.'
    ],
    primaryBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;',
    subBtn: 'Faire le Bilan de Stress en 3 Minutes &rarr;'
  },
  ja: {
    badge: '30秒・扁桃体ハイジャック＆感情トリガー診断',
    heading: 'その激しい感情は今の問題？それとも過去の「感情トリガー」？',
    sub: '感情が大きく揺さぶられたときの心身のサインをチェックしてください：',
    items: [
      '<strong>0から100への過剰な爆発：</strong> 些細な一言や態度の変化で、状況以上に激しい怒り・不安・羞恥心が一気に噴き出す。',
      '<strong>思考より先に起きる身体反応：</strong> 頭で整理する前に、動悸・喉の詰まり・胃がキュッとなる感覚が走る。',
      '<strong>年齢退行（無力だった頃の感覚）：</strong> その瞬間、昔の傷ついた子どもの頃のように無力で追い詰められた感覚になる。',
      '<strong>90秒を過ぎても続く脳内リプレイ：</strong> 最初の感情の波（90秒）が過ぎた後も、何時間も頭の中で場面を再生して怒りや悲しみを再燃させる。'
    ],
    scoreUnit: '/ 4 個の扁桃体ハイジャック・サインが該当',
    verdicts: [
      '上の項目をチェックして、通常のストレス反応と「感情トリガーの活性化」を見分けましょう。',
      '軽度の状況的反応（1/4）。90秒間の深呼吸ルールで前頭葉の冷静さをすぐに取り戻せます。',
      '感情トリガーの活性化（2/4）。過去の未解決の傷が、現在の出来事への反応を増幅させています。',
      '高い扁桃体ハイジャック頻度（3/4）。理性で考えるより先に脳の警報装置が暴走しやすい状態です。',
      '深刻なトリガー氾濫状態（4/4）。今すぐ感情調整プランナーを開き、あなた専用のSTOPAR対処プロトコルを作成してください。'
    ],
    primaryBtn: '感情調整プランナーで対処プロトコルを作る &rarr;',
    subBtn: '3分間の無料ストレス＆神経負荷チェック &rarr;'
  },
  zh: {
    badge: '30秒杏仁核劫持与情绪触发点（Trigger）筛查',
    heading: '你刚才的强烈反应是正常压力，还是被“情绪扳机”击中了？',
    sub: '勾选你在情绪突然失控或强烈波动时出现的身心信号：',
    items: [
      '<strong>0到100的不成比例爆发：</strong> 一句随口的话、语气变化或回复延迟，瞬间引爆远超事件本身的愤怒、羞耻或恐慌。',
      '<strong>先于理智的躯体警报：</strong> 大脑还没来得及思考，心跳加速、喉咙发紧或胃部下沉感就已经在一瞬间袭来。',
      '<strong>心理退行（变回弱小感）：</strong> 在被触发的当下，你突然感觉自己像过去那样弱小、无助、被忽视或无路可退。',
      '<strong>超过90秒的剧情反刍：</strong> 最初90秒的激素浪潮退去后，你的大脑仍连续数小时反复回放画面，不断重新点燃情绪。'
    ],
    scoreUnit: '/ 4 项杏仁核劫持信号激活',
    verdicts: [
      '勾选上方信号，区分当下的正常情绪与过往创伤触发的“杏仁核劫持”。',
      '轻度情境反应 (1/4)。运用“90秒法则”配合深长呼气，即可迅速恢复前额叶理性。',
      '明显的情绪触发模式 (2/4)。未愈合的旧伤口正在放大你对当下人际摩擦的痛感。',
      '高频杏仁核劫持 (3/4)。你的威胁警报系统常在前额叶介入前就抢先接管了身体。',
      '重度触发淹没状态 (4/4)。建议立即打开互动式情绪调节规划器，定制你的 STOPAR 紧急平复方案。'
    ],
    primaryBtn: '打开情绪调节规划器定制 STOPAR 方案 &rarr;',
    subBtn: '开始3分钟免费压力与触发负荷测试 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE GATILHOS EMOCIONAIS E AMÍGDALA EM 30S',
    heading: 'É uma reação normal ou um Gatilho Emocional (Sequestro da Amígdala)?',
    sub: 'Marque os sinais que aparecem quando uma situação desperta uma reação intensa:',
    items: [
      '<strong>Explosão desproporcional de 0 a 100:</strong> Um comentário ou atraso mínimo gera uma onda intensa de raiva, medo ou vergonha.',
      '<strong>Alarme físico antes do pensamento:</strong> Coração acelerado, nó na garganta ou aperto no estômago surgem antes da razão.',
      '<strong>Regressão emocional (sentir-se pequeno):</strong> No momento do gatilho, você se sente impotente ou acuado como no passado.',
      '<strong>Replay mental após 90 segundos:</strong> Horas depois da onda química inicial, sua mente continua repetindo a cena.'
    ],
    scoreUnit: 'de 4 sinais de sequestro da amígdala ativos',
    verdicts: [
      'Marque os itens acima para diferenciar frustração comum de um gatilho emocional profundo.',
      'Reatividade situacional leve (1/4). A pausa de 90 segundos com respiração restaura sua clareza.',
      'Padrão de gatilho ativo (2/4). Feridas antigas estão amplificando conflitos atuais.',
      'Alta frequência de sequestro da amígdala (3/4). Seu alarme dispara antes do córtex pré-frontal.',
      'Inundação severa por gatilhos (4/4). Monte agora seu protocolo STOPAR no Planejador de Regulação Emocional.'
    ],
    primaryBtn: 'Abrir Planejador de Regulação Emocional &rarr;',
    subBtn: 'Fazer o Check-up de Estresse em 3 Minutos &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ЭМОЦИОНАЛЬНЫЕ ТРИГГЕРЫ',
    heading: 'Обычная реакция или захват миндалевидного тела (триггер)?',
    sub: 'Отметьте признаки, которые сопровождают ваши вспышки гнева, обиды или тревоги:',
    items: [
      '<strong>Скачок от 0 до 100 (несоразмерность):</strong> Мелкое замечание или пауза вызывают бурю гнева, стыда или паники.',
      '<strong>Телесная тревога быстрее мысли:</strong> Сердцебиение, ком в горле или спазм в животе возникают раньше разумной оценки.',
      '<strong>Эмоциональная регрессия:</strong> В момент вспышки вы чувствуете себя маленьким, беспомощным или загнанным в угол, как в прошлом.',
      '<strong>мысленный повтор после 90 секунд:</strong> Спустя часы после первой биохимической волны мозг продолжает прокручивать сцену.'
    ],
    scoreUnit: 'из 4 признаков триггерного захвата активно',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить обычный стресс от активации старой эмоциональной травмы.',
      'Легкая ситуативная реакция (1/4). Правило 90 секунд и удлиненный выдох быстро вернут ясность ума.',
      'Активный эмоциональный триггер (2/4). Незажившие раны прошлого усиливают остроту текущих конфликтов.',
      'Частый захват миндалевидного тела (3/4). Система угроз срабатывает быстрее префронтальной коры.',
      'Сильное триггерное затопление (4/4). Составьте персональный протокол STOPAR в Планировщике эмоциональной регуляции.'
    ],
    primaryBtn: 'Открыть Планировщик эмоциональной регуляции &rarr;',
    subBtn: 'Пройти 3-минутный тест на уровень стресса &rarr;'
  },
  id: {
    badge: 'SKRINING PEMICU EMOSI (TRIGGER) & AMIGDALA 30 DETIK',
    heading: 'Apakah Ini Reaksi Biasa atau Bajakan Amigdala (Emotional Trigger)?',
    sub: 'Centang tanda yang muncul saat emosi Anda meledak atau terguncang hebat:',
    items: [
      '<strong>Lonjakan 0 ke 100 yang Tidak Proporsional:</strong> Komentar kecil atau perubahan nada memicu gelombang marah, malu, atau panik yang besar.',
      '<strong>Alarm Tubuh Sebelum Berpikir:</strong> Jantung berdebar, tenggorokan tercekat, atau perut mulas muncul sebelum akal sehat sempat mencerna.',
      '<strong>Regresi Usia (Merasa Kecil &amp; Tak Berdaya):</strong> Saat terpicu, Anda tiba-tiba merasa tak berdaya atau terpojok seperti di masa lalu.',
      '<strong>Putar Ulang Cerita Lebih dari 90 Detik:</strong> Berjam-jam setelah gelombang kimia 90 detik berlalu, pikiran Anda terus memutar ulang kejadian itu.'
    ],
    scoreUnit: 'dari 4 sinyal bajakan amigdala aktif',
    verdicts: [
      'Centang poin di atas untuk membedakan stres wajar dari luka pemicu emosi (trigger).',
      'Reaktivitas Situasional Ringan (1/4). Jeda napas 90 detik akan cepat memulihkan kejernihan berpikir.',
      'Pola Trigger Emosi Aktif (2/4). Luka lama sedang memperbesar reaksi Anda terhadap situasi hari ini.',
      'Frekuensi Bajakan Amigdala Tinggi (3/4). Alarm ancaman Anda menyala sebelum korteks prefrontal sempat bekerja.',
      'Banjir Trigger Berat (4/4). Susun protokol STOPAR pribadi Anda di Perencana Regulasi Emosi sekarang.'
    ],
    primaryBtn: 'Buka Perencana Regulasi Emosi Interaktif &rarr;',
    subBtn: 'Ikuti Cek Beban Stres 3 Menit &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK DUYGUSAL TETİKLENME VE AMİGDALA TARAMASI',
    heading: 'Normal Bir Tepki mi Yoksa Duygusal Tetiklenme (Amigdala Baskını) mı?',
    sub: 'Yoğun duygusal patlamalar yaşadığınızda fark ettiğiniz işaretleri seçin:',
    items: [
      '<strong>0\'dan 100\'e Orantısız Patlama:</strong> Küçük bir yorum veya gecikme, durumla orantısız bir öfke, utanç veya panik dalgası yaratıyor.',
      '<strong>Düşünceden Önce Bedensel Alarm:</strong> Mantıklı zihniniz durumu analiz edemeden kalp çarpıntısı veya boğaz düğümlenmesi başlıyor.',
      '<strong>Duygusal Gerileme (Küçük Hissetme):</strong> Tetiklenme anında kendinizi geçmişteki gibi güçsüz, görünmez veya köşeye sıkışmış hissediyorsunuz.',
      '<strong>90 Saniye Sonrası Zihinsel Tekrar:</strong> İlk 90 saniyelik kimyasal dalga geçse bile zihniniz sahneyi saatlerce tekrar oynatıyor.'
    ],
    scoreUnit: '/ 4 amigdala baskını sinyali aktif',
    verdicts: [
      'Normal stres ile geçmiş yaraların tetiklenmesini ayırt etmek için yukarıdakileri işaretleyin.',
      'Hafif Durumsal Tepkisellik (1/4). 90 saniyelik nefes molası prefrontal netliği hızla geri kazandırır.',
      'Aktif Duygusal Tetikleyici (2/4). Çözülmemiş eski yaralar bugünkü tepkilerinizi büyütüyor.',
      'Yüksek Amigdala Baskını (3/4). Tehdit dedektörünüz mantıklı düşünceden daha hızlı ateşleniyor.',
      'Şiddetli Tetiklenme Taşkını (4/4). Duygu Düzenleme Planlayıcısında kişisel STOPAR protokolünüzü hemen oluşturun.'
    ],
    primaryBtn: 'Duygu Düzenleme Planlayıcısını Aç &rarr;',
    subBtn: '3 Dakikalık Stres ve Tetikleyici Testini Çöz &rarr;'
  },
  hi: {
    badge: '30-सेकंड इमोशनल ट्रिगर और एमिग्डाला हाईजैक स्क्रीनर',
    heading: 'क्या यह सामान्य तनाव है या इमोशनल ट्रिगर (Amygdala Hijack)?',
    sub: 'जब आपकी भावनाएं अचानक तीव्र होती हैं, तब दिखने वाले संकेतों को चुनें:',
    items: [
      '<strong>0 से 100 तक अचानक उछाल:</strong> किसी छोटी सी बात या देरी पर स्थिति से कहीं अधिक गुस्सा, डर या शर्म की लहर उठना।',
      '<strong>सोचने से पहले शारीरिक अलार्म:</strong> दिमाग के समझने से पहले ही दिल की धड़कन तेज़ होना, गला रुंधना या पेट में हलचल होना।',
      '<strong>अतीत जैसा असहाय महसूस करना:</strong> उस पल अचानक खुद को पहले की तरह छोटा, शक्तिहीन या घिरा हुआ महसूस करना।',
      '<strong>90 सेकंड के बाद भी विचारों का लूप:</strong> शुरुआती 90 सेकंड की केमिकल लहर बीतने के घंटों बाद भी दिमाग में वही दृश्य बार-बार चलना।'
    ],
    scoreUnit: '/ 4 एमिग्डाला हाईजैक संकेत सक्रिय',
    verdicts: [
      'सामान्य प्रतिक्रिया और पुराने घाव के ट्रिगर में अंतर जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'हल्की परिस्थितिजन्य प्रतिक्रिया (1/4)। 90 सेकंड की गहरी सांस आपकी मानसिक स्पष्टता तुरंत लौटा देगी।',
      'सक्रिय इमोशनल ट्रिगर पैटर्न (2/4)। अतीत के अनसुलझे घाव वर्तमान प्रतिक्रियाओं को बढ़ा रहे हैं।',
      'उच्च एमिग्डाला हाईजैक आवृत्ति (3/4)। आपका थ्रेट अलार्म तार्किक मस्तिष्क से पहले सक्रिय हो रहा है।',
      'गंभीर ट्रिगर फ्लडिंग (4/4)। इमोशन रेगुलेशन प्लानर में अपना व्यक्तिगत STOPAR प्रोटोकॉल अभी तैयार करें।'
    ],
    primaryBtn: 'इमोशन रेगुलेशन प्लानर टूल खोलें &rarr;',
    subBtn: '3-मिनट का मुफ्त स्ट्रेस चेक शुरू करें &rarr;'
  }
};

const DECISION_FATIGUE_LOCALES = {
  en: {
    badge: '30-SECOND PREFRONTAL DEPLETION SCREENER',
    heading: 'Is Your Prefrontal Cortex Suffering from Decision Fatigue?',
    sub: 'Check the cognitive overload signs you have noticed by mid-afternoon or evening:',
    items: [
      '<strong>Trivial Choice Irritability:</strong> Simple questions like "what\'s for dinner?" or "which email first?" trigger immediate annoyance or exhaustion.',
      '<strong>Analysis Paralysis &amp; Tab Hoarding:</strong> You keep 15+ browser tabs or tasks open because choosing one option feels mentally overwhelming.',
      '<strong>Evening Impulse &amp; Default Collapse:</strong> After a disciplined morning, you default to takeout, doom-scrolling, or impulsive late-night spending.',
      '<strong>High-Stakes Procrastination:</strong> You busy yourself with low-value micro-tasks while postponing the 1–2 decisions that actually matter.'
    ],
    scoreUnit: 'of 4 decision fatigue signals active',
    verdicts: [
      'Check the signals above to measure your prefrontal cortex executive budget right now.',
      'Healthy Executive Bandwidth (1/4). Your cognitive load is manageable—use a weighted matrix for complex choices.',
      'Moderate Prefrontal Depletion (2/4). Micro-decisions are draining your willpower before evening arrives.',
      'High Decision Fatigue (3/4). Your executive brain is running low on glucose—offload choices into the Decision Matrix now.',
      'Severe Cognitive & Executive Overload (4/4). Stop deliberating in your head—externalize your choices in the Decision Matrix & Cognitive Load Calculator.'
    ],
    primaryBtn: 'Externalize Your Choice in the Decision Matrix &rarr;',
    subBtn: 'Measure Mental RAM in the Cognitive Load Calculator &rarr;'
  },
  ko: {
    badge: '30초 전두엽 결정 피로(Decision Fatigue) 판별기',
    heading: '지금 내 뇌는 게으른 걸까, "결정 피로"로 방전된 걸까?',
    sub: '오후나 저녁 무렵 반복되는 전두엽 에너지 고갈 신호를 체크해보세요:',
    items: [
      '<strong>사소한 선택에 대한 짜증과 회피:</strong> "오늘 저녁 뭐 먹을까?" 같은 간단한 질문에도 답하기 싫고 피로감이 몰려옵니다.',
      '<strong>분석 마비와 탭 쌓아두기:</strong> 하나를 고르는 것이 버거워 브라우저 탭이나 할 일 목록만 끝없이 열어두고 결정을 미룹니다.',
      '<strong>밤 시간 충동성 및 의지력 붕괴:</strong> 낮에는 잘 참다가도 밤이 되면 배달 음식, 충동구매, 무의미한 쇼츠 스크롤링에 무너집니다.',
      '<strong>중요 결정 회피와 잡무 도피:</strong> 정작 중요한 핵심 결정 1~2개는 미뤄둔 채 쉬운 메일 답장이나 사소한 일만 붙잡고 있습니다.'
    ],
    scoreUnit: '개 전두엽 결정 피로 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 전두엽(실행 기능)의 의사결정 에너지 잔량을 확인해보세요.',
      '양호한 전두엽 에너지(1/4). 중요한 선택만 의사결정 매트릭스로 구조화하면 최상의 판단력을 유지할 수 있습니다.',
      '중등도 결정 피로 누적(2/4). 수많은 자잘한 선택이 저녁 시간의 의지력을 갉아먹고 있습니다.',
      '높은 전두엽 에너지 고갈(3/4). 머릿속으로만 고민하지 말고 의사결정 매트릭스에 선택지를 외부화하세요.',
      '심각한 인지 과부하 및 결정 마비(4/4). 전두엽 배터리가 방전되었습니다. 지금 의사결정 매트릭스와 인지 부하 계산기로 뇌 용량을 비우세요.'
    ],
    primaryBtn: '딜레마 의사결정 매트릭스 도구 열기 &rarr;',
    subBtn: '인지 부하(뇌 RAM) 계산기로 과부하 측정 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN ENTSCHEIDUNGSMÜDIGKEITS-CHECK',
    heading: 'Leidet Ihr präfrontaler Kortex unter Decision Fatigue?',
    sub: 'Wählen Sie die Anzeichen aus, die Sie nachmittags oder abends an sich bemerken:',
    items: [
      '<strong>Gereiztheit bei kleinen Fragen:</strong> Einfache Entscheidungen wie „Was essen wir heute?“ lösen sofortigen Widerwillen aus.',
      '<strong>Analyse-Paralyse &amp; offene Tabs:</strong> Sie halten dutzende Tabs oder Optionen offen, weil das Festlegen mental überfordert.',
      '<strong>Abendlicher Willenskraft-Einbruch:</strong> Nach einem produktiven Tag kippen abends Ernährung, Disziplin oder Impulskontrolle.',
      '<strong>Aufschieben wichtiger Weichenstellungen:</strong> Sie erledigen Kleinkram, während Sie die 1–2 wirklich wichtigen Entscheidungen vertagen.'
    ],
    scoreUnit: 'von 4 Entscheidungsmüdigkeits-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihr aktuelles exekutives Energiebudget zu prüfen.',
      'Gute mentale Kapazität (1/4). Nutzen Sie für komplexe Fragen einfach eine strukturierte Entscheidungsmatrix.',
      'Mittlere Erschöpfung (2/4). Zu viele Mikro-Entscheidungen zehren Ihre tägliche Willenskraft auf.',
      'Hohe Entscheidungsmüdigkeit (3/4). Entlasten Sie Ihr Gehirn jetzt mit der gewichteten Entscheidungsmatrix.',
      'Schwere kognitive Überlastung (4/4). Lagern Sie Ihre Entscheidung sofort in die Matrix und den Cognitive Load Calculator aus.'
    ],
    primaryBtn: 'Jetzt interaktive Entscheidungsmatrix öffnen &rarr;',
    subBtn: 'Mentale Auslastung im Cognitive Load Rechner prüfen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE FATIGA DE DECISIÓN EN 30 SEGUNDOS',
    heading: '¿Tu corteza prefrontal sufre de fatiga de decisión?',
    sub: 'Marca las señales de agotamiento mental que notas por la tarde o noche:',
    items: [
      '<strong>Irritabilidad ante opciones simples:</strong> Preguntas como "¿qué cenamos?" te generan fastidio o bloqueo inmediato.',
      '<strong>Parálisis por análisis:</strong> Dejas decenas de pestañas o tareas abiertas porque elegir una sola te resulta agotador.',
      '<strong>Colapso de autocontrol nocturno:</strong> Tras un día productivo, por la noche caes en compras impulsivas, comida rápida o scroll infinito.',
      '<strong>Procrastinación de decisiones clave:</strong> Haces tareas rutinarias fáciles mientras postergas la decisión importante.'
    ],
    scoreUnit: 'de 4 señales de fatiga de decisión activas',
    verdicts: [
      'Marca los puntos arriba para medir tu presupuesto ejecutivo prefrontal ahora mismo.',
      'Buena capacidad ejecutiva (1/4). Usa una matriz ponderada cuando enfrentes dilemas complejos.',
      'Agotamiento prefrontal moderado (2/4). Las micro-decisiones están drenando tu fuerza de voluntad.',
      'Alta fatiga de decisión (3/4). Deja de dar vueltas en tu cabeza y usa la Matriz de Decisiones ahora.',
      'Sobrecarga cognitiva severa (4/4). Externaliza tus opciones en la Matriz de Decisiones y mide tu Carga Cognitiva.'
    ],
    primaryBtn: 'Abrir Matriz de Decisiones Interactiva &rarr;',
    subBtn: 'Medir Saturación en la Calculadora de Carga Cognitiva &rarr;'
  },
  fr: {
    badge: 'TRIAGE FATIGUE DÉCISIONNELLE EN 30 SECONDES',
    heading: 'Votre cortex préfrontal est-il en surcharge décisionnelle ?',
    sub: 'Cochez les signes d\'épuisement exécutif que vous remarquez en fin de journée :',
    items: [
      '<strong>Irritabilité face aux choix banals :</strong> Une simple question comme « qu\'est-ce qu\'on mange ce soir ? » vous épuise d\'avance.',
      '<strong>Paralysie de l\'analyse :</strong> Vous gardez 20 onglets ou options ouverts car trancher devient trop coûteux mentalement.',
      '<strong>Effondrement du contrôle le soir :</strong> Après une journée disciplinée, vous cédez aux achats impulsifs ou au défilement infini la nuit.',
      '<strong>Report des décisions majeures :</strong> Vous traitez de petites tâches secondaires pour éviter la décision stratégique qui compte.'
    ],
    scoreUnit: 'sur 4 signaux de fatigue décisionnelle actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer votre réserve d\'énergie préfrontale.',
      'Bonne bande passante exécutive (1/4). Utilisez une matrice pondérée pour vos choix complexes.',
      'Épuisement préfrontal modéré (2/4). Les micro-décisions grignotent votre volonté quotidienne.',
      'Forte fatigue décisionnelle (3/4). Soulagez votre esprit en utilisant la Matrice de Décision.',
      'Surcharge cognitive sévère (4/4). Externalisez immédiatement vos choix dans la Matrice et le Calculateur de Charge Cognitive.'
    ],
    primaryBtn: 'Ouvrir la Matrice de Décision Interactive &rarr;',
    subBtn: 'Mesurer votre RAM Mentale (Charge Cognitive) &rarr;'
  },
  ja: {
    badge: '30秒・決断疲れ（ディシジョン・ファティーグ）チェック',
    heading: '前頭葉のウィルパワーが「決断疲れ」でガス欠していませんか？',
    sub: '夕方〜夜にかけて現れやすい脳のエネルギー切れサインをチェックしてください：',
    items: [
      '<strong>些細な選択へのイライラ：</strong> 「今日の夕飯どうする？」といった簡単な質問すら考えるのが面倒で疲れる。',
      '<strong>分析麻痺とタブの放置：</strong> 1つに決めるエネルギーがなく、ブラウザのタブや保留タスクばかりが増えていく。',
      '<strong>夜の自制心崩壊：</strong> 日中は頑張れるのに、夜になるとジャンクフード、衝動買い、ダラダラスマホに流される。',
      '<strong>重要決断の先延ばし：</strong> 本当に決めるべき重要な1件を避け、簡単な雑務ばかりを片付けてしまう。'
    ],
    scoreUnit: '/ 4 個の決断疲れサインが該当',
    verdicts: [
      '上の項目をチェックして、現在の前頭葉の決断エネルギー残量を確認しましょう。',
      '良好な決断キャパシティ（1/4）。迷う問題だけ意思決定マトリクスで整理すれば快適に進めます。',
      '中程度の前頭葉疲労（2/4）。日々の小さな選択が夕方のウィルパワーを削っています。',
      '高い決断疲れ状態（3/4）。頭の中だけで悩まず、意思決定マトリクスに書き出して脳を休ませましょう。',
      '深刻な認知オーバーロード（4/4）。脳のメモリが限界です。今すぐ意思決定マトリクスと認知負荷計算機を使って頭を空にしましょう。'
    ],
    primaryBtn: '意思決定マトリクスツールで迷いを数値化する &rarr;',
    subBtn: '認知負荷（脳メモリ）計算機で疲労度を測る &rarr;'
  },
  zh: {
    badge: '30秒前额叶“决策疲劳”快速筛查',
    heading: '你的大脑不是懒，而是陷入“决策疲劳”了吗？',
    sub: '勾选你在下午或晚上最常出现的执行功能耗竭信号：',
    items: [
      '<strong>对琐碎选择感到烦躁：</strong> 面对“晚上吃什么”或“先回哪封邮件”这类小事，第一反应是不耐烦或说“随便”。',
      '<strong>分析瘫痪与标签页囤积：</strong> 浏览器开着几十个标签页或待办事项，因为做最终拍板让你感到心理畏惧。',
      '<strong>夜间自控力崩盘：</strong> 白天自律克制，一到晚上就忍不住报复性熬夜、冲动网购或点高热量外卖。',
      '<strong>用低价值杂务逃避核心决策：</strong> 不停处理简单琐事，却一直拖延那 1～2 个真正重要的人生或工作决定。'
    ],
    scoreUnit: '/ 4 项决策疲劳信号激活',
    verdicts: [
      '勾选上方信号，评估你当前的前额叶决策带宽与意志力余量。',
      '良好的执行功能基线 (1/4)。遇到复杂纠结时使用决策矩阵即可保持高效。',
      '中度前额叶耗竭 (2/4)。过多微小的日常选择正在悄悄掏空你的晚间意志力。',
      '高度决策疲劳 (3/4)。不要再靠大脑空想内耗，立即用加权决策矩阵帮你做减法。',
      '重度认知与决策超载 (4/4)。你的工作记忆已满载，请立即打开决策矩阵与认知负荷计算器释放大脑内存。'
    ],
    primaryBtn: '打开互动式决策矩阵工具化解纠结 &rarr;',
    subBtn: '使用认知负荷计算器测量大脑内存占用 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE FADIGA DE DECISÃO EM 30 SEGUNDOS',
    heading: 'Seu córtex pré-frontal está sofrendo de fadiga de decisão?',
    sub: 'Marque os sinais de sobrecarga mental que você nota no fim da tarde ou à noite:',
    items: [
      '<strong>Irritação com escolhas simples:</strong> Perguntas como "o que vamos jantar?" geram cansaço ou impaciência imediata.',
      '<strong>Paralisia por análise:</strong> Você mantém dezenas de abas ou opções abertas porque decidir parece pesado demais.',
      '<strong>Queda de autocontrole à noite:</strong> Após um dia produtivo, você cede a compras por impulso, delivery ou rolagem infinita.',
      '<strong>Adiar decisões importantes:</strong> Você se ocupa com tarefas fáceis enquanto adia a decisão que realmente importa.'
    ],
    scoreUnit: 'de 4 sinais de fadiga de decisão ativos',
    verdicts: [
      'Marque os itens acima para medir seu orçamento executivo pré-frontal agora.',
      'Boa capacidade executiva (1/4). Use uma matriz ponderada para escolhas complexas.',
      'Desgaste pré-frontal moderado (2/4). Micro-decisões estão drenando sua força de vontade.',
      'Alta fadiga de decisão (3/4). Pare de ruminar e coloque suas opções na Matriz de Decisão.',
      'Sobrecarga cognitiva severa (4/4). Externalize sua escolha na Matriz de Decisão e meça sua Carga Cognitiva agora.'
    ],
    primaryBtn: 'Abrir Matriz de Decisão Interativa &rarr;',
    subBtn: 'Medir Memória Mental na Calculadora de Carga Cognitiva &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА УСТАЛОСТЬ ОТ ПРИНЯТИЯ РЕШЕНИЙ',
    heading: 'Испытывает ли ваша префронтальная кора усталость от решений?',
    sub: 'Отметьте признаки когнитивного истощения, которые появляются у вас к вечеру:',
    items: [
      '<strong>Раздражение от простых вопросов:</strong> Даже вопрос «что на ужин?» вызывает усталость и желание ответить «всё равно».',
      '<strong>Паралич анализа:</strong> Вы держите десятки открытых вкладок, потому что сделать окончательный выбор слишком тяжело.',
      '<strong>Вечерний срыв самоконтроля:</strong> После продуктивного дня вечером вы срываетесь на импульсивные покупки, фастфуд или думскроллинг.',
      '<strong>Откладывание главных решений:</strong> Вы делаете мелкую рутину, бесконечно откладывая 1–2 действительно важных решения.'
    ],
    scoreUnit: 'из 4 признаков усталости от решений активно',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить текущий ресурс вашей префронтальной коры.',
      'Хороший когнитивный ресурс (1/4). Для сложных дилемм используйте взвешенную матрицу решений.',
      'Умеренное истощение (2/4). Мелкие бытовые выборы съедают вашу силу воли к вечеру.',
      'Высокая усталость от решений (3/4). Разгрузите голову с помощью интерактивной Матрицы решений.',
      'Критическая когнитивная перегрузка (4/4). Вынесите выбор на бумагу в Матрице решений и проверьте индекс когнитивной нагрузки.'
    ],
    primaryBtn: 'Открыть интерактивную Матрицу решений &rarr;',
    subBtn: 'Измерить перегрузку в Калькуляторе когнитивной нагрузки &rarr;'
  },
  id: {
    badge: 'SKRINING KELELAHAN KEPUTUSAN (DECISION FATIGUE) 30 DETIK',
    heading: 'Apakah Korteks Prefrontal Anda Mengalami Decision Fatigue?',
    sub: 'Centang tanda kelelahan mental yang paling sering muncul di sore atau malam hari:',
    items: [
      '<strong>Kesal Saat Ditanya Hal Sepele:</strong> Pertanyaan sederhana seperti "makan apa malam ini?" langsung terasa melelahkan.',
      '<strong>Lumpuh Analisis &amp; Tumpukan Tab:</strong> Anda membiarkan puluhan tab terbuka karena memilih satu opsi terasa sangat berat.',
      '<strong>Runtuhnya Kontrol Diri di Malam Hari:</strong> Setelah disiplin seharian, malamnya Anda impulsif belanja online, pesan junk food, atau scroll tanpa henti.',
      '<strong>Menunda Keputusan Penting:</strong> Anda sibuk mengerjakan tugas receh sambil terus menunda 1–2 keputusan besar.'
    ],
    scoreUnit: 'dari 4 sinyal kelelahan keputusan aktif',
    verdicts: [
      'Centang poin di atas untuk mengukur sisa energi eksekutif otak Anda saat ini.',
      'Kapasitas Eksekutif Sehat (1/4). Gunakan matriks berbobot saat menghadapi pilihan rumit.',
      'Kelelahan Prefrontal Sedang (2/4). Keputusan-keputusan kecil sedang menguras willpower harian Anda.',
      'Decision Fatigue Tinggi (3/4). Berhenti memutar opsi di kepala—gunakan Matriks Keputusan sekarang.',
      'Overload Kognitif Berat (4/4). Pindahkan beban pikiran Anda ke Matriks Keputusan &amp; Kalkulator Beban Kognitif.'
    ],
    primaryBtn: 'Buka Matriks Keputusan Interaktif &rarr;',
    subBtn: 'Ukur RAM Mental di Kalkulator Beban Kognitif &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK KARAR YORGUNLUĞU (DECISION FATIGUE) TARAMASI',
    heading: 'Prefrontal Korteksiniz Karar Yorgunluğu mu Yaşıyor?',
    sub: 'Öğleden sonra veya akşam saatlerinde fark ettiğiniz zihinsel tükenme işaretlerini seçin:',
    items: [
      '<strong>Basit Seçimlere Tahammülsüzlük:</strong> "Akşam ne yiyelim?" gibi basit sorular bile anında bıkkınlık yaratıyor.',
      '<strong>Analiz Felci ve Açık Sekmeler:</strong> Tek bir seçeneğe karar vermek zor geldiği için onlarca sekmeyi açık bırakıyorsunuz.',
      '<strong>Gece Öz-Kontrol Çöküşü:</strong> Gündüz disiplinli olsanız da gece dürtüsel alışverişe, sağlıksız atıştırmaya veya sonsuz kaydırmaya yeniliyorsunuz.',
      '<strong>Önemli Kararları Erteleme:</strong> Gerçekten önemli 1–2 kararı erteleyip kolay ve düşük değerli işlerle oyalanıyorsunuz.'
    ],
    scoreUnit: '/ 4 karar yorgunluğu sinyali aktif',
    verdicts: [
      'Prefrontal yürütücü enerji bütçenizi ölçmek için yukarıdaki maddeleri işaretleyin.',
      'Sağlıklı Yürütücü Kapasite (1/4). Karmaşık ikilemler için ağırlıklı karar matrisini kullanabilirsiniz.',
      'Orta Düzey Prefrontal Tükenme (2/4). Küçük günlük seçimler akşam iradenizi tüketiyor.',
      'Yüksek Karar Yorgunluğu (3/4). Zihninizi yormayı bırakıp seçenekleri Karar Matrisine aktarın.',
      'Şiddetli Bilişsel Aşırı Yük (4/4). Seçimlerinizi hemen Karar Matrisi ve Bilişsel Yük Hesaplayıcısı ile dışsallaştırın.'
    ],
    primaryBtn: 'İnteraktif Karar Matrisini Aç &rarr;',
    subBtn: 'Bilişsel Yük Hesaplayıcısında Zihinsel Yükü Ölç &rarr;'
  },
  hi: {
    badge: '30-सेकंड डिसीजन फटीग (निर्णय थकान) स्क्रीनर',
    heading: 'क्या आपका प्रीफ्रंटल कॉर्टेक्स "डिसीजन फटीग" से थक चुका है?',
    sub: 'शाम या रात तक महसूस होने वाले मानसिक थकान के संकेतों को चुनें:',
    items: [
      '<strong>छोटे फैसलों पर चिड़चिड़ापन:</strong> "आज खाने में क्या बनाएं?" जैसे आसान सवाल भी तुरंत थकान या झुंझलाहट पैदा करते हैं।',
      '<strong>एनालिसिस पैरालिसिस और खुले टैब्स:</strong> एक विकल्प चुनना भारी लगता है, इसलिए आप दर्जनों ब्राउज़र टैब या काम अधूरे छोड़ देते हैं।',
      '<strong>रात में आत्म-नियंत्रण टूटना:</strong> दिन भर अनुशासित रहने के बाद रात में जंक फूड, इम्पल्स शॉपिंग या अंतहीन स्क्रॉलिंग में फंस जाना।',
      '<strong>बड़े फैसलों को टालना:</strong> आप आसान छोटे कामों में खुद को उलझाए रखते हैं ताकि 1–2 सबसे महत्वपूर्ण फैसले न लेने पड़ें।'
    ],
    scoreUnit: '/ 4 डिसीजन फटीग संकेत सक्रिय',
    verdicts: [
      'अपने मस्तिष्क की वर्तमान निर्णय क्षमता जांचने के लिए ऊपर दिए गए विकल्प चुनें।',
      'स्वस्थ निर्णय क्षमता (1/4)। जटिल फैसलों के लिए बस डिसीजन मैट्रिक्स का उपयोग करें।',
      'मध्यम प्रीफ्रंटल थकान (2/4)। दिन भर के छोटे-छोटे चुनाव आपकी इच्छाशक्ति को कम कर रहे हैं।',
      'उच्च डिसीजन फटीग (3/4)। दिमाग में उलझने के बजाय अपने विकल्पों को डिसीजन मैट्रिक्स में डालें।',
      'गंभीर कॉग्निटिव ओवरलोड (4/4)। तुरंत डिसीजन मैट्रिक्स और कॉग्निटिव लोड कैलकुलेटर से अपने दिमाग का बोझ हल्का करें।'
    ],
    primaryBtn: 'इंटरैक्टिव डिसीजन मैट्रिक्स टूल खोलें &rarr;',
    subBtn: 'कॉग्निटिव लोड कैलकुलेटर में मानसिक भार मापें &rarr;'
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

  // 1. fight-flight-freeze-fawn-test.html (12 locales)
  for (const [lang, loc] of Object.entries(STRESS_4F_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'fight-flight-freeze-fawn-test.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'stress4fScreener',
      chkClass: 's4f-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=4f_test_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=4f_test_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/fight-flight-freeze-fawn-test.html`);
    console.log(`[PASS] fight-flight-freeze-fawn-test (${lang})`);
  }

  // 2. emotional-triggers-understanding.html (12 locales)
  for (const [lang, loc] of Object.entries(EMOTIONAL_TRIGGERS_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-triggers-understanding.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'emotionalTriggerScreener',
      chkClass: 'emotrig-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=emotional_triggers_screener`,
      primaryTargetSlug: 'emotion-regulation-planner',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/?lang=${lang}&source=emotional_triggers_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-triggers-understanding.html`);
    console.log(`[PASS] emotional-triggers-understanding (${lang})`);
  }

  // 3. decision-fatigue-signs-solutions.html (12 locales)
  for (const [lang, loc] of Object.entries(DECISION_FATIGUE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'decision-fatigue-signs-solutions.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'decisionFatigueScreener',
      chkClass: 'decfat-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/portal/tools/decision-matrix.html?lang=${lang}&source=decision_fatigue_screener`,
      primaryTargetSlug: 'decision-matrix',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/cognitive-load-calculator.html?lang=${lang}&source=decision_fatigue_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/decision-fatigue-signs-solutions.html`);
    console.log(`[PASS] decision-fatigue-signs-solutions (${lang})`);
  }

  // 4. trauma-response-4f-fight-flight-freeze-fawn.html (en & ko)
  for (const lang of ['en', 'ko']) {
    const filePath = path.join(PORTAL_BLOG, lang, 'trauma-response-4f-fight-flight-freeze-fawn.html');
    if (!fs.existsSync(filePath)) continue;
    const loc = STRESS_4F_LOCALES[lang];
    applyScreenerToFile(filePath, {
      lang,
      id: 'trauma4fScreener',
      chkClass: 'tr4f-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&start=1&surface=${lang}_trauma_4f_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=${lang}_trauma_4f_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/trauma-response-4f-fight-flight-freeze-fawn.html`);
    console.log(`[PASS] trauma-response-4f-fight-flight-freeze-fawn (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 2: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

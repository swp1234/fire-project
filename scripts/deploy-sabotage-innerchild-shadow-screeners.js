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

const SELF_SABOTAGE_LOCALES = {
  en: {
    badge: '30-SECOND PROTECTIVE SELF-SABOTAGE SCREENER',
    heading: 'Why Do You Pull the Plug Right Before Things Go Well?',
    sub: 'Check the unconscious "upper-limit" defense patterns active in your goals and relationships:',
    items: [
      '<strong>Finish-Line Withdrawal:</strong> You work hard to reach 90% of a goal, then mysteriously lose momentum, miss deadlines, or abandon the project.',
      '<strong>Upper-Limit Discomfort:</strong> When life or a relationship feels unusually calm and successful, you unconsciously pick a fight or create a crisis.',
      '<strong>Protective Self-Handicapping:</strong> You procrastinate until the last minute so that if you fail, you can blame lack of time instead of your ability.',
      '<strong>Preemptive Rejection:</strong> You pull away from promising opportunities or partners first so they never get the chance to disappoint you.'
    ],
    scoreUnit: 'of 4 protective self-sabotage signals active',
    verdicts: [
      'Check the items above to see if your nervous system uses self-sabotage as a safety shield.',
      'Low Self-Sabotage Interference (1/4). Minor hesitation around new challenges without chronic derailing.',
      'Moderate Upper-Limit Friction (2/4). Your nervous system equates higher visibility or success with higher threat.',
      'High Protective Self-Handicapping (3/4). Fear of failure or exposure is triggering unconscious self-derailing.',
      'Core Self-Sabotage Defense Loop (4/4). Your nervous system prefers familiar frustration over unfamiliar success—check your stress and attachment patterns now.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Threat-Response Check &rarr;',
    subBtn: 'Check Relational Sabotage with the Attachment Test &rarr;'
  },
  ko: {
    badge: '30초 방어적 자기방해(Self-Sabotage) 패턴 판별기',
    heading: '왜 일이 잘 풀려갈 때쯤 스스로 브레이크를 밟을까요?',
    sub: '목표 달성이나 관계가 깊어질 때 무의식적으로 작동하는 자기방해 신호를 체크해보세요:',
    items: [
      '<strong>결승선 직전의 기권:</strong> 90%까지 열심히 해놓고 마지막 완성·제출 단계에서 갑자기 의욕을 잃거나 미루며 망쳐버립니다.',
      '<strong>행복 상한선(Upper-Limit) 불안:</strong> 삶이나 관계가 평온하고 순조로울수록 오히려 불안해져서 스스로 갈등이나 문제를 만듭니다.',
      '<strong>자존감 방어용 셀프 핸디캐핑:</strong> 실패했을 때 "능력이 부족해서가 아니라 시간이 없어서"라고 핑계 대기 위해 일부러 마감 직전까지 미룹니다.',
      '<strong>선제적 거절과 도피:</strong> 좋은 기회나 다정한 사람에게 나중에 실망하거나 버림받기 전에 내가 먼저 거리를 두고 끊어냅니다.'
    ],
    scoreUnit: '개 방어적 자기방해 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 무의식이 나를 보호하기 위해 쓰는 자기방해 패턴을 확인해보세요.',
      '낮은 자기방해 개입(1/4). 새로운 도전 앞에서의 자연스러운 긴장 수준입니다.',
      '중등도 상한선 저항(2/4). 신경계가 더 큰 성공이나 친밀감을 더 큰 위험으로 인식하고 있습니다.',
      '높은 방어적 셀프 핸디캐핑(3/4). 실패와 수치심에 대한 공포가 무의식적 브레이크를 작동시키고 있습니다.',
      '강한 핵심 자기방해 루프(4/4). 신경계가 낯선 행복보다 익숙한 좌절을 안전하다고 착각하고 있습니다. 지금 스트레스 및 애착 진단을 시작하세요.'
    ],
    primaryBtn: '3분 신경계 스트레스 및 방어기제 진단 &rarr;',
    subBtn: '관계 속 자기방해 원인을 찾는 애착 유형 테스트 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN SELBSTSABOTAGE-MUSTER-CHECK',
    heading: 'Warum ziehen Sie kurz vor dem Erfolg den Stecker?',
    sub: 'Wählen Sie die unbewussten Schutzmuster aus, die Ihre Ziele und Beziehungen bremsen:',
    items: [
      '<strong>Abbruch vor der Ziellinie:</strong> Sie bringen Projekte bis zu 90 %, verlieren dann aber plötzlich den Antrieb oder verpassen Fristen.',
      '<strong>Obergrenzen-Unbehagen:</strong> Wenn es in Beruf oder Liebe ungewohnt gut läuft, lösen Sie unbewusst Konflikte oder Krisen aus.',
      '<strong>Schützendes Self-Handicapping:</strong> Sie schieben Aufgaben bis zuletzt auf, um ein mögliches Scheitern auf Zeitmangel schieben zu können.',
      '<strong>Präventiver Rückzug:</strong> Sie beenden gute Chancen oder Beziehungen zuerst, bevor Sie enttäuscht oder abgelehnt werden können.'
    ],
    scoreUnit: 'von 4 Selbstsabotage-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um unbewusste Selbstsabotage zu erkennen.',
      'Geringe Selbstsabotage (1/4). Normales Zögern vor neuen Herausforderungen.',
      'Moderater Obergrenzen-Widerstand (2/4). Ihr Nervensystem verknüpft Erfolg oder Nähe mit Gefahr.',
      'Hohes Schutz-Handicapping (3/4). Angst vor Versagen oder Sichtbarkeit bremst Sie unbewusst aus.',
      'Chronische Selbstsabotage-Schleife (4/4). Prüfen Sie jetzt Ihr Stressprofil und Ihr Bindungsmuster.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Abwehrmuster-Check starten &rarr;',
    subBtn: 'Beziehungs-Sabotage mit dem Bindungstest prüfen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE AUTOSABOTAJE PROTECTIVO EN 30 SEGUNDOS',
    heading: '¿Por qué frenas justo antes de que las cosas salgan bien?',
    sub: 'Marca los patrones inconscientes de defensa que bloquean tus metas y relaciones:',
    items: [
      '<strong>Abandono en la línea de meta:</strong> Avanzas hasta el 90 % de un objetivo y de pronto pierdes impulso o saboteas el cierre.',
      '<strong>Incomodidad ante el bienestar:</strong> Cuando todo va demasiado bien o en calma, inconscientemente provocas una discusión o crisis.',
      '<strong>Auto-obstaculización protectora:</strong> Postergas hasta el último minuto para culpar a la falta de tiempo y no a tu capacidad si fallas.',
      '<strong>Rechazo preventivo:</strong> Te alejas primero de buenas oportunidades o parejas para que nunca puedan decepcionarte.'
    ],
    scoreUnit: 'de 4 señales de autosabotaje activas',
    verdicts: [
      'Marca los puntos arriba para ver si tu sistema nervioso usa el autosabotaje como escudo.',
      'Baja interferencia (1/4). Duda normal ante nuevos retos sin bloqueo crónico.',
      'Fricción moderada de límite superior (2/4). Tu sistema nervioso asocia más éxito o intimidad con mayor riesgo.',
      'Alta auto-obstaculización protectora (3/4). El miedo al fracaso o exposición activa frenos inconscientes.',
      'Bucle severo de autosabotaje (4/4). Tu cerebro prefiere la frustración conocida al éxito incierto. Haz el test ahora.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Respuesta de Amenaza &rarr;',
    subBtn: 'Evaluar Sabotaje Relacional con el Test de Apego &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR D’AUTO-SABOTAGE PROTECTEUR EN 30 SECONDES',
    heading: 'Pourquoi appuyez-vous sur le frein juste avant de réussir ?',
    sub: 'Cochez les réflexes inconscients qui freinent vos projets et vos relations :',
    items: [
      '<strong>Retrait sur la ligne d’arrivée :</strong> Vous avancez jusqu’à 90 % d’un projet puis perdez soudainement toute énergie au moment de conclure.',
      '<strong>Malaise du plafond de bonheur :</strong> Quand tout est calme et fluide, vous créez inconsciemment une dispute ou une crise.',
      '<strong>Auto-handicap protecteur :</strong> Vous procrastinez jusqu’à la dernière minute pour pouvoir accuser le manque de temps en cas d’échec.',
      '<strong>Rejet préventif :</strong> Vous quittez les bonnes opportunités ou partenaires en premier pour éviter d’être déçu.'
    ],
    scoreUnit: 'sur 4 signaux d’auto-sabotage actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour identifier vos mécanismes d’auto-sabotage.',
      'Faible auto-sabotage (1/4). Hésitation naturelle face à la nouveauté.',
      'Friction modérée du plafond de réussite (2/4). Votre système nerveux associe visibilité et danger.',
      'Fort auto-handicap protecteur (3/4). La peur du jugement déclenche des freins inconscients.',
      'Boucle sévère d’auto-sabotage (4/4). Évaluez votre charge de stress et votre style d’attachement dès maintenant.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Mécanismes de Défense &rarr;',
    subBtn: 'Tester le Sabotage Relationnel avec le Test d’Attachement &rarr;'
  },
  ja: {
    badge: '30秒 防衛的セルフ・サボタージュ（自己妨害）診断チェック',
    heading: 'なぜ物事がうまくいきそうになると、自分で壊してしまうのか？',
    sub: '目標達成や親密な関係の手前で無意識にブレーキを踏むサインをチェックしてください：',
    items: [
      '<strong>ゴール寸前での失速・放棄：</strong> 90%まで順調に進めたのに、最後の仕上げや提出の段階で急にやる気を失い先延ばしにする。',
      '<strong>幸福の上限（アッパーリミット）不安：</strong> 仕事や人間関係が順調で穏やかすぎると、居心地が悪くなり自らトラブルを作ってしまう。',
      '<strong>自尊心を守るセルフ・ハンディキャッピング：</strong> 失敗したときに「時間がなかったから」と言い訳できるよう、わざと直前まで手をつけない。',
      '<strong>先回りした拒絶と撤退：</strong> 傷ついたり失望されたりする前に、有望なチャンスや大切な人から自分から離れてしまう。'
    ],
    scoreUnit: '/ 4 個の自己妨害（セルフ・サボタージュ）信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、無意識の防衛ブレーキが働いていないか確認しましょう。',
      '自己妨害の干渉は低め（1/4）。新しい挑戦に対する自然な慎重さです。',
      '中程度のアッパーリミット抵抗（2/4）。神経系が「成功や親密さ＝リスクの増大」と警戒しています。',
      '高い防衛的セルフ・ハンディキャッピング（3/4）。失敗や恥への恐怖が無意識のブレーキを作動させています。',
      '深刻な自己妨害ループ（4/4）。脳が「未知の成功」より「慣れ親しんだ停滞」を安全だと錯覚しています。今すぐストレス＆愛着診断を行ってください。'
    ],
    primaryBtn: '3分間の無料ストレス＆防衛反応チェックへ &rarr;',
    subBtn: '人間関係の自己妨害を解く「愛着スタイル診断」へ &rarr;'
  },
  zh: {
    badge: '30秒 防御性自我挫败（Self-Sabotage）筛查',
    heading: '为什么事情眼看就要顺利时，你却亲手踩下刹车？',
    sub: '勾选在目标达成或关系升温前，你潜意识自动启动的防御性破坏信号：',
    items: [
      '<strong>终点线前突然撤退：</strong> 已经努力做到了 90%，却在最后收尾或提交阶段莫名失去动力、拖延甚至放弃。',
      '<strong>幸福上限（Upper-Limit）不适感：</strong> 当生活或关系出奇地顺利平静时，反而感到莫名不安，不自觉地挑起争端或制造危机。',
      '<strong>保护性自我设障：</strong> 故意拖到最后一刻才动手，这样万一失败就可以怪“时间不够”而不是“能力不行”。',
      '<strong>先发制人的抽离：</strong> 在好机会或好伴侣可能让你失望之前，自己先主动退缩或推开对方。'
    ],
    scoreUnit: '/ 4 个防御性自我挫败信号已激活',
    verdicts: [
      '勾选上方信号，查看你的神经系统是否把“自我挫败”当成了安全防护盾。',
      '低度自我设限（1/4）。面对新挑战时的正常犹豫，未形成慢性内耗。',
      '中度幸福上限阻力（2/4）。你的神经系统把更高的成功或亲密等同于更大的风险。',
      '高度保护性自我设障（3/4）。对失败或暴露缺点的恐惧正在触发潜意识刹车。',
      '核心自我挫败防御循环（4/4）。你的大脑觉得“熟悉的挫败”比“陌生的成功”更安全，请立即检测压力负荷与依恋模式。'
    ],
    primaryBtn: '开始 3 分钟压力与威胁防御测试 &rarr;',
    subBtn: '通过依恋类型测试排查亲密关系自我挫败 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE AUTOSSABOTAGEM PROTETORA EM 30 SEGUNDOS',
    heading: 'Por que você puxa o freio de mão justamente quando tudo começa a dar certo?',
    sub: 'Marque os padrões inconscientes de defesa ativos em suas metas e relações:',
    items: [
      '<strong>Desistência na linha de chegada:</strong> Você chega a 90% de uma meta e, de repente, perde o gás, atrasa ou abandona a entrega.',
      '<strong>Desconforto com a calmaria:</strong> Quando a vida ou o relacionamento está calmo e positivo, você inconscientemente cria uma crise.',
      '<strong>Auto-obstaculização protetora:</strong> Você adia até o último minuto para poder culpar a falta de tempo (e não sua capacidade) se falhar.',
      '<strong>Rejeição preventiva:</strong> Você se afasta primeiro de boas oportunidades ou parceiros para evitar ser decepcionado depois.'
    ],
    scoreUnit: 'de 4 sinais de autossabotagem protetora ativos',
    verdicts: [
      'Marque os itens acima para ver se seu sistema nervoso usa a autossabotagem como escudo.',
      'Baixa interferência (1/4). Hesitação normal diante de novos desafios.',
      'Atrito moderado de limite superior (2/4). Seu cérebro associa mais visibilidade ou intimidade a maior perigo.',
      'Alta autossabotagem protetora (3/4). O medo de falhar está acionando freios inconscientes.',
      'Ciclo severo de autossabotagem (4/4). Seu sistema nervoso prefere a frustração familiar ao sucesso novo. Faça o teste agora.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Resposta de Ameaça &rarr;',
    subBtn: 'Avaliar Sabotagem nos Relacionamentos com o Teste de Apego &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ЗАЩИТНЫЙ САМОСАБОТАЖ',
    heading: 'Почему вы нажимаете на тормоз прямо перед успехом?',
    sub: 'Отметьте неосознанные защитные паттерны, мешающие вашим целям и отношениям:',
    items: [
      '<strong>Отступление перед финишем:</strong> Вы доводите дело до 90%, а затем внезапно теряете интерес, срываете сроки или бросаете проект.',
      '<strong>Тревога «потолка благополучия»:</strong> Когда в жизни или отношениях все слишком спокойно и хорошо, вы невольно создаете кризис или ссору.',
      '<strong>Защитное самоограничение:</strong> Вы тянете до последнего, чтобы в случае неудачи списать всё на нехватку времени, а не на способности.',
      '<strong>Превентивный уход:</strong> Вы первыми отталкиваете хорошие возможности или партнеров, чтобы они не успели разочаровать вас.'
    ],
    scoreUnit: 'из 4 признаков защитного самосаботажа активны',
    verdicts: [
      'Отметьте пункты выше, чтобы понять, использует ли ваш мозг самосаботаж как щит.',
      'Низкий уровень самосаботажа (1/4). Естественная осторожность перед новым шагом.',
      'Умеренное сопротивление росту (2/4). Нервная система связывает успех или близость с угрозой.',
      'Высокий защитный самосаботаж (3/4). Страх оценки включает бессознательное торможение.',
      'Глубокий цикл самосаботажа (4/4). Мозг выбирает привычное разочарование вместо пугающей новизны. Проверьте стресс и тип привязанности.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и защитные реакции &rarr;',
    subBtn: 'Проверить сценарии отношений в тесте на тип привязанности &rarr;'
  },
  id: {
    badge: 'SKRINING SABOTASE DIRI (SELF-SABOTAGE) 30 DETIK',
    heading: 'Mengapa Anda Justru Menginjak Rem Saat Segalanya Hampir Berhasil?',
    sub: 'Centang pola pertahanan bawah sadar yang menghambat target dan hubungan Anda:',
    items: [
      '<strong>Mundur di Garis Finis:</strong> Anda bekerja keras hingga 90% target, lalu mendadak hilang motivasi atau menunda penyelesaian.',
      '<strong>Gelisah Saat Terlalu Tenang:</strong> Ketika hidup atau hubungan terasa lancar dan aman, Anda tanpa sadar memicu masalah.',
      '<strong>Self-Handicapping Pelindung:</strong> Anda menunda sampai menit terakhir agar jika gagal bisa menyalahkan waktu, bukan kemampuan.',
      '<strong>Menolak Lebih Dulu:</strong> Anda menjauh lebih dulu dari peluang bagus atau pasangan agar tidak sempat dikecewakan.'
    ],
    scoreUnit: 'dari 4 sinyal sabotase diri pelindung aktif',
    verdicts: [
      'Centang item di atas untuk melihat apakah sistem saraf Anda memakai sabotase diri sebagai tameng.',
      'Hambatan Rendah (1/4). Keraguan wajar saat menghadapi tantangan baru.',
      'Gesekan Batas Atas Sedang (2/4). Sistem saraf menyamakan kesuksesan atau keintiman dengan risiko.',
      'Sabotase Pelindung Tinggi (3/4). Rasa takut gagal memicu rem bawah sadar Anda.',
      'Siklus Sabotase Diri Berat (4/4). Otak memilih kegagalan yang familiar daripada kesuksesan baru. Cek stres &amp; gaya kelekatan Anda.'
    ],
    primaryBtn: 'Ikuti Tes Stres &amp; Respons Ancaman 3 Menit &rarr;',
    subBtn: 'Cek Sabotase Hubungan dengan Tes Gaya Kelekatan &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK KORUYUCU KENDİNİ SABOTE ETME TARAMASI',
    heading: 'İşler Tam Yoluna Girerken Neden Kendi Ayağınıza Çelme Takıyorsunuz?',
    sub: 'Hedeflerinizde ve ilişkilerinizde devreye giren bilinçdışı savunma kalıplarını işaretleyin:',
    items: [
      '<strong>Bitiş Çizgisinde Geri Çekilme:</strong> Bir hedefin %90’ına kadar gelip son aşamada aniden motivasyonu kaybediyor veya erteliyorsunuz.',
      '<strong>Üst Sınır Huzursuzluğu:</strong> Hayat veya ilişki alışılmadık derecede sakin ve iyi gittiğinde bilinçdışı bir kriz çıkarıyorsunuz.',
      '<strong>Koruyucu Kendini Engelleme:</strong> Başarısız olursanız yeteneğinizi değil zaman darlığını suçlayabilmek için son dakikaya kadar bekliyorsunuz.',
      '<strong>Önleyici Reddetme:</strong> Hayal kırıklığına uğramamak için iyi fırsatları veya yakınlaşan partnerleri önce siz uzaklaştırıyorsunuz.'
    ],
    scoreUnit: '/ 4 koruyucu kendini sabote etme sinyali aktif',
    verdicts: [
      'Sinir sisteminizin kendini sabotajı bir güvenlik kalkanı olarak kullanıp kullanmadığını görün.',
      'Düşük Sabotaj Etkisi (1/4). Yeni hedefler karşısında doğal tereddüt.',
      'Orta Düzey Üst Sınır Direnci (2/4). Sinir sisteminiz daha fazla başarı veya yakınlığı tehdit olarak algılıyor.',
      'Yüksek Koruyucu Engelleme (3/4). Başarısızlık korkusu bilinçdışı frenlerinizi devreye sokuyor.',
      'Derin Kendini Sabote Döngüsü (4/4). Beyniniz tanıdık hayal kırıklığını yabancı başarıya tercih ediyor. Şimdi stres ve bağlanma testini çözün.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Savunma Tepkisi Testini Başlat &rarr;',
    subBtn: 'İlişkisel Sabotajı Bağlanma Stili Testiyle Ölç &rarr;'
  },
  hi: {
    badge: '30-सेकंड सेल्फ-सैबोटाज (Self-Sabotage) पैटर्न स्क्रीनर',
    heading: 'जब सब कुछ अच्छा होने वाला होता है, तब आप खुद ही कदम पीछे क्यों खींच लेते हैं?',
    sub: 'अपने लक्ष्यों और रिश्तों में अनजाने में काम करने वाले इन रक्षात्मक संकेतों को चुनें:',
    items: [
      '<strong>फिनिश लाइन से ठीक पहले रुक जाना:</strong> लक्ष्य के 90% तक मेहनत करने के बाद अचानक प्रेरणा खो देना या काम अधूरा छोड़ देना।',
      '<strong>खुशी और शांति में बेचैनी:</strong> जब जीवन या रिश्ता बहुत शांत और अच्छा चल रहा हो, तो अनजाने में कोई विवाद या संकट खड़ा कर लेना।',
      '<strong>बचाव के लिए काम टालना:</strong> आखिरी समय तक काम टालना ताकि असफल होने पर अपनी क्षमता के बजाय "समय की कमी" को दोष दिया जा सके।',
      '<strong>पहले ही दूरी बना लेना:</strong> अच्छे अवसरों या रिश्तों से खुद पहले ही पीछे हट जाना ताकि बाद में निराशा का सामना न करना पड़े।'
    ],
    scoreUnit: '/ 4 सेल्फ-सैबोटाज संकेत सक्रिय',
    verdicts: [
      'यह देखने के लिए ऊपर चुनें कि क्या आपका नर्वस सिस्टम बचाव के लिए सेल्फ-सैबोटाज का उपयोग कर रहा है।',
      'कम सेल्फ-सैबोटाज (1/4)। नई चुनौतियों के सामने सामान्य झिझक।',
      'मध्यम प्रतिरोध (2/4)। आपका नर्वस सिस्टम बड़ी सफलता या नज़दीकी को खतरे से जोड़ रहा है।',
      'उच्च रक्षात्मक रुकावट (3/4)। असफलता का डर अनजाने में आपके कदमों पर ब्रेक लगा रहा है।',
      'गंभीर सेल्फ-सैबोटाज चक्र (4/4)। अभी अपना स्ट्रेस चेक करें और अटैचमेंट स्टाइल टेस्ट से अपने पैटर्न समझें।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और डिफेंस चेक लें &rarr;',
    subBtn: 'अटैचमेंट स्टाइल टेस्ट से रिश्तों के पैटर्न जांचें &rarr;'
  }
};

const INNER_CHILD_LOCALES = {
  en: {
    badge: '30-SECOND INNER CHILD WOUND & TRIGGER SCREENER',
    heading: 'Which Unmet Childhood Need Is Driving Your Adult Triggers?',
    sub: 'Check the inner child survival patterns that still activate in your close relationships:',
    items: [
      '<strong>Abandonment Alarm (Wounded Child):</strong> A partner’s quiet mood or delayed reply triggers disproportionate panic that you are about to be left behind.',
      '<strong>Hyper-Independence Armor (Parentified Child):</strong> You struggle to ask for help because you learned early that relying on others leads to disappointment.',
      '<strong>Perfectionist Earning of Love:</strong> You feel valuable only when you are achieving, fixing, or useful—resting makes you feel guilty or unlovable.',
      '<strong>Fear of Taking Up Space:</strong> Expressing anger, boundaries, or emotional needs makes you feel like a "bad" or "too needy" person.'
    ],
    scoreUnit: 'of 4 inner child wound signals active',
    verdicts: [
      'Check the items above to uncover how early attachment wounds echo in your adult nervous system.',
      'Mild Echoes (1/4). Your adult self stays grounded during most relational misunderstandings.',
      'Moderate Inner Child Activation (2/4). Old protective rules around worthiness and safety are resurfacing.',
      'High Childhood Wound Resonance (3/4). Unmet early needs for safety and validation are steering your adult relationships.',
      'Deep Inner Child Survival Pattern (4/4). Your nervous system is still protecting the younger you—map your Attachment Style and ground your body now.'
    ],
    primaryBtn: 'Map Your Core Wounds with the Attachment Style Test &rarr;',
    subBtn: 'Soothe Inner Child Panic with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 내면아이 상처(Inner Child Wound) 및 트리거 판별기',
    heading: '어린 시절의 어떤 결핍이 지금 내 관계의 방아쇠를 당기고 있을까요?',
    sub: '성인이 된 지금도 가까운 관계에서 반복되는 내면아이 생존 신호를 체크해보세요:',
    items: [
      '<strong>유기 공포 경보 (상처받은 아이):</strong> 상대의 말수가 줄거나 연락이 조금만 늦어져도 버림받을 것 같은 극심한 불안에 휩싸입니다.',
      '<strong>초독립성 갑옷 (부모화된 아이):</strong> 어릴 때부터 기댈 곳이 없어 스스로 해결해야 했기에, 지금도 남에게 도움을 요청하거나 기대는 것이 불편합니다.',
      '<strong>성취와 쓸모로 증명하는 사랑:</strong> 무언가 성과를 내거나 남을 도울 때만 내 가치가 느껴지고, 아무것도 안 하고 쉬면 죄책감이 듭니다.',
      '<strong>존재감과 욕구 표현의 죄책감:</strong> 내 감정, 분노, 정당한 요구를 말하면 "내가 너무 이기적이거나 귀찮은 존재가 아닐까" 두렵습니다.'
    ],
    scoreUnit: '개 내면아이 상처·생존 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 어린 시절 형성된 애착 상처가 현재 신경계에 미치는 영향을 확인해보세요.',
      '안정적인 성인 자아(1/4). 과거의 상처가 현재 관계를 크게 흔들지 않고 있습니다.',
      '중등도 내면아이 활성화(2/4). 안전감과 자기 가치에 대한 오래된 방어 규칙이 관계에서 작동하고 있습니다.',
      '높은 내면아이 상처 공명(3/4). 충족되지 못한 초기 애착 욕구가 현재의 불안이나 거리두기를 유도하고 있습니다.',
      '깊은 핵심 내면아이 생존 패턴(4/4). 신경계가 여전히 어린 시절의 나를 지키기 위해 고군분투하고 있습니다. 지금 애착 유형 진단과 그라운딩을 시작하세요.'
    ],
    primaryBtn: '무료 4대 애착 유형 및 관계 상처 정밀 테스트 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 내면아이 안심시키기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN INNERES-KIND-WUNDEN-CHECK',
    heading: 'Welches unerfüllte Kindheitsbedürfnis steuert Ihre heutigen Trigger?',
    sub: 'Wählen Sie die Überlebensmuster Ihres inneren Kindes, die in Beziehungen aktiv werden:',
    items: [
      '<strong>Verlassenheits-Alarm:</strong> Schweigen oder späte Antworten des Partners lösen sofort Panik aus, verlassen zu werden.',
      '<strong>Hyper-Unabhängigkeit (Parentifizierung):</strong> Sie können kaum um Hilfe bitten, weil Sie früh gelernt haben, alles allein zu tragen.',
      '<strong>Liebe durch Leistung verdienen:</strong> Sie fühlen sich nur wertvoll, wenn Sie nützlich sind oder funktionieren; Ruhe löst Schuldgefühle aus.',
      '<strong>Angst, Raum einzunehmen:</strong> Eigene Bedürfnisse oder Grenzen zu äußern gibt Ihnen das Gefühl, „zu viel“ oder „egoistisch“ zu sein.'
    ],
    scoreUnit: 'von 4 Inneres-Kind-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um frühe Bindungsprägungen zu erkennen.',
      'Leichte Resonanz (1/4). Ihr Erwachsenen-Ich bleibt in Beziehungen meist stabil.',
      'Moderate Aktivierung des inneren Kindes (2/4). Alte Schutzregeln um Selbstwert und Sicherheit werden wach.',
      'Hohe Kindheitswunden-Resonanz (3/4). Unerfüllte frühe Bedürfnisse steuern Ihre heutigen Beziehungsmuster.',
      'Tiefes Überlebensmuster des inneren Kindes (4/4). Machen Sie jetzt den Bindungstest und beruhigen Sie Ihr Nervensystem.'
    ],
    primaryBtn: 'Kostenlosen Bindungsstil- &amp; Prägungstest starten &rarr;',
    subBtn: '5-4-3-2-1 Grounding zur Beruhigung des inneren Kindes &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE HERIDAS DEL NIÑO INTERIOR EN 30 SEGUNDOS',
    heading: '¿Qué necesidad infantil no cubierta dispara tus detonantes hoy?',
    sub: 'Marca los patrones de supervivencia de tu niño interior activos en tus relaciones:',
    items: [
      '<strong>Alarma de abandono:</strong> El silencio o demora de tu pareja despierta un pánico intenso a que te dejen.',
      '<strong>Armadura de hiperindependencia:</strong> Te cuesta pedir ayuda porque aprendiste temprano que depender de otros duele.',
      '<strong>Ganarse el amor rindiendo:</strong> Solo te sientes valioso cuando eres útil o resuelves problemas; descansar te da culpa.',
      '<strong>Miedo a ocupar espacio:</strong> Expresar tus necesidades o límites te hace sentir «egoísta» o «demasiado intenso».'
    ],
    scoreUnit: 'de 4 señales de herida del niño interior activas',
    verdicts: [
      'Marca los puntos arriba para descubrir cómo resuenan tus heridas tempranas.',
      'Eco leve (1/4). Tu yo adulto mantiene la calma en la mayoría de los vínculos.',
      'Activación moderada del niño interior (2/4). Antiguas reglas de protección sobre tu valía siguen activas.',
      'Alta resonancia de herida infantil (3/4). Necesidades tempranas de seguridad guían tus reacciones actuales.',
      'Patrón profundo de supervivencia infantil (4/4). Descubre tu Estilo de Apego ahora y calma tu cuerpo con Grounding.'
    ],
    primaryBtn: 'Descubrir tus Heridas con el Test de Estilo de Apego &rarr;',
    subBtn: 'Calmar al Niño Interior con Grounding 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DES BLESSURES DE L’ENFANT INTÉRIEUR EN 30 SECONDES',
    heading: 'Quel besoin d’enfance non comblé pilote vos déclencheurs actuels ?',
    sub: 'Cochez les réflexes de survie de votre enfant intérieur actifs dans vos relations :',
    items: [
      '<strong>Alarme d’abandon :</strong> Un silence ou un message tardif déclenche une peur disproportionnée d’être rejeté.',
      '<strong>Armure d’hyper-indépendance :</strong> Vous n’osez pas demander d’aide car vous avez appris très tôt à ne compter que sur vous.',
      '<strong>Mériter l’amour par la performance :</strong> Vous ne vous sentez légitime que lorsque vous êtes utile ; le repos vous culpabilise.',
      '<strong>Peur de prendre de la place :</strong> Exprimer vos besoins ou vos limites vous donne l’impression d’être « trop demandeur ».'
    ],
    scoreUnit: 'sur 4 signaux de blessure de l’enfant intérieur actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour repérer l’écho de vos blessures d’attachement.',
      'Écho léger (1/4). Votre adulte intérieur reste stable face aux tensions.',
      'Activation modérée de l’enfant intérieur (2/4). D’anciennes règles de protection refont surface.',
      'Forte résonance des blessures d’enfance (3/4). Vos besoins précoces de sécurité guident vos réactions.',
      'Schéma profond de survie infantile (4/4). Passez le Test de Style d’Attachement et apaisez votre corps.'
    ],
    primaryBtn: 'Explorer vos Blessures avec le Test de Style d’Attachement &rarr;',
    subBtn: 'Apaiser l’Enfant Intérieur avec l’Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒 インナーチャイルドの傷＆愛着トリガー診断',
    heading: '幼少期のどんな未充足ニーズが、今の人間関係の引き金になっている？',
    sub: '大人になった今も親密な関係で自動的に作動する「インナーチャイルドの防衛サイン」をチェック：',
    items: [
      '<strong>見捨てられアラーム（傷ついた子ども）：</strong> 相手の口数が減ったり返信が遅れたりするだけで、見捨てられるような強い不安に襲われる。',
      '<strong>過剰な自立の鎧（親役割を担った子ども）：</strong> 昔から誰にも頼れなかったため、今でも人に助けを求めたり甘えたりするのが苦手。',
      '<strong>成果や「役に立つこと」で愛を稼ぐ：</strong> 何かを達成したり人の役に立っている時だけ価値を感じ、休むと罪悪感に駆られる。',
      '<strong>自分の欲求を出すことへの恐怖：</strong> 本音や怒り、境界線を伝えると「わがままで迷惑な人間だと思われる」と怖くなる。'
    ],
    scoreUnit: '/ 4 個のインナーチャイルド傷サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、幼少期の愛着の傷が今の神経系にどう響いているか確認しましょう。',
      '軽度のエコー（1/4）。大人の自分が人間関係の揺れを安定して受け止められています。',
      '中程度のインナーチャイルド活性化（2/4）。自己価値や安全に関する昔のルールが顔を出しています。',
      '高いインナーチャイルド共鳴（3/4）。満たされなかった初期の安全欲求が現在の不安や回避を動かしています。',
      '深いインナーチャイルド生存パターン（4/4）。今すぐ愛着スタイル診断で根本パターンを知り、五感グラウンディングで安心感を取り戻しましょう。'
    ],
    primaryBtn: '無料の愛着スタイル＆インナーチャイルド傾向診断へ &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで内なる子どもを安心させる &rarr;'
  },
  zh: {
    badge: '30秒 内在小孩创伤（Inner Child Wound）与触发点筛查',
    heading: '童年哪项未被满足的需求，正在驱动你成年后的情绪触发点？',
    sub: '勾选在亲密关系中依然自动激活的“内在小孩生存防御信号”：',
    items: [
      '<strong>被抛弃警报（受伤的小孩）：</strong> 伴侣语气冷淡或回消息稍慢，就会引发不成比例的恐慌，害怕自己要被丢下。',
      '<strong>过度独立盔甲（亲职化小孩）：</strong> 很难开口求助或依赖他人，因为从小就学会了“靠别人只会换来失望”。',
      '<strong>靠有用与优秀换取爱：</strong> 只有在取得成绩、照顾别人或有用时才觉得自己有价值，一旦停下来休息就充满负罪感。',
      '<strong>害怕占据空间与表达需求：</strong> 一旦表达愤怒、底线或情感需求，就会觉得自己“太作、太自私或太添麻烦”。'
    ],
    scoreUnit: '/ 4 个内在小孩创伤信号已激活',
    verdicts: [
      '勾选上方信号，了解早年依恋创伤如何在成年神经系统中产生回响。',
      '轻度回响（1/4）。你的成年自我在大多数关系波动中能保持稳定。',
      '中度内在小孩激活（2/4）。关于自我价值与安全的早期防御规则正在浮现。',
      '高度童年创伤共鸣（3/4）。未被满足的早期安全感需求正在主导你当下的关系反应。',
      '深层内在小孩生存模式（4/4）。你的神经系统仍在保护当年的小孩，请立即进行依恋类型测试并用着陆法安抚身体。'
    ],
    primaryBtn: '通过免费依恋类型测试测绘核心关系创伤 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆法安抚内在小孩恐慌 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE FERIDAS DA CRIANÇA INTERIOR EM 30 SEGUNDOS',
    heading: 'Qual necessidade infantil não atendida dispara seus gatilhos hoje?',
    sub: 'Marque os padrões de sobrevivência da criança interior ativos em suas relações:',
    items: [
      '<strong>Alarme de abandono:</strong> O silêncio ou demora de resposta de quem você ama dispara pânico de ser deixado para trás.',
      '<strong>Armadura de hiperindependência:</strong> Você tem dificuldade de pedir ajuda porque aprendeu cedo a contar só consigo mesmo.',
      '<strong>Merecer amor pela utilidade:</strong> Você só se sente valioso quando produz ou ajuda; descansar gera culpa.',
      '<strong>Medo de ocupar espaço:</strong> Expressar necessidades ou limites faz você se sentir "egoísta" ou "carente demais".'
    ],
    scoreUnit: 'de 4 sinais de ferida da criança interior ativos',
    verdicts: [
      'Marque os itens acima para ver como feridas precoces ecoam no seu sistema nervoso.',
      'Eco leve (1/4). Seu eu adulto permanece firme na maioria dos desentendimentos.',
      'Ativação moderada da criança interior (2/4). Regras antigas sobre valor pessoal estão reaparecendo.',
      'Alta ressonância de ferida infantil (3/4). Necessidades antigas de segurança guiam suas reações atuais.',
      'Padrão profundo de sobrevivência infantil (4/4). Mapeie seu Estilo de Apego agora e acalme o corpo com Grounding.'
    ],
    primaryBtn: 'Mapear Feridas com o Teste de Estilo de Apego &rarr;',
    subBtn: 'Acalmar a Criança Interior com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ТРАВМЫ ВНУТРЕННЕГО РЕБЕНКА',
    heading: 'Какая детская боль управляет вашими взрослыми триггерами?',
    sub: 'Отметьте защитные реакции внутреннего ребенка, которые включаются в близких отношениях:',
    items: [
      '<strong>Тревога покинутости:</strong> Молчание партнера или задержка ответа вызывает панику, что вас разлюбили и бросят.',
      '<strong>Броня гипернезависимости:</strong> Вам трудно просить о помощи, потому что с детства вы привыкли рассчитывать только на себя.',
      '<strong>Заслуживание любви через пользу:</strong> Вы чувствуете свою ценность только когда достигаете целей или спасаете других.',
      '<strong>Страх занимать место:</strong> Озвучивание своих желаний или границ вызывает чувство вины, будто вы «слишком сложный» человек.'
    ],
    scoreUnit: 'из 4 признаков травмы внутреннего ребенка активны',
    verdicts: [
      'Отметьте пункты выше, чтобы увидеть, как ранний опыт влияет на ваши отношения.',
      'Легкий отголосок (1/4). Ваша взрослая часть сохраняет устойчивость в общении.',
      'Умеренная активация внутреннего ребенка (2/4). Включаются старые правила заслуживания безопасности.',
      'Высокий резонанс детской травмы (3/4). Неудовлетворенные детские потребности управляют вашими реакциями.',
      'Глубокий защитный сценарий (4/4). Пройдите тест на тип привязанности и верните телу безопасность через заземление.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности и детские раны &rarr;',
    subBtn: 'Успокоить внутреннего ребенка практикой 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING LUKA INNER CHILD &amp; PEMICU 30 DETIK',
    heading: 'Kebutuhan Masa Kecil Apa yang Memicu Reaksi Emosional Anda Saat Dewasa?',
    sub: 'Centang pola bertahan hidup inner child yang masih aktif dalam hubungan dekat Anda:',
    items: [
      '<strong>Alarm Pengabaian:</strong> Sikap diam pasangan atau balasan pesan yang lambat memicu kepanikan takut ditinggalkan.',
      '<strong>Perisai Hiper-Independensi:</strong> Anda sulit meminta bantuan karena sejak kecil terbiasa menanggung semuanya sendiri.',
      '<strong>Membeli Kasih Sayang Lewat Prestasi:</strong> Anda baru merasa berharga saat berguna atau berprestasi; istirahat memicu rasa bersalah.',
      '<strong>Takut Menyampaikan Kebutuhan:</strong> Mengungkapkan batasan atau keinginan membuat Anda merasa "egois" atau "merepotkan".'
    ],
    scoreUnit: 'dari 4 sinyal luka inner child aktif',
    verdicts: [
      'Centang item di atas untuk melihat bagaimana luka kelekatan masa kecil memengaruhi Anda.',
      'Gema Ringan (1/4). Diri dewasa Anda tetap tenang dalam sebagian besar dinamika hubungan.',
      'Aktivasi Inner Child Sedang (2/4). Aturan lama tentang rasa aman dan harga diri mulai muncul kembali.',
      'Resonansi Luka Masa Kecil Tinggi (3/4). Kebutuhan masa kecil yang belum terpenuhi mengarahkan reaksi Anda.',
      'Pola Bertahan Hidup Inner Child Mendalam (4/4). Petakan Gaya Kelekatan Anda sekarang dan tenangkan tubuh dengan Grounding.'
    ],
    primaryBtn: 'Petakan Luka Inti dengan Tes Gaya Kelekatan &rarr;',
    subBtn: 'Tenangkan Kepanikan Inner Child via Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İÇİMİZDEKİ ÇOCUK YARASI TARAMASI',
    heading: 'Karşılanmamış Hangi Çocukluk İhtiyacı Bugünkü Tetikleyicilerinizi Yönetiyor?',
    sub: 'Yakın ilişkilerinizde hala devreye giren içsel çocuk hayatta kalma kalıplarını işaretleyin:',
    items: [
      '<strong>Terk Edilme Alarmı:</strong> Partnerinizin sessizliği veya geç mesajı, terk edileceğinize dair orantısız bir panik başlatıyor.',
      '<strong>Aşırı Bağımsızlık Zırhı:</strong> Yardım istemekte zorlanıyorsunuz çünkü erken yaşta başkalarına güvenmenin hayal kırıklığı getirdiğini öğrendiniz.',
      '<strong>Sevgiyi Başarı ve Faydayla Kazanma:</strong> Sadece üretken veya faydalıyken değerli hissediyor, dinlenirken suçluluk duyuyorsunuz.',
      '<strong>Alan Kaplama Korkusu:</strong> İhtiyaçlarınızı veya sınırlarınızı dile getirmek kendinizi "fazla talepkar" hissettiriyor.'
    ],
    scoreUnit: '/ 4 içsel çocuk yarası sinyali aktif',
    verdicts: [
      'Erken dönem bağlanma yaralarının yetişkin sinir sisteminizdeki yansımasını görmek için işaretleyin.',
      'Hafif Yansıma (1/4). Yetişkin benliğiniz ilişkisel dalgalanmalarda dengesini koruyor.',
      'Orta Düzey İçsel Çocuk Aktivasyonu (2/4). Değerlilik ve güvenlikle ilgili eski koruma kuralları yüzeye çıkıyor.',
      'Yüksek Çocukluk Yarası Rezonansı (3/4). Karşılanmamış erken güven ihtiyaçları ilişkilerinizi yönlendiriyor.',
      'Derin İçsel Çocuk Hayatta Kalma Kalıbı (4/4). Şimdi Bağlanma Stili Testini çözün ve 5-4-3-2-1 Topraklama ile bedeninizi yatıştırın.'
    ],
    primaryBtn: 'Bağlanma Stili Testiyle Temel Yaralarınızı Haritalayın &rarr;',
    subBtn: '5-4-3-2-1 Topraklama ile İçsel Çocuğu Sakinleştirin &rarr;'
  },
  hi: {
    badge: '30-सेकंड इनर चाइल्ड वूंड (Inner Child Wound) स्क्रीनर',
    heading: 'बचपन की कौन-सी अधूरी ज़रूरत आज आपके भावनात्मक ट्रिगर्स को चला रही है?',
    sub: 'अपने करीबी रिश्तों में आज भी सक्रिय होने वाले इन इनर चाइल्ड संकेतों को चुनें:',
    items: [
      '<strong>छोड़े जाने का डर (Abandonment Alarm):</strong> पार्टनर की चुप्पी या देर से आए रिप्लाई से अचानक अकेले छूट जाने की तीव्र घबराहट होना।',
      '<strong>अत्यधिक आत्मनिर्भरता का कवच:</strong> मदद मांगने में झिझक होना क्योंकि आपने बचपन में ही सीख लिया था कि दूसरों पर निर्भर रहना निराशा देता है।',
      '<strong>उपयोगिता से प्यार कमाना:</strong> केवल काम करने या दूसरों की मदद करने पर ही खुद को मूल्यवान समझना और आराम करने पर अपराधबोध होना।',
      '<strong>अपनी ज़रूरतें बताने का डर:</strong> अपनी भावनाएं या सीमाएं बताते हुए यह डर लगना कि लोग आपको "स्वार्थी" या "बोझ" समझेंगे।'
    ],
    scoreUnit: '/ 4 इनर चाइल्ड वूंड संकेत सक्रिय',
    verdicts: [
      'यह जानने के लिए ऊपर चुनें कि बचपन के अनुभव आज आपके नर्वस सिस्टम को कैसे प्रभावित कर रहे हैं।',
      'हल्का प्रभाव (1/4)। आपका वयस्क मन रिश्तों के उतार-चढ़ाव में स्थिर रहता है।',
      'मध्यम इनर चाइल्ड सक्रियण (2/4)। सुरक्षा और आत्म-मूल्य से जुड़े पुराने नियम उभर रहे हैं।',
      'उच्च बचपन के घाव की गूंज (3/4)। सुरक्षा की अधूरी ज़रूरतें आपके वर्तमान रिश्तों को प्रभावित कर रही हैं।',
      'गहरा इनर चाइल्ड सर्वाइवल पैटर्न (4/4)। अभी अटैचमेंट स्टाइल टेस्ट लें और 5-4-3-2-1 ग्राउंडिंग से मन को शांत करें।'
    ],
    primaryBtn: 'अटैचमेंट स्टाइल टेस्ट से अपने पैटर्न जानें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग से इनर चाइल्ड पैनिक शांत करें &rarr;'
  }
};

const SHADOW_WORK_LOCALES = {
  en: {
    badge: '30-SECOND JUNGIAN SHADOW PROJECTION SCREENER',
    heading: 'What Is Your Unconscious Shadow Trying to Show You?',
    sub: 'Check the shadow projection and emotional repression signals active in your daily reactions:',
    items: [
      '<strong>Intense "Mirror" Irritation:</strong> Certain traits in others—arrogance, laziness, selfishness, or neediness—trigger an instant, disproportionate rage in you.',
      '<strong>Exiled Emotions:</strong> You pride yourself on "never getting angry" or "never needing anyone," yet experience sudden emotional explosions or somatic tension.',
      '<strong>Repeating Relationship Scripts:</strong> You keep attracting the exact same dynamic with different partners or bosses despite promising yourself "never again."',
      '<strong>Hidden Shame Mask:</strong> You expend constant energy curating a "good, calm, capable" persona while terrified that people might see your messy feelings.'
    ],
    scoreUnit: 'of 4 Jungian shadow projection signals active',
    verdicts: [
      'Check the items above to see where repressed shadow traits are draining your psychological energy.',
      'High Self-Integration (1/4). You acknowledge your complex emotions without heavy projection.',
      'Moderate Shadow Projection (2/4). Disowned parts of your assertiveness or needs are showing up as irritation at others.',
      'Active Shadow Split (3/4). Suppressing "unacceptable" emotions is fueling hidden stress and repeating patterns.',
      'Deep Shadow Repression &amp; Energy Leak (4/4). Holding down your shadow is exhausting your nervous system—check your stress load and build an emotion regulation plan now.'
    ],
    primaryBtn: 'Check Your Hidden Stress &amp; Repression Load &rarr;',
    subBtn: 'Open Interactive Emotion Regulation Planner &rarr;'
  },
  ko: {
    badge: '30초 융 심리학 그림자 투사(Shadow Projection) 판별기',
    heading: '내가 억누른 무의식의 그림자(Shadow)는 어디로 향하고 있을까요?',
    sub: '일상 속 강한 감정 반응과 인간관계 패턴에서 나타나는 그림자 신호를 체크해보세요:',
    items: [
      '<strong>타인을 향한 과도한 거울 분노:</strong> 뻔뻔함, 이기심, 나태함, 의존성 등 타인의 특정 모습을 볼 때 유독 참을 수 없는 분노나 혐오가 치밉니다.',
      '<strong>추방된 감정의 역습:</strong> 스스로 "나는 화를 안 내는 사람/남에게 아쉬운 소리 안 하는 사람"이라고 믿지만, 가끔 감정이 폭발하거나 몸이 아픕니다.',
      '<strong>사람만 바뀌고 반복되는 관계 대본:</strong> "다시는 이런 사람 안 만나야지" 다짐해도 비슷한 유형의 연인이나 상사와 똑같은 갈등을 겪습니다.',
      '<strong>완벽한 페르소나 유지 피로:</strong> 늘 착하고 이성적인 사람으로 보이기 위해 에너지를 쏟으며, 내 어두운 감정을 들킬까 봐 두렵습니다.'
    ],
    scoreUnit: '개 무의식 그림자 투사 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 억압된 그림자가 심리적 에너지를 얼마나 소모하고 있는지 확인해보세요.',
      '높은 자기 통합 수준(1/4). 내면의 다양한 감정을 억누르지 않고 건강하게 수용하고 있습니다.',
      '중등도 그림자 투사(2/4). 내가 스스로에게 금지한 욕구나 자기주장이 타인에 대한 짜증으로 투사되고 있습니다.',
      '활발한 페르소나-그림자 분열(3/4). 부정적 감정을 억누르느라 숨은 스트레스와 반복되는 관계 갈등이 누적되고 있습니다.',
      '깊은 그림자 억압 및 에너지 누수(4/4). 가면을 유지하느라 신경계가 고갈되고 있습니다. 지금 스트레스 부하를 점검하고 정서 조절 플랜을 세우세요.'
    ],
    primaryBtn: '3분 무의식 스트레스 및 억압 부하 진단 &rarr;',
    subBtn: '그림자 감정 통합을 위한 정서 조절 플래너 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN SCHATTENPROJEKTIONS-CHECK (JUNG)',
    heading: 'Was will Ihnen Ihr unbewusster Schatten zeigen?',
    sub: 'Wählen Sie die Anzeichen für Schattenprojektion und verdrängte Gefühle in Ihrem Alltag:',
    items: [
      '<strong>Heftige „Spiegel“-Irritation:</strong> Bestimmte Eigenschaften anderer (Egoismus, Faulheit, Bedürftigkeit) lösen unverhältnismäßige Wut in Ihnen aus.',
      '<strong>Verbannte Gefühle:</strong> Sie glauben, „nie wütend“ oder „nie bedürftig“ zu sein, leiden aber unter plötzlichen Ausbrüchen oder Körperspannung.',
      '<strong>Wiederkehrende Beziehungsmuster:</strong> Trotz guter Vorsätze geraten Sie mit neuen Partnern oder Chefs immer wieder in dieselbe Dynamik.',
      '<strong>Erschöpfende Persona-Maske:</strong> Sie kosten viel Kraft, immer „nett, ruhig und stark“ zu wirken, aus Angst vor Ihren Schattenseiten.'
    ],
    scoreUnit: 'von 4 Schattenprojektions-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um verdrängte Schattenanteile zu erkennen.',
      'Hohe Selbstintegration (1/4). Sie nehmen auch schwierige Gefühle an, ohne sie stark zu projizieren.',
      'Moderate Schattenprojektion (2/4). Unterdrückte eigene Bedürfnisse zeigen sich als Ärger über andere.',
      'Aktive Schattenspaltung (3/4). Das Wegdrücken „unerlaubter“ Gefühle erzeugt Dauerstress.',
      'Tiefe Schattenverdrängung (4/4). Prüfen Sie jetzt Ihre Stresslast und erstellen Sie einen Plan zur Emotionsregulation.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Verdrängungs-Check starten &rarr;',
    subBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE PROYECCIÓN DE LA SOMBRA (JUNG) EN 30 SEGUNDOS',
    heading: '¿Qué intenta mostrarte tu sombra inconsciente?',
    sub: 'Marca las señales de proyección y represión emocional activas en tus reacciones:',
    items: [
      '<strong>Irritación «espejo» intensa:</strong> Ciertos rasgos ajenos (egoísmo, pereza, arrogancia) te provocan una rabia desproporcionada.',
      '<strong>Emociones exiliadas:</strong> Te enorgulleces de «nunca enfadarte» o «no necesitar a nadie», pero sufres explosiones o tensión física.',
      '<strong>Guiones relacionales repetidos:</strong> Atraes una y otra vez la misma dinámica con distintas parejas o jefes.',
      '<strong>Fatiga de la máscara perfecta:</strong> Gastas mucha energía manteniendo una imagen «buena y controlada» por miedo a mostrar tu lado oscuro.'
    ],
    scoreUnit: 'de 4 señales de proyección de la sombra activas',
    verdicts: [
      'Marca los puntos arriba para ver dónde la sombra reprimida drena tu energía.',
      'Alta integración personal (1/4). Aceptas tus emociones complejas sin proyectarlas.',
      'Proyección moderada de la sombra (2/4). Necesidades propias prohibidas aparecen como molestia hacia otros.',
      'Escisión activa de la sombra (3/4). Reprimir emociones genera estrés oculto y patrones repetitivos.',
      'Represión profunda de la sombra (4/4). Sostener la máscara agota tu sistema nervioso. Mide tu estrés y regula tus emociones.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Carga Emocional Oculta &rarr;',
    subBtn: 'Abrir el Planificador de Regulación Emocional &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE PROJECTION DE L’OMBRE (JUNG) EN 30 SECONDES',
    heading: 'Que cherche à vous révéler votre part d’ombre inconsciente ?',
    sub: 'Cochez les signes de projection et de refoulement émotionnel dans votre quotidien :',
    items: [
      '<strong>Irritation « miroir » intense :</strong> Certains défauts chez autrui (égoïsme, paresse, besoin d’attention) déclenchent en vous une colère vive.',
      '<strong>Émotions exilées :</strong> Vous pensez « ne jamais vous mettre en colère », mais subissez des tensions somatiques ou des éclats soudains.',
      '<strong>Scénarios relationnels répétitifs :</strong> Vous rejouez la même dynamique conflictuelle avec différents partenaires ou collègues.',
      '<strong>Fatigue du masque parfait :</strong> Vous vous épuisez à maintenir une image « calme et irréprochable » par peur du jugement.'
    ],
    scoreUnit: 'sur 4 signaux de projection de l’ombre actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour mesurer l’énergie consommée par votre ombre.',
      'Bonne intégration émotionnelle (1/4). Vous accueillez vos nuances sans forte projection.',
      'Projection modérée de l’ombre (2/4). Des besoins refoulés s’expriment par de l’agacement envers autrui.',
      'Clivage actif Persona-Ombre (3/4). Le refoulement alimente un stress latent et des schémas répétitifs.',
      'Refoulement profond de l’ombre (4/4). Évaluez votre charge de stress et créez un plan de régulation émotionnelle.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Charge Émotionnelle Cachée &rarr;',
    subBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;'
  },
  ja: {
    badge: '30秒 ユング心理学 シャドウ投影（影の抑圧）診断チェック',
    heading: '無意識に押し込めた「シャドウ（影）」は今どこに現れている？',
    sub: '日常の強い感情反応や人間関係で繰り返されるシャドウ投影サインをチェックしてください：',
    items: [
      '<strong>他人の特定の欠点に対する激しい怒り（鏡の法則）：</strong> わがまま・怠慢・自己主張・甘えなど、他人の特定の姿を見ると異常に腹が立つ。',
      '<strong>追放された感情の逆襲：</strong> 「自分は怒らない・人に頼らない人間だ」と思っているのに、突然の爆発や原因不明の身体緊張が起きる。',
      '<strong>相手が変わっても繰り返される人間関係：</strong> 「もうこんな人とは関わらない」と決めても、違う相手と同じような갈등パターンを繰り返す。',
      '<strong>「いい人仮面（ペルソナ）」の維持疲労：</strong> 常に穏やかで有能な自分を演じるのに疲れ果て、本音のドロドロした感情を見せるのが怖い。'
    ],
    scoreUnit: '/ 4 個のシャドウ投影・抑圧サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、抑圧されたシャドウがどれだけ心のエネルギーを奪っているか確認しましょう。',
      '高い自己統合レベル（1/4）。自分の多様な感情を否定せず健全に扱えています。',
      '中程度のシャドウ投影（2/4）。自分に禁じている欲求や主張が、他人へのイライラとして投影されています。',
      'ペルソナとシャドウの乖離（3/4）。「許されない感情」を抑え込むことで隠れストレスが蓄積しています。',
      '深いシャドウ抑圧＆エネルギー漏出（4/4）。仮面を保つことで神経系が消耗しています。今すぐストレス診断と感情調整プランを作成しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆深層負荷チェックへ &rarr;',
    subBtn: '抑圧した感情を整える「感情調整プランナー」を開く &rarr;'
  },
  zh: {
    badge: '30秒 荣格心理学“阴影投射（Shadow Projection）”筛查',
    heading: '被你压抑在潜意识里的“阴影”，正在通过什么方式提醒你？',
    sub: '勾选在日常情绪反应与人际关系中出现的阴影投射与压抑信号：',
    items: [
      '<strong>强烈的“镜像”厌恶与愤怒：</strong> 看到别人身上的自私、懒惰、炫耀或脆弱时，会触发不成比例的强烈反感或愤怒。',
      '<strong>被放逐情绪的反扑：</strong> 自认为“从不生气”或“从不需要别人”，却会突然情绪决堤或出现躯体紧绷疼痛。',
      '<strong>换汤不换药的关系剧本：</strong> 明明发誓“再也不遇这种人”，却总在不同的伴侣、朋友或上司身上重复完全相同的冲突模式。',
      '<strong>维持完美面具（Persona）的疲惫：</strong> 耗费大量精力维持“温和、懂事、情绪稳定”的人设，极度害怕别人看到自己阴暗真实的一面。'
    ],
    scoreUnit: '/ 4 个荣格阴影投射信号已激活',
    verdicts: [
      '勾选上方信号，查看被压抑的潜意识阴影正在消耗多少心理能量。',
      '高度自我整合（1/4）。你能坦然接纳自己的复杂情绪，无需大量向外投射。',
      '中度阴影投射（2/4）。被你禁止的自我需求，正在以“看别人不顺眼”的方式投射出来。',
      '明显的面具-阴影割裂（3/4）。压抑“不被允许的情绪”正在制造隐性压力与重复冲突。',
      '深层阴影压抑与能量内耗（4/4）。维持完美面具正在掏空你的神经系统，请立即检测压力负荷并制定情绪调节方案。'
    ],
    primaryBtn: '开始 3 分钟潜意识压力与内耗测评 &rarr;',
    subBtn: '打开整合情绪阴影的情绪调节规划器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE PROJEÇÃO DA SOMBRA (JUNG) EM 30 SEGUNDOS',
    heading: 'O que sua Sombra Inconsciente está tentando mostrar a você?',
    sub: 'Marque os sinais de projeção da sombra e repressão emocional no seu dia a dia:',
    items: [
      '<strong>Irritação "espelho" intensa:</strong> Certos traços nos outros (egoísmo, preguiça, carência) despertam uma raiva desproporcional em você.',
      '<strong>Emoções exiladas:</strong> Você se orgulha de "nunca sentir raiva", mas sofre explosões repentinas ou tensão física constante.',
      '<strong>Roteiros repetidos nas relações:</strong> Você atrai sempre a mesma dinâmica difícil com diferentes parceiros ou chefes.',
      '<strong>Exaustão da máscara perfeita:</strong> Você gasta muita energia mantendo uma persona "calma e boa" por medo de mostrar suas falhas.'
    ],
    scoreUnit: 'de 4 sinais de projeção da sombra ativos',
    verdicts: [
      'Marque os itens acima para ver onde traços reprimidos estão drenando sua energia.',
      'Alta integração pessoal (1/4). Você acolhe suas emoções complexas sem forte projeção.',
      'Projeção moderada da sombra (2/4). Necessidades reprimidas aparecem como irritação com os outros.',
      'Divisão ativa Persona-Sombra (3/4). Reprimir emoções gera estresse oculto e padrões repetitivos.',
      'Repressão profunda da sombra (4/4). Sustentar a máscara esgota seu sistema nervoso. Meça seu estresse e regule suas emoções.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Carga Oculta em 3 Minutos &rarr;',
    subBtn: 'Abrir o Planejador de Regulação Emocional &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ПРОЕКЦИЮ ТЕНИ (ЮНГ)',
    heading: 'Что пытается показать вам ваша бессознательная Тень?',
    sub: 'Отметьте признаки проекции Тени и подавленных эмоций в вашей жизни:',
    items: [
      '<strong>Острое «зеркальное» раздражение:</strong> Эгоизм, лень или слабость других людей вызывают у вас непропорциональную вспышку гнева.',
      '<strong>Изгнанные эмоции:</strong> Вы считаете, что «никогда не злитесь», но страдаете от внезапных срывов или зажимов в теле.',
      '<strong>Повторяющиеся сценарии отношений:</strong> Вы снова и снова попадаете в одни и те же конфликты с разными партнерами или начальниками.',
      '<strong>Усталость от «хорошей маски»:</strong> Вы тратите массу сил на поддержание безупречного образа, боясь показать свои настоящие чувства.'
    ],
    scoreUnit: 'из 4 признаков проекции Тени активны',
    verdicts: [
      'Отметьте пункты выше, чтобы увидеть, куда уходит энергия на удержание Тени.',
      'Высокая интеграция личности (1/4). Вы принимаете свои сложные чувства без сильных проекций.',
      'Умеренная проекция Тени (2/4). Запрещенные себе желания проявляются как раздражение на окружающих.',
      'Активное расщепление Персоны и Тени (3/4). Подавление эмоций создает скрытый стресс.',
      'Глубокое подавление Тени (4/4). Удержание маски истощает нервную систему. Проверьте уровень стресса и план регуляции эмоций.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на скрытый стресс и напряжение &rarr;',
    subBtn: 'Открыть планировщик эмоциональной регуляции &rarr;'
  },
  id: {
    badge: 'SKRINING PROYEKSI BAYANGAN (SHADOW WORK) 30 DETIK',
    heading: 'Apa yang Coba Ditunjukkan oleh Sisi Bayangan (Shadow) Bawah Sadar Anda?',
    sub: 'Centang sinyal proyeksi shadow dan represi emosi dalam reaksi harian Anda:',
    items: [
      '<strong>Kekesalan "Cermin" yang Intens:</strong> Sifat tertentu pada orang lain (egois, malas, manja) memicu kemarahan berlebih dalam diri Anda.',
      '<strong>Emosi yang Diasingkan:</strong> Anda merasa "tidak pernah marah", namun mengalami ledakan emosi mendadak atau ketegangan fisik.',
      '<strong>Pola Hubungan Berulang:</strong> Anda terus mengalami konflik yang sama dengan pasangan atau atasan yang berbeda.',
      '<strong>Lelah Menjaga Topeng Sempurna:</strong> Anda menguras energi demi terlihat "selalu baik dan tenang" karena takut sisi gelap Anda terlihat.'
    ],
    scoreUnit: 'dari 4 sinyal proyeksi shadow aktif',
    verdicts: [
      'Centang item di atas untuk melihat di mana emosi yang ditekan menguras energi Anda.',
      'Integrasi Diri Tinggi (1/4). Anda menerima emosi kompleks tanpa proyeksi berlebihan.',
      'Proyeksi Shadow Sedang (2/4). Kebutuhan diri yang dilarang muncul sebagai rasa kesal pada orang lain.',
      'Pemisahan Persona-Shadow Aktif (3/4). Menekan emosi memicu stres tersembunyi dan pola berulang.',
      'Represi Shadow Mendalam (4/4). Menahan topeng menguras sistem saraf Anda—cek beban stres dan buat rencana regulasi emosi.'
    ],
    primaryBtn: 'Ikuti Tes Beban Stres &amp; Represi Tersembunyi &rarr;',
    subBtn: 'Buka Perencana Regulasi Emosi Interaktif &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK JUNG GÖLGE PROJEKSİYONU TARAMASI',
    heading: 'Bilinçdışı Gölgeniz (Shadow) Size Ne Göstermeye Çalışıyor?',
    sub: 'Günlük tepkilerinizde aktif olan gölge projeksiyonu ve bastırma sinyallerini işaretleyin:',
    items: [
      '<strong>Yoğun "Ayna" Öfkesi:</strong> Başkalarındaki bencillik, tembellik veya ilgi ihtiyacı gibi özellikler sizde aşırı bir öfke tetikliyor.',
      '<strong>Sürgün Edilmiş Duygular:</strong> "Asla öfkelenmem" diyorsunuz ama ani patlamalar veya bedensel ağrılar yaşıyorsunuz.',
      '<strong>Tekrarlayan İlişki Senaryoları:</strong> Farklı partnerler veya yöneticilerle hep aynı çatışma döngüsünün içine düşüyorsunuz.',
      '<strong>Kusursuz Maske Yorgunluğu:</strong> Karanlık veya karmaşık duygularınız görülür korkusuyla sürekli "iyi ve sakin" görünmeye çalışıyorsunuz.'
    ],
    scoreUnit: '/ 4 gölge projeksiyonu sinyali aktif',
    verdicts: [
      'Bastırılan gölge yönlerin enerjinizi nerede tükettiğini görmek için yukarıdakileri işaretleyin.',
      'Yüksek Öz-Bütünleşme (1/4). Karmaşık duygularınızı bastırmadan kabul edebiliyorsunuz.',
      'Orta Düzey Gölge Projeksiyonu (2/4). Kendinize yasakladığınız ihtiyaçlar başkalarına öfke olarak yansıyor.',
      'Aktif Persona-Gölge Bölünmesi (3/4). Duyguları bastırmak gizli stres ve tekrarlayan döngüler yaratıyor.',
      'Derin Gölge Bastırması (4/4). Maskeyi korumak sinir sisteminizi tüketiyor—stres yükünüzü ölçün ve duygu düzenleme planı oluşturun.'
    ],
    primaryBtn: '3 Dakikalık Gizli Stres ve Bastırma Yükü Testini Başlat &rarr;',
    subBtn: 'Duygu Düzenleme Planlayıcısını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड शैडो वर्क (Shadow Projection) स्क्रीनर',
    heading: 'आपका अचेतन मन (Shadow) आपको क्या दिखाने की कोशिश कर रहा है?',
    sub: 'अपनी दैनिक प्रतिक्रियाओं में दिखने वाले इन शैडो प्रोजेक्शन संकेतों को चुनें:',
    items: [
      '<strong>दूसरों की कुछ आदतों पर तीव्र गुस्सा:</strong> दूसरों में स्वार्थ, आलस्य या घमंड देखकर अचानक अत्यधिक क्रोध या चिढ़ होना।',
      '<strong>दबी हुई भावनाओं का विस्फोट:</strong> यह मानना कि "मुझे कभी गुस्सा नहीं आता", लेकिन अचानक भावनात्मक विस्फोट या शारीरिक जकड़न होना।',
      '<strong>बार-बार दोहराए जाने वाले रिश्ते के पैटर्न:</strong> अलग-अलग लोगों या बॉस के साथ बार-बार एक जैसी ही समस्या और टकराव में फंसना।',
      '<strong>"अच्छे इंसान" का मुखौटा बनाए रखने की थकान:</strong> हमेशा शांत और सही दिखने में ऊर्जा खर्च करना और अपनी कमज़ोर भावनाओं के दिखने से डरना।'
    ],
    scoreUnit: '/ 4 शैडो प्रोजेक्शन संकेत सक्रिय',
    verdicts: [
      'यह देखने के लिए ऊपर चुनें कि दबी हुई भावनाएं आपकी मानसिक ऊर्जा कहाँ खर्च कर रही हैं।',
      'उच्च आत्म-संतुलन (1/4)। आप अपनी जटिल भावनाओं को सहजता से स्वीकार करते हैं।',
      'मध्यम शैडो प्रोजेक्शन (2/4)। आपकी अपनी दबी हुई ज़रूरतें दूसरों के प्रति चिढ़ के रूप में दिख रही हैं।',
      'सक्रिय शैडो विभाजन (3/4)। भावनाओं को दबाने से छुपा हुआ तनाव और दोहराव बढ़ रहा है।',
      'गहरा शैडो दमन और ऊर्जा हानि (4/4)। अभी अपना स्ट्रेस लोड जांचें और इमोशन रेगुलेशन प्लान बनाएं।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और आंतरिक लोड चेक लें &rarr;',
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

  // 1. self-sabotage-patterns.html (12 locales)
  for (const [lang, loc] of Object.entries(SELF_SABOTAGE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'self-sabotage-patterns.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'selfSabotageScreener',
      chkClass: 'sabot-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=self_sabotage_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/attachment-style/?lang=${lang}&source=self_sabotage_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/self-sabotage-patterns.html`);
    console.log(`[PASS] self-sabotage-patterns (${lang})`);
  }

  // 2. inner-child-test-quiz-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(INNER_CHILD_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'inner-child-test-quiz-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'innerChildWoundScreener',
      chkClass: 'inchild-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=inner_child_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=inner_child_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/inner-child-test-quiz-guide.html`);
    console.log(`[PASS] inner-child-test-quiz-guide (${lang})`);
  }

  // 3. shadow-work-quiz-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(SHADOW_WORK_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'shadow-work-quiz-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'shadowProjectionScreener',
      chkClass: 'shadow-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=shadow_work_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=shadow_work_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/shadow-work-quiz-guide.html`);
    console.log(`[PASS] shadow-work-quiz-guide (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 8: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

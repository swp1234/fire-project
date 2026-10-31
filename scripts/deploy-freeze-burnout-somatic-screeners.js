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

const FUNCTIONAL_FREEZE_LOCALES = {
  en: {
    badge: '30-SECOND FUNCTIONAL FREEZE (DORSAL VAGAL) SCREENER',
    heading: 'Are You in "Functional Freeze" Without Realizing It?',
    sub: 'Check the polyvagal shutdown signs hiding behind your daily autopilot:',
    items: [
      '<strong>High-Functioning Autopilot Mask:</strong> You show up to work and answer messages, but feel like you\'re watching your life from behind glass.',
      '<strong>Task Initiation Paralysis:</strong> Simple personal tasks (replying to a text, opening mail, starting a hobby) feel like wading through wet cement.',
      '<strong>Muted Emotional Volume:</strong> You aren\'t actively crying or panicking—your emotional system just feels flat, numb, or "on pause."',
      '<strong>Post-Social Collapse &amp; Screen Numbing:</strong> After "turning on" for work or social obligations, you collapse into hours of passive scrolling.'
    ],
    scoreUnit: 'of 4 functional freeze signals active',
    verdicts: [
      'Check the signals above to see if your nervous system has entered dorsal vagal functional freeze.',
      'Mild Fatigue Baseline (1/4). Gentle movement and rest will quickly restore your ventral vagal energy.',
      'Moderate Functional Freeze (2/4). Your nervous system is conserving energy behind a high-functioning mask.',
      'High Dorsal Vagal Shutdown (3/4). You are burning extra energy just to look "normal" while internally immobilized.',
      'Deep Functional Freeze State (4/4). Stop forcing willpower—check your autonomic stress load and gently re-engage your senses with 5-4-3-2-1 grounding.'
    ],
    primaryBtn: 'Take the 3-Minute Autonomic Stress &amp; Freeze Check &rarr;',
    subBtn: 'Gently Thaw Shutdown with 5-4-3-2-1 Sensory Grounding &rarr;'
  },
  ko: {
    badge: '30초 기능적 동결(Functional Freeze) 판별기',
    heading: '겉으론 멀쩡한데 속은 멈춰버린 "기능적 동결" 상태일까?',
    sub: '일상은 유지하지만 내면의 배측 미주신경이 셧다운된 신호를 체크해보세요:',
    items: [
      '<strong>고기능 자동조종(Autopilot) 가면:</strong> 출근하고 할 일은 해내지만, 유리벽 너머로 내 인생을 구경하는 것처럼 실감이 나지 않습니다.',
      '<strong>사소한 시작 마비 (착수 불능):</strong> 간단한 답장, 우편물 확인, 취미 시작조차 시멘트 늪을 걷는 것처럼 버겁습니다.',
      '<strong>음소거된 감정 볼륨:</strong> 슬프거나 불안하기보다 감정 전체가 평평하게 무뎌져 일시정지 버튼이 눌린 것 같습니다.',
      '<strong>사회적 연기 후 방전과 도피성 스크롤링:</strong> 밖에서 정상적인 척 에너지를 쓰고 나면 집에 와서 몇 시간이고 멍하니 화면만 봅니다.'
    ],
    scoreUnit: '개 기능적 동결(Dorsal Vagal Freeze) 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내 신경계가 기능적 동결(보호적 셧다운) 상태인지 확인해보세요.',
      '일시적 피로 상태(1/4). 가벼운 스트레칭과 휴식만으로도 신경계 활력을 회복할 수 있습니다.',
      '중등도 기능적 동결(2/4). 겉으로는 기능하지만 신경계는 에너지를 아끼기 위해 절전 모드에 들어가 있습니다.',
      '높은 배측 미주신경 셧다운(3/4). 멀쩡한 척 가면을 유지하느라 남은 에너지마저 고갈되고 있습니다.',
      '깊은 기능적 동결 고착 상태(4/4). 의지력으로 밀어붙이지 마세요. 지금 자율신경 스트레스 진단과 5-4-3-2-1 감각 해동(Grounding)을 시작하세요.'
    ],
    primaryBtn: '무료 자율신경 스트레스 &amp; 동결 반응 테스트 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 신경계 해동하기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN FUNCTIONAL-FREEZE-CHECK',
    heading: 'Stecken Sie unbemerkt im „Funktionalen Freeze“?',
    sub: 'Wählen Sie die Anzeichen für einen dorsalen Vagus-Shutdown hinter Ihrem Alltags-Autopiloten:',
    items: [
      '<strong>Hochfunktionale Autopilot-Maske:</strong> Sie erledigen Ihre Pflichten, fühlen sich aber wie hinter einer Glasscheibe vom Leben getrennt.',
      '<strong>Start-Paralyse bei Kleinigkeiten:</strong> Einfache Dinge wie eine Nachricht beantworten oder Post öffnen fühlen sich bleischwer an.',
      '<strong>Gedämpfte Emotionen:</strong> Sie sind nicht akut traurig, sondern innerlich flach, taub oder wie auf „Pause“ gedrückt.',
      '<strong>Erschöpfungs-Kollaps &amp; Scrollen:</strong> Nach sozialen oder beruflichen Terminen versinken Sie stundenlang im passiven Bildschirmkonsum.'
    ],
    scoreUnit: 'von 4 Functional-Freeze-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um einen funktionalen Freeze-Zustand zu prüfen.',
      'Leichte Erschöpfung (1/4). Sanfte Bewegung und Pausen stellen Ihre Energie rasch wieder her.',
      'Mittlerer Funktionaler Freeze (2/4). Ihr Nervensystem läuft hinter einer funktionierenden Fassade im Sparmodus.',
      'Hoher dorsaler Vagus-Shutdown (3/4). Allein das Aufrechterhalten der Normalität kostet Sie enorme Kraft.',
      'Tiefer Funktionaler Freeze (4/4). Prüfen Sie jetzt Ihr Stressprofil und nutzen Sie 5-4-3-2-1 Grounding zum sanften Auftauen.'
    ],
    primaryBtn: 'Zum 3-Minuten Stress- &amp; Freeze-Check &rarr;',
    subBtn: 'Sanftes Auftauen mit dem 5-4-3-2-1 Grounding-Tool &rarr;'
  },
  es: {
    badge: 'TRIAJE DE CONGELACIÓN FUNCIONAL EN 30 SEGUNDOS',
    heading: '¿Estás en "Congelación Funcional" sin darte cuenta?',
    sub: 'Marca las señales de apagado vagal dorsal que se esconden tras tu piloto automático:',
    items: [
      '<strong>Máscara de piloto automático:</strong> Cumples con el trabajo y las rutinas, pero sientes que ves tu vida detrás de un cristal.',
      '<strong>Parálisis para iniciar tareas:</strong> Cosas simples como responder un mensaje o empezar algo personal pesan como el cemento.',
      '<strong>Volumen emocional silenciado:</strong> No estás llorando ni en pánico; tu sistema emocional se siente plano, entumecido o en pausa.',
      '<strong>Colapso post-social y scroll pasivo:</strong> Tras cumplir socialmente, te desplomas horas consumiendo pantallas sin energía.'
    ],
    scoreUnit: 'de 4 señales de congelación funcional activas',
    verdicts: [
      'Marca los puntos arriba para evaluar si tu sistema nervioso está en congelación funcional.',
      'Fatiga leve (1/4). El descanso y el movimiento suave restaurarán tu energía rápidamente.',
      'Congelación funcional moderada (2/4). Tu cuerpo está en modo ahorro de energía tras una fachada funcional.',
      'Alto apagado vagal dorsal (3/4). Gastas toda tu reserva solo en parecer "normal" por fuera.',
      'Congelación funcional profunda (4/4). No te fuerces con culpa—haz el Chequeo de Estrés y descongela tus sentidos con Anclaje 5-4-3-2-1.'
    ],
    primaryBtn: 'Hacer el Chequeo de Estrés y Respuesta Freeze &rarr;',
    subBtn: 'Reactivar Sentidos con Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'TRIAGE FIGEMENT FONCTIONNEL (FREEZE) EN 30 SECONDES',
    heading: 'Êtes-vous en « figement fonctionnel » sans le savoir ?',
    sub: 'Cochez les signes d\'arrêt vagal dorsal cachés derrière votre pilote automatique :',
    items: [
      '<strong>Masque de pilote automatique :</strong> Vous assurez au travail, mais vous avez l\'impression d\'observer votre vie derrière une vitre.',
      '<strong>Paralysie de l\'initiation :</strong> Les petites tâches personnelles semblent lourdes comme du plomb.',
      '<strong>Volume émotionnel coupé :</strong> Ni crise de larmes ni panique—juste une sensation de vide plat, d\'engourdissement ou de « pause ».',
      '<strong>Effondrement après l\'effort social :</strong> Dès que vous rentrez chez vous, vous vous réfugiez dans le défilement passif sur écran.'
    ],
    scoreUnit: 'sur 4 signaux de figement fonctionnel actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour détecter un état de figement fonctionnel.',
      'Fatigue passagère (1/4). Du repos et des mouvements doux relanceront votre énergie.',
      'Figement fonctionnel modéré (2/4). Votre système nerveux s\'est mis en veille derrière une façade efficace.',
      'Fort arrêt vagal dorsal (3/4). Maintenir les apparences consomme vos dernières réserves.',
      'Figement fonctionnel profond (4/4). Faites le Bilan de Stress et réveillez doucement vos sens avec l\'Ancrage 5-4-3-2-1.'
    ],
    primaryBtn: 'Faire le Bilan de Stress &amp; Figement &rarr;',
    subBtn: 'Sortir de la Sidération avec l\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・機能的フリーズ（隠れシャットダウン）チェック',
    heading: '外見は普通なのに心が動かない「機能的フリーズ」状態？',
    sub: '日常をこなしながらも自律神経がフリーズしているサインをチェックしてください：',
    items: [
      '<strong>自動操縦（オートパイロット）の仮面：</strong> 仕事や家事はこなせるが、ガラス越しに自分の人生を見ているようで現実感がない。',
      '<strong>行動開始の麻痺：</strong> 返信や片付けなど、簡単なことに取り掛かるだけでも鉛のように体が重い。',
      '<strong>感情のミュート（無感覚）：</strong> 悲しいわけでも不安なわけでもなく、感情のボリュームがゼロになったように平坦。',
      '<strong>帰宅後の虚脱と受動的スクロール：</strong> 外で「普通」を演じた後、家では動けなくなり何時間もスマホを眺めてしまう。'
    ],
    scoreUnit: '/ 4 個の機能的フリーズ・サインが該当',
    verdicts: [
      '上の項目をチェックして、背側迷走神経による「機能的フリーズ」を確認しましょう。',
      '軽度のエネルギー低下（1/4）。休息と小さな身体の動きで自然に回復できます。',
      '中程度の機能的フリーズ（2/4）。「ちゃんとしている仮面」の裏で、神経系が省エネ停止モードに入っています。',
      '高いシャットダウン状態（3/4）。普通を演じるだけで全エネルギーを使い果たしています。',
      '深い機能的フリーズ状態（4/4）。気合で動くのは逆効果です。今すぐストレス診断と5-4-3-2-1感覚グラウンディングで優しく解凍しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆フリーズ反応チェック &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで心を解凍する &rarr;'
  },
  zh: {
    badge: '30秒功能性僵住（Functional Freeze）筛查',
    heading: '你是否处于表面正常、内心停摆的“功能性僵住”？',
    sub: '勾选隐藏在你日常“自动驾驶”模式背后的背侧迷走神经关闭信号：',
    items: [
      '<strong>高功能自动驾驶面具：</strong> 能正常上班、回复工作，但感觉像隔着一层玻璃旁观自己的人生，毫无真实感。',
      '<strong>启动瘫痪（行动如灌铅）：</strong> 面对极其简单的私人小事（回消息、拆快递、洗碗），迈出第一步却像踩在水泥里一样沉重。',
      '<strong>情绪音量被静音：</strong> 不是强烈的悲伤或焦虑，而是整个情绪系统变得扁平、麻木，仿佛被按下了暂停键。',
      '<strong>社交耗竭后的被动刷屏：</strong> 在外勉强维持正常表现后，一回到家就彻底瘫倒，连续数小时麻木地刷手机。'
    ],
    scoreUnit: '/ 4 项功能性僵住信号激活',
    verdicts: [
      '勾选上方信号，查看你的神经系统是否已进入“功能性僵住（保护性关机）”。',
      '轻度日常疲惫 (1/4)。温和的肢体伸展与休息即可恢复腹侧迷走神经活力。',
      '中度功能性僵住 (2/4)。你的神经系统正在“正常运转”的外壳下开启低功耗休眠。',
      '高度背侧迷走神经关闭 (3/4)。光是维持表面正常就已经耗光了你的全部心理带宽。',
      '深层功能性僵住状态 (4/4)。停止用意志力硬撑，建议立即检测自主神经压力负荷，并用 5-4-3-2-1 感官着陆法温和解冻。'
    ],
    primaryBtn: '开始3分钟免费压力与神经冻结测试 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆温和解冻身体 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE CONGELAMENTO FUNCIONAL EM 30 SEGUNDOS',
    heading: 'Você está em "Congelamento Funcional" sem perceber?',
    sub: 'Marque os sinais de desligamento vagal dorsal escondidos atrás do seu piloto automático:',
    items: [
      '<strong>Máscara de piloto automático:</strong> Você trabalha e cumpre tarefas, mas sente que assiste à própria vida atrás de um vidro.',
      '<strong>Paralisia para iniciar tarefas:</strong> Coisas simples do dia a dia parecem pesadas como caminhar no cimento.',
      '<strong>Volume emocional no mudo:</strong> Você não está chorando nem em pânico—suas emoções apenas parecem planas, anestesiadas ou em pausa.',
      '<strong>Colapso pós-social e rolagem passiva:</strong> Depois de funcionar para os outros, você desaba por horas rolando a tela sem energia.'
    ],
    scoreUnit: 'de 4 sinais de congelamento funcional ativos',
    verdicts: [
      'Marque os itens acima para avaliar se seu sistema nervoso entrou em congelamento funcional.',
      'Cansaço leve (1/4). Descanso e micro-movimentos restauram sua energia rapidamente.',
      'Congelamento funcional moderado (2/4). Seu corpo entrou em economia de energia atrás de uma fachada funcional.',
      'Alto desligamento vagal dorsal (3/4). Parecer "bem" por fora está consumindo toda a sua reserva.',
      'Congelamento funcional profundo (4/4). Faça o Check-up de Estresse e descongele seus sentidos com o Grounding 5-4-3-2-1 agora.'
    ],
    primaryBtn: 'Fazer o Check-up de Estresse e Freeze &rarr;',
    subBtn: 'Descongelar com a Ferramenta Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ФУНКЦИОНАЛЬНОЕ ЗАМИРАНИЕ (FREEZE)',
    heading: 'Находитесь ли вы в «функциональном замирании»?',
    sub: 'Отметьте признаки защитного отключения нервной системы за маской обычной жизни:',
    items: [
      '<strong>Маска автопилота:</strong> Вы ходите на работу и выполняете обязанности, но словно наблюдаете за своей жизнью через толстое стекло.',
      '<strong>Паралич начала действия:</strong> Простые личные дела требуют невероятных усилий, будто тело налито свинцом.',
      '<strong>Выключенный звук эмоций:</strong> Нет ни острой грусти, ни паники — только внутренняя пустота, онемение и ощущение «паузы».',
      '<strong>Крах после общения и думскроллинг:</strong> Отыграв социальную роль, дома вы часами оцепенело листаете ленту.'
    ],
    scoreUnit: 'из 4 признаков функционального замирания активно',
    verdicts: [
      'Отметьте пункты выше, чтобы проверить, не перешла ли ваша нервная система в режим энергосбережения.',
      'Легкое утомление (1/4). Отдых и мягкое движение быстро вернут тонус.',
      'Умеренное функциональное замирание (2/4). За внешней активностью скрывается защитное торможение.',
      'Сильный дорсальный вагусный спад (3/4). Поддержание маски «всё нормально» забирает последние силы.',
      'Глубокое функциональное замирание (4/4). Проверьте уровень стресса и мягко верните чувствительность практикой 5-4-3-2-1.'
    ],
    primaryBtn: 'Пройти 3-минутную проверку уровня стресса &rarr;',
    subBtn: 'Мягко выйти из оцепенения с практикой 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING FUNCTIONAL FREEZE (MEMBEKU FUNGSIONAL) 30 DETIK',
    heading: 'Apakah Anda Sedang Mengalami "Functional Freeze"?',
    sub: 'Centang tanda shutdown sistem saraf yang tersembunyi di balik mode autopilot harian Anda:',
    items: [
      '<strong>Topeng Autopilot Berfungsi Tinggi:</strong> Anda tetap bekerja dan membalas pesan, namun merasa seperti menonton hidup dari balik kaca.',
      '<strong>Lumpuh Memulai Hal Kecil:</strong> Tugas pribadi sederhana terasa sangat berat seperti berjalan di dalam lumpur.',
      '<strong>Emosi Terasa "Mute" (Hampa):</strong> Tidak sedih hebat atau panik—sistem emosi Anda hanya terasa datar, mati rasa, atau terjeda.',
      '<strong>Tumbang Setelah Sosial &amp; Scroll Pasif:</strong> Setelah tampil "baik-baik saja", Anda tumbang dan hanya mampu scroll layar berjam-jam.'
    ],
    scoreUnit: 'dari 4 sinyal functional freeze aktif',
    verdicts: [
      'Centang poin di atas untuk melihat apakah saraf Anda masuk ke mode beku fungsional.',
      'Kelelahan Ringan (1/4). Istirahat dan gerakan ringan akan cepat memulihkan energi Anda.',
      'Functional Freeze Sedang (2/4). Sistem saraf Anda menghemat energi di balik topeng produktif.',
      'Shutdown Vagal Dorsal Tinggi (3/4). Sekadar terlihat "normal" sudah menguras habis sisa tenaga Anda.',
      'Functional Freeze Dalam (4/4). Cek beban stres otonom Anda dan cairkan kebekuan saraf dengan Grounding 5-4-3-2-1.'
    ],
    primaryBtn: 'Ikuti Cek Stres &amp; Respons Freeze (3 Menit) &rarr;',
    subBtn: 'Buka Alat Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK FONKSİYONEL DONMA (FUNCTIONAL FREEZE) TARAMASI',
    heading: 'Farkında Olmadan "Fonksiyonel Donma" Halinde misiniz?',
    sub: 'Günlük otomatik pilotunuzun ardına gizlenen sinir sistemi kapanma işaretlerini seçin:',
    items: [
      '<strong>Yüksek İşlevli Otomatik Pilot Maskesi:</strong> İşe gidiyor ve sorumlulukları yapıyorsunuz ama hayatınızı cam 유리의 arkasından izliyor gibisiniz.',
      '<strong>Başlama Felci:</strong> Basit kişisel işlere başlamak bile betonun içinde yürümek kadar ağır geliyor.',
      '<strong>Kısılmış Duygusal Ses:</strong> Aktif bir ağlama ya da panik yok; duygularınız sadece düz, uyuşmuş veya "duraklatılmış" gibi.',
      '<strong>Sosyal Çöküş ve Ekran Uyuşması:</strong> Dışarıda "iyi" göründükten sonra evde saatlerce pasifçe ekran kaydırarak çöküyorsunuz.'
    ],
    scoreUnit: '/ 4 fonksiyonel donma sinyali aktif',
    verdicts: [
      'Sinir sisteminizin koruyucu donma (dorsal vagal) modunda olup olmadığını görmek için yukarıdakileri işaretleyin.',
      'Hafif Yorgunluk (1/4). Nazik hareket ve dinlenme enerjinizi hızla tazeleyecektir.',
      'Orta Düzey Fonksiyonel Donma (2/4). Sinir sisteminiz işlevsel bir maskenin ardında enerji tasarrufu yapıyor.',
      'Yüksek Dorsal Vagal Kapanma (3/4). Sadece "normal" görünmek bile tüm enerjinizi tüketiyor.',
      'Derin Fonksiyonel Donma (4/4). Kendinizi zorlamayı bırakın—Stres Testini çözün ve 5-4-3-2-1 topraklama ile duyularınızı nazikçe uyandırın.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Donma Tepkisi Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड फंक्शनल फ्रीज (Functional Freeze) स्क्रीनर',
    heading: 'क्या आप अनजाने में "फंक्शनल फ्रीज" की स्थिति में हैं?',
    sub: 'अपनी दैनिक दिनचर्या के पीछे छिपे नर्वस सिस्टम शटडाउन के संकेतों को चुनें:',
    items: [
      '<strong>ऑटोपायलट मास्क:</strong> आप बाहर से काम पूरा कर रहे हैं, लेकिन भीतर से ऐसा लगता है जैसे कांच के पीछे से अपनी ज़िंदगी देख रहे हों।',
      '<strong>काम शुरू करने में जड़ता:</strong> छोटे व्यक्तिगत काम शुरू करना भी भारी पत्थर उठाने जैसा मुश्किल लगता है।',
      '<strong>भावनाओं का सुन्न पड़ना:</strong> न तेज़ दुख है न घबराहट—बस भावनाएं पूरी तरह सपाट, सुन्न या "पॉज़" पर लगती हैं।',
      '<strong>सामाजिक थकान और स्क्रीन स्क्रॉलिंग:</strong> लोगों के सामने सामान्य दिखने के बाद घर आकर घंटों बिना सोचे स्क्रीन स्क्रॉल करते रहना।'
    ],
    scoreUnit: '/ 4 फंक्शनल फ्रीज संकेत सक्रिय',
    verdicts: [
      'यह जानने के लिए ऊपर दिए गए विकल्प चुनें कि क्या आपका नर्वस सिस्टम शटडाउन मोड में है।',
      'हल्की थकान (1/4)। आराम और हल्की शारीरिक गतिविधि आपकी ऊर्जा वापस ला देगी।',
      'मध्यम फंक्शनल फ्रीज (2/4)। आपका शरीर सामान्य दिखने के पीछे ऊर्जा बचाने के मोड में है।',
      'उच्च नर्वस सिस्टम शटडाउन (3/4)। सिर्फ "ठीक" दिखने का अभिनय आपकी सारी ऊर्जा सोख रहा है।',
      'गहरा फंक्शनल फ्रीज (4/4)। खुद पर दबाव न डालें—अभी स्ट्रेस चेक करें और 5-4-3-2-1 ग्राउंडिंग से इंद्रियों को धीरे-धीरे सक्रिय करें।'
    ],
    primaryBtn: '3-मिनट का मुफ्त स्ट्रेस और फ्रीज चेक लें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग टूल से खुद को रिचार्ज करें &rarr;'
  }
};

const BURNOUT_VS_DEP_LOCALES = {
  en: {
    badge: '30-SECOND BURNOUT VS. DEPRESSION DIFFERENTIAL SCREENER',
    heading: 'Is Your Exhaustion Role-Specific Burnout or Systemic Depletion?',
    sub: 'Check the clinical differentiators that match your current exhaustion pattern:',
    items: [
      '<strong>Context-Bound vs. Global Scope:</strong> Your exhaustion spikes around work, caregiving, or obligations, yet lifts slightly when obligations are removed.',
      '<strong>"I Want To, But I Have Zero Fuel":</strong> You still care about goals or hobbies in theory, but lack the physical or cognitive battery to engage.',
      '<strong>Cynicism &amp; Irritability Shield:</strong> You feel growing detachment, impatience, or resentment toward demands and people asking for more from you.',
      '<strong>Unrefreshing Sleep &amp; Sunday Dread:</strong> Even after sleeping, you wake up dreading the upcoming task load before the day even begins.'
    ],
    scoreUnit: 'of 4 burnout-differential markers active',
    verdicts: [
      'Check the items above to map your exhaustion pattern before choosing a recovery strategy.',
      'Acute Stress Fatigue (1/4). Short-term rest and boundary protection will restore your baseline.',
      'Moderate Role Burnout (2/4). Chronic demand overload is outpacing your daily recovery window.',
      'High Systemic Burnout (3/4). Unaddressed burnout is spilling across life domains—run the full Burnout vs. Stress Differential now.',
      'Severe Depletion & Overlap Zone (4/4). Chronic exhaustion is affecting your nervous system globally—open the Burnout Differential Tool and Stress Check now.'
    ],
    primaryBtn: 'Run the Interactive Burnout vs. Stress Differential &rarr;',
    subBtn: 'Take the 3-Minute Autonomic Stress Check &rarr;'
  },
  ko: {
    badge: '30초 정서적 번아웃 vs 우울·무기력 감별 스크리너',
    heading: '지금 내 깊은 피로는 "번아웃"일까, 전면적 에너지 고갈일까?',
    sub: '회복 전략을 결정짓는 4가지 핵심 감별 신호를 체크해보세요:',
    items: [
      '<strong>상황 의존적 고갈 신호:</strong> 일·돌봄·의무 생각만 하면 숨이 막히지만, 압박에서 완전히 벗어나면 숨통이 조금은 트입니다.',
      '<strong>"하고 싶은 마음은 있는데 에너지가 0%":</strong> 취미나 목표에 대한 욕구 자체는 남아 있으나, 몸과 뇌의 배터리가 방전되어 움직일 수 없습니다.',
      '<strong>냉소주의와 방어적 짜증:</strong> 나에게 무언가를 요구하는 사람이나 업무에 대해 마음의 문을 닫고 냉소적이거나 예민해집니다.',
      '<strong>자고 일어나도 회복되지 않는 아침의 두려움:</strong> 잠을 자도 피로가 풀리지 않고 눈을 뜨자마자 오늘 해내야 할 일들이 두렵게 느껴집니다.'
    ],
    scoreUnit: '개 번아웃·에너지 고갈 감별 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 피로가 직무·역할 번아웃인지 전면적 소진인지 확인해보세요.',
      '급성 스트레스 피로(1/4). 단기 휴식과 업무 경계 설정만으로도 빠르게 회복할 수 있습니다.',
      '중등도 역할 번아웃(2/4). 일일 에너지 소모량이 수면으로 회복되는 양을 초과하고 있습니다.',
      '높은 만성 번아웃 상태(3/4). 특정 영역의 소진이 일상 전체로 번지고 있습니다. 지금 정밀 감별 진단을 실행하세요.',
      '심각한 전면적 고갈 및 중첩 위험(4/4). 만성 번아웃이 신경계 전체를 짓누르고 있습니다. 지금 번아웃 vs 스트레스 감별 도구와 스트레스 체크를 확인하세요.'
    ],
    primaryBtn: '인터랙티브 번아웃 vs 스트레스 감별 도구 열기 &rarr;',
    subBtn: '3분 자율신경 스트레스 &amp; 소진 정밀 체크 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN BURNOUT-DIFFERENTIAL-CHECK',
    heading: 'Rollen-Burnout oder tiefgreifende emotionale Erschöpfung?',
    sub: 'Wählen Sie die Merkmale aus, die am besten zu Ihrer aktuellen Erschöpfung passen:',
    items: [
      '<strong>Kontextbezogene Erschöpfung:</strong> Die Schwere steigt massiv bei Arbeits- oder Pflichtgedanken, lässt aber ohne Leistungsdruck leicht nach.',
      '<strong>„Ich will, aber der Akku ist leer“:</strong> Wünsche und Interessen sind theoretisch da, aber es fehlt jede mentale Kraft zur Umsetzung.',
      '<strong>Zynismus &amp; Reizbarkeit:</strong> Sie reagieren zunehmend distanziert, genervt oder abgestumpft auf neue Anforderungen.',
      '<strong>Nicht erholsamer Schlaf &amp; Morgengrauen:</strong> Selbst nach dem Schlafen wachen Sie mit Widerstand gegen den kommenden Tag auf.'
    ],
    scoreUnit: 'von 4 Burnout-Differential-Merkmalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihr Erschöpfungsmuster genauer einzuordnen.',
      'Akute Stressmüdigkeit (1/4). Gezielte Pausen und klare Grenzen bringen Ihre Energie zurück.',
      'Mittlerer Rollen-Burnout (2/4). Chronische Überlastung übersteigt Ihre tägliche Regeneration.',
      'Hoher systemischer Burnout (3/4). Die Erschöpfung greift auf Ihren gesamten Alltag über—nutzen Sie jetzt das Differential-Tool.',
      'Schwere Tiefenerschöpfung (4/4). Starten Sie jetzt das Burnout-vs.-Stress-Differential und prüfen Sie Ihre autonome Belastung.'
    ],
    primaryBtn: 'Stress- vs. Burnout-Differential-Tool öffnen &rarr;',
    subBtn: 'Zum 3-Minuten Stress- &amp; Nervensystem-Check &rarr;'
  },
  es: {
    badge: 'TRIAJE DIFERENCIAL BURNOUT VS. DEPRESIÓN EN 30S',
    heading: '¿Tu agotamiento es Burnout por sobrecarga o desgaste profundo?',
    sub: 'Marca los indicadores clínicos que coinciden con tu fatiga actual:',
    items: [
      '<strong>Alcance ligado a obligaciones:</strong> Tu agotamiento se dispara ante el trabajo o responsabilidades, pero mejora un poco al desconectar.',
      '<strong>"Quiero hacerlo, pero no tengo batería":</strong> Mantienes el deseo por tus gustos, pero no tienes energía física ni mental.',
      '<strong>Cinismo e irritabilidad defensiva:</strong> Te sientes cada vez más distante o impaciente cuando alguien te pide algo más.',
      '<strong>Sueño no reparador y angustia matutina:</strong> Incluso después de dormir, despiertas temiendo la carga del día.'
    ],
    scoreUnit: 'de 4 marcadores diferenciales de burnout activos',
    verdicts: [
      'Marca los puntos arriba para identificar la raíz de tu agotamiento.',
      'Fatiga por estrés agudo (1/4). El descanso y poner límites restaurarán tu equilibrio.',
      'Burnout moderado (2/4). La sobrecarga diaria supera tu capacidad de recuperación nocturna.',
      'Burnout sistémico alto (3/4). El desgaste se está extendiendo a toda tu vida—abre el Diferencial de Burnout ahora.',
      'Agotamiento severo y zona de solapamiento (4/4). Evalúa ahora tu Diferencial de Estrés vs. Burnout y tu carga autonómica.'
    ],
    primaryBtn: 'Abrir Diferencial Interactivo Estrés vs. Burnout &rarr;',
    subBtn: 'Hacer el Chequeo de Estrés en 3 Minutos &rarr;'
  },
  fr: {
    badge: 'TRIAGE DIFFÉRENTIEL BURNOUT VS DÉPRESSION EN 30S',
    heading: 'Votre épuisement est-il un Burnout de surcharge ou un vide global ?',
    sub: 'Cochez les marqueurs cliniques qui correspondent à votre fatigue actuelle :',
    items: [
      '<strong>Épuisement lié au contexte :</strong> La fatigue explose face au travail ou aux obligations, mais s\'allège légèrement hors pression.',
      '<strong>« J\'aimerais, mais ma batterie est à plat » :</strong> Vos envies existent encore en théorie, mais l\'énergie manque totalement.',
      '<strong>Cynisme et irritabilité :</strong> Vous ressentez du détachement ou de l\'agacement dès qu\'on vous sollicite.',
      '<strong>Sommeil non réparateur et appréhension du matin :</strong> Même après avoir dormi, vous vous réveillez déjà épuisé par la journée à venir.'
    ],
    scoreUnit: 'sur 4 marqueurs différentiels de burnout actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour orienter votre stratégie de récupération.',
      'Fatigue de stress aigu (1/4). Du repos et des limites claires suffiront à recharger vos batteries.',
      'Burnout modéré (2/4). Les exigences chroniques dépassent votre capacité de récupération.',
      'Burnout systémique élevé (3/4). L\'épuisement déborde sur toute votre vie—utilisez l\'Outil Différentiel maintenant.',
      'Épuisement sévère (4/4). Ouvrez immédiatement le Différentiel Stress vs Burnout et faites le Bilan de Stress.'
    ],
    primaryBtn: 'Ouvrir l\'Outil Différentiel Stress vs Burnout &rarr;',
    subBtn: 'Faire le Bilan de Stress en 3 Minutes &rarr;'
  },
  ja: {
    badge: '30秒・燃え尽き症候群（バーンアウト）vs うつ傾向・鑑別チェック',
    heading: 'その深い疲労は「燃え尽き症候群」？それとも心のエネルギー枯渇？',
    sub: '正しい回復法を選ぶために、現在の疲労パターンに当てはまるものをチェックしてください：',
    items: [
      '<strong>状況依存の疲労感：</strong> 仕事や義務を考えると鉛のように重くなるが、プレッシャーから完全に離れると少し呼吸が楽になる。',
      '<strong>「やりたい気持ちはあるのに充電が0%」：</strong> 趣味や目標への関心は残っているのに、体と脳のバッテリーが切れて動けない。',
      '<strong>シニシズム（冷소）とイライラ：</strong> 周囲からの頼み事や業務に対して、距離を置きたくなったりトゲのある反応をしてしまう。',
      '<strong>寝ても取れない疲れと朝の絶望感：</strong> 睡眠をとっても回復せず、朝起きた瞬間から1日のタスクが怖くなる。'
    ],
    scoreUnit: '/ 4 個のバーンアウト鑑別サインが該当',
    verdicts: [
      '上の項目をチェックして、あなたの疲労の性質を見極めましょう。',
      '急性のストレス疲労（1/4）。休息と境界線のケアでスムーズに回復できます。',
      '中程度のバーンアウト傾向（2/4）。日々の消耗が睡眠による回復量を上回っています。',
      '高いバーンアウト状態（3/4）。特定領域の消耗が生活全体に広がっています。鑑別ツールで詳細を確認しましょう。',
      '深刻なエネルギー枯渇・重複ゾーン（4/4）。今すぐ「ストレス vs 燃え尽き鑑別ツール」とストレス診断で現在地を把握してください。'
    ],
    primaryBtn: 'ストレス vs 燃え尽き症候群・鑑別ツールを開く &rarr;',
    subBtn: '3分間の無料ストレス＆自律神経チェック &rarr;'
  },
  zh: {
    badge: '30秒职业/情感倦怠（Burnout）与抑郁耗竭鉴别筛查',
    heading: '你的极度疲惫是“压力性倦怠”，还是深层心理耗竭？',
    sub: '勾选最符合你当前透支状态的临床鉴别指标：',
    items: [
      '<strong>情境相关性耗竭：</strong> 一想到工作、照顾责任或任务就窒息沉重，但若彻底脱离压力源，呼吸会稍微轻松一点。',
      '<strong>“我想做，但电量为 0%”：</strong> 内心对爱好或目标仍有向往，但身体和大脑彻底没电，完全提不起劲。',
      '<strong>疏离感、讽刺与易怒防御：</strong> 对他人的要求或工作变得冷漠、不耐烦，本能地想要推开一切消耗。',
      '<strong>睡眠无法回血与清晨恐惧：</strong> 就算睡了一觉也毫无恢复感，早上睁眼第一秒就开始畏惧今天要应付的事。'
    ],
    scoreUnit: '/ 4 项倦怠鉴别指标激活',
    verdicts: [
      '勾选上方指标，先精准识别耗竭类型，再选择正确的恢复方案。',
      '急性压力疲劳 (1/4)。短期休整与划清界限即可帮助你快速回血。',
      '中度角色倦怠 (2/4)。长期的外部透支已经超出了你每日睡眠的修复速度。',
      '高度系统性倦怠 (3/4)。特定领域的耗竭正在蔓延至整个生活，建议立即运行倦怠鉴别工具。',
      '重度透支与叠加风险区 (4/4)。长期过载正全面压垮神经系统，请立即打开倦怠 vs 压力鉴别工具与压力测试。'
    ],
    primaryBtn: '打开互动式倦怠 vs 压力鉴别工具 &rarr;',
    subBtn: '开始3分钟免费自主神经压力测试 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DIFERENCIAL BURNOUT VS. DEPRESSÃO EM 30S',
    heading: 'Sua exaustão é Burnout por sobrecarga ou esgotamento profundo?',
    sub: 'Marque os indicadores que melhor descrevem seu cansaço atual:',
    items: [
      '<strong>Exaustão ligada ao contexto:</strong> O peso explode diante do trabalho ou obrigações, mas alivia levemente quando a cobrança some.',
      '<strong>"Eu quero, mas estou sem bateria":</strong> O desejo de fazer coisas boas ainda existe, mas falta energia física e mental.',
      '<strong>Cinismo e irritabilidade defensiva:</strong> Você sente impaciência e distanciamento emocional diante de novas demandas.',
      '<strong>Sono não reparador e pavor matinal:</strong> Mesmo dormindo, você já acorda exausto pensando nas tarefas do dia.'
    ],
    scoreUnit: 'de 4 marcadores diferenciais de burnout ativos',
    verdicts: [
      'Marque os itens acima para mapear seu padrão de exaustão.',
      'Fadiga por estresse agudo (1/4). Pausa e limites claros restauram sua energia.',
      'Burnout moderado (2/4). As demandas crônicas estão superando sua recuperação diária.',
      'Alto burnout sistêmico (3/4). O desgaste está invadindo todas as áreas da vida—use a Ferramenta Diferencial agora.',
      'Esgotamento severo (4/4). Abra agora a Ferramenta Diferencial Estresse vs. Burnout e faça o Check-up de Estresse.'
    ],
    primaryBtn: 'Abrir Ferramenta Diferencial Estresse vs. Burnout &rarr;',
    subBtn: 'Fazer o Check-up de Estresse em 3 Minutos &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ДИФФЕРЕНЦИАЛ: ВЫГОРАНИЕ ИЛИ ДЕПРЕССИЯ?',
    heading: 'Ваше истощение — это выгорание от перегрузок или глубокий спад?',
    sub: 'Отметьте ключевые маркеры, которые точнее всего описывают вашу усталость:',
    items: [
      '<strong>Привязка к контексту и обязанностям:</strong> Упадок сил резко усиливается от мыслей о работе или долге, но слегка отпускает вне давления.',
      '<strong>«Я хочу, но батарейка на нуле»:</strong> Интерес к жизни теоретически сохранен, но нет ни физических, ни умственных сил.',
      '<strong>Цинизм и защитная раздражительность:</strong> Любые новые просьбы вызывают глухое раздражение и желание отгородиться.',
      '<strong>Сон не восстанавливает силы:</strong> Даже после сна вы просыпаетесь с тяжестью и страхом перед наступающим днем.'
    ],
    scoreUnit: 'из 4 маркеров выгорания активно',
    verdicts: [
      'Отметьте пункты выше, чтобы определить природу вашего истощения.',
      'Острое стрессовое утомление (1/4). Отдых и защита границ быстро вернут ресурс.',
      'Умеренное ролевое выгорание (2/4). Ежедневные нагрузки превышают скорость ночного восстановления.',
      'Высокое системное выгорание (3/4). Истощение распространяется на все сферы жизни — откройте Дифференциал выгорания.',
      'Критическое истощение (4/4). Пройдите интерактивный Дифференциал Стресс vs Выгорание и проверьте нервную систему сейчас.'
    ],
    primaryBtn: 'Открыть интерактивный дифференциал Стресс vs Выгорание &rarr;',
    subBtn: 'Пройти 3-минутный тест на уровень стресса &rarr;'
  },
  id: {
    badge: 'SKRINING DIFERENSIAL BURNOUT VS DEPRESI 30 DETIK',
    heading: 'Apakah Kelelahan Anda Burnout Peran atau Kelelahan Sistemik?',
    sub: 'Centang indikator klinis yang paling sesuai dengan kondisi kelelahan Anda saat ini:',
    items: [
      '<strong>Kelelahan Terikat Konteks:</strong> Rasa berat memuncak saat memikirkan pekerjaan atau kewajiban, namun sedikit lega saat bebas tugas.',
      '<strong>"Ingin Melakukan, Tapi Baterai 0%":</strong> Keinginan pada hobi atau tujuan masih ada, tetapi energi fisik dan mental habis.',
      '<strong>Sinisme &amp; Mudah Tersinggung:</strong> Anda merasa makin menjaga jarak, sinis, atau kesal saat orang meminta sesuatu lagi.',
      '<strong>Tidur Tidak Menyegarkan &amp; Cemas Pagi Hari:</strong> Meski sudah tidur, Anda bangun dengan perasaan berat menghadapi beban hari ini.'
    ],
    scoreUnit: 'dari 4 penanda diferensial burnout aktif',
    verdicts: [
      'Centang poin di atas untuk memetakan pola kelelahan Anda sebelum memilih cara pulih.',
      'Kelelahan Stres Akut (1/4). Istirahat singkat dan batasan tegas akan memulihkan energi Anda.',
      'Burnout Peran Sedang (2/4). Beban tuntutan harian melebihi kapasitas pemulihan tidur Anda.',
      'Burnout Sistemik Tinggi (3/4). Kelelahan mulai merembet ke seluruh aspek hidup—buka Alat Diferensial Burnout sekarang.',
      'Kelelahan Berat &amp; Zona Tumpang Tindih (4/4). Buka Alat Diferensial Stres vs Burnout dan Cek Stres sekarang.'
    ],
    primaryBtn: 'Buka Alat Diferensial Stres vs Burnout Interaktif &rarr;',
    subBtn: 'Ikuti Cek Stres Otonom 3 Menit &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK TÜKENMİŞLİK (BURNOUT) VS DEPRESYON TARAMASI',
    heading: 'Yorgunluğunuz Rol Kaynaklı Tükenmişlik mi Yoksa Derin Çöküş mü?',
    sub: 'Mevcut yorgunluk örüntünüzle eşleşen klinik ayırt edici işaretleri seçin:',
    items: [
      '<strong>Bağlama Dayalı Yorgunluk:</strong> Tükenmişlik iş veya sorumluluklar karşısında zirve yapıyor, baskı kalktığında biraz olsun hafifliyor.',
      '<strong>"İstiyorum Ama Pilim Sıfır":</strong> Hedeflere veya hobilere 이론적 isteğiniz var ama başlayacak zihinsel/bedensel yakıtınız yok.',
      '<strong>Sinimizm ve Savunmacı Tahammülsüzlük:</strong> Sizden bir şey daha isteyen insanlara ve taleplere karşı soğukluk ve öfke hissediyorsunuz.',
      '<strong>Dinlendirmeyen Uyku ve Sabah Kaygısı:</strong> Uyusanız bile güne başlarken yapılacak işlerin ağırlığıyla yorgun uyanıyorsunuz.'
    ],
    scoreUnit: '/ 4 tükenmişlik ayırıcı işareti aktif',
    verdicts: [
      'Doğru iyileşme stratejisini seçmek için yukarıdaki maddeleri işaretleyin.',
      'Akut Stres Yorgunluğu (1/4). Kısa süreli dinlenme ve sınır koruma dengenizi geri kazandırır.',
      'Orta Düzey Rol Tükenmişliği (2/4). Kronik talepler günlük toparlanma kapasitenizi aşıyor.',
      'Yüksek Sistemik Tükenmişlik (3/4). Tükenmişlik tüm yaşam alanlarınıza yayılıyor—Tükenmişlik Ayırıcı Aracını hemen açın.',
      'Şiddetli Tükenme ve Kesişim Bölgesi (4/4). Şimdi Stres vs Tükenmişlik Ayırıcı Aracını ve Stres Testini çalıştırın.'
    ],
    primaryBtn: 'İnteraktif Stres vs Tükenmişlik Ayırıcı Aracını Aç &rarr;',
    subBtn: '3 Dakikalık Otonom Stres Testini Çöz &rarr;'
  },
  hi: {
    badge: '30-सेकंड बर्नआउट बनाम डिप्रेशन डिफरेंशियल स्क्रीनर',
    heading: 'क्या आपकी थकान "बर्नआउट" है या गहरी भावनात्मक गिरावट?',
    sub: 'सही रिकवरी चुनने के लिए अपने वर्तमान लक्षणों को चिह्नित करें:',
    items: [
      '<strong>परिस्थिति से जुड़ी थकान:</strong> काम या ज़िम्मेदारियों के विचार से भारीपन बढ़ता है, लेकिन दबाव हटने पर थोड़ी राहत मिलती है।',
      '<strong>"करने की इच्छा है, पर बैटरी 0% है":</strong> शौक या लक्ष्यों की चाहत बाकी है, लेकिन शरीर और दिमाग में ऊर्जा बिल्कुल नहीं है।',
      '<strong>चिड़चिड़ापन और भावनात्मक दूरी:</strong> नई मांगों या ज़िम्मेदारियों के प्रति मन में रूखापन और झुंझलाहट महसूस होना।',
      '<strong>नींद के बाद भी थकान और सुबह का डर:</strong> सोने के बाद भी ताज़गी महसूस न होना और सुबह उठते ही दिन के कामों से डर लगना।'
    ],
    scoreUnit: '/ 4 बर्नआउट डिफरेंशियल संकेत सक्रिय',
    verdicts: [
      'अपनी थकान की प्रकृति को समझने के लिए ऊपर दिए गए विकल्प चुनें।',
      'तीव्र तनाव थकान (1/4)। थोड़ा आराम और स्पष्ट सीमाएं आपकी ऊर्जा लौटा देंगी।',
      'मध्यम बर्नआउट (2/4)। रोज़मर्रा का दबाव आपकी रिकवरी क्षमता से अधिक हो रहा है।',
      'उच्च सिस्टमेटिक बर्नआउट (3/4)। थकान आपके पूरे जीवन को प्रभावित कर रही है—अभी बर्नआउट डिफरेंशियल टूल खोलें।',
      'गंभीर ऊर्जा क्षरण (4/4)। तुरंत स्ट्रेस बनाम बर्नआउट डिफरेंशियल टूल और स्ट्रेस चेक का उपयोग करें।'
    ],
    primaryBtn: 'स्ट्रेस बनाम बर्नआउट डिफरेंशियल टूल खोलें &rarr;',
    subBtn: '3-मिनट का मुफ्त स्ट्रेस चेक शुरू करें &rarr;'
  }
};

const SOMATIC_ANXIETY_LOCALES = {
  en: {
    badge: '30-SECOND SOMATIC ANXIETY & VAGAL TENSION SCREENER',
    heading: 'Is Your Anxiety Living Inside Your Body?',
    sub: 'Check the physical autonomic symptoms you experience even when medical tests are normal:',
    items: [
      '<strong>Visceral Chest, Throat, or Gut Alarms:</strong> Tight chest, lump in the throat, nausea, or stomach churning during stress or quiet moments.',
      '<strong>Unconscious Muscular Armor:</strong> Your jaw is clenched, shoulders are raised, or breath is shallow without you realizing you\'re bracing.',
      '<strong>Body Fires Before Worry Starts:</strong> Physical symptoms (racing heart, dizziness, heat wave) appear first, and anxious thoughts follow.',
      '<strong>Slow Sympathetic Come-Down:</strong> Once your body gets physically keyed up, it stays tense and wired for hours.'
    ],
    scoreUnit: 'of 4 somatic anxiety signals active',
    verdicts: [
      'Check the physical signals above to assess how strongly anxiety is expressing through your body.',
      'Mild Somatic Tension (1/4). Extended-exhale breathing and shoulder drops will quickly release stored tension.',
      'Moderate Somatic Anxiety (2/4). Your autonomic nervous system is channeling stress directly into muscle and gut pathways.',
      'High Sympathetic Body Activation (3/4). Thinking harder won\'t calm a body alarm—use bottom-up somatic grounding first.',
      'Severe Somatic Overload (4/4). Your nervous system is physically braced for threat—take the Stress Check and start a 5-4-3-2-1 grounding reset now.'
    ],
    primaryBtn: 'Check Your Somatic &amp; Autonomic Stress Load &rarr;',
    subBtn: 'Calm Physical Symptoms with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 신체화 불안(Somatic Anxiety) & 자율신경 긴장 판별기',
    heading: '병원 검사에선 정상인데 몸이 아픈 이유, "신체화 불안"일까?',
    sub: '스트레스가 생각이 아닌 신체 증상으로 나타나는 자율신경 신호를 체크해보세요:',
    items: [
      '<strong>가슴·목·위장의 내장성 경보:</strong> 가슴 답답함, 목 이물감(매핵기), 메스꺼움, 위장 경련이 이유 없이 반복됩니다.',
      '<strong>무의식적 근육 갑옷 (항시 긴장):</strong> 의식하지 못한 사이에 어금니를 꽉 깨물고 있거나 어깨가 귀까지 올라가 있고 호흡이 얕습니다.',
      '<strong>생각보다 먼저 반응하는 신체 증상:</strong> 걱정스러운 생각이 들기도 전에 심장 두근거림, 어지러움, 식은땀 같은 신체 반응이 먼저 터집니다.',
      '<strong>느린 아드레날린 진정 속도:</strong> 한 번 몸이 긴장하거나 놀라면 몇 시간이 지나도 근육 피로와 각성이 쉽게 가라앉지 않습니다.'
    ],
    scoreUnit: '개 신체화 불안(Somatic Anxiety) 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 불안과 스트레스가 신체에 얼마나 축적되어 있는지 확인해보세요.',
      '경미한 신체 긴장(1/4). 긴 날숨 호흡과 어깨 이완만으로도 미주신경 톤을 빠르게 회복할 수 있습니다.',
      '중등도 신체화 불안(2/4). 자율신경계가 정서적 압박을 위장과 근육 긴장으로 배출하고 있습니다.',
      '높은 교감신경 신체 과각성(3/4). 머리로 안심시키려 하기보다 신체 감각부터 진정시키는 상향식(Bottom-up) 조절이 필요합니다.',
      '심각한 신체화 과부하 상태(4/4). 몸 전체가 상시 비상벨을 울리고 있습니다. 지금 스트레스 체크와 5-4-3-2-1 오감 그라운딩을 시작하세요.'
    ],
    primaryBtn: '무료 신체화 스트레스 &amp; 자율신경 체크하기 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 신체 긴장 풀기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN SOMATISCHER ANGST- & KÖRPER-CHECK',
    heading: 'Sitzt Ihre Angst direkt in Ihrem Körper (Somatische Angst)?',
    sub: 'Wählen Sie die körperlichen Stresssignale aus, die trotz normaler Arztbefunde auftreten:',
    items: [
      '<strong>Enge in Brust, Hals oder Magen:</strong> Brustdruck, Kloß im Hals, Übelkeit oder Magenkrämpfe bei Stress oder sogar in Ruhe.',
      '<strong>Unbewusster Muskelpanzer:</strong> Zusammengebissene Zähne, hochgezogene Schultern oder flache Brustatmung im Alltag.',
      '<strong>Körperalarm vor dem Gedanken:</strong> Herzklopfen, Schwindel oder Hitzewellen treten auf, noch bevor Sie bewusst grübeln.',
      '<strong>Langsamer Adrenalin-Abbau:</strong> Wenn Ihr Körper einmal in Alarmbereitschaft ist, hält die Anspannung über Stunden an.'
    ],
    scoreUnit: 'von 4 somatischen Angstsignalen aktiv',
    verdicts: [
      'Wählen Sie die Körpersignale oben aus, um Ihre somatische Stressaktivierung zu prüfen.',
      'Leichte Körperspannung (1/4). Verlängertes Ausatmen löst die muskuläre Spannung rasch.',
      'Mittlere somatische Angst (2/4). Ihr Nervensystem leitet Stress direkt in Muskulatur und Verdauung.',
      'Hohe körperliche Übererregung (3/4). Beruhigen Sie zuerst den Körper über somatische Erdung statt über Grübeln.',
      'Schwere somatische Überlastung (4/4). Prüfen Sie jetzt Ihr Stressprofil und starten Sie die 5-4-3-2-1 Grounding-Übung.'
    ],
    primaryBtn: 'Zum 3-Minuten Stress- &amp; Körper-Check &rarr;',
    subBtn: 'Körpersymptome mit 5-4-3-2-1 Grounding beruhigen &rarr;'
  },
  es: {
    badge: 'TRIAJE DE ANSIEDAD SOMÁTICA Y TENSIÓN CORPORAL EN 30S',
    heading: '¿Tu ansiedad vive dentro de tu cuerpo (Ansiedad Somática)?',
    sub: 'Marca los síntomas físicos autonómicos que sientes aunque tus análisis médicos salgan bien:',
    items: [
      '<strong>Alarmas en pecho, garganta o estómago:</strong> Opresión en el pecho, nudo en la garganta, náuseas o tensión digestiva recurrente.',
      '<strong>Armadura muscular inconsciente:</strong> Mandíbula apretada, hombros levantados o respiración superficial sin darte cuenta.',
      '<strong>El cuerpo dispara antes que la mente:</strong> Taquicardia, mareo o calor repentino aparecen antes de cualquier pensamiento ansioso.',
      '<strong>Bajada lenta de adrenalina:</strong> Una vez que tu cuerpo entra en tensión, tarda horas en volver a relajarse.'
    ],
    scoreUnit: 'de 4 señales de ansiedad somática activas',
    verdicts: [
      'Marca las señales físicas arriba para evaluar cómo se expresa la ansiedad en tu cuerpo.',
      'Tensión somática leve (1/4). La respiración con exhalación larga liberará la tensión acumulada.',
      'Ansiedad somática moderada (2/4). Tu sistema nervioso descarga el estrés en músculos y sistema digestivo.',
      'Alta activación física simpática (3/4). Calma primero el cuerpo con anclaje sensorial antes de intentar razonar.',
      'Sobrecarga somática severa (4/4). Tu cuerpo vive en defensa constante—haz el Chequeo de Estrés y usa el Anclaje 5-4-3-2-1 ahora.'
    ],
    primaryBtn: 'Hacer el Chequeo de Estrés Somático &rarr;',
    subBtn: 'Calmar Síntomas Físicos con Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'TRIAGE ANXIÉTÉ SOMATIQUE & TENSIONS CORPORELLES EN 30S',
    heading: 'Votre anxiété s\'exprime-t-elle à travers votre corps ?',
    sub: 'Cochez les symptômes physiques ressentis même lorsque vos examens médicaux sont normaux :',
    items: [
      '<strong>Alarmes thoraciques ou digestives :</strong> Oppression dans la poitrine, boule dans la gorge, nausées ou ventre noué.',
      '<strong>Cuirasse musculaire inconsciente :</strong> Mâchoires serrées, épaules crispées ou respiration courte tout au long de la journée.',
      '<strong>Le corps réagit avant la pensée :</strong> Palpitations, vertiges ou bouffées de chaleur surgissent avant même toute inquiétude consciente.',
      '<strong>Retour au calme très lent :</strong> Une fois sous tension, votre corps met des heures à relâcher l\'adrénaline.'
    ],
    scoreUnit: 'sur 4 signaux d\'anxiété somatique actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer l\'impact somatique de votre stress.',
      'Tension corporelle légère (1/4). Quelques expirations longues suffisent à relâcher le nerf vague.',
      'Anxiété somatique modérée (2/4). Votre système nerveux traduit le stress en tensions physiques.',
      'Forte hyperactivité somatique (3/4). Apaisez d\'abord le corps par les sens avant d\'analyser vos pensées.',
      'Surcharge somatique sévère (4/4). Faites le Bilan de Stress et lancez immédiatement l\'exercice d\'Ancrage 5-4-3-2-1.'
    ],
    primaryBtn: 'Faire le Bilan de Stress &amp; Tension Corporelle &rarr;',
    subBtn: 'Apaiser le Corps avec l\'Outil d\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・身体化不安（ソマティック・アングザエティ）チェック',
    heading: '検査では異常なしなのに続く不調、「身体化された不安」かも？',
    sub: 'ストレスが思考ではなく「身体症状」として現れるサインをチェックしてください：',
    items: [
      '<strong>胸・喉・胃腸の身体アラーム：</strong> 胸の圧迫感、喉の詰まり（ヒステリー球）、吐き気、胃腸の不調が繰り返される。',
      '<strong>無意識の筋肉の鎧（こわばり）：</strong> 気づくと奥歯を噛み締めていたり、肩が上がっていたり、呼吸が浅くなっている。',
      '<strong>思考より先に起きる身体症状：</strong> 不安なことを考えるより先に、動悸・めまい・冷や汗などの身体反応が突然出る。',
      '<strong>抜けない交感神経の緊張：</strong> 一度体が緊張モードに入ると、何時間経っても力が抜けず疲れ果ててしまう。'
    ],
    scoreUnit: '/ 4 個の身体化不安サインが該当',
    verdicts: [
      '上の項目をチェックして、自律神経の緊張がどれだけ身体に蓄積しているか確認しましょう。',
      '軽度の身体緊張（1/4）。長い呼気の深呼吸と肩の脱力で迷走神経を整えられます。',
      '中程度の身体化不安（2/4）。言葉にできないストレスが筋肉や胃腸のサインとして表れています。',
      '高い交感神経の身体反応（3/4）。頭で考え込むより先に、五感を使ったボトムアップの鎮静が必要です。',
      '深刻な身体化オーバーロード（4/4）。体が常に戦闘態勢にあります。今すぐストレス診断と5-4-3-2-1感覚グラウンディングを行ってください。'
    ],
    primaryBtn: '3分間の無料ストレス＆自律神経負荷チェック &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで身体を緩める &rarr;'
  },
  zh: {
    badge: '30秒躯体化焦虑（Somatic Anxiety）与迷走神经筛查',
    heading: '体检一切正常却浑身难受，你的焦虑正藏在身体里吗？',
    sub: '勾选你在日常生活中频繁出现的自主神经躯体化信号：',
    items: [
      '<strong>胸口、咽喉与肠胃警报：</strong> 胸闷气短、喉咙异物感（梅核气）、恶心或肠胃痉挛反复出现。',
      '<strong>无意识的肌肉盔甲（紧绷）：</strong> 经常在不知不觉中咬紧牙关、耸肩、眉头紧锁，且呼吸浅促。',
      '<strong>身体比大脑先一步拉响警报：</strong> 还没意识到自己在担心什么，心悸、头晕、手抖或燥热感就已经先袭来。',
      '<strong>肾上腺素消退极慢：</strong> 一旦身体进入紧绷应激状态，往往需要好几个小时才能慢慢松弛下来。'
    ],
    scoreUnit: '/ 4 项躯体化焦虑信号激活',
    verdicts: [
      '勾选上方身体信号，评估焦虑与压力在躯体层面的沉积程度。',
      '轻度躯体紧绷 (1/4)。练习长呼气与沉肩放松即可快速激活迷走神经。',
      '中度躯体化焦虑 (2/4)。你的自主神经系统正在将心理压力转化为肌肉与肠胃张力。',
      '高度交感神经躯体激活 (3/4)。光靠讲道理无法平息身体警报，请优先使用自下而上的感官着陆法。',
      '重度躯体化超载状态 (4/4)。你的身体长期处于戒备状态，建议立即检测压力负荷并进行 5-4-3-2-1 感官放松。'
    ],
    primaryBtn: '开始3分钟免费躯体与神经压力测试 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆工具舒缓躯体症状 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE ANSIEDADE SOMÁTICA E CORPO EM 30 SEGUNDOS',
    heading: 'Sua ansiedade está morando no seu corpo (Ansiedade Somática)?',
    sub: 'Marque os sintomas físicos autonômicos que você sente mesmo com exames normais:',
    items: [
      '<strong>Alarmes no peito, garganta ou estômago:</strong> Aperto no peito, nó na garganta, náusea ou desconforto gástrico frequente.',
      '<strong>Armadura muscular inconsciente:</strong> Mandíbula travada, ombros tensos ou respiração curta sem perceber.',
      '<strong>O corpo dispara antes do pensamento:</strong> Coração acelerado, tontura ou ondas de calor surgem antes da preocupação consciente.',
      '<strong>Descida lenta de adrenalina:</strong> Quando seu corpo entra em alerta, leva horas para conseguir relaxar de verdade.'
    ],
    scoreUnit: 'de 4 sinais de ansiedade somática ativos',
    verdicts: [
      'Marque os sinais físicos acima para avaliar como o estresse atua no seu corpo.',
      'Tensão somática leve (1/4). Exalações longas e relaxamento muscular aliviam rapidamente.',
      'Ansiedade somática moderada (2/4). Seu sistema nervoso está descarregando tensão nos músculos e estômago.',
      'Alta ativação física simpática (3/4). Acalme primeiro o corpo pelos sentidos antes de tentar racionalizar.',
      'Sobrecarga somática severa (4/4). Faça o Check-up de Estresse e inicie o Grounding 5-4-3-2-1 para relaxar o corpo agora.'
    ],
    primaryBtn: 'Fazer o Check-up de Estresse Somático &rarr;',
    subBtn: 'Acalmar Sintomas Físicos com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА СОМАТИЧЕСКУЮ ТРЕВОГУ В ТЕЛЕ',
    heading: 'Живет ли ваша тревога внутри тела (соматическая тревога)?',
    sub: 'Отметьте телесные симптомы, которые возникают даже при нормальных медицинских анализах:',
    items: [
      '<strong>Спазмы в груди, горле или животе:</strong> Сдавленность в груди, ком в горле, тошнота или «крутит живот» от малейшего стресса.',
      '<strong>Неосознанный мышечный панцирь:</strong> Сжатые челюсти, поднятые плечи и поверхностное дыхание даже в покое.',
      '<strong>Тело реагирует раньше мыслей:</strong> Тахикардия, головокружение или жар накатывают прежде, чем вы успеваете подумать о проблеме.',
      '<strong>Долгий выход из напряжения:</strong> Если тело включило тревогу, мышечный спазм не отпускает часами.'
    ],
    scoreUnit: 'из 4 признаков соматической тревоги активно',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить уровень телесного напряжения.',
      'Легкое мышечное напряжение (1/4). Удлиненный выдох быстро вернет тонус блуждающему нерву.',
      'Умеренная соматическая тревога (2/4). Нервная система переводит скрытый стресс в спазмы мышц и ЖКТ.',
      'Высокая телесная гиперактивация (3/4). Сначала успокойте тело через органы чувств, а не уговорами разума.',
      'Сильная соматическая перегрузка (4/4). Пройдите проверку уровня стресса и выполните телесное заземление 5-4-3-2-1.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на уровень стресса &rarr;',
    subBtn: 'Снять телесные симптомы практикой 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING KECEMASAN SOMATIK (GEJALA FISIK) 30 DETIK',
    heading: 'Apakah Kecemasan Anda Bersarang di Dalam Tubuh?',
    sub: 'Centang gejala fisik sistem saraf yang sering muncul meski hasil medis Anda normal:',
    items: [
      '<strong>Alarm di Dada, Tenggorokan, atau Lambung:</strong> Dada sesak, tenggorokan mengganjal, mual, atau perut melilit saat stres.',
      '<strong>Ketegangan Otot Tanpa Sadar:</strong> Rahang mengatup rapat, bahu terangkat, atau napas pendek tanpa Anda sadari.',
      '<strong>Tubuh Bereaksi Sebelum Pikiran:</strong> Jantung berdebar, pusing, atau keringat dingin muncul lebih dulu sebelum pikiran cemas.',
      '<strong>Ketegangan Fisik Sulit Mereda:</strong> Begitu tubuh tegang, butuh waktu berjam-jam agar otot kembali rileks.'
    ],
    scoreUnit: 'dari 4 sinyal kecemasan somatik aktif',
    verdicts: [
      'Centang gejala fisik di atas untuk melihat seberapa kuat kecemasan bekerja di tubuh Anda.',
      'Ketegangan Somatik Ringan (1/4). Napas hembusan panjang akan cepat melemaskan saraf vagus Anda.',
      'Kecemasan Somatik Sedang (2/4). Sistem saraf Anda menyalurkan stres langsung ke otot dan pencernaan.',
      'Aktivasi Fisik Simpatis Tinggi (3/4). Tenangkan tubuh lewat panca indera lebih dulu sebelum berpikir keras.',
      'Overload Somatik Berat (4/4). Ikuti Cek Stres dan gunakan Grounding 5-4-3-2-1 untuk merilekskan tubuh sekarang.'
    ],
    primaryBtn: 'Ikuti Cek Beban Stres &amp; Saraf (3 Menit) &rarr;',
    subBtn: 'Redakan Gejala Fisik dengan Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK SOMATİK (BEDENSEL) KAYGI TARAMASI',
    heading: 'Kaygınız Bedeninizin İçinde mi Yaşıyor (Somatik Kaygı)?',
    sub: 'Tıbbiผล testleriniz normal çıksa bile yaşadığınız fiziksel otonom belirtileri işaretleyin:',
    items: [
      '<strong>Göğüs, Boğaz veya Mide Alarmları:</strong> Göğüs sıkışması, boğazda düğümlenme, mide bulantısı veya kramp.',
      '<strong>Bilinçsiz Kas Zırhı:</strong> Farkında olmadan diş sıkma, omuzları kaldırma veya sığ nefes alma.',
      '<strong>Düşünceden Önce Ateşlenen Beden:</strong> Endişeli düşünceler başlamadan önce çarpıntı, baş dönmesi veya ateş basması.',
      '<strong>Yavaş Adrenalin Düşüşü:</strong> Bedeniniz bir kez gerildiğinde saatlerce gevşeyemiyor.'
    ],
    scoreUnit: '/ 4 somatik kaygı sinyali aktif',
    verdicts: [
      'Kaygının bedeninizde ne kadar yoğunlaştığını görmek için yukarıdakileri işaretleyin.',
      'Hafif Bedensel Gerginlik (1/4). Uzun nefes verme egzersizleri vagus sinirinizi hızla rahatlatacaktır.',
      'Orta Düzey Somatik Kaygı (2/4). Sinir sisteminiz stresi doğrudan kaslara ve sindirim sistemine yönlendiriyor.',
      'Yüksek Fiziksel Sempatik Aktivasyon (3/4). Zihinsel analizden önce bedensel topraklama ile alarmı kapatın.',
      'Şiddetli Somatik Aşırı Yük (4/4). Şimdi Stres Testini çözün ve 5-4-3-2-1 topraklama ile bedeninizi yatıştırın.'
    ],
    primaryBtn: '3 Dakikalık Somatik Stres Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklama ile Bedeni Rahatlat &rarr;'
  },
  hi: {
    badge: '30-सेकंड सोमैटिक एंग्जायटी (शारीरिक चिंता) स्क्रीनर',
    heading: 'क्या आपकी चिंता आपके शरीर में बस गई है (Somatic Anxiety)?',
    sub: 'मेडिकल रिपोर्ट सामान्य होने पर भी महसूस होने वाले शारीरिक लक्षणों को चुनें:',
    items: [
      '<strong>सीने, गले या पेट में अलार्म:</strong> सीने में जकड़न, गले में गांठ जैसा लगना, मतली या पेट में मरोड़ उठना।',
      '<strong>अनजाने में मांसपेशियों का कड़ापन:</strong> बिना ध्यान दिए जबड़े भींचे रहना, कंधे उठे रहना या उथली सांस लेना।',
      '<strong>विचार से पहले शरीर की प्रतिक्रिया:</strong> चिंताजनक विचार आने से पहले ही दिल की धड़कन बढ़ना, चक्कर आना या पसीना छूटना।',
      '<strong>तनाव का देर से उतरना:</strong> एक बार शरीर में तनाव आ जाए, तो शांत होने में कई घंटे लग जाते हैं।'
    ],
    scoreUnit: '/ 4 सोमैटिक एंग्जायटी संकेत सक्रिय',
    verdicts: [
      'आपके शरीर में जमा तनाव को मापने के लिए ऊपर दिए गए विकल्प चुनें।',
      'हल्का शारीरिक तनाव (1/4)। लंबी सांस छोड़ने का अभ्यास मांसपेशियों को तुरंत आराम देगा।',
      'मध्यम सोमैटिक एंग्जायटी (2/4)। आपका नर्वस सिस्टम तनाव को सीधे मांसपेशियों और पेट पर भेज रहा है।',
      'उच्च शारीरिक सक्रियता (3/4)। ज़्यादा सोचने के बजाय पहले इंद्रियों की ग्राउंडिंग से शरीर को शांत करें।',
      'गंभीर सोमैटिक ओवरलोड (4/4)। अभी स्ट्रेस चेक लें और 5-4-3-2-1 ग्राउंडिंग से शारीरिक लक्षणों को शांत करें।'
    ],
    primaryBtn: '3-मिनट का मुफ्त सोमैटिक स्ट्रेस चेक लें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग से शारीरिक तनाव कम करें &rarr;'
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

  // 1. functional-freeze-signs-recovery.html (12 locales)
  for (const [lang, loc] of Object.entries(FUNCTIONAL_FREEZE_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'functional-freeze-signs-recovery.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'functionalFreezeScreener',
      chkClass: 'ffreeze-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=functional_freeze_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=functional_freeze_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/functional-freeze-signs-recovery.html`);
    console.log(`[PASS] functional-freeze-signs-recovery (${lang})`);
  }

  // 2. emotional-burnout-vs-depression.html (12 locales)
  for (const [lang, loc] of Object.entries(BURNOUT_VS_DEP_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-burnout-vs-depression.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'burnoutVsDepressionScreener',
      chkClass: 'bvsd-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}&source=burnout_vs_dep_screener`,
      primaryTargetSlug: 'burnout-stress-differential',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/?lang=${lang}&source=burnout_vs_dep_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-burnout-vs-depression.html`);
    console.log(`[PASS] emotional-burnout-vs-depression (${lang})`);
  }

  // 3. somatic-anxiety-body-symptoms.html (12 locales)
  for (const [lang, loc] of Object.entries(SOMATIC_ANXIETY_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'somatic-anxiety-body-symptoms.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'somaticAnxietyScreener',
      chkClass: 'somat-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=somatic_anxiety_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=somatic_anxiety_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/somatic-anxiety-body-symptoms.html`);
    console.log(`[PASS] somatic-anxiety-body-symptoms (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 4: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

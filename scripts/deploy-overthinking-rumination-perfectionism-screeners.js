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

const NIGHTTIME_OVERTHINKING_LOCALES = {
  en: {
    badge: '30-SECOND NOCTURNAL OVERTHINKING & HYPERAROUSAL SCREENER',
    heading: 'Why Does Your Brain Race the Moment Your Head Hits the Pillow?',
    sub: 'Check the bedtime cognitive arousal patterns keeping your nervous system awake:',
    items: [
      '<strong>"Tired But Wired" Flip:</strong> You feel exhausted all evening, yet the instant the lights go out your mind switches into high-speed alertness.',
      '<strong>Social Replay Reel:</strong> Your brain involuntarily audits awkward conversations, minor mistakes, or things you said years ago.',
      '<strong>Tomorrow’s Catastrophe Simulation:</strong> You pre-rehearse worst-case scenarios for tomorrow’s tasks, emails, or alarms.',
      '<strong>Clock-Watching Sleep Panic:</strong> You calculate how few hours of sleep remain if you fall asleep right now, spiking nighttime cortisol.'
    ],
    scoreUnit: 'of 4 nocturnal hyperarousal signals active',
    verdicts: [
      'Check the items above to see what is fueling your nighttime overthinking loop.',
      'Mild Bedtime Unwinding Delay (1/4). A brief brain dump before bed can clear residual mental tabs.',
      'Moderate Default Mode Network Surge (2/4). When external stimuli drop at night, unprocessed daytime stress surfaces.',
      'High Nocturnal Sympathetic Arousal (3/4). Your nervous system treats quiet darkness as a window to scan for unfinished threats.',
      'Severe Bedtime Hyperarousal Loop (4/4). Your body is flooded with evening cortisol—run the Stress Check or start the Bedtime Sensory Reset now.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Overthinking Check &rarr;',
    subBtn: 'Start Interactive Bedtime Sensory Reset Now &rarr;'
  },
  ko: {
    badge: '30초 야간 과잉사고(Nighttime Overthinking) 및 각성 판별기',
    heading: '왜 베개에 머리만 대면 뇌가 풀가동될까요?',
    sub: '밤마다 잠들지 못하게 만드는 야간 인지 과각성 신호를 체크해보세요:',
    items: [
      '<strong>"몸은 녹초인데 정신만 말똥말똥" 현상:</strong> 저녁 내내 피곤하다가도 불을 끄고 눕는 순간 뇌가 초고속 각성 상태로 전환됩니다.',
      '<strong>낮의 대화·실수 강제 리플레이:</strong> 오늘 했던 말실수나 어색했던 장면, 심지어 몇 년 전 흑역사까지 자동으로 재생됩니다.',
      '<strong>내일의 최악 시나리오 시뮬레이션:</strong> 내일 해야 할 일, 답장하지 못한 연락, 일어날지도 모를 문제를 미리 걱정하며 예행연습합니다.',
      '<strong>남은 수면 시간 계산 불안:</strong> 시계를 보며 "지금 자도 몇 시간밖에 못 자네"라고 계산할수록 심장이 뛰고 잠이 더 달아납니다.'
    ],
    scoreUnit: '개 야간 인지 과각성 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 밤마다 뇌가 멈추지 않는 원인을 확인해보세요.',
      '가벼운 취침 전 잔여 생각(1/4). 잠들기 전 간단한 메모로 머릿속 탭을 닫아줄 수 있는 수준입니다.',
      '중등도 디폴트 모드 네트워크(DMN) 과활성(2/4). 밤에 외부 자극이 사라지자 낮 동안 억눌렀던 스트레스가 떠오르고 있습니다.',
      '높은 야간 교감신경 각성(3/4). 뇌가 조용한 밤 시간을 위기 점검 시간으로 착각하여 경보를 울리고 있습니다.',
      '심각한 야간 과잉사고·코르티솔 루프(4/4). 지금 신경계 과각성 점수를 확인하고 취침 전 감각 리셋으로 뇌를 진정시키세요.'
    ],
    primaryBtn: '3분 스트레스 및 과잉사고 정밀 진단 시작 &rarr;',
    subBtn: '취침 전 60초 감각 리셋(Sensory Reset) 바로 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN NÄCHTLICHES GRÜBELN & HYPERAROUSAL-CHECK',
    heading: 'Warum rast Ihr Gehirn, sobald Ihr Kopf das Kissen berührt?',
    sub: 'Wählen Sie die nächtlichen Denkmuster aus, die Ihr Nervensystem wachhalten:',
    items: [
      '<strong>„Todmüde, aber hellwach“:</strong> Sie sind den ganzen Abend erschöpft, doch sobald das Licht ausgeht, schaltet Ihr Kopf auf Hochtouren.',
      '<strong>Soziale Endlosschleife:</strong> Ihr Gehirn spielt vergangene Gespräche, kleine Fehler oder peinliche Momente immer wieder ab.',
      '<strong>Katastrophen-Simulation für morgen:</strong> Sie proben im Bett bereits mögliche Probleme und Aufgaben des nächsten Tages.',
      '<strong>Uhrzeit-Panik:</strong> Sie rechnen ständig aus, wie wenige Stunden Schlaf Ihnen noch bleiben, was neues Cortisol ausschüttet.'
    ],
    scoreUnit: 'von 4 nächtlichen Hyperarousal-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre nächtliche Grübelschleife zu prüfen.',
      'Leichte Einschlafverzögerung (1/4). Ein kurzes Aufschreiben vor dem Schlafen hilft beim Abschalten.',
      'Moderater DMN-Anstieg (2/4). Sobald äußere Reize wegfallen, drängt unverarbeiteter Tagesstress nach oben.',
      'Hohe nächtliche Sympathikus-Aktivierung (3/4). Ihr Gehirn nutzt die Stille zur Bedrohungsanalyse.',
      'Chronische nächtliche Übererregung (4/4). Prüfen Sie jetzt Ihren Stresswert oder starten Sie den abendlichen Sensory Reset.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Grübel-Check starten &rarr;',
    subBtn: 'Abendlichen Sensory Reset zur Beruhigung öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE PENSAMIENTO EXCESIVO NOCTURNO EN 30 SEGUNDOS',
    heading: '¿Por qué tu mente se acelera en cuanto apoyas la cabeza en la almohada?',
    sub: 'Marca los patrones de hiperactivación nocturna que mantienen despierto a tu cerebro:',
    items: [
      '<strong>«Agotado pero hiperalerta»:</strong> Te sientes exhausto toda la noche, pero al apagar la luz tu mente se enciende a máxima velocidad.',
      '<strong>Repetición de escenas sociales:</strong> Tu cerebro revisa involuntariamente conversaciones incómodas o errores del pasado.',
      '<strong>Simulación de catástrofes para mañana:</strong> Ensayas mentalmente los peores escenarios para las tareas del día siguiente.',
      '<strong>Ansiedad al mirar el reloj:</strong> Calculas cuántas horas de sueño te quedan si te duermes ya, disparando el cortisol nocturno.'
    ],
    scoreUnit: 'de 4 señales de hiperactivación nocturna activas',
    verdicts: [
      'Marca las señales arriba para descubrir qué alimenta tu bucle mental nocturno.',
      'Retraso leve de desconexión (1/4). Vaciar tus pendientes en papel antes de dormir ayudará.',
      'Activación moderada de la red por defecto (2/4). Al apagarse los estímulos externos, emerge el estrés acumulado.',
      'Alta activación simpática nocturna (3/4). Tu sistema nervioso interpreta el silencio como momento de vigilancia.',
      'Bucle severo de hiperalerta nocturna (4/4). Evalúa tu nivel de estrés ahora o inicia el reinicio sensorial nocturno.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Pensamiento Excesivo &rarr;',
    subBtn: 'Iniciar Reinicio Sensorial Nocturno Ahora &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE RUMINATION NOCTURNE EN 30 SECONDES',
    heading: 'Pourquoi votre cerveau s’emballe-t-il dès que vous vous couchez ?',
    sub: 'Cochez les signaux d’hyperéveil cognitif qui bloquent votre endormissement :',
    items: [
      '<strong>« Épuisé mais survolté » :</strong> Vous êtes fatigué toute la soirée, mais votre esprit passe en alerte maximale dès que la lumière s’éteint.',
      '<strong>Replay social involontaire :</strong> Votre cerveau repasse en boucle des discussions gênantes ou d’anciennes erreurs.',
      '<strong>Simulation des catastrophes de demain :</strong> Vous anticipez tous les problèmes possibles de la journée du lendemain.',
      '<strong>Panique du réveil :</strong> Vous calculez sans cesse le nombre d’heures de sommeil restantes, ce qui relance le cortisol.'
    ],
    scoreUnit: 'sur 4 signaux d’hyperéveil nocturne actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour identifier la source de vos pensées nocturnes.',
      'Léger délai d’apaisement (1/4). Noter vos pensées avant de dormir suffit à fermer vos onglets mentaux.',
      'Suractivation modérée du réseau par défaut (2/4). Le calme du soir fait remonter le stress non digéré.',
      'Hyperéveil sympathique nocturne élevé (3/4). Votre cerveau utilise le silence pour scanner les menaces.',
      'Boucle sévère d’insomnie cognitive (4/4). Testez votre charge de stress ou lancez la réinitialisation sensorielle du soir.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Rumination en 3 Minutes &rarr;',
    subBtn: 'Lancer la Réinitialisation Sensorielle du Soir &rarr;'
  },
  ja: {
    badge: '30秒 夜間の考えすぎ（オーバーシンキング）＆過覚醒チェック',
    heading: 'なぜ布団に入った瞬間に脳がフル回転し始めるのか？',
    sub: '夜の眠りを妨げる「脳の夜間過覚醒サイン」をチェックしてください：',
    items: [
      '<strong>「体はクタクタなのに頭だけ冴える」：</strong> 夜ずっと疲れていたのに、電気を消して横になった瞬間に脳が覚醒モードに切り替わる。',
      '<strong>過去の会話・失敗の自動リプレイ：</strong> 昼間の気まずい会話や小さなミス、何年も前の恥ずかしい記憶が勝手に再生される。',
      '<strong>明日の最悪シナリオの予行演習：</strong> 明日の仕事や予定、起きるかもしれないトラブルをベッドの中でシミュレーションしてしまう。',
      '<strong>時計を見て残り睡眠時間を計算する焦り：</strong> 「今寝てもあと◯時間しか寝られない」と計算し、さらに焦って目が冴える。'
    ],
    scoreUnit: '/ 4 個の夜間過覚醒サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、夜の思考ループの原因を確認しましょう。',
      '軽度のクールダウン遅延（1/4）。寝る前に紙へ書き出すだけで脳のタブを閉じられます。',
      '中程度のDMN（デフォルト・モード・ネットワーク）活性化（2/4）。夜の静けさで日中の未処理ストレスが浮上しています。',
      '高い夜間交感神経覚醒（3/4）。脳が静かな暗闇を「危険スキャンの時間」と誤認しています。',
      '深刻な夜間過覚醒ループ（4/4）。今すぐストレス＆思考ループ診断を行うか、就寝前の感覚リセットを始めましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆考えすぎ診断へ &rarr;',
    subBtn: '就寝前の感覚リセット（Sensory Reset）を開く &rarr;'
  },
  zh: {
    badge: '30秒 夜间过度思考与大脑高唤醒筛查',
    heading: '为什么头一沾枕头，大脑就开始疯狂运转？',
    sub: '勾选在关灯躺下后让你的神经系统无法入睡的认知唤醒信号：',
    items: [
      '<strong>“身体累透但大脑亢奋”：</strong> 整个晚上都觉得疲惫不堪，可一关灯躺下，大脑却瞬间切换到高速运转模式。',
      '<strong>社交画面强制回放：</strong> 大脑不由自主地反复回放白天的尴尬对话、小失误，甚至是几年前的糗事。',
      '<strong>预演明天的最坏情况：</strong> 在床上提前预演明天的工作、消息回复或可能出错的各种危机。',
      '<strong>看表计算剩余睡眠时间的恐慌：</strong> 不断计算“如果现在睡着还能睡几个小时”，导致夜间皮质醇飙升。'
    ],
    scoreUnit: '/ 4 个夜间认知高唤醒信号已激活',
    verdicts: [
      '勾选上方信号，查看是什么在驱动你的夜间过度思考循环。',
      '轻度睡前缓冲延迟（1/4）。睡前把待办事项写在纸上即可关闭大脑后台标签。',
      '中度默认模式网络（DMN）活跃（2/4）。当夜间外界刺激消失，白天未消化的压力开始浮出水面。',
      '高度夜间交感神经唤醒（3/4）。你的神经系统把安静的黑夜当成了排查威胁的窗口。',
      '重度睡前高唤醒循环（4/4）。请立即检测你的压力负荷，或开启睡前感官重置练习。'
    ],
    primaryBtn: '开始 3 分钟压力与过度思考测试 &rarr;',
    subBtn: '立即开启睡前 60 秒感官重置练习 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE PENSAMENTO EXCESSIVO NOTURNO EM 30 SEGUNDOS',
    heading: 'Por que seu cérebro acelera assim que você deita no travesseiro?',
    sub: 'Marque os padrões de hiperativação cognitiva que impedem seu sono:',
    items: [
      '<strong>"Exausto, mas ligado no 220V":</strong> Você sente cansaço a noite toda, mas ao apagar a luz sua mente entra em alerta máximo.',
      '<strong>Replay de interações sociais:</strong> Seu cérebro revisa involuntariamente conversas estranhas, pequenos erros ou memórias antigas.',
      '<strong>Simulação de problemas de amanhã:</strong> Você ensaia na cama os piores cenários para as tarefas do dia seguinte.',
      '<strong>Pânico do relógio:</strong> Você calcula quantas horas de sono restam se dormir agora, disparando o cortisol noturno.'
    ],
    scoreUnit: 'de 4 sinais de hiperativação noturna ativos',
    verdicts: [
      'Marque os itens acima para identificar o que alimenta sua ruminação noturna.',
      'Leve atraso de desaceleração (1/4). Anotar pendências antes de deitar ajuda a fechar abas mentais.',
      'Ativação moderada da rede padrão (2/4). Sem estímulos externos à noite, o estresse acumulado do dia emerge.',
      'Alta excitação simpática noturna (3/4). Seu sistema nervoso usa o silêncio para escanear ameaças.',
      'Ciclo severo de hiperalerta noturno (4/4). Faça o check-up de estresse agora ou inicie o Reset Sensorial de dormir.'
    ],
    primaryBtn: 'Fazer o Check-up de Estresse e Pensamento Excessivo &rarr;',
    subBtn: 'Iniciar Reset Sensorial para Dormir Agora &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА НОЧНУЮ НАКРУТКУ И ГИПЕРВОЗБУЖДЕНИЕ',
    heading: 'Почему мозг начинает работать на пределе, едва вы ложитесь в постель?',
    sub: 'Отметьте признаки ночного когнитивного возбуждения, мешающие уснуть:',
    items: [
      '<strong>«Устал, но мозг не выключается»:</strong> Весь вечер вы валились с ног, но в темноте голова мгновенно становится ясной и тревожной.',
      '<strong>Принудительный повтор разговоров:</strong> Мозг прокручивает неловкие фразы, мелкие ошибки или старые ситуации.',
      '<strong>Репетиция завтрашних катастроф:</strong> Вы заранее проигрываете худшие сценарии завтрашних дел и задач.',
      '<strong>Паника при взгляде на часы:</strong> Вы считаете, сколько часов сна осталось, если уснуть прямо сейчас, повышая уровень кортизола.'
    ],
    scoreUnit: 'из 4 признаков ночного гипервозбуждения активны',
    verdicts: [
      'Отметьте пункты выше, чтобы понять причину ночного потока мыслей.',
      'Легкая задержка торможения (1/4). Выпишите мысли на бумагу перед сном, чтобы закрыть фоновые вкладки.',
      'Умеренная активность сети пассивного режима (2/4). В тишине всплывает непереработанный дневной стресс.',
      'Высокое ночное симпатическое возбуждение (3/4). Мозг воспринимает тишину как время для поиска угроз.',
      'Тяжелый цикл ночного гипервозбуждения (4/4). Проверьте уровень стресса или запустите вечернюю сенсорную перезагрузку.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и накрутку &rarr;',
    subBtn: 'Запустить вечернюю сенсорную перезагрузку &rarr;'
  },
  id: {
    badge: 'SKRINING OVERTHINKING MALAM HARI 30 DETIK',
    heading: 'Mengapa Otak Justru Berputar Kencang Saat Kepala Menyentuh Bantal?',
    sub: 'Centang pola aktivasi pikiran malam hari yang membuat sistem saraf tetap terjaga:',
    items: [
      '<strong>"Tubuh Lelah tapi Pikiran Menyala":</strong> Anda mengantuk sepanjang malam, namun saat lampu mati pikiran langsung siaga penuh.',
      '<strong>Putaran Ulang Percakapan:</strong> Otak memutar ulang obrolan canggung, kesalahan kecil, atau kejadian bertahun-tahun lalu.',
      '<strong>Simulasi Masalah Besok:</strong> Anda membayangkan skenario terburuk untuk pekerjaan atau tugas esok hari di atas kasur.',
      '<strong>Panik Menghitung Jam Tidur:</strong> Anda terus melihat jam dan menghitung sisa waktu tidur, memicu lonjakan kortisol.'
    ],
    scoreUnit: 'dari 4 sinyal hiperarousal malam aktif',
    verdicts: [
      'Centang item di atas untuk melihat apa yang memicu overthinking malam Anda.',
      'Penundaan Relaksasi Ringan (1/4). Menulis catatan singkat sebelum tidur dapat menutup tab pikiran.',
      'Lonjakan Jaringan Mode Default Sedang (2/4). Saat suasana hening, stres siang hari yang belum selesai muncul.',
      'Aktivasi Saraf Simpatis Malam Tinggi (3/4). Otak menganggap keheningan malam sebagai waktu memindai ancaman.',
      'Siklus Hiperarousal Malam Berat (4/4). Cek tingkat stres Anda sekarang atau mulai Reset Sensorik sebelum tidur.'
    ],
    primaryBtn: 'Ikuti Tes Stres &amp; Overthinking 3 Menit &rarr;',
    subBtn: 'Mulai Reset Sensorik Pengantar Tidur Sekarang &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK GECE AŞIRI DÜŞÜNME TARAMASI',
    heading: 'Başınızı Yastığa Koyduğunuz Anda Beyniniz Neden Hızlanıyor?',
    sub: 'Sinir sisteminizi gece uyanık tutan bilişsel uyarılma sinyallerini işaretleyin:',
    items: [
      '<strong>"Çok Yorgun Ama Cin Gibi":</strong> Tüm akşam bitkin hissedip ışığı kapattığınız anda zihniniz tam الفاظıyla alarma geçiyor.',
      '<strong>Sosyal Tekrar Kaydı:</strong> Beyniniz gün içindeki garip diyalogları, küçük hataları veya yıllar önceki anıları tekrar oynatıyor.',
      '<strong>Yarının Felaket Simülasyonu:</strong> Ertesi günün görevleri ve olası sorunları için yatakta en kötü senaryoları prova ediyorsunuz.',
      '<strong>Saate Bakıp Uyku Hesabı Yapma:</strong> "Şimdi uyusam kaç saat kalıyor" diye hesaplayarak gece kortizolünü artırıyorsunuz.'
    ],
    scoreUnit: '/ 4 gece aşırı uyarılma sinyali aktif',
    verdicts: [
      'Gece düşünce döngünüzü neyin beslediğini görmek için yukarıdakileri işaretleyin.',
      'Hafif Gevşeme Gecikmesi (1/4). Uyumadan önce düşünceleri kağıda dökmek zihinsel sekmeleri kapatır.',
      'Orta Düzey DMN Artışı (2/4). Dış uyaranlar kesildiğinde günün işlenmemiş stresi yüzeye çıkıyor.',
      'Yüksek Gece Sempatik Uyarılması (3/4). Sinir sisteminiz gece sessizliğini tehdit tarama zamanı sanıyor.',
      'Şiddetli Gece Aşırı Uyarılma Döngüsü (4/4). Şimdi stres yükünüzü ölçün veya Uyku Öncesi Duyusal Sıfırlamayı başlatın.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Aşırı Düşünme Testini Başlat &rarr;',
    subBtn: 'Uyku Öncesi Duyusal Sıfırlama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड रात की ओवरथिंकिंग (Nighttime Overthinking) स्क्रीनर',
    heading: 'तकिए पर सिर रखते ही आपका दिमाग तेज़ी से क्यों दौड़ने लगता है?',
    sub: 'रात में आपकी नींद उड़ाने वाले इन मानसिक संकेतों को चुनें:',
    items: [
      '<strong>"शरीर थका हुआ लेकिन दिमाग पूरी तरह जागृत":</strong> पूरी शाम थकान रहने के बाद भी लाइट बंद करते ही दिमाग हाई-स्पीड मोड में चला जाता है।',
      '<strong>पुरानी बातों का रीप्ले:</strong> दिमाग अपने आप दिन की अजीब बातचीत, छोटी गलतियों या पुरानी यादों को बार-बार दोहराता है।',
      '<strong>कल की चिंताओं का रिहर्सल:</strong> कल के काम, ईमेल या संभावित समस्याओं के सबसे बुरे परिणामों की कल्पना करना।',
      '<strong>घड़ी देखकर नींद के घंटे गिनना:</strong> बार-बार यह गिनना कि "अगर अभी सोऊं तो कितने घंटे की नींद बचेगी", जिससे घबराहट और बढ़ती है।'
    ],
    scoreUnit: '/ 4 रात्रि ओवरथिंकिंग संकेत सक्रिय',
    verdicts: [
      'रात की ओवरथिंकिंग के कारण को समझने के लिए ऊपर दिए गए विकल्प चुनें।',
      'हल्की मानसिक थकान (1/4)। सोने से पहले विचारों को डायरी में लिखना दिमाग को शांत कर सकता है।',
      'मध्यम डिफ़ॉल्ट मोड नेटवर्क सक्रियण (2/4)। रात के सन्नाटे में दिन का अनसुलझा तनाव ऊपर आ रहा है।',
      'उच्च रात्रि नर्वस सिस्टम अलर्ट (3/4)। आपका मस्तिष्क शांत अंधेरे को खतरे ढूंढने का समय मान रहा है।',
      'गंभीर रात्रि ओवरथिंकिंग चक्र (4/4)। अभी अपना स्ट्रेस चेक करें या बेडटाइम सेंसरी रीसेट शुरू करें।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और ओवरथिंकिंग चेक लें &rarr;',
    subBtn: 'बेडटाइम सेंसरी रीसेट (Sensory Reset) अभी शुरू करें &rarr;'
  }
};

const RUMINATION_LOOP_LOCALES = {
  en: {
    badge: '30-SECOND RUMINATION vs. PROBLEM-SOLVING SCREENER',
    heading: 'Are You Problem-Solving or Trapped in a Rumination Loop?',
    sub: 'Check the cognitive loop indicators to see if your thinking is productive or draining:',
    items: [
      '<strong>Zero New Actionable Insights:</strong> You have thought about the exact same issue for over 20 minutes without producing a single concrete next step.',
      '<strong>"Why" Questions Over "How" Questions:</strong> Your mind keeps asking "Why did this happen? Why am I like this?" instead of "What can I do right now?"',
      '<strong>Somatic Mood Drop:</strong> The longer you analyze the situation, the heavier, more anxious, or more hopeless your body feels.',
      '<strong>Uncontrollable Background Playback:</strong> Even while working, eating, or talking to others, the same mental tape keeps running in the background.'
    ],
    scoreUnit: 'of 4 repetitive rumination loop signals active',
    verdicts: [
      'Check the items above to test whether your brain is solving a problem or spinning its wheels.',
      'Constructive Reflection (1/4). Your thinking is still connected to actionable problem-solving.',
      'Moderate Cognitive Looping (2/4). Your mind is starting to mistake repetitive worry for preparation.',
      'Active Rumination Trap (3/4). Analysis has crossed into emotional self-punishment without producing solutions.',
      'Severe Compulsive Rumination Loop (4/4). Your brain is burning glucose in a closed loop—measure your stress load and build a circuit-breaker plan now.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Rumination Check &rarr;',
    subBtn: 'Build a Loop-Breaking Emotion Regulation Plan &rarr;'
  },
  ko: {
    badge: '30초 반추(Rumination) 루프 vs 문제 해결 판별기',
    heading: '지금 나는 문제를 해결 중일까요, 반추의 늪에 빠진 걸까요?',
    sub: '현재 머릿속 생각이 생산적인 고민인지 에너지만 갉아먹는 반추인지 체크해보세요:',
    items: [
      '<strong>새로운 실행안 제로:</strong> 똑같은 문제를 20분 이상 생각했지만 당장 실행할 수 있는 구체적인 행동 계획이 하나도 나오지 않았습니다.',
      '<strong>"어떻게" 대신 "왜"라는 질문만 반복:</strong> "지금 무엇을 할까?" 대신 "왜 그런 일이 생겼지? 난 왜 이럴까?"만 끝없이 되묻습니다.',
      '<strong>생각할수록 가라앉는 신체 감각:</strong> 상황을 분석할수록 명쾌해지기는커녕 가슴이 답답해지고 무기력감과 불안만 커집니다.',
      '<strong>꺼지지 않는 백그라운드 재생:</strong> 일을 하거나 밥을 먹을 때도 백그라운드 앱처럼 똑같은 생각 테이프가 멈추지 않고 돌아갑니다.'
    ],
    scoreUnit: '개 반복적 반추(Rumination) 루프 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 생각이 건강한 성찰인지 소모적인 반추 루프인지 확인해보세요.',
      '건설적인 문제 해결 단계(1/4). 생각이 실질적인 대안 탐색과 연결되어 있습니다.',
      '중등도 인지 맴돌기(2/4). 뇌가 반복적인 걱정을 문제 해결 준비라고 착각하기 시작했습니다.',
      '활발한 반추의 덫(3/4). 분석이 해결책을 내지 못한 채 정서적 자책과 피로만 키우고 있습니다.',
      '심각한 강박적 반추 루프(4/4). 폐쇄 회로에서 뇌 에너지가 고갈되고 있습니다. 지금 스트레스 부하를 측정하고 정서 조절 루프 차단 플랜을 세우세요.'
    ],
    primaryBtn: '3분 스트레스 및 반추 루프 정밀 진단 &rarr;',
    subBtn: '반추 차단 맞춤 정서 조절 플래너 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN GRÜBELSCHLEIFE vs. PROBLEMLÖSUNGS-CHECK',
    heading: 'Lösen Sie gerade ein Problem oder stecken Sie in einer Grübelschleife?',
    sub: 'Prüfen Sie, ob Ihr Nachdenken produktiv ist oder Ihre Energie absaugt:',
    items: [
      '<strong>Keine neuen Handlungsschritte:</strong> Sie denken seit über 20 Minuten über dasselbe Thema nach, ohne einen konkreten nächsten Schritt.',
      '<strong>„Warum“- statt „Wie“-Fragen:</strong> Sie fragen sich endlos „Warum ist das passiert?“, statt „Was kann ich jetzt konkret tun?“. ',
      '<strong>Sinkende Stimmung &amp; Körperspannung:</strong> Je länger Sie analysieren, desto schwerer, ängstlicher oder hoffnungsloser fühlen Sie sich.',
      '<strong>Unkontrollierbare Hintergrundschleife:</strong> Selbst beim Arbeiten oder Essen läuft derselbe Gedankenfilm im Hintergrund weiter.'
    ],
    scoreUnit: 'von 4 Grübelschleifen-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um produktives Denken von Rumination zu trennen.',
      'Konstruktive Reflexion (1/4). Ihr Denken bleibt lösungsorientiert.',
      'Moderates Gedankenkreisen (2/4). Ihr Gehirn verwechselt Sorgen mit Vorbereitung.',
      'Aktive Grübelfalle (3/4). Die Analyse kostet Kraft, ohne Lösungen zu liefern.',
      'Chronische Ruminationsschleife (4/4). Prüfen Sie jetzt Ihren Stresswert und erstellen Sie einen Regulationsplan.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Grübel-Test starten &rarr;',
    subBtn: 'Emotionsregulations-Planer gegen Grübeln öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE RUMIACIÓN vs. RESOLUCIÓN EN 30 SEGUNDOS',
    heading: '¿Estás resolviendo un problema o atrapado en un bucle de rumiación?',
    sub: 'Marca los indicadores para saber si tu pensamiento es productivo o agotador:',
    items: [
      '<strong>Cero pasos nuevos de acción:</strong> Llevas más de 20 minutos pensando en lo mismo sin llegar a ninguna acción concreta.',
      '<strong>Preguntas de «por qué» en vez de «cómo»:</strong> Te repites «¿Por qué pasó esto?» en lugar de «¿Qué puedo hacer ahora mismo?».',
      '<strong>Caída del estado de ánimo físico:</strong> Cuanto más analizas el tema, más pesado, ansioso o desesperanzado se siente tu cuerpo.',
      '<strong>Reproducción en segundo plano:</strong> Incluso mientras trabajas o conversas, la misma cinta mental sigue girando sin parar.'
    ],
    scoreUnit: 'de 4 señales de bucle de rumiación activas',
    verdicts: [
      'Marca los puntos arriba para distinguir la reflexión útil de la rumiación.',
      'Reflexión constructiva (1/4). Tu mente sigue enfocada en soluciones reales.',
      'Bucle cognitivo moderado (2/4). Tu cerebro empieza a confundir preocuparse con resolver.',
      'Trampa activa de rumiación (3/4). El análisis genera desgaste emocional sin aportar respuestas.',
      'Bucle severo de rumiación compulsiva (4/4). Mide tu carga de estrés ahora y diseña un plan de regulación emocional.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Rumiación en 3 Minutos &rarr;',
    subBtn: 'Abrir el Planificador de Regulación Emocional &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR RUMINATION vs RÉSOLUTION EN 30 SECONDES',
    heading: 'Résolvez-vous un problème ou tournez-vous dans une boucle de rumination ?',
    sub: 'Cochez ces indicateurs pour savoir si votre réflexion est utile ou épuisante :',
    items: [
      '<strong>Aucune piste d’action concrète :</strong> Vous pensez au même sujet depuis plus de 20 minutes sans trouver d’étape concrète.',
      '<strong>Des « Pourquoi » au lieu de « Comment » :</strong> Vous répétez « Pourquoi ai-je fait ça ? » au lieu de « Que puis-je faire maintenant ? ».',
      '<strong>Chute de l’énergie corporelle :</strong> Plus vous analysez la situation, plus vous vous sentez lourd, anxieux ou découragé.',
      '<strong>Lecture continue en arrière-plan :</strong> Même en travaillant ou en mangeant, le même disque mental tourne sans arrêt.'
    ],
    scoreUnit: 'sur 4 signaux de boucle de rumination actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour distinguer la réflexion de la rumination.',
      'Réflexion constructive (1/4). Votre pensée reste tournée vers l’action.',
      'Boucle cognitive modérée (2/4). Votre esprit confond inquiétude répétitive et préparation.',
      'Piège de rumination actif (3/4). L’analyse vous épuise sans produire de solution.',
      'Rumination compulsive sévère (4/4). Évaluez votre niveau de stress et créez un plan de régulation émotionnelle.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Rumination en 3 Minutes &rarr;',
    subBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;'
  },
  ja: {
    badge: '30秒 反芻思考（ルミネーション）vs 問題解決チェック',
    heading: '今あなたは「問題解決」をしていますか？それとも「反芻ループ」にハマっていますか？',
    sub: '今の思考が生産的なものか、脳を消耗させる反芻ループかチェックしてください：',
    items: [
      '<strong>具体的な行動案がゼロ：</strong> 同じ問題を20分以上考えているのに、今すぐできる具体的な一歩が一つも出ていない。',
      '<strong>「どうするか」ではなく「なぜ」の繰り返し：</strong> 「なぜあんなことを言ったのか」「なぜ自分はこうなのか」ばかりを繰り返している。',
      '<strong>考えるほど気分と体が重くなる：</strong> 分析すればするほどスッキリするどころか、胸が苦しくなり不安や無力感が増していく。',
      '<strong>バックグラウンドでの自動再生：</strong> 仕事中や食事中も、頭の裏側でずっと同じ思考テープが回り続けている。'
    ],
    scoreUnit: '/ 4 個の反芻思考ループ信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、今の思考が「解決」か「反芻ループ」か見極めましょう。',
      '建設的な振り返り（1/4）。具体的な対策や行動につながる思考ができています。',
      '中程度の思考ループ（2/4）。脳が「繰り返し悩むこと」を「問題への備え」と錯覚し始めています。',
      '反芻思考の罠（3/4）。解決策が出ないまま自己批判と脳疲労だけが増幅しています。',
      '深刻な強迫的反芻ループ（4/4）。今すぐストレス＆思考負荷を測定し、ループを断ち切る感情調整プランを作成しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆反芻ループ診断へ &rarr;',
    subBtn: '反芻を止める「感情調整プランナー」を開く &rarr;'
  },
  zh: {
    badge: '30秒 反刍思维（Rumination）vs 解决问题筛查',
    heading: '你是在解决问题，还是困在了“反刍思维死循环”？',
    sub: '勾选下方指标，测试你现在的思考是富有成效还是在消耗神经能量：',
    items: [
      '<strong>零可执行的新方案：</strong> 你已经就同一件事反复想了超过 20 分钟，却没有得出任何一个具体可执行的下一步。',
      '<strong>只问“为什么”而不问“怎么做”：</strong> 脑子里不断重复“为什么会这样？我为什么这么蠢？”，而不是“我现在能做什么？”。',
      '<strong>越想越沉重的躯体情绪：</strong> 越是深入分析，身体反而感到越沉重、越焦虑、越无力。',
      '<strong>无法关闭的后台播放：</strong> 即使在工作、吃饭或与人交谈时，同一盘思维磁带仍在脑海后台不停转动。'
    ],
    scoreUnit: '/ 4 个反刍思维死循环信号已激活',
    verdicts: [
      '勾选上方信号，判断大脑是在真正解决问题还是在原地空转。',
      '建设性反思（1/4）。你的思考依然服务于具体的行动与解决。',
      '中度思维打转（2/4）。大脑开始把“反复担忧”误当成“提前准备”。',
      '高度反刍陷阱（3/4）。过度分析没有带来答案，反而演变成了情绪自我惩罚。',
      '重度强迫性反刍循环（4/4）。大脑正在闭环中空耗能量，请立即测算压力负荷并制定情绪调节阻断计划。'
    ],
    primaryBtn: '开始 3 分钟压力与反刍思维测评 &rarr;',
    subBtn: '打开打断内耗的情绪调节规划器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE RUMINAÇÃO vs. RESOLUÇÃO EM 30 SEGUNDOS',
    heading: 'Você está resolvendo um problema ou preso em um loop de ruminação?',
    sub: 'Marque os indicadores para ver se seu pensamento é produtivo ou desgastante:',
    items: [
      '<strong>Zero novas ações práticas:</strong> Você pensa no mesmo assunto há mais de 20 minutos sem chegar a nenhum passo concreto.',
      '<strong>Perguntas de "por quê" em vez de "como":</strong> Sua mente repete "Por que isso aconteceu?" em vez de "O que posso fazer agora?".',
      '<strong>Queda de humor e peso no corpo:</strong> Quanto mais você analisa, mais pesado, ansioso ou sem esperança seu corpo se sente.',
      '<strong>Reprodução contínua em segundo plano:</strong> Mesmo trabalhando ou comendo, a mesma fita mental continua rodando.'
    ],
    scoreUnit: 'de 4 sinais de loop de ruminação ativos',
    verdicts: [
      'Marque os itens acima para testar se seu cérebro está resolvendo ou girando em falso.',
      'Reflexão construtiva (1/4). Seu pensamento continua ligado a soluções práticas.',
      'Loop cognitivo moderado (2/4). Sua mente está confundindo preocupação repetitiva com preparo.',
      'Armadilha ativa de ruminação (3/4). A análise virou desgaste emocional sem gerar soluções.',
      'Loop severo de ruminação compulsiva (4/4). Meça sua carga de estresse agora e monte um plano de regulação emocional.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Ruminação em 3 Minutos &rarr;',
    subBtn: 'Abrir o Planejador de Regulação Emocional &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ: РУМИНАЦИЯ ИЛИ РЕШЕНИЕ ПРОБЛЕМЫ?',
    heading: 'Вы ищете решение или застряли в петле мысленной жвачки (руминации)?',
    sub: 'Отметьте признаки, чтобы понять — продуктивны ваши мысли или они истощают мозг:',
    items: [
      '<strong>Ноль новых конкретных шагов:</strong> Вы думаете об одном и том же больше 20 минут, но не нашли ни одного реального действия.',
      '<strong>Вопросы «почему» вместо «как»:</strong> Вы бесконечно спрашиваете «Почему так вышло?», а не «Что я могу сделать сейчас?».',
      '<strong>Ухудшение самочувствия:</strong> Чем дольше вы анализируете ситуацию, тем больше тяжести, тревоги и бессилия в теле.',
      '<strong>Непрерывный фоновый повтор:</strong> Даже во время работы или еды в голове продолжает крутиться одна и та же пластинка.'
    ],
    scoreUnit: 'из 4 признаков петли руминации активны',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить полезный анализ от руминации.',
      'Конструктивное осмысление (1/4). Ваши мысли направлены на поиск решения.',
      'Умеренное зацикливание (2/4). Мозг начинает путать тревожное прокручивание с подготовкой.',
      'Активная ловушка руминации (3/4). Анализ перешел в самобичевание без результата.',
      'Глубокая навязчивая руминация (4/4). Проверьте уровень стресса и составьте план эмоциональной регуляции.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и руминацию &rarr;',
    subBtn: 'Открыть планировщик эмоциональной регуляции &rarr;'
  },
  id: {
    badge: 'SKRINING RUMINASI vs. PEMECAHAN MASALAH 30 DETIK',
    heading: 'Apakah Anda Sedang Menyelesaikan Masalah atau Terjebak Loop Ruminasi?',
    sub: 'Centang indikator berikut untuk melihat apakah pikiran Anda produktif atau menguras energi:',
    items: [
      '<strong>Nol Langkah Tindakan Baru:</strong> Anda memikirkan hal yang sama lebih dari 20 menit tanpa menghasilkan satu pun langkah konkret.',
      '<strong>Pertanyaan "Mengapa" Bukan "Bagaimana":</strong> Pikiran terus bertanya "Kenapa ini terjadi?" alih-alih "Apa yang bisa kulakukan sekarang?".',
      '<strong>Suasana Hati &amp; Tubuh Makin Berat:</strong> Semakin lama dianalisis, tubuh justru terasa makin cemas, berat, dan putus asa.',
      '<strong>Putaran Latar Belakang Tanpa Henti:</strong> Saat bekerja atau makan sekalipun, kaset pikiran yang sama terus berputar di kepala.'
    ],
    scoreUnit: 'dari 4 sinyal loop ruminasi aktif',
    verdicts: [
      'Centang item di atas untuk menguji apakah otak Anda sedang mencari solusi atau berputar di tempat.',
      'Refleksi Konstruktif (1/4). Pikiran Anda masih terhubung dengan langkah pemecahan masalah.',
      'Loop Kognitif Sedang (2/4). Pikiran mulai mengira kekhawatiran berulang sebagai persiapan.',
      'Jebakan Ruminasi Aktif (3/4). Analisis telah berubah menjadi kelelahan emosional tanpa solusi.',
      'Loop Ruminasi Kompulsif Berat (4/4). Ukur beban stres Anda sekarang dan buat rencana regulasi emosi pemutus loop.'
    ],
    primaryBtn: 'Ikuti Tes Stres &amp; Ruminasi 3 Menit &rarr;',
    subBtn: 'Buka Perencana Regulasi Emosi Pemutus Loop &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK RÜMİNASYON vs. PROBLEM ÇÖZME TARAMASI',
    heading: 'Problem mi Çözüyorsunuz Yoksa Zihinsel Geviş Getirme (Rüminasyon) Döngüsünde misiniz?',
    sub: 'Düşüncelerinizin üretken mi yoksa enerji tüketici mi olduğunu görmek için işaretleyin:',
    items: [
      '<strong>Sıfır Yeni Eylem Adımı:</strong> Aynı konuyu 20 dakikadan fazla düşündünüz ama tek bir somut adım bile çıkmadı.',
      '<strong>"Nasıl" Yerine "Neden" Soruları:</strong> "Şimdi ne yapabilirim?" yerine sürekli "Neden böyle oldu, neden böyleyim?" diye soruyorsunuz.',
      '<strong>Bedensel Çöküş ve Kaygı Artışı:</strong> Analiz ettikçe rahatlamak yerine göğsünüz daralıyor ve umutsuzluk artıyor.',
      '<strong>Arka Planda Kapanmayan Kayıt:</strong> Çalışırken veya yemek yerken bile aynı düşünce kaseti zihninizde dönmeye devam ediyor.'
    ],
    scoreUnit: '/ 4 rüminasyon döngüsü sinyali aktif',
    verdicts: [
      'Beyninizin çözüm mü ürettiğini yoksa yerinde mi saydığını görmek için yukarıdakileri işaretleyin.',
      'Yapıcı Değerlendirme (1/4). Düşünceleriniz hala eyleme dönük problem çözmeyle bağlantılı.',
      'Orta Düzey Zihinsel Döngü (2/4). Zihniniz tekrarlayan endişeyi hazırlık sanmaya başlıyor.',
      'Aktif Rüminasyon Tuzağı (3/4). Analiz, çözüm üretmeden duygusal yıpranmaya dönüştü.',
      'Şiddetli Takıntılı Rüminasyon Döngüsü (4/4). Şimdi stres yükünüzü ölçün ve döngü kırıcı duygu düzenleme planınızı oluşturun.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Rüminasyon Testini Başlat &rarr;',
    subBtn: 'Döngü Kırıcı Duygu Düzenleme Planlayıcısını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड रूमिनेशन (Rumination) बनाम समस्या-समाधान स्क्रीनर',
    heading: 'क्या आप समस्या हल कर रहे हैं या विचारों के लूप (Rumination) में फंसे हैं?',
    sub: 'यह जानने के लिए नीचे दिए गए संकेतों को चुनें कि आपकी सोच उपयोगी है या ऊर्जा सोख रही है:',
    items: [
      '<strong>कोई नया ठोस कदम नहीं:</strong> आप 20 मिनट से ज़्यादा समय से एक ही बात सोच रहे हैं, लेकिन कोई ठोस अगला कदम नहीं निकला।',
      '<strong>"कैसे" के बजाय "क्यों" के सवाल:</strong> दिमाग बार-बार यही पूछता है "ऐसा क्यों हुआ?" बजाय इसके कि "मैं अभी क्या कर सकता हूँ?"।',
      '<strong>सोचने के साथ भारी होता मन:</strong> आप जितना अधिक विश्लेषण करते हैं, शरीर उतना ही भारी, चिंतित और निराश महसूस करता है।',
      '<strong>बैकग्राउंड में लगातार चलती टेप:</strong> काम करते या खाते समय भी दिमाग के पीछे वही विचार बिना रुके घूमता रहता है।'
    ],
    scoreUnit: '/ 4 रूमिनेशन लूप संकेत सक्रिय',
    verdicts: [
      'यह जांचने के लिए ऊपर दिए गए विकल्प चुनें कि आपका दिमाग समाधान खोज रहा है या लूप में घूम रहा है।',
      'सकारात्मक चिंतन (1/4)। आपकी सोच अभी भी व्यावहारिक समाधान से जुड़ी हुई है।',
      'मध्यम वैचारिक भटकाव (2/4)। आपका मन बार-बार चिंता करने को ही तैयारी समझ रहा है।',
      'सक्रिय रूमिनेशन जाल (3/4)। विश्लेषण बिना किसी समाधान के मानसिक थकान बढ़ा रहा है।',
      'गंभीर रूमिनेशन लूप (4/4)। अभी अपना स्ट्रेस लोड जांचें और लूप तोड़ने के लिए इमोशन रेगुलेशन प्लान बनाएं।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और रूमिनेशन चेक लें &rarr;',
    subBtn: 'इमोशन रेगुलेशन प्लानर (Emotion Regulation Planner) खोलें &rarr;'
  }
};

const PERFECTIONISM_ANXIETY_LOCALES = {
  en: {
    badge: '30-SECOND ANXIETY-DRIVEN PERFECTIONISM SCREENER',
    heading: 'Is Your High Standard Healthy Excellence—or Toxic Perfectionism Anxiety?',
    sub: 'Check the fear-driven performance patterns active in your work and daily life:',
    items: [
      '<strong>Perfectionist Procrastination Paralysis:</strong> You delay starting or finishing tasks because you dread producing something less than flawless.',
      '<strong>Conditional Self-Worth:</strong> One minor mistake or critical comment erases 99% of your achievements and makes you feel like a fraud.',
      '<strong>Over-Polishing &amp; Diminishing Returns:</strong> You spend hours tweaking tiny details nobody else notices just to quiet internal anxiety.',
      '<strong>Zero Post-Success Relief:</strong> Even when you succeed, you feel no pride—only brief relief ("I didn’t fail this time") before raising the bar higher.'
    ],
    scoreUnit: 'of 4 perfectionism anxiety signals active',
    verdicts: [
      'Check the items above to distinguish healthy ambition from anxiety-driven perfectionism.',
      'Healthy Striving (1/4). Your high standards are fueled by growth rather than fear of shame.',
      'Moderate Performance Anxiety (2/4). Fear of criticism is starting to slow your execution speed.',
      'High Maladaptive Perfectionism (3/4). Your nervous system uses flawlessness as armor against rejection.',
      'Severe Perfectionism-Burnout Loop (4/4). Chronic over-control is exhausting your nervous system—check your stress &amp; burnout differential now.'
    ],
    primaryBtn: 'Take the 3-Minute Anxiety &amp; Stress Check &rarr;',
    subBtn: 'Run Burnout vs. Stress Differential Audit &rarr;'
  },
  ko: {
    badge: '30초 불안 기반 완벽주의(Perfectionism Anxiety) 판별기',
    heading: '건강한 성취욕일까요, 불안에 쫓기는 독성 완벽주의일까요?',
    sub: '일과 일상에서 작동하는 실패 공포 및 과잉 통제 신호를 체크해보세요:',
    items: [
      '<strong>완벽주의형 미루기 마비:</strong> 결과가 완벽하지 않을까 봐 두려워서 아예 시작을 못 하거나 마감 직전까지 제출을 미룹니다.',
      '<strong>조건부 자기 가치감:</strong> 99개를 잘해도 단 1개의 실수나 지적을 받으면 모든 성취가 무너진 것처럼 자책합니다.',
      '<strong>과잉 수정과 에너지 소모:</strong> 남들은 눈치채지도 못하는 사소한 디테일을 고치느라 몇 시간씩 에너지를 쏟으며 불안을 달랩니다.',
      '<strong>성공 후에도 없는 성취감:</strong> 목표를 달성해도 기쁨 대신 "이번엔 안 들켰다/실패 안 했다"는 짧은 안도감만 느끼고 곧바로 기준을 더 높입니다.'
    ],
    scoreUnit: '개 불안 기반 완벽주의 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 건강한 탁월함 추구와 불안 기반 완벽주의를 구분해보세요.',
      '건강한 성취 지향(1/4). 두려움이 아닌 성장의 즐거움으로 높은 기준을 추구하고 있습니다.',
      '중등도 수행 불안 완벽주의(2/4). 실수와 비판에 대한 두려움이 실행 속도를 늦추고 있습니다.',
      '높은 부적응적 완벽주의(3/4). 신경계가 거절과 수치심을 피하기 위한 갑옷으로 완벽주의를 사용하고 있습니다.',
      '심각한 완벽주의-번아웃 루프(4/4). 만성적인 과잉 통제가 신경계를 소진시키고 있습니다. 지금 불안·스트레스 지수와 번아웃 감별 진단을 실행하세요.'
    ],
    primaryBtn: '3분 불안·스트레스 및 완벽주의 과부하 진단 &rarr;',
    subBtn: '번아웃 vs 스트레스 감별 진단 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN PERFEKTIONISMUS-ANGST-CHECK',
    heading: 'Gesunder Ehrgeiz oder angstgetriebener Perfektionismus?',
    sub: 'Wählen Sie die Muster aus, die Ihren Arbeits- und Lebensalltag bestimmen:',
    items: [
      '<strong>Perfektionistische Prokrastination:</strong> Sie schieben Aufgaben auf, aus Angst, das Ergebnis könnte nicht makellos sein.',
      '<strong>Bedingter Selbstwert:</strong> Ein einziger kleiner Fehler entwertet für Sie 99 % Ihrer bisherigen Erfolge.',
      '<strong>Endloses Überarbeiten:</strong> Sie investieren Stunden in kleinste Details, nur um Ihre innere Unruhe zu betäuben.',
      '<strong>Keine Freude nach Erfolgen:</strong> Nach einem Erfolg spüren Sie keinen Stolz, sondern nur kurze Erleichterung („Noch mal gut gegangen“).'
    ],
    scoreUnit: 'von 4 Perfektionismus-Angst-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um gesundes Streben von toxischem Perfektionismus zu unterscheiden.',
      'Gesunder Ehrgeiz (1/4). Ihre hohen Ansprüche fördern Ihr Wachstum ohne Angstblockade.',
      'Moderate Leistungsangst (2/4). Angst vor Kritik bremst Ihre Umsetzung.',
      'Hoher maladaptiver Perfektionismus (3/4). Ihr Nervensystem nutzt Fehlerlosigkeit als Schutzschild gegen Scham.',
      'Akute Perfektionismus-Burnout-Schleife (4/4). Prüfen Sie jetzt Ihren Stresswert und machen Sie den Burnout-Differentialcheck.'
    ],
    primaryBtn: '3-Minuten Angst- &amp; Stress-Check starten &rarr;',
    subBtn: 'Burnout- vs. Stress-Differentialanalyse öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE PERFECCIONISMO POR ANSIEDAD EN 30 SEGUNDOS',
    heading: '¿Tu exigencia es excelencia sana o perfeccionismo tóxico impulsado por ansiedad?',
    sub: 'Marca los patrones de miedo al fallo activos en tu trabajo y vida diaria:',
    items: [
      '<strong>Parálisis por procrastinación perfeccionista:</strong> Retrasas empezar o entregar tareas por terror a que no queden impecables.',
      '<strong>Autoestima condicional:</strong> Un solo error pequeño o comentario crítico borra el 99 % de tus logros.',
      '<strong>Sobrecorrección agotadora:</strong> Pasas horas puliendo detalles mínimos que nadie nota solo para calmar tu ansiedad.',
      '<strong>Cero disfrute tras el éxito:</strong> Al lograr una meta no sientes orgullo, solo un breve alivio («no fallé esta vez») antes de subir la exigencia.'
    ],
    scoreUnit: 'de 4 señales de perfeccionismo ansioso activas',
    verdicts: [
      'Marca los puntos arriba para distinguir la ambición sana del perfeccionismo ansioso.',
      'Excelencia saludable (1/4). Tus estándares nacen del crecimiento y no del miedo.',
      'Ansiedad de rendimiento moderada (2/4). El temor al juicio está frenando tu ejecución.',
      'Alto perfeccionismo desadaptativo (3/4). Tu sistema nervioso usa la perfección como escudo ante el rechazo.',
      'Bucle severo de perfeccionismo y burnout (4/4). Evalúa tu nivel de estrés y realiza el diagnóstico diferencial de burnout.'
    ],
    primaryBtn: 'Hacer el Test de Ansiedad y Estrés en 3 Minutos &rarr;',
    subBtn: 'Abrir Diagnóstico Diferencial Burnout vs. Estrés &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE PERFECTIONNISME ANXIEUX EN 30 SECONDES',
    heading: 'Votre exigence est-elle une saine ambition ou un perfectionnisme anxieux ?',
    sub: 'Cochez les comportements dictés par la peur de l’échec dans votre quotidien :',
    items: [
      '<strong>Paralysie et procrastination perfectionniste :</strong> Vous repoussez le début ou la fin d’une tâche par peur de l’imperfection.',
      '<strong>Estime de soi conditionnelle :</strong> Une seule petite erreur efface à vos yeux 99 % de vos réussites.',
      '<strong>Sur-peaufinage épuisant :</strong> Vous passez des heures sur des micro-détails invisibles juste pour calmer votre anxiété.',
      '<strong>Aucune fierté après le succès :</strong> Même en réussissant, vous ne ressentez qu’un bref soulagement avant de placer la barre plus haut.'
    ],
    scoreUnit: 'sur 4 signaux de perfectionnisme anxieux actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour distinguer l’excellence saine du perfectionnisme toxique.',
      'Ambition saine (1/4). Vos standards vous portent sans vous paralyser.',
      'Anxiété de performance modérée (2/4). La peur de la critique ralentit votre passage à l’action.',
      'Perfectionnisme inadapté élevé (3/4). Votre système nerveux utilise le sans-faute comme armure.',
      'Boucle sévère perfectionnisme-burnout (4/4). Testez votre stress et lancez l’analyse différentielle du burnout.'
    ],
    primaryBtn: 'Faire le Bilan Anxiété et Stress en 3 Minutes &rarr;',
    subBtn: 'Ouvrir l’Analyse Différentielle Burnout vs Stress &rarr;'
  },
  ja: {
    badge: '30秒 不安型完璧主義（パーフェクショニズム）診断チェック',
    heading: 'その高い基準は「健全な向上心」？それとも不安に駆られた「毒性完璧主義」？',
    sub: '仕事や日常で働いている失敗恐怖・過剰コントロールのサインをチェックしてください：',
    items: [
      '<strong>完璧主義による先延ばし麻痺：</strong> 「完璧にできないなら始められない」と着手や提出をギリギリまで遅らせてしまう。',
      '<strong>条件付きの自己価値：</strong> 99%うまくいっても、たった1つのミスや指摘で自分の価値がすべて否定されたように感じる。',
      '<strong>過剰な手直しと消耗：</strong> 他人が気づかないような細部の修正に何時間も費やし、内側の不安を鎮めようとする。',
      '<strong>達成しても喜びがない：</strong> 成功しても誇らしさはなく「今回は失敗せずに済んだ」という一瞬の安堵だけで、すぐハードルを上げてしまう。'
    ],
    scoreUnit: '/ 4 個の不安型完璧主義サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、健全な向上心と不安型完璧主義を見分けましょう。',
      '健全な向上心（1/4）。恐怖ではなく成長の喜びから高い基準を目指せています。',
      '中程度の遂行不安（2/4）。批判や失敗への恐れが行動のスピードを鈍らせています。',
      '高い不適応的完璧主義（3/4）。神経系が「恥や拒絶」から身を守る鎧として完璧主義を使っています。',
      '深刻な完璧主義・燃え尽きループ（4/4）。今すぐ不安・ストレス診断とバーンアウト鑑別ツールで負荷を測定しましょう。'
    ],
    primaryBtn: '3分間の無料不安・ストレス＆完璧主義チェックへ &rarr;',
    subBtn: 'バーンアウト vs ストレス鑑別診断ツールを開く &rarr;'
  },
  zh: {
    badge: '30秒 焦虑型完美主义（Perfectionism Anxiety）筛查',
    heading: '你的高标准是健康的追求卓越，还是焦虑驱动的“毒性完美主义”？',
    sub: '勾选在工作与生活中由失败恐惧驱动的表现模式：',
    items: [
      '<strong>完美主义式拖延瘫痪：</strong> 因为害怕做出来的东西不够完美，所以迟迟不敢开始或拖到最后一刻才交差。',
      '<strong>有条件的自我价值感：</strong> 哪怕做好了 99%，只要出现 1 个小失误或批评，就会全盘否定自己。',
      '<strong>过度打磨与内耗：</strong> 花几个小时反复修改别人根本注意不到的微小细节，只为缓解内心的不安。',
      '<strong>成功后毫无喜悦：</strong> 即使达成目标也没有自豪感，只有短暂的“这次没搞砸”的庆幸，随后立刻把标准提得更高。'
    ],
    scoreUnit: '/ 4 个焦虑型完美主义信号已激活',
    verdicts: [
      '勾选上方信号，区分健康的进取心与焦虑驱动的完美主义。',
      '健康的卓越追求（1/4）。你的高标准源于成长动力而非羞耻恐惧。',
      '中度表现焦虑（2/4）。对批评的恐惧正在拖慢你的执行速度。',
      '高度不适应性完美主义（3/4）。你的神经系统正把“零瑕疵”当成防御拒绝的盔甲。',
      '重度完美主义-倦怠循环（4/4）。长期过度控制正在透支神经系统，请立即检测压力负荷并进行倦怠鉴别。'
    ],
    primaryBtn: '开始 3 分钟焦虑与压力负荷测试 &rarr;',
    subBtn: '打开倦怠 vs 压力鉴别诊断工具 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE PERFECCIONISMO POR ANSIEDADE EM 30 SEGUNDOS',
    heading: 'Seu padrão alto é excelência saudável ou perfeccionismo tóxico por ansiedade?',
    sub: 'Marque os padrões movidos pelo medo de falhar em sua rotina:',
    items: [
      '<strong>Paralisia e procrastinação perfeccionista:</strong> Você adia começar ou entregar tarefas por pavor de que o resultado não saia impecável.',
      '<strong>Autoestima condicional:</strong> Um único erro pequeno ou crítica apaga 99% das suas conquistas.',
      '<strong>Polimento excessivo e exaustivo:</strong> Você gasta horas ajustando detalhes mínimos que ninguém percebe só para acalmar a ansiedade.',
      '<strong>Zero alívio após o sucesso:</strong> Mesmo quando vence, você não sente orgulho—apenas um breve "não falhei desta vez".'
    ],
    scoreUnit: 'de 4 sinais de perfeccionismo ansioso ativos',
    verdicts: [
      'Marque os itens acima para diferenciar ambição saudável de perfeccionismo ansioso.',
      'Busca saudável (1/4). Seus padrões altos vêm do crescimento, não do medo da vergonha.',
      'Ansiedade de desempenho moderada (2/4). O medo de críticas está freando sua execução.',
      'Alto perfeccionismo desadaptativo (3/4). Seu sistema nervoso usa a perfeição como armadura contra rejeição.',
      'Ciclo severo de perfeccionismo e burnout (4/4). Faça o check-up de estresse agora e rode o diferencial de burnout.'
    ],
    primaryBtn: 'Fazer o Teste de Ansiedade e Estresse em 3 Minutos &rarr;',
    subBtn: 'Abrir Diagnóstico Diferencial de Burnout vs. Estresse &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ТРЕВОЖНЫЙ ПЕРФЕКЦИОНИЗМ',
    heading: 'Ваши высокие стандарты — здоровое стремление или тревожный перфекционизм?',
    sub: 'Отметьте признаки страха ошибки и гиперконтроля в вашей работе и жизни:',
    items: [
      '<strong>Перфекционистская прокрастинация:</strong> Вы откладываете старт или сдачу дела из-за страха сделать его неидеально.',
      '<strong>Условная самооценка:</strong> Одна мелкая ошибка или замечание перечеркивает для вас 99% успеха.',
      '<strong>Изнуряющая шлифовка деталей:</strong> Вы тратите часы на незаметные мелочи только ради унятия внутренней тревоги.',
      '<strong>Отсутствие радости после побед:</strong> Даже добившись цели, вы чувствуете лишь краткое «пронесло» и сразу задираете планку выше.'
    ],
    scoreUnit: 'из 4 признаков тревожного перфекционизма активны',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить здоровую целеустремленность от невротического перфекционизма.',
      'Здоровое стремление к качеству (1/4). Ваши стандарты опираются на интерес, а не на страх.',
      'Умеренная тревога оценки (2/4). Страх критики начинает тормозить вашу скорость.',
      'Высокий дезадаптивный перфекционизм (3/4). Безупречность стала броней вашей нервной системы от стыда.',
      'Острый цикл перфекционизма и выгорания (4/4). Проверьте уровень стресса и пройдите дифференциацию выгорания.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на тревогу и стресс &rarr;',
    subBtn: 'Открыть дифференциальный тест: выгорание или стресс &rarr;'
  },
  id: {
    badge: 'SKRINING PERFEKSIONISME AKIBAT CEMAS 30 DETIK',
    heading: 'Apakah Standar Tinggi Anda Sehat atau Perfeksionisme Toksik Akibat Cemas?',
    sub: 'Centang pola ketakutan gagal yang aktif dalam pekerjaan dan keseharian Anda:',
    items: [
      '<strong>Kelumpuhan Prokrastinasi Perfeksionis:</strong> Anda menunda memulai atau menyelesaikan tugas karena takut hasilnya kurang sempurna.',
      '<strong>Harga Diri Bersyarat:</strong> Satu kesalahan kecil atau kritik menghapus 99% pencapaian Anda dan memicu rasa gagal.',
      '<strong>Revisi Berlebihan yang Menguras Energi:</strong> Anda menghabiskan berjam-jam mengutak-atik detail kecil demi meredakan cemas.',
      '<strong>Tanpa Rasa Bangga Saat Sukses:</strong> Saat berhasil pun Anda hanya merasa lega sesaat ("kali ini tidak gagal") lalu menaikkan target lagi.'
    ],
    scoreUnit: 'dari 4 sinyal perfeksionisme cemas aktif',
    verdicts: [
      'Centang item di atas untuk membedakan ambisi sehat dari perfeksionisme akibat kecemasan.',
      'Ambisi Sehat (1/4). Standar tinggi Anda didorong oleh pertumbuhan, bukan ketakutan.',
      'Kecemasan Performa Sedang (2/4). Takut dikritik mulai memperlambat eksekusi Anda.',
      'Perfeksionisme Maladaptif Tinggi (3/4). Sistem saraf Anda menjadikan kesempurnaan sebagai tameng dari penolakan.',
      'Siklus Perfeksionisme-Burnout Berat (4/4). Cek beban stres Anda sekarang dan jalankan audit diferensial burnout.'
    ],
    primaryBtn: 'Ikuti Tes Cemas &amp; Stres 3 Menit &rarr;',
    subBtn: 'Buka Alat Audit Diferensial Burnout vs. Stres &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK KAYGI ODAKLI MÜKEMMELİYETÇİLİK TARAMASI',
    heading: 'Yüksek Standartlarınız Sağlıklı Bir Başarı Arzusu mu Yoksa Toksik Mükemmeliyetçilik mi?',
    sub: 'İş ve günlük yaşamınızda aktif olan hata yapma korkusu kalıplarını işaretleyin:',
    items: [
      '<strong>Mükemmeliyetçi Erteleme Felci:</strong> Kusursuz olmayacağı korkusuyla görevlere başlamayı veya teslim etmeyi erteliyorsunuz.',
      '<strong>Koşullu Öz-Değer:</strong> Tek bir küçük hata veya eleştiri, başarılarınızın %99’unu zihninizde silip süpürüyor.',
      '<strong>Aşırı Rötuş ve Tükeniş:</strong> İçsel kaygıyı susturmak için kimsenin fark etmeyeceği detaylara saatler harcıyorsunuz.',
      '<strong>Başarı Sonrası Sıfır Tatmin:</strong> Başardığınızda bile gurur değil, yalnızca kısa bir "bu kez hata yapmadım" rahatlaması hissediyorsunuz.'
    ],
    scoreUnit: '/ 4 mükemmeliyetçilik kaygısı sinyali aktif',
    verdicts: [
      'Sağlıklı başarı arzusunu kaygı odaklı mükemmeliyetçilikten ayırmak için yukarıdakileri işaretleyin.',
      'Sağlıklı Çaba (1/4). Yüksek standartlarınız utanç korkusundan değil gelişim arzusundan besleniyor.',
      'Orta Düzey Performans Kaygısı (2/4). Eleştiri korkusu eylem hızınızı yavaşlatmaya başlıyor.',
      'Yüksek Uyumsuz Mükemmeliyetçilik (3/4). Sinir sisteminiz kusursuzluğu reddedilmeye karşı zırh olarak kullanıyor.',
      'Şiddetli Mükemmeliyetçilik-Tükenmişlik Döngüsü (4/4). Şimdi stres yükünüzü ölçün ve tükenmişlik ayrım analizini çalıştırın.'
    ],
    primaryBtn: '3 Dakikalık Kaygı ve Stres Testini Başlat &rarr;',
    subBtn: 'Tükenmişlik vs. Stres Ayırıcı Analiz Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड परफेक्शनिज़्म एंग्ज़ायटी (Perfectionism Anxiety) स्क्रीनर',
    heading: 'क्या आपके उच्च मानक स्वस्थ उत्कृष्टता हैं—या चिंता से चलने वाला टॉक्सिक परफेक्शनिज़्म?',
    sub: 'अपने काम और दैनिक जीवन में असफलता के डर से जुड़े इन संकेतों को चुनें:',
    items: [
      '<strong>परफेक्शनिस्ट टालमटोल (Procrastination):</strong> काम एकदम सही न होने के डर से उसे शुरू करने या पूरा करने में देरी करना।',
      '<strong>शर्तों पर टिका आत्म-मूल्य:</strong> एक छोटी सी गलती या आलोचना आपकी 99% उपलब्धियों को मिटाकर आपको असफल महसूस कराती है।',
      '<strong>छोटी बारीकियों में घंटों ऊर्जा गंवाना:</strong> अपनी अंदरूनी घबराहट शांत करने के लिए उन सूक्ष्म चीज़ों को सुधारते रहना जिन पर कोई ध्यान नहीं देता।',
      '<strong>सफलता के बाद भी खुशी न मिलना:</strong> लक्ष्य पूरा होने पर भी गर्व के बजाय केवल "इस बार गलती होने से बच गए" की छोटी राहत मिलना।'
    ],
    scoreUnit: '/ 4 परफेक्शनिज़्म एंग्ज़ायटी संकेत सक्रिय',
    verdicts: [
      'स्वस्थ महत्वाकांक्षा और चिंता-आधारित परफेक्शनिज़्म में अंतर करने के लिए ऊपर चुनें।',
      'स्वस्थ उत्कृष्टता (1/4)। आपके उच्च मानक डर के बजाय विकास की इच्छा से प्रेरित हैं।',
      'मध्यम प्रदर्शन चिंता (2/4)। आलोचना का डर आपकी कार्य गति को धीमा कर रहा है।',
      'उच्च अस्वस्थ परफेक्शनिज़्म (3/4)। आपका नर्वस सिस्टम अस्वीकृति से बचने के लिए परफेक्शन को कवच बना रहा है।',
      'गंभीर परफेक्शनिज़्म-बर्नआउट चक्र (4/4)। अभी अपना स्ट्रेस चेक करें और बर्नआउट बनाम स्ट्रेस अंतर जांचें।'
    ],
    primaryBtn: '3-मिनट का एंग्ज़ायटी और स्ट्रेस चेक लें &rarr;',
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

  // 1. overthinking-at-night-how-to-stop.html (12 locales)
  for (const [lang, loc] of Object.entries(NIGHTTIME_OVERTHINKING_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'overthinking-at-night-how-to-stop.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'nighttimeOverthinkingScreener',
      chkClass: 'nightot-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=night_overthinking_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/hsp-test/reset.html?lang=${lang}&source=night_overthinking_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/overthinking-at-night-how-to-stop.html`);
    console.log(`[PASS] overthinking-at-night-how-to-stop (${lang})`);
  }

  // 2. rumination-repetitive-thinking-stop.html (12 locales)
  for (const [lang, loc] of Object.entries(RUMINATION_LOOP_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'rumination-repetitive-thinking-stop.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'ruminationLoopScreener',
      chkClass: 'rumloop-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=rumination_loop_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=rumination_loop_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/rumination-repetitive-thinking-stop.html`);
    console.log(`[PASS] rumination-repetitive-thinking-stop (${lang})`);
  }

  // 3. perfectionism-anxiety-quiz.html (12 locales)
  for (const [lang, loc] of Object.entries(PERFECTIONISM_ANXIETY_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'perfectionism-anxiety-quiz.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'perfectionismAnxietyScreener',
      chkClass: 'perfanx-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=perfectionism_anxiety_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}&source=perfectionism_anxiety_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/perfectionism-anxiety-quiz.html`);
    console.log(`[PASS] perfectionism-anxiety-quiz (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 6: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

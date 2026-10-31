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

const NERVOUS_LOCALES = {
  en: {
    badge: '30-SECOND AUTONOMIC STATE TRIAGE',
    heading: 'Is Your Nervous System Dysregulated Right Now?',
    sub: 'Check the polyvagal survival states you have experienced over the past 7 days:',
    items: [
      '<strong>Sympathetic Hyper-Arousal:</strong> Racing heart, shallow chest breathing, jaw clenching, or feeling "wired but exhausted" at night.',
      '<strong>Startle &amp; Sensory Hypervigilance:</strong> Sudden noises, bright screens, or minor changes in tone trigger an immediate spike in tension.',
      '<strong>Dorsal Vagal Shutdown:</strong> Periods of emotional numbness, heavy physical fatigue, brain fog, or wanting to disconnect completely.',
      '<strong>Slow Vagal Recovery:</strong> After a stressful meeting or minor conflict, it takes hours for your body to return to a calm baseline.'
    ],
    scoreUnit: 'of 4 dysregulation signals active',
    verdicts: [
      'Check the signals above to map your current autonomic nervous system state.',
      'Mild sympathetic activation (1/4). Practice 2 minutes of extended-exhale breathing to restore vagal tone.',
      'Moderate autonomic dysregulation (2/4). Your nervous system is oscillating outside its optimal window of tolerance.',
      'High survival-mode activation (3/4). Prioritize somatic grounding and vagal toning before cognitive problem-solving.',
      'Severe multi-state dysregulation (4/4). Your autonomic baseline is overloaded—start a guided 5-4-3-2-1 sensory reset now.'
    ],
    primaryBtn: 'Take the Full Stress &amp; Nervous System Check &rarr;',
    subBtn: 'Launch 5-4-3-2-1 Sensory Grounding Tool &rarr;'
  },
  ko: {
    badge: '30초 자율신경계 상태 트리아지',
    heading: '지금 내 자율신경계는 조절 불균형 상태일까요?',
    sub: '최근 7일간 몸과 마음에서 반복된 다중미주신경(Polyvagal) 생존 신호를 체크해보세요:',
    items: [
      '<strong>교감신경 과각성(투쟁·도피):</strong> 이유 없이 심장이 두근거리고 호흡이 얕으며, 밤에 피곤한데도 뇌가 각성되어 잠들기 어렵습니다.',
      '<strong>감각 과민 및 놀람 반사:</strong> 갑작스러운 소리, 밝은 화면, 타인의 미묘한 표정 변화에도 몸이 즉각 긴장합니다.',
      '<strong>배측 미주신경 셧다운(동결):</strong> 만사가 무기력하고 감정이 무뎌지거나, 머릿속이 안개 낀 것처럼 멍해집니다.',
      '<strong>느린 신경계 회복 탄력성:</strong> 작은 갈등이나 업무 스트레스 후 평온한 상태로 돌아오는 데 몇 시간씩 걸립니다.'
    ],
    scoreUnit: '개 자율신경 불균형 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 자율신경계(교감·부교감) 균형 상태를 확인해보세요.',
      '경미한 교감신경 긴장(1/4). 날숨을 길게 내쉬는 호흡법으로 미주신경 톤을 빠르게 회복할 수 있습니다.',
      '중등도 자율신경 불균형(2/4). 신경계가 적정 인내 창(Window of Tolerance) 밖으로 자주 벗어나고 있습니다.',
      '높은 생존 모드 고착(3/4). 생각으로 해결하려 하기보다 오감 그라운딩으로 신체 안전 신호부터 확보하세요.',
      '심각한 자율신경 과부하(4/4). 교감 과각성과 탈진이 반복되고 있습니다. 지금 즉시 5-4-3-2-1 감각 리셋을 시작하세요.'
    ],
    primaryBtn: '무료 스트레스 &amp; 신경계 반응 정밀 진단 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩 진정 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN NERVENSYSTEM-TRIAGE',
    heading: 'Ist Ihr Nervensystem aktuell dysreguliert?',
    sub: 'Wählen Sie die autonomen Körpersignale aus, die Sie in den letzten 7 Tagen bemerkt haben:',
    items: [
      '<strong>Sympathische Übererregung:</strong> Herzklopfen, flache Atmung, Kieferpressen oder abends „todmüde, aber innerlich unter Strom“.',
      '<strong>Schreckhaftigkeit &amp; Reizüberflutung:</strong> Plötzliche Geräusche oder Hektik lösen sofortige körperliche Anspannung aus.',
      '<strong>Dorsaler Shutdown (Erstarrung):</strong> Phasen von emotionaler Taubheit, Bleischwere, Gehirnnebel oder Rückzug.',
      '<strong>Verzögerte Vagus-Erholung:</strong> Nach Stress dauert es Stunden, bis Ihr Körper wieder zur Ruhe kommt.'
    ],
    scoreUnit: 'von 4 Dysregulations-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um Ihren autonomen Zustand zu prüfen.',
      'Leichte Aktivierung (1/4). 2 Minuten verlängertes Ausatmen beruhigt den Vagusnerv spürbar.',
      'Mittlere Dysregulation (2/4). Ihr Nervensystem verlässt häufig das Stresstoleranzfenster.',
      'Hohe Überlebensmodus-Aktivierung (3/4). Nutzen Sie somatische Erdung vor mentaler Problemlösung.',
      'Schwere autonome Überlastung (4/4). Starten Sie jetzt eine geführte 5-4-3-2-1 Grounding-Übung.'
    ],
    primaryBtn: 'Zum Stresstest &amp; Nervensystem-Check &rarr;',
    subBtn: '5-4-3-2-1 Grounding-Tool starten &rarr;'
  },
  es: {
    badge: 'TRIAJE DEL SISTEMA NERVIOSO EN 30 SEGUNDOS',
    heading: '¿Está desregulado tu sistema nervioso ahora mismo?',
    sub: 'Marca las señales autonómicas que has experimentado en los últimos 7 días:',
    items: [
      '<strong>Hiperactivación simpática:</strong> Latidos rápidos, respiración superficial, mandíbula tensa o sentirte agotado pero incapaz de dormir.',
      '<strong>Hipervigilancia sensorial:</strong> Ruidos repentinos, pantallas o pequeños cambios de tono disparan tu tensión al instante.',
      '<strong>Apagado vagal dorsal:</strong> Episodios de entumecimiento emocional, niebla mental o ganas de desconectarte de todo.',
      '<strong>Recuperación vagal lenta:</strong> Tras un conflicto o estrés laboral, tu cuerpo tarda horas en volver a la calma.'
    ],
    scoreUnit: 'de 4 señales de desregulación activas',
    verdicts: [
      'Marca las señales arriba para evaluar el estado de tu sistema nervioso.',
      'Activación leve (1/4). Practica 2 minutos de exhalación prolongada para activar el nervio vago.',
      'Desregulación moderada (2/4). Tu sistema nervioso sale con frecuencia de su ventana de tolerancia.',
      'Alta activación de supervivencia (3/4). Prioriza el anclaje somático antes de analizar problemas.',
      'Sobrecarga autonómica severa (4/4). Inicia ahora un reinicio sensorial guiado 5-4-3-2-1.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Sistema Nervioso &rarr;',
    subBtn: 'Abrir Herramienta de Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'TRIAGE DU SYSTÈME NERVEUX EN 30 SECONDES',
    heading: 'Votre système nerveux est-il dérégulé en ce moment ?',
    sub: 'Cochez les signaux autonomes ressentis au cours des 7 derniers jours :',
    items: [
      '<strong>Hyper-activation sympathique :</strong> Cœur rapide, respiration courte, mâchoire serrée ou sensation d\'être « épuisé mais sous tension ».',
      '<strong>Hypervigilance sensorielle :</strong> Les bruits soudains ou l\'agitation déclenchent une tension corporelle immédiate.',
      '<strong>Figement vagal dorsal :</strong> Moments d\'engourdissement émotionnel, brouillard mental ou besoin de tout couper.',
      '<strong>Récupération vagale lente :</strong> Après un stress, votre corps met des heures à retrouver son calme.'
    ],
    scoreUnit: 'sur 4 signaux de dérégulation actifs',
    verdicts: [
      'Cochez les signaux ci-dessus pour évaluer votre état autonome.',
      'Activation légère (1/4). 2 minutes d\'expiration prolongée suffisent à stimuler le nerf vague.',
      'Dérégulation modérée (2/4). Votre système sort régulièrement de sa fenêtre de tolérance.',
      'Forte activation de survie (3/4). Privilégiez l\'ancrage corporel avant toute réflexion cognitive.',
      'Surcharge autonome sévère (4/4). Lancez immédiatement un exercice d\'ancrage sensoriel 5-4-3-2-1.'
    ],
    primaryBtn: 'Faire le Test de Stress &amp; Système Nerveux &rarr;',
    subBtn: 'Ouvrir l\'Outil d\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・自律神経バランスチェック',
    heading: '今、あなたの自律神経は乱れていませんか？',
    sub: '過去7日間で経験したポリヴェーガル理論に基づく身体サインをチェックしてください：',
    items: [
      '<strong>交感神経の過覚醒（闘争・逃走）：</strong> 動悸、浅い呼吸、食いしばり、または「疲れ切っているのに夜眠れない」感覚がある。',
      '<strong>感覚過敏・びっくり反応：</strong> 突然の音や強い光、相手の些細な声色の変化で瞬時に体が緊張する。',
      '<strong>背側迷走神経のシャットダウン（凍りつき）：</strong> 感情が麻痺したように無気力になり、頭にモヤがかかったようにぼーっとする。',
      '<strong>迷走神経の回復遅れ：</strong> ストレスや 작은 トラブルの後、体の緊張が解けるまでに何時間もかかる。'
    ],
    scoreUnit: '/ 4 個の自律神経乱れサインが該当',
    verdicts: [
      '上の項目をチェックして、現在の自律神経の状態を確認しましょう。',
      '軽度の交感神経緊張（1/4）。吐く息を長くする呼吸法を2分間行い、迷走神経を整えましょう。',
      '中程度の自律神経の乱れ（2/4）。耐性の窓（Window of Tolerance）から外れやすくなっています。',
      '高いサバイバルモード（3/4）。頭で考える前に、五感グラウンディングで体に安心感を与えましょう。',
      '重度の自律神経オーバーロード（4/4）。今すぐ5-4-3-2-1感覚グラウンディングで神経をリセットしてください。'
    ],
    primaryBtn: '無料ストレス＆自律神経タイプ診断へ &rarr;',
    subBtn: '5-4-3-2-1 五感グラウンディングツールを開く &rarr;'
  },
  zh: {
    badge: '30秒自主神经状态筛查',
    heading: '你的神经系统现在处于失调状态吗？',
    sub: '勾选你在过去7天内频繁出现的迷走神经与生存模式信号：',
    items: [
      '<strong>交感神经高唤醒（战或逃）：</strong> 心跳加快、呼吸浅促、咬紧牙关，或夜晚“身体极度疲惫大脑却停不下来”。',
      '<strong>感官高警觉与易受惊：</strong> 突然的声响、强光或他人微小的语气变化都会瞬间引发身体紧绷。',
      '<strong>背侧迷走神经关闭（冻结）：</strong> 感到情绪麻木、肢体沉重、脑雾弥漫，想要彻底逃避社交。',
      '<strong>迷走神经恢复缓慢：</strong> 经历压力或小冲突后，身体需要好几个小时才能恢复平静。'
    ],
    scoreUnit: '/ 4 项神经失调信号激活',
    verdicts: [
      '勾选上方信号，评估你当前的自主神经系统平衡状态。',
      '轻度交感激活 (1/4)。练习2分钟延长呼气呼吸法即可提升迷走神经张力。',
      '中度自主神经失调 (2/4)。你的神经系统正频繁滑出最佳情绪耐受窗。',
      '高度生存模式激活 (3/4)。请先通过躯体着陆技术让身体恢复安全感。',
      '重度自主神经超载 (4/4)。建议立即开启5-4-3-2-1感官着陆练习进行神经重置。'
    ],
    primaryBtn: '开始免费压力与神经反应测试 &rarr;',
    subBtn: '打开 5-4-3-2-1 感官着陆平静工具 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DO SISTEMA NERVOSO EM 30 SEGUNDOS',
    heading: 'Seu sistema nervoso está desregulado agora?',
    sub: 'Marque os sinais autonômicos que você sentiu nos últimos 7 dias:',
    items: [
      '<strong>Hiperativação simpática:</strong> Coração acelerado, respiração curta, mandíbula presa ou sensação de estar "exausto, mas ligado".',
      '<strong>Hipervigilância sensorial:</strong> Barulhos repentinos ou mudanças sutis de tom geram tensão imediata.',
      '<strong>Desligamento vagal dorsal:</strong> Momentos de dormência emocional, névoa mental ou vontade de se isolar.',
      '<strong>Recuperação vagal lenta:</strong> Após um estresse, seu corpo leva horas para voltar à calma.'
    ],
    scoreUnit: 'de 4 sinais de desregulação ativos',
    verdicts: [
      'Marque os sinais acima para avaliar seu estado autonômico atual.',
      'Ativação leve (1/4). Pratique 2 minutos de expiração prolongada para ativar o nervo vago.',
      'Desregulação moderada (2/4). Seu sistema nervoso está saindo da janela de tolerância.',
      'Alta ativação de sobrevivência (3/4). Priorize o aterramento somático antes de forçar o foco.',
      'Sobrecarga autonômica severa (4/4). Inicie agora o exercício guiado de aterramento 5-4-3-2-1.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Sistema Nervoso &rarr;',
    subBtn: 'Abrir Ferramenta de Aterramento 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ СКРИНИНГ НЕРВНОЙ СИСТЕМЫ',
    heading: 'Ваша нервная система сейчас разбалансирована?',
    sub: 'Отметьте телесные сигналы, которые вы замечали за последние 7 дней:',
    items: [
      '<strong>Симпатическое перевозбуждение:</strong> Учащенный пульс, поверхностное дыхание, сжатые челюсти или состояние «устал, но не могу уснуть».',
      '<strong>Сенсорная гипербдительность:</strong> Резкие звуки или суета мгновенно вызывают скачок внутреннего напряжения.',
      '<strong>Дорсальное замирание (шатаут):</strong> Эпизоды эмоционального оцепенения, тумана в голове и желания отключиться от мира.',
      '<strong>Медленное восстановление:</strong> После стресса организму требуются часы, чтобы вернуться в спокойное состояние.'
    ],
    scoreUnit: 'из 4 сигналов дисрегуляции активно',
    verdicts: [
      'Отметьте сигналы выше, чтобы оценить состояние вегетативной нервной системы.',
      'Легкая активация (1/4). 2 минуты дыхания с удлиненным выдохом помогут активировать блуждающий нерв.',
      'Умеренная дисрегуляция (2/4). Нервная система часто выходит за пределы окна толерантности.',
      'Высокий режим выживания (3/4). Сначала верните телу ощущение безопасности через заземление.',
      'Тяжелая перегрузка (4/4). Запустите интерактивную практику заземления 5-4-3-2-1 прямо сейчас.'
    ],
    primaryBtn: 'Пройти тест на уровень стресса и реакцию НС &rarr;',
    subBtn: 'Открыть практику заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'TRIASE SISTEM SARAF 30 DETIK',
    heading: 'Apakah Sistem Saraf Anda Sedang Disregulasi?',
    sub: 'Centang sinyal otonom yang Anda alami selama 7 hari terakhir:',
    items: [
      '<strong>Hiper-Arousal Simpatis:</strong> Jantung berdebar, napas pendek, rahang menegang, atau merasa sangat lelah tapi sulit tidur.',
      '<strong>Hipervigilansi Sensorik:</strong> Suara mendadak atau layar terang langsung memicu lonjakan ketegangan tubuh.',
      '<strong>Shutdown Vagal Dorsal:</strong> Mati rasa emosional, kabut otak (brain fog), atau ingin menarik diri sepenuhnya.',
      '<strong>Pemulihan Vagal Lambat:</strong> Setelah stres atau konflik kecil, butuh berjam-jam bagi tubuh untuk kembali tenang.'
    ],
    scoreUnit: 'dari 4 sinyal disregulasi aktif',
    verdicts: [
      'Centang sinyal di atas untuk memetakan kondisi sistem saraf otonom Anda.',
      'Aktivasi ringan (1/4). Lakukan pernapasan hembusan panjang selama 2 menit untuk menenangkan saraf vagus.',
      'Disregulasi sedang (2/4). Sistem saraf Anda sering keluar dari jendela toleransi optimal.',
      'Mode bertahan hidup tinggi (3/4). Utamakan grounding somatik sebelum memaksakan berpikir keras.',
      'Kelebihan beban otonom berat (4/4). Mulai latihan grounding sensorik 5-4-3-2-1 sekarang juga.'
    ],
    primaryBtn: 'Ikuti Tes Cek Stres &amp; Sistem Saraf &rarr;',
    subBtn: 'Buka Alat Grounding Sensorik 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK SİNİR SİSTEMİ TARAMASI',
    heading: 'Sinir Sisteminiz Şu Anda Düzensiz mi?',
    sub: 'Son 7 içinde yaşadığınız otonom sinir sistemi sinyallerini işaretleyin:',
    items: [
      '<strong>Sempatik Aşırı Uyarılma:</strong> Çarpıntı, sığ nefes, çene sıkma veya gece "çok yorgun ama uykuya dalamama" hali.',
      '<strong>Duyusal Aşırı Tetikte Olma:</strong> Ani sesler veya küçük ton değişimleri anında bedensel gerginlik yaratıyor.',
      '<strong>Dorsal Vagal Kapanma (Donma):</strong> Duygusal uyuşma, beyin sisi, aşırı ağırlık hissi ve içe çekilme isteği.',
      '<strong>Yavaş Vagal Toparlanma:</strong> Stresli bir durumdan sonra bedenin sakinleşmesi saatler sürüyor.'
    ],
    scoreUnit: '/ 4 düzensizlik sinyali aktif',
    verdicts: [
      'Mevcut otonom sinir sistemi durumunuzu görmek için yukarıdaki maddeleri işaretleyin.',
      'Hafif sempatik uyarılma (1/4). Vagus siniriniสมดุลlamak için 2 dakika uzun nefes verme egzersizi yapın.',
      'Orta düzey düzensizlik (2/4). Sinir sisteminiz sık sık tolerans penceresinin dışına çıkıyor.',
      'Yüksek hayatta kalma modu (3/4). Zihinsel analizden önce bedensel topraklanma (grounding) uygulayın.',
      'Şiddetli otonom aşırı yüklenme (4/4). Şimdi 5-4-3-2-1 duyusal topraklanma aracını başlatın.'
    ],
    primaryBtn: 'Ücretsiz Stres ve Sinir Sistemi Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Duyusal Topraklanma Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड तंत्रिका तंत्र (Nervous System) जांच',
    heading: 'क्या आपका नर्वस सिस्टम अभी असंतुलित है?',
    sub: 'पिछले 7 दिनों में महसूस किए गए शारीरिक और मानसिक संकेतों को चुनें:',
    items: [
      '<strong>सिम्पैथेटिक अति-सक्रियता:</strong> तेज़ धड़कन, उथली सांस, जबड़ा भींचना, या रात में "थके होने पर भी नींद न आना"।',
      '<strong>संवेदी अति-सतर्कता:</strong> अचानक आवाज़ या तेज़ रोशनी से शरीर में तुरंत तनाव बढ़ जाना।',
      '<strong>डॉर्सल वेगस शटडाउन:</strong> भावनात्मक सुन्नता, भारी थकान, ब्रेन फॉग या सबसे अलग होने की इच्छा।',
      '<strong>धीमी रिकवरी:</strong> किसी तनाव या छोटी बहस के बाद शरीर को शांत होने में घंटों लगना।'
    ],
    scoreUnit: '/ 4 असंतुलन संकेत सक्रिय हैं',
    verdicts: [
      'अपने नर्वस सिस्टम की स्थिति जानने के लिए ऊपर दिए गए संकेतों को चुनें।',
      'हल्का तनाव (1/4)। वेगस नर्व को शांत करने के लिए 2 मिनट लंबी सांस छोड़ने का अभ्यास करें।',
      'मध्यम असंतुलन (2/4)। आपका तंत्रिका तंत्र अपनी सहनशीलता की सीमा से बाहर जा रहा है।',
      'उच्च सर्वाइवल मोड (3/4)। ज्यादा सोचने से पहले शारीरिक ग्राउंडिंग तकनीक अपनाएं।',
      'गंभीर ओवरलोड (4/4)। तुरंत 5-4-3-2-1 सेंसरी ग्राउंडिंग टूल से नर्वस सिस्टम रीसेट करें।'
    ],
    primaryBtn: 'निःशुल्क स्ट्रेस और नर्वस सिस्टम टेस्ट लें &rarr;',
    subBtn: '5-4-3-2-1 सेंसरी ग्राउंडिंग टूल खोलें &rarr;'
  }
};

const EMOTION_REG_LOCALES = {
  en: {
    badge: '30-SECOND EMOTIONAL REGULATION TRIAGE',
    heading: 'What Is Your Current Emotional Regulation Capacity?',
    sub: 'Check the emotional reactivity patterns you have noticed over the past 2 weeks:',
    items: [
      '<strong>Amygdala Hijack (0-to-100 Spikes):</strong> Frustration, anxiety, or anger surges so fast that you say or do things before your rational brain can pause.',
      '<strong>Post-Trigger Rumination Loop:</strong> You replay tense conversations or mistakes in your head for hours, unable to shift attention.',
      '<strong>Suppression &amp; Bottling Up:</strong> You push uncomfortable feelings down to keep the peace until they erupt or cause physical tension.',
      '<strong>Emotional Flooding:</strong> Strong feelings quickly overwhelm your working memory, making it hard to think clearly or communicate needs.'
    ],
    scoreUnit: 'of 4 dysregulation patterns active',
    verdicts: [
      'Check the patterns above to evaluate your emotional regulation bandwidth.',
      'Solid baseline regulation (1/4). Cognitive reappraisal and brief breathwork will easily maintain your equilibrium.',
      'Moderate regulation strain (2/4). Stress is narrowing your window of tolerance—use structured emotion planning.',
      'High emotional reactivity (3/4). Your prefrontal braking system is fatigued; pair somatic breathing with CBT reappraisal.',
      'Severe emotional flooding (4/4). Build an immediate personalized regulation protocol before engaging in difficult talks.'
    ],
    primaryBtn: 'Open Interactive Emotion Regulation Planner &rarr;',
    subBtn: 'Take the Free Stress &amp; Trigger Check &rarr;'
  },
  ko: {
    badge: '30초 감정 조절 역량 트리아지',
    heading: '지금 나의 감정 조절 에너지는 충분한가요?',
    sub: '최근 2주간 갈등이나 스트레스 상황에서 반복된 감정 반응 패턴을 체크해보세요:',
    items: [
      '<strong>감정 급발진(편도체 납치):</strong> 화나 불안이 순식간에 치밀어 올라 이성적으로 멈추기 전에 말이나 행동이 먼저 나갑니다.',
      '<strong>사후 반추 루프(곱씹기):</strong> 불편했던 대화나 실수를 몇 시간이고 머릿속에서 되감기하며 주의를 돌리지 못합니다.',
      '<strong>감정 억압과 응어리:</strong> 분위기를 맞추려고 감정을 꾹 참았다가 나중에 폭발하거나 두통·소화불량 같은 신체 증상으로 나타납니다.',
      '<strong>감정 홍수(Emotional Flooding):</strong> 강한 감정이 밀려오면 머리가 하얘지고 내가 진짜 원하는 바를 차분히 말하기 어렵습니다.'
    ],
    scoreUnit: '개 감정 조절 과부하 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 전두엽 감정 조절 대역폭을 확인해보세요.',
      '양호한 조절 상태(1/4). 인지적 재해석과 짧은 호흡법만으로도 평정심을 잘 유지할 수 있습니다.',
      '중등도 감정 피로(2/4). 스트레스로 인해 감정 인내 창이 좁아졌습니다. 맞춤 감정 조절 플래너를 활용해보세요.',
      '높은 감정 반응성(3/4). 전두엽의 감정 브레이크가 지쳐 있습니다. 호흡 진정과 인지 재구성을 병행하세요.',
      '심각한 감정 과부하(4/4). 중요한 대화를 하기 전에 먼저 양방향 감정 조절 플래너로 진정 프로토콜을 설계하세요.'
    ],
    primaryBtn: '감정 조절 플래너 도구 바로 열기 &rarr;',
    subBtn: '무료 스트레스 &amp; 감정 트리거 진단하기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN EMOTIONSREGULATIONS-CHECK',
    heading: 'Wie stabil ist Ihre Emotionsregulation aktuell?',
    sub: 'Wählen Sie die Reaktionsmuster aus, die Sie in den letzten 2 Wochen erlebt haben:',
    items: [
      '<strong>Amygdala-Hijack (0-auf-100-Reaktion):</strong> Ärger oder Angst steigen so schnell auf, dass Sie impulsiv reagieren.',
      '<strong>Grübelschleifen nach Konflikten:</strong> Sie spielen unangenehme Gespräche stundenlang im Kopf wieder durch.',
      '<strong>Emotionale Unterdrückung:</strong> Sie schlucken Gefühle herunter, bis sie als körperliche Anspannung oder Ausbruch zurückkehren.',
      '<strong>Emotionale Überflutung:</strong> Starke Gefühle blockieren Ihr klares Denken und Ihre Kommunikationsfähigkeit.'
    ],
    scoreUnit: 'von 4 Mustern aktiv',
    verdicts: [
      'Wählen Sie die Muster oben aus, um Ihre emotionale Selbstregulation zu prüfen.',
      'Gute Grundregulation (1/4). Kognitive Neubewertung hält Ihr Gleichgewicht stabil.',
      'Mittlere Belastung (2/4). Nutzen Sie strukturierte Regulationsstrategien für akute Trigger.',
      'Hohe emotionale Reaktivität (3/4). Kombinieren Sie Atemtechniken mit kognitiver Umstrukturierung.',
      'Starke Überflutung (4/4). Erstellen Sie jetzt Ihren persönlichen Notfallplan im Emotions-Planer.'
    ],
    primaryBtn: 'Interaktiven Emotionsregulations-Planer öffnen &rarr;',
    subBtn: 'Zum kostenlosen Stress-Check &rarr;'
  },
  es: {
    badge: 'TRIAJE DE REGULACIÓN EMOCIONAL EN 30 SEGUNDOS',
    heading: '¿Cuál es tu capacidad actual de regulación emocional?',
    sub: 'Marca los patrones de reactividad que has notado en las últimas 2 semanas:',
    items: [
      '<strong>Secuestro amigdalino (de 0 a 100):</strong> La frustración o ansiedad sube tan rápido que reaccionas antes de pensar.',
      '<strong>Bucle de rumiación:</strong> Repites conversaciones tensas o errores durante horas sin poder desconectar.',
      '<strong>Supresión emocional:</strong> Guardas lo que sientes para evitar conflictos hasta que explotas o te somatizas.',
      '<strong>Inundación emocional:</strong> Las emociones intensas bloquean tu claridad mental y te impiden expresarte bien.'
    ],
    scoreUnit: 'de 4 patrones activos',
    verdicts: [
      'Marca los patrones arriba para evaluar tu capacidad de regulación emocional.',
      'Buena regulación base (1/4). La reevaluación cognitiva mantendrá tu equilibrio fácilmente.',
      'Tensión moderada (2/4). El estrés reduce tu tolerancia; usa un plan estructurado de regulación.',
      'Alta reactividad emocional (3/4). Combina respiración fisiológica con reestructuración cognitiva.',
      'Inundación emocional severa (4/4). Diseña ahora tu protocolo personalizado en el Planificador Emocional.'
    ],
    primaryBtn: 'Abrir Planificador de Regulación Emocional &rarr;',
    subBtn: 'Hacer el Chequeo Gratuito de Estrés &rarr;'
  },
  fr: {
    badge: 'TRIAGE DE RÉGULATION ÉMOTIONNELLE EN 30 SECONDES',
    heading: 'Quelle est votre capacité actuelle de régulation émotionnelle ?',
    sub: 'Cochez les schémas de réactivité observés ces 2 dernières semaines :',
    items: [
      '<strong>Piratage de l\'amygdale (0 à 100) :</strong> La colère ou l\'anxiété monte si vite que vous réagissez avant de réfléchir.',
      '<strong>Boucle de rumination :</strong> Vous repassez les discussions tendues en boucle pendant des heures.',
      '<strong>Suppression émotionnelle :</strong> Vous refoulez vos émotions jusqu\'à l\'épuisement ou l\'explosion.',
      '<strong>Submersion émotionnelle :</strong> Les émotions fortes bloquent votre clarté mentale et votre communication.'
    ],
    scoreUnit: 'sur 4 schémas actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer votre régulation émotionnelle.',
      'Bonne régulation (1/4). La réévaluation cognitive suffit à maintenir votre équilibre.',
      'Tension modérée (2/4). Utilisez un plan structuré pour élargir votre fenêtre de tolérance.',
      'Forte réactivité (3/4). Associez respiration apaisante et recadrage cognitif.',
      'Submersion sévère (4/4). Créez immédiatement votre protocole dans le Planificateur Émotionnel.'
    ],
    primaryBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;',
    subBtn: 'Faire le Bilan de Stress Gratuit &rarr;'
  },
  ja: {
    badge: '30秒・感情コントロール力チェック',
    heading: '今、あなたの感情調整エネルギーは足りていますか？',
    sub: '過去2週間で経験した感情の反応パターンをチェックしてください：',
    items: [
      '<strong>扁桃体ハイジャック（瞬間的な爆発）：</strong> 怒りや不安が急上昇し、理性で止める前に言葉や態度に出てしまう。',
      '<strong>反芻ループ（ぐるぐる思考）：</strong> 嫌だった会話や失敗を何時間も頭の中で再生し続けてしまう。',
      '<strong>感情の抑圧・我慢：</strong> 波風を立てないよう感情を押し殺し、後で爆発するか体調不良になる。',
      '<strong>感情の氾濫（フラッディング）：</strong> 強い感情に襲われると頭が真っ白になり、自分の気持ちをうまく伝えられない。'
    ],
    scoreUnit: '/ 4 個の感情負荷パターンが該当',
    verdicts: [
      '上の項目をチェックして、現在の前頭葉の感情調整キャパシティを確認しましょう。',
      '良好な調整力（1/4）。認知的再評価と深呼吸で十分に心の安定を保てています。',
      '中程度の感情疲労（2/4）。ストレスで余裕が減っています。感情調整プランナーで対策を整理しましょう。',
      '高い感情反応性（3/4）。心のブレーキが疲れています。呼吸法と認知の書き換えを組み合わせましょう。',
      '重度の感情オーバーロード（4/4）。今すぐ感情調整プランナーであなた専用の鎮静プロトコルを作成してください。'
    ],
    primaryBtn: '感情調整プランナーツールを開く &rarr;',
    subBtn: '無料ストレス＆トリガー診断を受ける &rarr;'
  },
  zh: {
    badge: '30秒情绪调节能力筛查',
    heading: '你当前的情绪调节带宽够用吗？',
    sub: '勾选你在过去两周内频繁出现的情绪反应模式：',
    items: [
      '<strong>杏仁核劫持（瞬间失控）：</strong> 挫败、焦虑或愤怒瞬间飙升，在理智刹车前就已经脱口而出。',
      '<strong>事后反刍循环（内耗）：</strong> 在脑海中反复回放紧张的对话或失误长达数小时，无法转移注意力。',
      '<strong>情绪压抑与憋闷：</strong> 为了维持表面和平而强行压下情绪，直到最后爆发或转化为躯体紧绷。',
      '<strong>情绪淹没（Flooding）：</strong> 强烈的情绪迅速占满工作记忆，导致大脑空白、难以清晰表达需求。'
    ],
    scoreUnit: '/ 4 项情绪调节失衡模式激活',
    verdicts: [
      '勾选上方模式，评估你当前的前额叶情绪调节容量。',
      '良好的调节基线 (1/4)。结合认知重评与深呼吸即可轻松保持内心平衡。',
      '中度调节疲劳 (2/4)。压力正在收窄你的耐受窗，建议使用结构化情绪规划工具。',
      '高情绪反应性 (3/4)。你的理性刹车系统已疲劳，请将生理呼吸与CBT认知重评结合使用。',
      '重度情绪淹没 (4/4)。建议立即打开互动式情绪调节规划器，定制你的专属平复方案。'
    ],
    primaryBtn: '打开互动式情绪调节规划器 &rarr;',
    subBtn: '开始免费压力与情绪触发测试 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM DE REGULAÇÃO EMOCIONAL EM 30 SEGUNDOS',
    heading: 'Qual é a sua capacidade atual de regulação emocional?',
    sub: 'Marque os padrões de reatividade que você notou nas últimas 2 semanas:',
    items: [
      '<strong>Sequestro da amígdala (0 a 100):</strong> A frustração ou ansiedade sobe tão rápido que você reage antes de pensar.',
      '<strong>Loop de ruminação:</strong> Você repete conversas tensas ou erros na cabeça por horas.',
      '<strong>Supressão emocional:</strong> Você engole sentimentos para manter a paz até explodir ou sentir tensão física.',
      '<strong>Inundação emocional:</strong> Emoções fortes bloqueiam sua clareza mental e comunicação.'
    ],
    scoreUnit: 'de 4 padrões ativos',
    verdicts: [
      'Marque os padrões acima para avaliar sua largura de banda emocional.',
      'Boa regulação base (1/4). A reavaliação cognitiva mantém seu equilíbrio facilmente.',
      'Tensão moderada (2/4). Use um plano estruturado de regulação emocional.',
      'Alta reatividade (3/4). Combine respiração calmante com reestruturação cognitiva.',
      'Inundação severa (4/4). Monte agora seu protocolo no Planejador de Regulação Emocional.'
    ],
    primaryBtn: 'Abrir Planejador de Regulação Emocional &rarr;',
    subBtn: 'Fazer o Teste Gratuito de Estresse &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ ЭМОЦИОНАЛЬНОЙ РЕГУЛЯЦИИ',
    heading: 'Насколько эффективно вы управляете эмоциями сейчас?',
    sub: 'Отметьте паттерны реактивности, которые проявлялись за последние 2 недели:',
    items: [
      '<strong>Захват миндалевидного тела (от 0 до 100):</strong> Раздражение или тревога вспыхивают быстрее, чем включается разум.',
      '<strong>Руминация после стресса:</strong> Вы часами прокручиваете в голове сложные разговоры или ошибки.',
      '<strong>Подавление эмоций:</strong> Вы загоняете чувства внутрь ради мира, пока они не выльются в срыв или спазмы.',
      '<strong>Эмоциональное затопление:</strong> Сильные чувства парализуют рабочую память и мешают ясно выражать мысли.'
    ],
    scoreUnit: 'из 4 паттернов активно',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить ресурс эмоциональной саморегуляции.',
      'Стабильная регуляция (1/4). Когнитивной переоценки достаточно для сохранения баланса.',
      'Умеренная нагрузка (2/4). Стресс сужает окно толерантности — используйте планировщик регуляции.',
      'Высокая реактивность (3/4). Сочетайте дыхательные техники с когнитивным переосмыслением.',
      'Сильная перегрузка (4/4). Составьте персональный протокол в Планировщике эмоциональной регуляции.'
    ],
    primaryBtn: 'Открыть Планировщик эмоциональной регуляции &rarr;',
    subBtn: 'Пройти бесплатный тест на стресс &rarr;'
  },
  id: {
    badge: 'TRIASE REGULASI EMOSI 30 DETIK',
    heading: 'Seberapa Stabil Kapasitas Regulasi Emosi Anda Saat Ini?',
    sub: 'Centang pola reaktivitas emosional yang Anda alami selama 2 minggu terakhir:',
    items: [
      '<strong>Bajak Amigdala (Lonjakan 0 ke 100):</strong> Frustrasi atau cemas muncul begitu cepat sebelum sempat berpikir jernih.',
      '<strong>Putaran Ruminasi:</strong> Memutar ulang percakapan tegang atau kesalahan di kepala selama berjam-jam.',
      '<strong>Memendam Emosi:</strong> Menekan perasaan tidak nyaman demi menghindari konflik hingga akhirnya meledak.',
      '<strong>Banjir Emosi (Emotional Flooding):</strong> Perasaan kuat membuat pikiran buntu dan sulit menyampaikan kebutuhan.'
    ],
    scoreUnit: 'dari 4 pola aktif',
    verdicts: [
      'Centang pola di atas untuk mengevaluasi kapasitas regulasi emosi Anda.',
      'Regulasi dasar stabil (1/4). Reappraisal kognitif sudah cukup menjaga keseimbangan Anda.',
      'Ketegangan sedang (2/4). Gunakan perencana regulasi emosi terstruktur.',
      'Reaktivitas tinggi (3/4). Padukan pernapasan somatik dengan restrukturisasi kognitif.',
      'Banjir emosi berat (4/4). Buat protokol penenangan pribadi Anda di Perencana Regulasi Emosi sekarang.'
    ],
    primaryBtn: 'Buka Perencana Regulasi Emosi Interaktif &rarr;',
    subBtn: 'Ikuti Tes Cek Stres Gratis &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK DUYGU DÜZENLEME TARAMASI',
    heading: 'Mevcut Duygu Düzenleme Kapasiteniz Ne Durumda?',
    sub: 'Son 2 haftada fark ettiğiniz duygusal tepki kalıplarını işaretleyin:',
    items: [
      '<strong>Amigdala Baskını (0\'dan 100\'e Tepki):</strong> Öfke veya kaygı o kadar hızlı yükseliyor ki düşünmeden tepki veriyorsunuz.',
      '<strong>Zihinsel Geviş Getirme (Ruminasyon):</strong> Gergin konuşmaları veya hataları saatlerce kafanızda tekrar oynatıyorsunuz.',
      '<strong>Duygu Bastırma:</strong> Huzuru bozmamak için duyguları içinize atıp sonunda patlama veya bedensel ağrı yaşıyorsunuz.',
      '<strong>Duygusal Taşma (Flooding):</strong> Yoğun duygular net düşünmenizi ve kendinizi ifade etmenizi kilitliyor.'
    ],
    scoreUnit: '/ 4 kalıp aktif',
    verdicts: [
      'Duygusal düzenleme kapasitenizi ölçmek için yukarıdaki maddeleri işaretleyin.',
      'Sağlam temel düzenleme (1/4). Bilişsel yeniden değerlendirme dengenizi korumak için yeterli.',
      'Orta düzey zorlanma (2/4). Yapılandırılmış duygu düzenleme planlayıcısını kullanın.',
      'Yüksek duygusal tepkisellik (3/4). Nefes egzersizlerini bilişsel yeniden çerçeveleme ile birleştirin.',
      'Şiddetli duygusal taşma (4/4). Şimdi Duygu Düzenleme Planlayıcısında kişisel protokolünüzü oluşturun.'
    ],
    primaryBtn: 'Etkileşimli Duygu Düzenleme Planlayıcısını Aç &rarr;',
    subBtn: 'Ücretsiz Stres Testini Çöz &rarr;'
  },
  hi: {
    badge: '30-सेकंड भावनात्मक नियंत्रण (Emotional Regulation) जांच',
    heading: 'आपकी भावनात्मक नियंत्रण क्षमता अभी कैसी है?',
    sub: 'पिछले 2 सप्ताह में अनुभव किए गए भावनात्मक पैटर्न को चुनें:',
    items: [
      '<strong>अमिगडाला हाईजैक (तुरंत गुस्सा/चिंता):</strong> भावनाएं इतनी तेज़ी से बढ़ती हैं कि सोचने से पहले ही प्रतिक्रिया निकल जाती है।',
      '<strong>बार-बार सोचना (Rumination):</strong> किसी तनावपूर्ण बातचीत या गलती को घंटों दिमाग में दोहराते रहना।',
      '<strong>भावनाओं को दबाना:</strong> शांति बनाए रखने के लिए भावनाओं को अंदर दबाना जब तक वे फूट न पड़ें।',
      '<strong>भावनात्मक बाढ़ (Emotional Flooding):</strong> तीव्र भावनाओं के कारण दिमाग सुन्न होना और अपनी बात स्पष्ट न कह पाना।'
    ],
    scoreUnit: '/ 4 पैटर्न सक्रिय हैं',
    verdicts: [
      'अपनी भावनात्मक नियंत्रण क्षमता जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'अच्छा संतुलन (1/4)। कॉग्निटिव रीअप्रेजल और गहरी सांस से संतुलन बना रहेगा।',
      'मध्यम दबाव (2/4)। तनाव आपकी सहनशीलता कम कर रहा है—इमोशन प्लानर का उपयोग करें।',
      'उच्च भावनात्मक प्रतिक्रिया (3/4)। श्वास तकनीक और वैचारिक पुनर्गठन को साथ अपनाएं।',
      'गंभीर भावनात्मक ओवरलोड (4/4)। तुरंत इमोशन रेगुलेशन प्लानर में अपना शांत प्रोटोकॉल बनाएं।'
    ],
    primaryBtn: 'इमोशन रेगुलेशन प्लानर टूल खोलें &rarr;',
    subBtn: 'निःशुल्क स्ट्रेस टेस्ट लें &rarr;'
  }
};

const ANXIOUS_ATTACHMENT_LOCALES = {
  en: {
    badge: '30-SECOND ATTACHMENT HYPERACTIVATION CHECK',
    heading: 'Is Your Anxious Attachment System Activated Right Now?',
    sub: 'Check the relational hypervigilance patterns you experience when you sense distance:',
    items: [
      '<strong>Text-Latency Panic:</strong> A delayed reply or shorter message immediately triggers a chest drop and catastrophic "they are losing interest" narratives.',
      '<strong>Micro-Shift Scanning:</strong> You constantly monitor your partner\'s tone, facial expressions, and energy shifts, assuming any quietness is your fault.',
      '<strong>Protest Urges:</strong> When feeling insecure, you feel a strong urge to double-text, test their love, pick a fight for reassurance, or act distant.',
      '<strong>Mental Bandwidth Hijack:</strong> When connection feels uncertain, you cannot focus on work, sleep, or hobbies until reassurance is restored.'
    ],
    scoreUnit: 'of 4 hyperactivation signals active',
    verdicts: [
      'Check the signals above to measure your attachment system activation level.',
      'Mild relational sensitivity (1/4). Pause and name the story your mind is telling before seeking reassurance.',
      'Moderate attachment anxiety (2/4). Your threat-detection system is over-interpreting normal space as abandonment.',
      'High protest activation (3/4). De-escalate somatic panic for 90 seconds before sending any message.',
      'Severe attachment panic (4/4). Your nervous system is in full abandonment alarm—ground your body first and map your exact attachment profile.'
    ],
    primaryBtn: 'Take the 4-Style Attachment Assessment &rarr;',
    subBtn: 'Calm Attachment Panic with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 불안형 애착 과활성 체크',
    heading: '지금 내 불안형 애착 경보 시스템이 켜져 있나요?',
    sub: '연인이나 가까운 사람에게서 거리감이 느껴질 때 나타나는 반응 패턴을 체크해보세요:',
    items: [
      '<strong>답장 지연 공황:</strong> 연락이 조금만 늦어지거나 말투가 짧아져도 가슴이 철렁하고 "마음이 식었나?" 하는 최악의 시나리오가 떠오릅니다.',
      '<strong>미세 감정 스캐닝:</strong> 상대방의 표정, 목소리 톤, 기분 변화를 초단위로 살피며 상대가 조용하면 내 탓이라고 생각합니다.',
      '<strong>저항 행동(Protest Behavior) 충동:</strong> 불안할 때 확인 카톡을 연달아 보내거나, 사랑을 시험하거나, 일부러 토라져서 관심을 끌고 싶어집니다.',
      '<strong>일상 집중력 마비:</strong> 관계가 불안정하다고 느껴지면 상대의 확신을 얻을 때까지 업무, 공부, 취미에 전혀 집중할 수 없습니다.'
    ],
    scoreUnit: '개 애착 과활성 신호 감지 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 관계 내 애착 불안 활성도를 확인해보세요.',
      '경미한 관계 민감성(1/4). 안심을 요구하기 전에 내 머릿속이 만들어낸 소설과 사실을 구분해보세요.',
      '중등도 애착 과활성(2/4). 뇌의 위협 감지 시스템이 상대의 자연스러운 개인 시간을 버림받음으로 오해하고 있습니다.',
      '높은 저항 행동 충동(3/4). 카톡을 보내기 전에 90초 동안 신체적 불안 파도를 먼저 가라앉히세요.',
      '심각한 애착 패닉 상태(4/4). 유기 불안 경보가 최대치입니다. 오감 그라운딩으로 몸을 진정시키고 나의 정확한 애착 유형을 진단해보세요.'
    ],
    primaryBtn: '무료 4가지 애착유형 정밀 테스트 시작 &rarr;',
    subBtn: '5-4-3-2-1 그라운딩으로 관계 불안 진정시키기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN BINDUNGSANGST-CHECK',
    heading: 'Ist Ihr ängstliches Bindungssystem gerade aktiviert?',
    sub: 'Wählen Sie die Muster aus, die auftreten, wenn Ihr Partner distanziert wirkt:',
    items: [
      '<strong>Antwort-Panik:</strong> Eine späte Nachricht löst sofort Herzklopfen und Katastrophengedanken („Er/Sie verliert das Interesse“) aus.',
      '<strong>Stimmungs-Scanning:</strong> Sie analysieren kleinste Veränderungen in Tonfall oder Mimik und beziehen Schweigen sofort auf sich.',
      '<strong>Protestverhalten-Impuls:</strong> Aus Unsicherheit möchten Sie doppelt schreiben, Bestätigung einfordern oder Streit provozieren.',
      '<strong>Gedanken-Blockade:</strong> Solange die Verbindung unsicher wirkt, können Sie sich kaum auf Arbeit oder Alltag konzentrieren.'
    ],
    scoreUnit: 'von 4 Überaktivierungs-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Signale oben aus, um Ihre Bindungsaktivierung zu prüfen.',
      'Leichte Sensibilität (1/4). Trennen Sie Fakten von alten Verlustängsten.',
      'Mittlere Bindungsangst (2/4). Ihr Alarmsystem deutet normalen Freiraum als Verlassenwerden.',
      'Hoher Protest-Impuls (3/4). Beruhigen Sie erst Ihren Körper, bevor Sie eine Nachricht senden.',
      'Akute Bindungspanik (4/4). Nutzen Sie sofort das 5-4-3-2-1 Grounding und prüfen Sie Ihren Bindungstyp.'
    ],
    primaryBtn: 'Zum kostenlosen Bindungstyp-Test &rarr;',
    subBtn: 'Bindungspanik mit 5-4-3-2-1 Grounding beruhigen &rarr;'
  },
  es: {
    badge: 'CHEQUEO DE HIPERACTIVACIÓN DE APEGO EN 30 SEGUNDOS',
    heading: '¿Está activado tu sistema de apego ansioso ahora mismo?',
    sub: 'Marca los patrones que experimentas cuando sientes distancia en tu relación:',
    items: [
      '<strong>Pánico por demora en mensajes:</strong> Una respuesta tardía o breve dispara un vacío en el pecho y pensamientos de abandono.',
      '<strong>Escaneo de microcambios:</strong> Analizas cada cambio de tono o gesto de tu pareja, asumiendo que su silencio es culpa tuya.',
      '<strong>Impulsos de protesta:</strong> Sientes urgencia de enviar varios mensajes, buscar pelea para forzar atención o poner a prueba su amor.',
      '<strong>Secuestro mental:</strong> Cuando sientes incertidumbre afectiva, no logras concentrarte en tu trabajo ni descansar.'
    ],
    scoreUnit: 'de 4 señales de hiperactivación activas',
    verdicts: [
      'Marca las señales arriba para medir la activación de tu sistema de apego.',
      'Sensibilidad leve (1/4). Cuestiona la historia catastrófica antes de pedir reaseguramiento.',
      'Ansiedad de apego moderada (2/4). Tu cerebro interpreta el espacio normal como amenaza de abandono.',
      'Alta activación de protesta (3/4). Regula tu cuerpo durante 90 segundos antes de enviar un mensaje.',
      'Pánico de apego severo (4/4). Calma tu sistema nervioso con anclaje 5-4-3-2-1 y descubre tu perfil de apego.'
    ],
    primaryBtn: 'Hacer el Test de Estilo de Apego Gratis &rarr;',
    subBtn: 'Calmar el Pánico con Anclaje 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'BILAN D\'HYPERACTIVATION D\'ATTACHEMENT EN 30 SECONDES',
    heading: 'Votre système d\'attachement anxieux est-il activé ?',
    sub: 'Cochez les réactions que vous vivez lorsque vous percevez une distance :',
    items: [
      '<strong>Panique des messages tardifs :</strong> Une réponse lente déclenche une angoisse immédiate et la peur que l\'autre se désintéresse.',
      '<strong>Scan émotionnel permanent :</strong> Vous scrutez le moindre changement de ton ou de regard en pensant que c\'est de votre faute.',
      '<strong>Comportements de protestation :</strong> Besoin pressant de relancer, de tester son amour ou de provoquer une réaction.',
      '<strong>Obsession relationnelle :</strong> Tant que vous n\'êtes pas rassuré(e), impossible de vous concentrer sur votre quotidien.'
    ],
    scoreUnit: 'sur 4 signaux d\'hyperactivation actifs',
    verdicts: [
      'Cochez les signaux ci-dessus pour évaluer votre anxiété d\'attachement.',
      'Sensibilité légère (1/4). Distinguez les faits actuels de vos anciennes blessures.',
      'Anxiété modérée (2/4). Votre système d\'alarme confond besoin d\'espace et abandon.',
      'Forte impulsion de protestation (3/4). Apaisez votre corps 90 secondes avant d\'écrire.',
      'Panique d\'attachement sévère (4/4). Utilisez l\'ancrage 5-4-3-2-1 et découvrez votre profil d\'attachement.'
    ],
    primaryBtn: 'Faire le Test de Style d\'Attachement &rarr;',
    subBtn: 'Apaiser l\'Angoisse avec l\'Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒・不安型愛着システム過覚醒チェック',
    heading: '今、あなたの「見捨てられ不安」アラームが鳴っていませんか？',
    sub: 'パートナーや大切な人との間に距離を感じたときの反応をチェックしてください：',
    items: [
      '<strong>返信遅れパニック：</strong> 連絡が少し遅い・文面が短いだけで胸がざわつき、「嫌われたかも」と最悪の想像をしてしまう。',
      '<strong>機嫌・声色の過剰スキャン：</strong> 相手の表情や声のトーンの微妙な変化を常に監視し、元気がないと自分のせいだと思う。',
      '<strong>抗議行動（プロテスト）の衝動：</strong> 不安になると追いLINEをしたり、愛情を試すような駆け引きや喧嘩を仕掛けてしまう。',
      '<strong>脳内メモリの占拠：</strong> 関係が不安なときは、相手から安心を得られるまで仕事や趣味に全く手がつかなくなる。'
    ],
    scoreUnit: '/ 4 個の愛着過覚醒サインが該当',
    verdicts: [
      '上の項目をチェックして、現在の愛着システムの活性化レベルを確認しましょう。',
      '軽度の感受性（1/4）。安心を求める前に、頭の中のストーリーと事実を切り分けましょう。',
      '中程度の愛着不安（2/4）。相手の自然な一人の時間を「見捨てられ」と誤認しやすくなっています。',
      '高い抗議衝動（3/4）。連絡を送る前に、まず90秒間だけ身体の緊張をクールダウンさせましょう。',
      '重度の愛着パニック（4/4）。見捨てられ警報が最大化しています。5-4-3-2-1グラウンディングで体を落ち着かせ、愛着スタイル診断を受けてください。'
    ],
    primaryBtn: '無料・愛着スタイル診断テストを受ける &rarr;',
    subBtn: '5-4-3-2-1 グラウンディングで不安を鎮める &rarr;'
  },
  zh: {
    badge: '30秒焦虑型依恋高唤醒筛查',
    heading: '你的“被抛弃警报系统”现在被触发了吗？',
    sub: '勾选当你察觉到伴侣似乎有些冷淡或距离感时的真实反应：',
    items: [
      '<strong>回信延迟恐慌：</strong> 消息晚回一会儿或语气变短，胸口就瞬间一紧，开始脑补“TA是不是不爱我了”。',
      '<strong>微表情与语气雷达：</strong> 时刻扫描对方的眼神、语气和情绪变化，对方一旦沉默就觉得是自己做错了什么。',
      '<strong>抗议行为冲动：</strong> 缺乏安全感时，忍不住连发消息追问、试探对方底线，或故意冷战博取关注。',
      '<strong>注意力完全被劫持：</strong> 只要关系存在不确定感，在得到安抚前完全无法专注工作、学习或自己的生活。'
    ],
    scoreUnit: '/ 4 项依恋高唤醒信号激活',
    verdicts: [
      '勾选上方信号，评估你当前的依恋系统激活水平。',
      '轻度关系敏感 (1/4)。在索取确认前，先区分“脑海中的灾难故事”与客观事实。',
      '中度依恋焦虑 (2/4)。你的威胁雷达正把伴侣正常的个人空间误判为抛弃信号。',
      '高度抗议冲动 (3/4)。在发出追问消息前，请先给自己90秒进行躯体降温。',
      '重度依恋恐慌 (4/4)。你的神经系统正处于最高级别警报——请先用5-4-3-2-1感官着陆平复身体，并测算你的依恋类型。'
    ],
    primaryBtn: '开始免费 4 型依恋风格深度测试 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆平复依恋恐慌 &rarr;'
  },
  pt: {
    badge: 'CHECAGEM DE APEGO ANSIOSO EM 30 SEGUNDOS',
    heading: 'Seu sistema de apego ansioso está ativado agora?',
    sub: 'Marque as reações que você sente quando percebe distância no relacionamento:',
    items: [
      '<strong>Pânico de resposta tardia:</strong> Uma demora no WhatsApp dispara aperto no peito e pensamentos de que a pessoa perdeu o interesse.',
      '<strong>Radar de microexpressões:</strong> Você monitora o tom de voz e humor do parceiro o tempo todo, achando que qualquer silêncio é culpa sua.',
      '<strong>Impulso de protesto:</strong> Vontade intensa de mandar várias mensagens, testar o amor ou provocar discussão para ter atenção.',
      '<strong>Sequestro de foco:</strong> Quando a relação parece incerta, você não consegue trabalhar nem descansar até receber validação.'
    ],
    scoreUnit: 'de 4 sinais de hiperativação ativos',
    verdicts: [
      'Marque os sinais acima para medir a ativação do seu sistema de apego.',
      'Sensibilidade leve (1/4). Separe os fatos reais das histórias catastróficas da mente.',
      'Ansiedade de apego moderada (2/4). Seu cérebro está confundindo espaço saudável com abandono.',
      'Alto impulso de protesto (3/4). Acalme o corpo por 90 segundos antes de enviar mensagens.',
      'Pânico de apego severo (4/4). Use o aterramento 5-4-3-2-1 agora e descubra seu estilo de apego.'
    ],
    primaryBtn: 'Fazer o Teste de Estilo de Apego Gratuito &rarr;',
    subBtn: 'Acalmar a Ansiedade com Aterramento 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ ТРЕВОЖНОЙ ПРИВЯЗАННОСТИ',
    heading: 'Активирована ли ваша система тревожной привязанности?',
    sub: 'Отметьте реакции, которые возникают, когда партнер кажется отдаленным:',
    items: [
      '<strong>Паника из-за долгих ответов:</strong> Задержка сообщения вызывает сжатие в груди и мысли «я больше не важен/не нужна».',
      '<strong>Сканирование настроения:</strong> Вы ловите малейшие изменения интонации или взгляда, принимая молчание на свой счет.',
      '<strong>Импульс протестного поведения:</strong> Желание писать снова и снова, проверять чувства или провоцировать спор ради внимания.',
      '<strong>Захват мыслей:</strong> Пока нет подтверждения близости, вы не можете сосредоточиться на работе и своих делах.'
    ],
    scoreUnit: 'из 4 сигналов гиперактивации активно',
    verdicts: [
      'Отметьте сигналы выше, чтобы оценить уровень тревоги привязанности.',
      'Легкая чувствительность (1/4). Отделите факты от пугающих домыслов перед тем, как искать подтверждения.',
      'Умеренная тревога (2/4). Мозг воспринимает нормальную дистанцию как угрозу отвержения.',
      'Высокий протестный импульс (3/4). Сделайте паузу на 90 секунд, прежде чем отправлять сообщение.',
      'Острая паника привязанности (4/4). Сначала заземлитесь через практику 5-4-3-2-1 и определите свой тип привязанности.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности &rarr;',
    subBtn: 'Снять панику через заземление 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'CEK HIPERAKTIVASI ATTACHMENT 30 DETIK',
    heading: 'Apakah Sistem Attachment Cemas Anda Sedang Aktif?',
    sub: 'Centang pola yang muncul saat pasangan terasa mulai menjauh:',
    items: [
      '<strong>Panik Balasan Chat Lama:</strong> Chat yang dibalas singkat atau lama langsung memicu rasa sesak dan pikiran negatif.',
      '<strong>Radar Perubahan Mood:</strong> Terus memantau nada bicara dan ekspresi pasangan, mengira diamnya mereka adalah salah Anda.',
      '<strong>Dorongan Perilaku Protes:</strong> Ingin mengirim chat beruntun, menguji cinta mereka, atau memancing debat demi mendapat kepastian.',
      '<strong>Fokus Harian Lumpuh:</strong> Saat hubungan terasa tidak pasti, Anda sulit fokus bekerja atau istirahat sampai ditenangkan.'
    ],
    scoreUnit: 'dari 4 sinyal hiperaktivasi aktif',
    verdicts: [
      'Centang sinyal di atas untuk mengukur tingkat aktivasi kecemasan relasi Anda.',
      'Sensitivitas ringan (1/4). Pisahkan fakta dari skenario terburuk di pikiran Anda.',
      'Kecemasan sedang (2/4). Sistem ancaman Anda menganggap ruang pribadi normal sebagai penolakan.',
      'Dorongan protes tinggi (3/4). Tenangkan tubuh selama 90 detik sebelum mengirim pesan.',
      'Panik attachment berat (4/4). Gunakan grounding 5-4-3-2-1 sekarang dan cek profil gaya kelekatan Anda.'
    ],
    primaryBtn: 'Ikuti Tes Gaya Attachment Gratis &rarr;',
    subBtn: 'Tenangkan Panik dengan Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK KAYGILI BAĞLANMA TARAMASI',
    heading: 'Kaygılı Bağlanma Sisteminiz Şu Anda Tetiklendi mi?',
    sub: 'İlişkide mesafe hissettiğinizde yaşadığınız tepkileri işaretleyin:',
    items: [
      '<strong>Geç Mesaj Paniği:</strong> Geç gelen veya kısa bir yanıt anında göğüste sıkışma ve "ilgisini kaybediyor" senaryoları başlatıyor.',
      '<strong>Mikro-Mimik Taraması:</strong> Partnerinizin ses tonunu ve modunu sürekli analiz edip sessizliğini kendi hatanız sanıyorsunuz.',
      '<strong>Protesto Davranışı Dürtüsü:</strong> Güvensizlik anında üst üste yazma, sevgisini test etme veya ilgi için tartışma çıkarma isteği.',
      '<strong>Zihinsel Kilitlenme:</strong> İlişkide belirsizlik varken onay alana kadar işe veya günlük hayata odaklanamama.'
    ],
    scoreUnit: '/ 4 aşırı uyarılma sinyali aktif',
    verdicts: [
      'Bağlanma sisteminizin uyarılma düzeyini ölçmek için yukarıdaki maddeleri işaretleyin.',
      'Hafif hassasiyet (1/4). Onay aramadan önce zihninizin yazdığı felaket senaryosunu fark edin.',
      'Orta düzey bağlanma kaygısı (2/4). Tehdit sisteminiz normal kişisel alanı terk edilme olarak algılıyor.',
      'Yüksek protesto dürtüsü (3/4). Mesaj atmadan önce 90 saniye bedensel kaygıyı yatıştırın.',
      'Şiddetli bağlanma paniği (4/4). Önce 5-4-3-2-1 topraklanma aracını kullanın ve bağlanma stilinizi test edin.'
    ],
    primaryBtn: 'Ücretsiz Bağlanma Stili Testini Çöz &rarr;',
    subBtn: '5-4-3-2-1 Topraklanma ile Kaygıyı Yatıştır &rarr;'
  },
  hi: {
    badge: '30-सेकंड एंग्शियस अटैचमेंट (Anxious Attachment) जांच',
    heading: 'क्या आपका अटैचमेंट अलार्म सिस्टम अभी सक्रिय है?',
    sub: 'रिश्ते में थोड़ी दूरी महसूस होने पर होने वाली प्रतिक्रियाओं को चुनें:',
    items: [
      '<strong>देर से रिप्लाई आने पर घबराहट:</strong> मैसेज का जवाब देर से या छोटा आने पर तुरंत सीने में भारीपन और नकारात्मक विचार आना।',
      '<strong>मूड और लहजे की लगातार स्कैनिंग:</strong> पार्टनर के चेहरे के भाव और आवाज़ के बदलाव को परखना और उनकी चुप्पी को अपनी गलती मानना।',
      '<strong>प्रोटेस्ट व्यवहार की इच्छा:</strong> असुरक्षा महसूस होने पर बार-बार मैसेज करने, प्यार की परीक्षा लेने या ध्यान खींचने की तीव्र इच्छा।',
      '<strong>ध्यान भटकना:</strong> जब तक रिश्ते में आश्वासन न मिल जाए, काम या पढ़ाई में बिल्कुल मन न लगना।'
    ],
    scoreUnit: '/ 4 संकेत सक्रिय हैं',
    verdicts: [
      'अपने अटैचमेंट सिस्टम के स्तर को जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'हल्की संवेदनशीलता (1/4)। आश्वासन मांगने से पहले कल्पना और वास्तविकता में अंतर करें।',
      'मध्यम अटैचमेंट चिंता (2/4)। आपका मन सामान्य स्पेस को भी अस्वीकृति समझ रहा है।',
      'उच्च प्रोटेस्ट आवेग (3/4)। कोई भी संदेश भेजने से पहले 90 सेकंड तक शरीर को शांत करें।',
      'गंभीर अटैचमेंट पैनिक (4/4)। पहले 5-4-3-2-1 ग्राउंडिंग से खुद को शांत करें और अपना अटैचमेंट स्टाइल जानें।'
    ],
    primaryBtn: 'निःशुल्क अटैचमेंट स्टाइल टेस्ट लें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग टूल से घबराहट शांत करें &rarr;'
  }
};

const KPOP_EN_SPEC = {
  lang: 'en',
  id: 'kpopRoleScreener',
  chkClass: 'kpop-screener-chk',
  badge: '30-SECOND K-POP POSITION MATCHER',
  heading: 'Which K-Pop Group Role Matches Your Stage Energy?',
  sub: 'Check the performance and team strengths that fit you best:',
  items: [
    '<strong>High-Note &amp; Chorus Anchor (Vocal):</strong> You gravitate toward emotional melodies, ad-libs, and carrying the sonic core of a track.',
    '<strong>Choreography &amp; Formation Precision (Dance):</strong> You notice rhythm breaks immediately and love leading high-impact movement transitions.',
    '<strong>Flow, Verse Writing &amp; Charisma (Rap):</strong> You bring rhythmic punch, lyrical attitude, and contrast that shifts the energy of a song.',
    '<strong>Team Glue &amp; Spotlight Magnet (Leader / Center):</strong> You naturally organize group dynamics or command visual attention during key killing parts.'
  ],
  scoreUnit: 'of 4 idol dimensions selected',
  verdicts: [
    'Select your strengths above to preview your group role profile.',
    'Focused Specialist (1/4). You shine brightest with a clear Main or Lead position responsibility.',
    'Dual-Position Unit Threat (2/4). Like many 4th/5th-gen idols, you bridge two core positions seamlessly.',
    'Multi-Role Ace (3/4). You can cover chorus vocals, dance breaks, and concept transitions across comebacks.',
    'Full All-Rounder / Golden Maknae Profile (4/4). You have the versatility to anchor any 3–12 member debut lineup.'
  ],
  primaryHref: '/kpop-position/?lang=en&start=1&surface=en_kpop_screener',
  primaryTargetSlug: 'kpop-position',
  primaryBtn: 'Take the Full K-Pop Position Test &rarr;',
  subHref: '/portal/tools/kpop-role-roster.html?lang=en&source=en_kpop_screener',
  subBtn: 'Build a Custom Group Lineup in the Roster Planner &rarr;'
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
  const existingScreenerRegex = new RegExp(`<div class="screener-box" id="${cfg.id}">[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>`);

  if (existingScreenerRegex.test(content)) {
    content = content.replace(existingScreenerRegex, markup);
  } else if (mode === 'after-first-highlight') {
    const hlRegex = /(<div class="highlight-box">[\s\S]*?<\/div>)/;
    const ctaBoxRegex = /<div class="cta-box">[\s\S]*?<\/div>/;
    if (hlRegex.test(content)) {
      content = content.replace(hlRegex, `$1\n\n            ${markup}`);
    } else if (ctaBoxRegex.test(content)) {
      content = content.replace(ctaBoxRegex, markup);
    } else {
      console.warn(`[WARN] No .highlight-box or .cta-box found in ${filePath}`);
    }
  } else if (mode === 'after-note') {
    const noteRegex = /(<div class="note">[\s\S]*?<\/div>)/;
    if (noteRegex.test(content)) {
      content = content.replace(noteRegex, `$1\n\n                ${markup}`);
    } else {
      console.warn(`[WARN] No .note found in ${filePath}`);
    }
  } else {
    const ctaBoxRegex = /<div class="cta-box">[\s\S]*?<\/div>/;
    const actionSectionRegex = /(<section class="action"[\s\S]*?<\/section>)/;
    if (ctaBoxRegex.test(content)) {
      content = content.replace(ctaBoxRegex, markup);
    } else if (actionSectionRegex.test(content)) {
      content = content.replace(actionSectionRegex, `$1\n\n      ${markup}`);
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

  // 1. Nervous System Regulation Techniques (12 locales)
  for (const [lang, loc] of Object.entries(NERVOUS_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'nervous-system-regulation-techniques.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'nervousScreener',
      chkClass: 'nerv-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=nervous_system_cta`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=nervous_system_screener`,
      subBtn: loc.subBtn
    }, 'replace-cta');
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/nervous-system-regulation-techniques.html`);
    console.log(`[PASS] nervous-system-regulation-techniques (${lang})`);
  }

  // 2. Emotional Regulation Techniques (12 locales)
  for (const [lang, loc] of Object.entries(EMOTION_REG_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'emotional-regulation-techniques.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'emotionRegScreener',
      chkClass: 'emoreg-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=emotion_reg_screener`,
      primaryTargetSlug: 'emotion-regulation-planner',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/?lang=${lang}&source=emotion_reg_screener`,
      subBtn: loc.subBtn
    }, 'replace-cta');
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/emotional-regulation-techniques.html`);
    console.log(`[PASS] emotional-regulation-techniques (${lang})`);
  }

  // 3. Anxious Attachment Style Relationships (12 locales)
  for (const [lang, loc] of Object.entries(ANXIOUS_ATTACHMENT_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'anxious-attachment-style-relationships.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'anxiousAttachScreener',
      chkClass: 'anxatt-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=anxious_attach_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=anxious_attach_screener`,
      subBtn: loc.subBtn
    }, 'after-first-highlight');
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/anxious-attachment-style-relationships.html`);
    console.log(`[PASS] anxious-attachment-style-relationships (${lang})`);
  }

  // 4. K-Pop Positions Explained Guide (EN)
  const kpopPath = path.join(PORTAL_BLOG, 'en', 'kpop-positions-explained-guide.html');
  if (fs.existsSync(kpopPath)) {
    applyScreenerToFile(kpopPath, KPOP_EN_SPEC, 'after-note');
    changedUrls.push('https://dopabrain.com/portal/blog/en/kpop-positions-explained-guide.html');
    console.log('[PASS] en/kpop-positions-explained-guide.html');
  }

  // 5. Also include the 4 updated portal tools in sitemap sync
  const toolUrls = [
    'https://dopabrain.com/portal/tools/grounding-exercise.html',
    'https://dopabrain.com/portal/tools/burnout-stress-differential.html',
    'https://dopabrain.com/portal/tools/cognitive-load-calculator.html',
    'https://dopabrain.com/portal/tools/dopamine-detox-protocol.html'
  ];

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of [...changedUrls, ...toolUrls]) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs + ${toolUrls.length} tool URLs in sitemaps.`);
}

run();

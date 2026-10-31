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

const SOCIAL_ANXIETY_LOCALES = {
  en: {
    badge: '30-SECOND SOCIAL ANXIETY & SPOTLIGHT EFFECT SCREENER',
    heading: 'Is It Shyness—or Social Evaluation Threat Activation?',
    sub: 'Check the nervous system responses that fire before, during, or after social interactions:',
    items: [
      '<strong>Anticipatory Dread &amp; Avoidance:</strong> You rehearse excuses to cancel plans or dread simple phone calls days in advance.',
      '<strong>Hyper-Monitoring Under the "Spotlight":</strong> In groups, you monitor your voice tone, posture, and eye contact so closely that you cannot stay present.',
      '<strong>Somatic Threat Alarm:</strong> Speaking up in meetings or meeting new people triggers a racing heart, hot face, tight throat, or shaky hands.',
      '<strong>Post-Event Autopsy Loop:</strong> Hours after a conversation ends, your brain replays every sentence to check if you sounded awkward or foolish.'
    ],
    scoreUnit: 'of 4 social anxiety threat signals active',
    verdicts: [
      'Check the items above to evaluate whether your social nervous system is in threat-monitoring mode.',
      'Mild Situational Shyness (1/4). Normal social warm-up time without chronic threat activation.',
      'Moderate Spotlight Sensitivity (2/4). Fear of negative evaluation is taxing your social battery.',
      'High Social Threat Activation (3/4). Your amygdala treats everyday social visibility like physical danger.',
      'Severe Social Anxiety Loop (4/4). Anticipatory dread and post-event replay are draining your nervous system—measure your stress load now.'
    ],
    primaryBtn: 'Take the 3-Minute Stress &amp; Social Anxiety Check &rarr;',
    subBtn: 'Calm Social Panic with 5-4-3-2-1 Grounding &rarr;'
  },
  ko: {
    badge: '30초 사회불안(Social Anxiety) 및 조명 효과 판별기',
    heading: '단순한 내향성·수줍음일까요, 사회적 평가 위협 반응일까요?',
    sub: '사회적 상황 전·중·후에 신경계에서 작동하는 반응을 체크해보세요:',
    items: [
      '<strong>사전 예기불안 및 회피 충동:</strong> 모임이나 간단한 전화 통화조차 며칠 전부터 부담스러워 취소할 핑계를 고민합니다.',
      '<strong>과도한 자기 검열(조명 효과):</strong> 대화 중 내 목소리 톤, 표정, 시선이 어색해 보일까 봐 실시간으로 감시하느라 대화에 집중하기 어렵습니다.',
      '<strong>신체적 위협 경보:</strong> 회의에서 발언하거나 낯선 사람을 만날 때 심장이 빨리 뛰고 얼굴이 화끈거리거나 목이 메고 손이 떨립니다.',
      '<strong>만남 후 대화 부검(Post-Event Autopsy):</strong> 집으로 돌아온 뒤에도 내가 했던 말실수나 어색했던 순간을 몇 시간이고 되감기하며 자책합니다.'
    ],
    scoreUnit: '개 사회불안 위협 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내향적 성향과 사회불안 신경계 과각성을 구분해보세요.',
      '가벼운 상황적 수줍음(1/4). 낯선 환경에 적응할 때 나타나는 자연스러운 긴장 수준입니다.',
      '중등도 시선 의식·조명 효과(2/4). 부정적 평가에 대한 두려움이 사회적 에너지를 빠르게 소모시키고 있습니다.',
      '높은 사회적 위협 각성(3/4). 편도체가 일상적인 시선 집중을 생존 위협처럼 인식하여 경보를 울리고 있습니다.',
      '심각한 사회불안·사후 반추 루프(4/4). 예기불안과 사후 복기가 신경계를 고갈시키고 있습니다. 지금 스트레스 지수를 진단하고 그라운딩을 시작하세요.'
    ],
    primaryBtn: '3분 스트레스 및 사회불안 신경계 진단 &rarr;',
    subBtn: '5-4-3-2-1 오감 그라운딩으로 대인 긴장 진정하기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN SOZIALE-ANGST- &amp; SPOTLIGHT-CHECK',
    heading: 'Schüchternheit oder soziale Bewertungsangst?',
    sub: 'Wählen Sie die Reaktionen Ihres Nervensystems vor, während oder nach sozialen Kontakten:',
    items: [
      '<strong>Vorab-Angst &amp; Vermeidung:</strong> Sie grübeln Tage vorher über Treffen oder Telefonate und suchen nach Absagegründen.',
      '<strong>Selbstüberwachung im „Rampenlicht“:</strong> In Gruppen kontrollieren Sie ständig Stimme, Blick und Haltung.',
      '<strong>Körperlicher Alarm:</strong> Das Wort zu ergreifen löst Herzrasen, Hitzegefühl, Kloß im Hals oder Zittern aus.',
      '<strong>Nachträgliches Gesprächs-Sezieren:</strong> Stunden nach einem Gespräch gehen Sie jeden Satz durch, ob Sie peinlich wirkten.'
    ],
    scoreUnit: 'von 4 Signalen sozialer Angst aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihr soziales Bedrohungsniveau zu prüfen.',
      'Leichte Schüchternheit (1/4). Normale Aufwärmphase in neuen Situationen.',
      'Moderate Spotlight-Empfindlichkeit (2/4). Bewertungsangst kostet Sie spürbar Energie.',
      'Hohe soziale Alarmbereitschaft (3/4). Ihre Amygdala wertet soziale Sichtbarkeit als Gefahr.',
      'Ausgeprägte soziale Angstschleife (4/4). Prüfen Sie jetzt Ihre Stresslast und nutzen Sie das 5-4-3-2-1 Grounding.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Sozialangst-Check starten &rarr;',
    subBtn: '5-4-3-2-1 Grounding gegen soziale Anspannung öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE ANSIEDAD SOCIAL EN 30 SEGUNDOS',
    heading: '¿Es timidez o activación de amenaza por evaluación social?',
    sub: 'Marca las respuestas de tu sistema nervioso antes, durante o después de interactuar:',
    items: [
      '<strong>Ansiedad anticipatoria y evitación:</strong> Buscas excusas para cancelar planes o temes hacer llamadas sencillas.',
      '<strong>Hipervigilancia bajo el «foco»:</strong> En grupo vigilas tanto tu voz, postura y gestos que no logras estar presente.',
      '<strong>Alarma física de amenaza:</strong> Hablar en reuniones o conocer gente dispara taquicardia, rubor o nudo en la garganta.',
      '<strong>Autopsia post-conversación:</strong> Horas después de hablar, repites cada frase buscando si sonaste torpe o ridículo.'
    ],
    scoreUnit: 'de 4 señales de ansiedad social activas',
    verdicts: [
      'Marca los puntos arriba para evaluar si tu sistema nervioso social está en modo alerta.',
      'Timidez situacional leve (1/4). Tiempo normal de adaptación social.',
      'Sensibilidad moderada al juicio (2/4). El temor a la evaluación drena tu batería social.',
      'Alta activación de amenaza social (3/4). Tu amígdala interpreta la exposición social como peligro.',
      'Bucle severo de ansiedad social (4/4). Evalúa tu carga de estrés ahora y calma tu cuerpo con Grounding 5-4-3-2-1.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Ansiedad Social en 3 Minutos &rarr;',
    subBtn: 'Calmar la Tensión Social con Grounding 5-4-3-2-1 &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR D’ANXIÉTÉ SOCIALE EN 30 SECONDES',
    heading: 'Simple timidité ou alarme nerveuse d’anxiété sociale ?',
    sub: 'Cochez les réactions de votre système nerveux avant, pendant ou après une interaction :',
    items: [
      '<strong>Appréhension et évitement :</strong> Vous redoutez des appels simples ou cherchez des excuses pour annuler des sorties.',
      '<strong>Auto-surveillance constante :</strong> En groupe, vous contrôlez chaque mot, geste et regard par peur d’être jugé.',
      '<strong>Alarme corporelle :</strong> Prendre la parole déclenche palpitations, rougeurs, gorge serrée ou tremblements.',
      '<strong>Autopsie après-coup :</strong> Des heures après un échange, vous repassez chaque phrase pour vérifier si vous avez semblé ridicule.'
    ],
    scoreUnit: 'sur 4 signaux d’anxiété sociale actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer votre niveau d’alerte sociale.',
      'Timidité légère (1/4). Temps d’adaptation naturel sans surcharge nerveuse.',
      'Sensibilité modérée au regard d’autrui (2/4). La peur du jugement épuise votre énergie.',
      'Forte activation de menace sociale (3/4). Votre amygdale perçoit la visibilité sociale comme un danger.',
      'Boucle sévère d’anxiété sociale (4/4). Testez votre niveau de stress et apaisez votre corps avec l’ancrage 5-4-3-2-1.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Anxiété Sociale en 3 Minutes &rarr;',
    subBtn: 'Apaiser la Tension Sociale avec l’Ancrage 5-4-3-2-1 &rarr;'
  },
  ja: {
    badge: '30秒 社交不安（ソーシャル・アングザエティ）＆視線恐怖チェック',
    heading: 'ただの「人見知り」？それとも神経系の「社会的評価アラーム」？',
    sub: '人と関わる前・最中・後に起きる神経系の反応をチェックしてください：',
    items: [
      '<strong>予期不安と回避衝動：</strong> 予定の何日も前から気が重くなり、ドタキャンの理由を考えたり電話をためらったりする。',
      '<strong>スポットライト下の過剰な自己監視：</strong> 集団の中で自分の声のトーン・表情・視線が変に思われていないか監視して疲弊する。',
      '<strong>身体の脅威アラーム：</strong> 会議での発言や初対面の場面で、動悸・赤面・喉の詰まり・手の震えが出る。',
      '<strong>帰宅後の「一人反省会」ループ：</strong> 会話が終わって何時間も経つのに、自分の発言を何度も脳内再生して落ち込む。'
    ],
    scoreUnit: '/ 4 個の社交不安アラーム信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、内向性と社交不安による神経過覚醒を見分けましょう。',
      '軽度の人見知り（1/4）。新しい環境に慣れるまでの自然な緊張です。',
      '中程度の評価過敏（2/4）。「どう思われるか」への警戒がソーシャルバッテリーを消耗させています。',
      '高い社会的脅威アラーム（3/4）。扁桃体が人前での注目を「危険」と誤認して警報を鳴らしています。',
      '深刻な社交不安・一人反省会ループ（4/4）。今すぐストレス負荷をチェックし、5-4-3-2-1グラウンディングで身体を鎮めましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆社交不安チェックへ &rarr;',
    subBtn: '5-4-3-2-1 感覚グラウンディングで対人緊張を鎮める &rarr;'
  },
  zh: {
    badge: '30秒 社交焦虑（Social Anxiety）与聚光灯效应筛查',
    heading: '你只是内向害羞，还是触发了“社交评价威胁警报”？',
    sub: '勾选在社交前、社交中或社交后，你神经系统出现的反应：',
    items: [
      '<strong>预期性恐惧与逃避：</strong> 提前几天就开始害怕聚会或打电话，总想找借口取消约定。',
      '<strong>聚光灯下的过度自我监控：</strong> 在人群中过度注意自己的语气、表情和眼神，导致根本无法放松投入对话。',
      '<strong>生理威胁警报：</strong> 在会议发言或面对生人时，出现心跳加速、脸红发热、喉咙发紧或手抖。',
      '<strong>社交后的“复盘解剖”死循环：</strong> 聊天结束几个小时后，大脑仍在反复回放每一句话，担心自己表现得愚蠢或尴尬。'
    ],
    scoreUnit: '/ 4 个社交焦虑威胁信号已激活',
    verdicts: [
      '勾选上方信号，评估你的神经系统是否处于社交威胁监控模式。',
      '轻度情境性害羞（1/4）。属于正常的社交慢热，并未造成慢性损耗。',
      '中度聚光灯敏感（2/4）。对负面评价的担忧正在加速消耗你的社交电量。',
      '高度社交威胁激活（3/4）。你的杏仁核正把日常的社交曝光当成生存危险。',
      '重度社交焦虑与事后反刍循环（4/4）。请立即检测你的神经系统压力负荷，并用 5-4-3-2-1 着陆法安抚身体。'
    ],
    primaryBtn: '开始 3 分钟压力与社交焦虑测评 &rarr;',
    subBtn: '使用 5-4-3-2-1 感官着陆法缓解社交恐慌 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE ANSIEDADE SOCIAL EM 30 SEGUNDOS',
    heading: 'É apenas timidez ou ativação de ameaça por avaliação social?',
    sub: 'Marque as reações do seu sistema nervoso antes, durante ou após interações sociais:',
    items: [
      '<strong>Ansiedade antecipatória e esquiva:</strong> Você sofre dias antes de um evento ou ligação e pensa em desculpas para cancelar.',
      '<strong>Automonitoramento sob o "holofote":</strong> Em grupo, você vigia tanto seu tom de voz e postura que não consegue relaxar.',
      '<strong>Alarme físico de ameaça:</strong> Falar em reuniões ou conhecer pessoas dispara coração acelerado, rosto quente ou tremor.',
      '<strong>Autópsia pós-conversa:</strong> Horas após o encontro, seu cérebro repassa cada frase procurando gafes.'
    ],
    scoreUnit: 'de 4 sinais de ansiedade social ativos',
    verdicts: [
      'Marque os itens acima para avaliar se seu sistema nervoso está em alerta social.',
      'Timidez situacional leve (1/4). Tempo normal de aquecimento social.',
      'Sensibilidade moderada ao julgamento (2/4). O medo de avaliação negativa drena sua bateria social.',
      'Alta ativação de ameaça social (3/4). Sua amígdala trata a visibilidade social como perigo real.',
      'Ciclo severo de ansiedade social (4/4). Meça sua carga de estresse agora e acalme o corpo com o Grounding 5-4-3-2-1.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Ansiedade Social em 3 Minutos &rarr;',
    subBtn: 'Acalmar a Tensão Social com Grounding 5-4-3-2-1 &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА СОЦИАЛЬНУЮ ТРЕВОЖНОСТЬ',
    heading: 'Это просто застенчивость или тревога социальной оценки?',
    sub: 'Отметьте реакции нервной системы до, во время и после общения:',
    items: [
      '<strong>Тревога ожидания и избегание:</strong> Вы заранее боитесь звонков или встреч и ищете повод их отменить.',
      '<strong>Гиперконтроль «под прожектором»:</strong> В компании вы так следите за своим голосом, позой и взглядом, что не можете расслабиться.',
      '<strong>Телесный сигнал угрозы:</strong> Выступление или знакомство вызывает сердцебиение, жар в лице, ком в горле или дрожь.',
      '<strong>Разбор полетов после общения:</strong> Спустя часы после разговора вы прокручиваете каждую фразу, стыдясь возможных неловкостей.'
    ],
    scoreUnit: 'из 4 признаков социальной тревожности активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить уровень социальной настороженности.',
      'Легкая ситуативная стеснительность (1/4). Естественная адаптация в новой компании.',
      'Умеренная чувствительность к оценке (2/4). Страх осуждения быстро сажает вашу социальную батарейку.',
      'Высокая социальная тревога (3/4). Миндалевидное тело воспринимает внимание окружающих как угрозу.',
      'Острый цикл социальной тревожности (4/4). Проверьте уровень стресса и успокойте тело практикой 5-4-3-2-1.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и социальную тревогу &rarr;',
    subBtn: 'Снять напряжение практикой заземления 5-4-3-2-1 &rarr;'
  },
  id: {
    badge: 'SKRINING KECEMASAN SOSIAL (SOCIAL ANXIETY) 30 DETIK',
    heading: 'Sekadar Pemalu atau Aktivasi Ancaman Evaluasi Sosial?',
    sub: 'Centang respons sistem saraf yang muncul sebelum, saat, atau setelah berinteraksi:',
    items: [
      '<strong>Cemas Antisipatif &amp; Menghindar:</strong> Anda cemas berhari-hari sebelum acara atau telepon dan mencari alasan membatalkan.',
      '<strong>Memantau Diri Berlebihan:</strong> Di tengah orang banyak, Anda terlalu mengawasi nada bicara dan gerak-gerik sendiri.',
      '<strong>Alarm Fisik Saat Disorot:</strong> Berbicara di rapat atau bertemu orang baru memicu jantung berdebar, wajah panas, atau tangan gemetar.',
      '<strong>Putar Ulang Usai Acara:</strong> Berjam-jam setelah obrolan selesai, otak memutar ulang setiap kalimat karena takut terlihat bodoh.'
    ],
    scoreUnit: 'dari 4 sinyal kecemasan sosial aktif',
    verdicts: [
      'Centang item di atas untuk melihat apakah sistem saraf sosial Anda dalam mode siaga.',
      'Sifat Pemalu Ringan (1/4). Waktu adaptasi sosial yang wajar.',
      'Sensitivitas Penilaian Sedang (2/4). Rasa takut dinilai negatif menguras baterai sosial Anda.',
      'Aktivasi Ancaman Sosial Tinggi (3/4). Amigdala Anda menganggap sorotan sosial sebagai bahaya fisik.',
      'Siklus Kecemasan Sosial Berat (4/4). Ukur beban stres Anda sekarang dan tenangkan tubuh dengan Grounding 5-4-3-2-1.'
    ],
    primaryBtn: 'Ikuti Tes Stres &amp; Kecemasan Sosial 3 Menit &rarr;',
    subBtn: 'Tenangkan Panik Sosial dengan Grounding 5-4-3-2-1 &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK SOSYAL KAYGI VE SPOT IŞIĞI ETKİSİ TARAMASI',
    heading: 'Sadece Utangaçlık mı Yoksa Sosyal Değerlendirme Tehdit Alarmı mı?',
    sub: 'Sosyal etkileşimlerden önce, sırasında veya sonrasında beliren sinyalleri işaretleyin:',
    items: [
      '<strong>Beklenti Kaygısı ve Kaçınma:</strong> Basit telefon görüşmelerinden bile çekiniyor veya buluşmaları iptal etmek için bahane arıyorsunuz.',
      '<strong>"Spot Işığı" Altında Aşırı Öz-Takip:</strong> Kalabalıkta ses tonunuzu ve duruşunuzu o kadar çok izliyorsunuz ki ana odaklanamıyorsunuz.',
      '<strong>Bedensel Tehdit Alarmı:</strong> Toplantıda konuşmak veya yeni biriyle tanışmak çarpıntı, yüz kızarması veya titreme başlatıyor.',
      '<strong>Sohbet Sonrası Zihinsel Otopsi:</strong> Konuşma bittikten saatler sonra bile "Acaba saçmaladım mı?" diye her cümleyi tekrar oynatıyorsunuz.'
    ],
    scoreUnit: '/ 4 sosyal kaygı sinyali aktif',
    verdicts: [
      'Sosyal sinir sisteminizin tehdit modunda olup olmadığını görmek için yukarıdakileri işaretleyin.',
      'Hafif Durumsal Utangaçlık (1/4). Yeni ortamlarda doğal ısınma süresi.',
      'Orta Düzey Değerlendirme Hassasiyeti (2/4). Yargılanma korkusu sosyal pilinizi hızla tüketiyor.',
      'Yüksek Sosyal Tehdit Aktivasyonu (3/4). Amigdalanız sosyal görünürlüğü fiziksel tehlike gibi algılıyor.',
      'Şiddetli Sosyal Kaygı Döngüsü (4/4). Şimdi stres yükünüzü ölçün ve 5-4-3-2-1 Topraklama ile bedeninizi sakinleştirin.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Sosyal Kaygı Testini Başlat &rarr;',
    subBtn: '5-4-3-2-1 Topraklama ile Sosyal Gerginliği Yatıştır &rarr;'
  },
  hi: {
    badge: '30-सेकंड सोशल एंग्ज़ायटी (Social Anxiety) स्क्रीनर',
    heading: 'क्या यह सिर्फ शर्मीलापन है—या सामाजिक मूल्यांकन का डर (Social Anxiety)?',
    sub: 'लोगों से मिलने से पहले, मिलने के दौरान या बाद में महसूस होने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>पहले से घबराहट और बचने की इच्छा:</strong> किसी मीटिंग या साधारण फोन कॉल से भी पहले से डर लगना और प्लान कैंसिल करने के बहाने ढूंढना।',
      '<strong>खुद पर अत्यधिक नज़र (Spotlight Effect):</strong> समूह में अपनी आवाज़, हाव-भाव और नज़र पर इतना ध्यान देना कि बातचीत में सहज न रह पाना।',
      '<strong>शारीरिक खतरे का अलार्म:</strong> सबके सामने बोलने या नए लोगों से मिलने पर दिल तेज़ धड़कना, चेहरा गर्म होना या हाथ कांपना।',
      '<strong>बातचीत के बाद घंटों विश्लेषण:</strong> बातचीत खत्म होने के घंटों बाद भी हर वाक्य को दोहराना कि कहीं कुछ अजीब तो नहीं कह दिया।'
    ],
    scoreUnit: '/ 4 सोशल एंग्ज़ायटी संकेत सक्रिय',
    verdicts: [
      'यह जानने के लिए ऊपर चुनें कि क्या आपका नर्वस सिस्टम सामाजिक खतरे के मोड में है।',
      'हल्का शर्मीलापन (1/4)। नए माहौल में घुलने-मिलने का सामान्य समय।',
      'मध्यम सामाजिक संवेदनशीलता (2/4)। दूसरों के आकलन का डर आपकी सामाजिक ऊर्जा घटा रहा है।',
      'उच्च सामाजिक खतरा अलार्म (3/4)। आपका मस्तिष्क सामान्य सामाजिक ध्यान को खतरे की तरह ले रहा है।',
      'गंभीर सोशल एंग्ज़ायटी चक्र (4/4)। अभी अपना स्ट्रेस चेक करें और 5-4-3-2-1 ग्राउंडिंग से शरीर को शांत करें।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और सोशल एंग्ज़ायटी चेक लें &rarr;',
    subBtn: '5-4-3-2-1 ग्राउंडिंग से सामाजिक घबराहट शांत करें &rarr;'
  }
};

const STRESS_VS_ANXIETY_LOCALES = {
  en: {
    badge: '30-SECOND STRESS vs. ANXIETY DIFFERENTIAL SCREENER',
    heading: 'Are You Experiencing External Stress—or Internalized Anxiety?',
    sub: 'Check the patterns below to distinguish situational pressure from free-floating anxiety:',
    items: [
      '<strong>Persists After the Deadline Passes:</strong> Even when the external task or crisis is solved, your chest stays tight and your mind immediately finds a new worry.',
      '<strong>"What-If" Future Projection:</strong> Instead of reacting to a concrete demand in front of you, your mind spirals into hypothetical future catastrophes.',
      '<strong>Disproportionate Autonomic Alarm:</strong> Minor uncertainty or a quiet afternoon triggers heart palpitations, shallow breathing, or stomach churning.',
      '<strong>Inability to Down-Regulate on Weekends:</strong> Time off does not restore you because your internal threat scanner refuses to power down.'
    ],
    scoreUnit: 'of 4 internalized anxiety differential signals active',
    verdicts: [
      'Check the items above to see if you are dealing with situational stress or autonomous anxiety.',
      'External Situational Stress (1/4). Your tension is tied to concrete workloads—reducing task load will restore balance.',
      'Stress-to-Anxiety Spillover (2/4). External pressure is starting to keep your nervous system on alert after hours.',
      'Predominant Internalized Anxiety (3/4). Your threat response is running independently of external deadlines.',
      'Chronic Autonomic Anxiety &amp; Overload (4/4). Your alarm system is stuck in the "ON" position—take the full Stress &amp; Burnout Differential now.'
    ],
    primaryBtn: 'Take the Free 3-Minute Stress &amp; Anxiety Check &rarr;',
    subBtn: 'Run Interactive Burnout vs. Stress Differential &rarr;'
  },
  ko: {
    badge: '30초 스트레스 vs 불안(Anxiety) 감별 판별기',
    heading: '지금 내 상태는 외부 스트레스일까요, 내면화된 불안일까요?',
    sub: '상황적 압박감(스트레스)과 자율신경 경보(불안)를 구분하는 핵심 신호를 체크해보세요:',
    items: [
      '<strong>문제가 해결된 뒤에도 꺼지지 않는 긴장:</strong> 마감이나 급한 일이 끝났는데도 가슴이 답답하고 뇌가 곧바로 다른 걱정거리를 찾아냅니다.',
      '<strong>"만약 ~하면 어쩌지" 미래 재앙 시뮬레이션:</strong> 눈앞의 구체적인 과제보다 아직 일어나지 않은 불확실한 미래의 최악 상황을 걱정합니다.',
      '<strong>특별한 원인 없는 신체 경보:</strong> 조용히 쉬는 시간이나 사소한 불확실성 앞에서도 심장이 두근거리고 호흡이 얕아지거나 속이 불편합니다.',
      '<strong>주말·휴일에도 불가능한 이완:</strong> 쉬는 날에도 내면의 위협 스캐너가 꺼지지 않아 쉬어도 충전되지 않고 계속 초조합니다.'
    ],
    scoreUnit: '개 내면화된 불안 감별 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 긴장이 외부 업무 압박 때문인지 자율신경 불안 때문인지 확인해보세요.',
      '외부 상황적 스트레스 중심(1/4). 명확한 외부 과제에 의한 긴장으로, 업무량 조절과 휴식으로 회복 가능합니다.',
      '스트레스-불안 전이 단계(2/4). 외부 스트레스 과부하가 퇴근 후에도 신경계 경보를 유지시키고 있습니다.',
      '내면화된 불안 우세(3/4). 외부 원인이 사라져도 편도체 경보가 독립적으로 작동하고 있습니다.',
      '만성 자율신경 불안 및 과부하(4/4). 신경계 경보 스위치가 켜진 채 고정되어 있습니다. 지금 정밀 스트레스·번아웃 감별 진단을 시작하세요.'
    ],
    primaryBtn: '3분 스트레스 및 불안 지수 정밀 진단 &rarr;',
    subBtn: '번아웃 vs 스트레스 감별 진단 도구 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN STRESS vs. ANGST DIFFERENTIAL-CHECK',
    heading: 'Leiden Sie unter äußerem Stress oder innerer Angst?',
    sub: 'Prüfen Sie, ob Ihre Anspannung von außen kommt oder sich verselbstständigt hat:',
    items: [
      '<strong>Anspannung bleibt nach der Deadline:</strong> Selbst wenn das Problem gelöst ist, sucht Ihr Kopf sofort die nächste Sorge.',
      '<strong>„Was-wäre-wenn“-Katastrophenkino:</strong> Statt auf konkrete Aufgaben zu reagieren, kreisen Sie um hypothetische Zukunftsrisiken.',
      '<strong>Körperalarm ohne klaren Auslöser:</strong> Schon kleine Unsicherheiten lösen Herzklopfen, flache Atmung oder Magendruck aus.',
      '<strong>Keine Erholung am Wochenende:</strong> Selbst in freien Momenten schaltet Ihr innerer Gefahrenscanner nicht ab.'
    ],
    scoreUnit: 'von 4 Angst-Differentialsignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Stress von verselbstständigter Angst zu unterscheiden.',
      'Situativer Stress (1/4). Ihre Belastung hängt an konkreten Aufgaben und klingt bei Pause ab.',
      'Stress-Angst-Übergang (2/4). Äußerer Druck hält Ihr Nervensystem auch nach Feierabend wach.',
      'Überwiegend innere Angst (3/4). Ihr Alarmsystem läuft unabhängig von äußeren Deadlines weiter.',
      'Chronische autonome Angst &amp; Überlastung (4/4). Starten Sie jetzt den Stress-Check und die Differentialanalyse.'
    ],
    primaryBtn: 'Kostenlosen 3-Minuten Stress- &amp; Angst-Check starten &rarr;',
    subBtn: 'Burnout- vs. Stress-Differentialanalyse öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DIFERENCIAL ESTRÉS vs. ANSIEDAD EN 30 SEGUNDOS',
    heading: '¿Sufres estrés externo o ansiedad internalizada?',
    sub: 'Marca las señales para distinguir la presión situacional de la ansiedad autónoma:',
    items: [
      '<strong>Persiste tras resolver el problema:</strong> Aunque termine la entrega o crisis, tu pecho sigue tenso y tu mente busca otra preocupación.',
      '<strong>Proyección «¿Y si...?»:</strong> En vez de responder a una tarea concreta, tu mente imagina catástrofes futuras hipotéticas.',
      '<strong>Alarma física sin causa clara:</strong> Pequeñas incertidumbres o tardes tranquilas disparan taquicardia o nudo estomacal.',
      '<strong>Incapacidad de desconectar en días libres:</strong> El descanso no te recarga porque tu radar interno de amenaza sigue encendido.'
    ],
    scoreUnit: 'de 4 señales diferenciales de ansiedad activas',
    verdicts: [
      'Marca los puntos arriba para saber si enfrentas estrés situacional o ansiedad persistente.',
      'Estrés situacional externo (1/4). Tu tensión responde a cargas concretas y baja al descansar.',
      'Transición de estrés a ansiedad (2/4). La presión externa mantiene alerta a tu sistema nervioso fuera de horario.',
      'Ansiedad internalizada predominante (3/4). Tu alarma interna funciona aunque no haya amenazas presentes.',
      'Ansiedad autónoma crónica (4/4). Mide ahora tu nivel de estrés y ejecuta el diagnóstico diferencial.'
    ],
    primaryBtn: 'Hacer el Test Gratuito de Estrés y Ansiedad en 3 Minutos &rarr;',
    subBtn: 'Abrir Diagnóstico Diferencial Burnout vs. Estrés &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DIFFÉRENTIEL STRESS vs ANXIÉTÉ EN 30 SECONDES',
    heading: 'Vivez-vous un stress externe ou une anxiété intériorisée ?',
    sub: 'Cochez ces indicateurs pour distinguer la pression ponctuelle de l’anxiété autonome :',
    items: [
      '<strong>Persiste une fois l’urgence passée :</strong> Même après la résolution du problème, votre esprit cherche immédiatement une nouvelle inquiétude.',
      '<strong>Scénarios « Et si... ? » :</strong> Au lieu de gérer une tâche précise, vous anticipez des catastrophes futures hypothétiques.',
      '<strong>Alarme corporelle disproportionnée :</strong> Une légère incertitude déclenche palpitations, souffle court ou tension digestive.',
      '<strong>Impossible de décrocher le week-end :</strong> Le repos ne vous régénère pas car votre radar de menace reste actif.'
    ],
    scoreUnit: 'sur 4 signaux différentiels d’anxiété actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour distinguer le stress ponctuel de l’anxiété.',
      'Stress situationnel externe (1/4). Votre tension est liée à des tâches concrètes.',
      'Glissement du stress vers l’anxiété (2/4). La surcharge maintient votre système nerveux en alerte le soir.',
      'Anxiété intériorisée dominante (3/4). Votre alarme interne tourne même sans échéance externe.',
      'Anxiété autonome chronique (4/4). Faites le bilan de stress et l’analyse différentielle du burnout.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Anxiété en 3 Minutes &rarr;',
    subBtn: 'Ouvrir l’Analyse Différentielle Burnout vs Stress &rarr;'
  },
  ja: {
    badge: '30秒 ストレス vs 不安（アングザエティ）鑑別チェック',
    heading: '今の苦しさは「外的ストレス」？それとも自律神経の「内的不安」？',
    sub: '状況的なプレッシャー（ストレス）と、止まらない警報（不安）を見分けるサインをチェック：',
    items: [
      '<strong>問題が片付いても緊張が消えない：</strong> 締め切りやトラブルが終わった後も胸のざわつきが続き、脳がすぐ別の心配事を探し始める。',
      '<strong>「もし〜だったら」の未来予測ループ：</strong> 目の前の具体的な課題ではなく、まだ起きてもいない未来の最悪シナリオばかり考えてしまう。',
      '<strong>明確な原因がない身体アラーム：</strong> 休日の静かな時間や些細な不確実性でも、動悸・浅い呼吸・胃の重さが現れる。',
      '<strong>休日でもオフにできない警戒モード：</strong> 休みの日も脳内の危険スキャナーが切れず、休んでも疲れが取れない。'
    ],
    scoreUnit: '/ 4 個の内的不安・鑑別サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、外的ストレスか自律神経の不安ループか確認しましょう。',
      '外的・状況的ストレス中心（1/4）。具体的な負荷に対する反応であり、休息とタスク調整で回復可能です。',
      'ストレスから不安への移行期（2/4）。日中のプレッシャーがオフの時間にも神経系を覚醒させています。',
      '内面化された不安が優勢（3/4）。外的な原因が去っても扁桃体の警報が独り歩きしています。',
      '慢性的な自律神経不安＆過負荷（4/4）。警報スイッチがONのまま固定されています。今すぐストレス＆バーンアウト鑑別診断を行ってください。'
    ],
    primaryBtn: '3分間の無料ストレス＆不安チェックへ &rarr;',
    subBtn: 'バーンアウト vs ストレス鑑別診断ツールを開く &rarr;'
  },
  zh: {
    badge: '30秒 压力（Stress）vs 焦虑（Anxiety）鉴别筛查',
    heading: '你正在经历的是外部压力，还是内化的持续焦虑？',
    sub: '勾选下方指标，区分情境性压力与自主神经焦虑警报：',
    items: [
      '<strong>事情解决后紧绷感仍不消失：</strong> 即使截止日期已过或问题已解决，胸口依然发紧，大脑立刻开始寻找下一个担忧点。',
      '<strong>“万一……怎么办”的未来灾难化：</strong> 不是在应对眼前的具体任务，而是陷入对未来假设性危机的无限推演。',
      '<strong>无明显诱因的躯体警报：</strong> 哪怕在安静的下午或面对微小不确定性，也会出现心悸、呼吸变浅或肠胃不适。',
      '<strong>周末与假期也无法关机：</strong> 休息日也无法真正放松，因为内心的威胁扫描仪始终处于通电状态。'
    ],
    scoreUnit: '/ 4 个内化焦虑鉴别信号已激活',
    verdicts: [
      '勾选上方信号，判断你面对的是外部任务压力还是持续性焦虑。',
      '外部情境性压力（1/4）。你的紧绷源于具体任务负荷，减少负荷即可恢复平衡。',
      '压力向焦虑溢出（2/4）。外部高压正让你的神经系统在下班后也难以解除警报。',
      '内化焦虑占主导（3/4）。即使外部没有危机，你的内部警报系统仍在独立运转。',
      '慢性自主神经焦虑与过载（4/4）。你的警报开关卡在了开启状态，请立即进行压力与倦怠鉴别测评。'
    ],
    primaryBtn: '开始 3 分钟压力与焦虑测评 &rarr;',
    subBtn: '打开倦怠 vs 压力鉴别诊断工具 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DIFERENCIAL ESTRESSE vs. ANSIEDADE EM 30 SEGUNDOS',
    heading: 'Você está sentindo Estresse Externo ou Ansiedade Internalizada?',
    sub: 'Marque os padrões abaixo para diferenciar pressão situacional de ansiedade contínua:',
    items: [
      '<strong>Continua mesmo após o prazo passar:</strong> Mesmo quando o problema é resolvido, o peito segue apertado e a mente caça outra preocupação.',
      '<strong>Projeção futura de "E se...?":</strong> Em vez de reagir a uma demanda real, sua mente cria cenários futuros catastróficos.',
      '<strong>Alarme físico sem gatilho claro:</strong> Pequenas incertezas ou tardes calmas provocam palpitações, respiração curta ou aperto no estômago.',
      '<strong>Incapacidade de desligar no fim de semana:</strong> O descanso não restaura você porque seu radar interno de ameaças não desliga.'
    ],
    scoreUnit: 'de 4 sinais diferenciais de ansiedade ativos',
    verdicts: [
      'Marque os itens acima para ver se você lida com estresse pontual ou ansiedade autônoma.',
      'Estresse situacional externo (1/4). Sua tensão vem de demandas concretas e cede com descanso.',
      'Transbordamento de estresse para ansiedade (2/4). A pressão externa mantém seu sistema nervoso ligado à noite.',
      'Ansiedade internalizada predominante (3/4). Seu alarme de ameaça roda mesmo sem prazos externos.',
      'Ansiedade autonômica crônica (4/4). Faça o check-up de estresse agora e rode o diferencial de burnout.'
    ],
    primaryBtn: 'Fazer o Teste Gratuito de Estresse e Ansiedade &rarr;',
    subBtn: 'Abrir Diagnóstico Diferencial Burnout vs. Estresse &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ДИФФЕРЕНЦИАЛЬНЫЙ ТЕСТ: СТРЕСС ИЛИ ТРЕВОГА?',
    heading: 'У вас внешний стресс или внутренняя автономная тревога?',
    sub: 'Отметьте признаки, чтобы отличить реакцию на нагрузку от фоновой тревожности:',
    items: [
      '<strong>Напряжение не уходит после дедлайна:</strong> Даже когда задача решена, внутри остается сжатие, а мозг сразу ищет новый повод для беспокойства.',
      '<strong>Катастрофизация «А вдруг...»:</strong> Вместо решения конкретной задачи ум рисует пугающие сценарии будущего.',
      '<strong>Телесная тревога без видимой причины:</strong> Малейшая неопределенность вызывает сердцебиение, поверхностное дыхание или спазм в животе.',
      '<strong>Невозможность расслабиться в выходные:</strong> Отдых не восстанавливает силы, потому что внутренний радар угроз не выключается.'
    ],
    scoreUnit: 'из 4 признаков внутренней тревоги активны',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить ситуативный стресс от тревоги.',
      'Внешний ситуативный стресс (1/4). Напряжение связано с конкретными задачами и проходит после отдыха.',
      'Переход стресса в тревогу (2/4). Внешние перегрузки мешают нервной системе тормозить вечером.',
      'Преобладание внутренней тревоги (3/4). Сигнал угрозы работает сам по себе, даже без внешних проблем.',
      'Хроническая автономная тревога (4/4). Проверьте уровень стресса и пройдите дифференциацию выгорания.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и тревогу &rarr;',
    subBtn: 'Открыть дифференциальный тест: выгорание или стресс &rarr;'
  },
  id: {
    badge: 'SKRINING DIFERENSIAL STRES vs. CEMAS 30 DETIK',
    heading: 'Apakah Anda Mengalami Stres Eksternal atau Kecemasan Internal?',
    sub: 'Centang pola berikut untuk membedakan tekanan situasi dari kecemasan otonom:',
    items: [
      '<strong>Tetap TegangMeski Tugas Selesai:</strong> Saat masalah sudah beres, dada tetap sesak dan pikiran langsung mencari kekhawatiran baru.',
      '<strong>Skenario "Bagaimana Jika...":</strong> Alih-alih fokus pada tugas nyata, pikiran melompat ke skenario buruk di masa depan.',
      '<strong>Alarm Tubuh Tanpa Pemicu Jelas:</strong> Ketidakpastian kecil atau sore yang tenang tetap memicu debar jantung atau lambung perih.',
      '<strong>Sulit Rileks Saat Akhir Pekan:</strong> Hari libur tidak memulihkan energi karena pemindai ancaman di otak tidak mau mati.'
    ],
    scoreUnit: 'dari 4 sinyal diferensial kecemasan aktif',
    verdicts: [
      'Centang item di atas untuk membedakan stres situasional dari kecemasan.',
      'Stres Situasional Eksternal (1/4). Ketegangan terkait beban kerja nyata dan mereda saat istirahat.',
      'Transisi Stres ke Cemas (2/4). Tekanan luar mulai membuat sistem saraf tetap siaga di luar jam kerja.',
      'Kecemasan Internal Dominan (3/4). Respons ancaman berjalan sendiri meski tanpa tenggat waktu.',
      'Kecemasan Otonom Kronis (4/4). Ukur tingkat stres Anda sekarang dan jalankan audit diferensial burnout.'
    ],
    primaryBtn: 'Ikuti Tes Gratis Stres &amp; Kecemasan 3 Menit &rarr;',
    subBtn: 'Buka Alat Audit Diferensial Burnout vs. Stres &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK STRES vs. KAYGI AYIRICI TARAMASI',
    heading: 'Yaşadığınız Dışsal Stres mi Yoksa İçselleşmiş Kaygı mı?',
    sub: 'Durumsal baskıyı otonom kaygıdan ayırmak için aşağıdaki sinyalleri işaretleyin:',
    items: [
      '<strong>Sorun Çözülse Bile Geçmeyen Gerginlik:</strong> Teslim tarihi veya kriz bitse bile göğsünüz sıkışmaya ve zihniniz yeni dert aramaya devam ediyor.',
      '<strong>"Ya Şöyle Olursa" Gelecek Senaryoları:</strong> Somut bir göreve odaklanmak yerine zihniniz olası gelecek felaketlerini kurguluyor.',
      '<strong>Belirgin Neden Olmadan Bedensel Alarm:</strong> Küçük belirsizlikler bile çarpıntı, sığ nefes veya mide düğümlenmesi yaratıyor.',
      '<strong>Hafta Sonu Bile Kapanmayan Radar:</strong> Tatil günlerinde bile içsel tehdit tarayıcınız kapanmadığı için dinlenemiyorsunuz.'
    ],
    scoreUnit: '/ 4 ayırıcı kaygı sinyali aktif',
    verdicts: [
      'Durumsal stresi otonom kaygıdan ayırmak için yukarıdakileri işaretleyin.',
      'Dışsal Durumsal Stres (1/4). Gerginliğiniz somut iş yüküne bağlı ve dinlenince azalıyor.',
      'Stresten Kaygıya Geçiş (2/4). Dış baskılar mesai sonrasında da sinir sisteminizi tetikte tutuyor.',
      'Baskın İçselleşmiş Kaygı (3/4). Tehdit tepkiniz dışsal nedenlerden bağımsız çalışıyor.',
      'Kronik Otonom Kaygı ve Aşırı Yük (4/4). Şimdi stres testini başlatın ve tükenmişlik ayrım analizini çalıştırın.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Kaygı Testini Başlat &rarr;',
    subBtn: 'Tükenmişlik vs. Stres Ayırıcı Analiz Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड स्ट्रेस (Stress) बनाम एंग्ज़ायटी (Anxiety) स्क्रीनर',
    heading: 'क्या आप बाहरी तनाव (Stress) में हैं—या आंतरिक चिंता (Anxiety) में?',
    sub: 'परिस्थितिजन्य दबाव और निरंतर चलने वाली एंग्ज़ायटी में अंतर करने के लिए चुनें:',
    items: [
      '<strong>काम खत्म होने के बाद भी तनाव न जाना:</strong> डेडलाइन या समस्या हल होने के बाद भी सीने में जकड़न रहती है और दिमाग नई चिंता ढूंढ लेता है।',
      '<strong>"अगर ऐसा हो गया तो?" की भविष्य कल्पना:</strong> सामने मौजूद काम के बजाय दिमाग भविष्य की काल्पनिक दुर्घटनाओं में उलझा रहता है।',
      '<strong>बिना स्पष्ट कारण के शारीरिक घबराहट:</strong> शांत समय या छोटी अनिश्चितता में भी दिल की धड़कन बढ़ना, उथली सांस या पेट में हलचल होना।',
      '<strong>छुट्टी के दिन भी रिलैक्स न हो पाना:</strong> आराम के दिनों में भी दिमाग का खतरा-स्कैनर बंद नहीं होता।'
    ],
    scoreUnit: '/ 4 आंतरिक एंग्ज़ायटी संकेत सक्रिय',
    verdicts: [
      'यह जानने के लिए ऊपर चुनें कि आप बाहरी स्ट्रेस में हैं या आंतरिक एंग्ज़ायटी में।',
      'बाहरी परिस्थितिजन्य स्ट्रेस (1/4)। आपका तनाव वास्तविक कार्यभार से जुड़ा है और आराम से ठीक हो सकता है।',
      'स्ट्रेस से एंग्ज़ायटी में बदलाव (2/4)। बाहरी दबाव काम के बाद भी आपके नर्वस सिस्टम को अलर्ट रख रहा है।',
      'प्रमुख आंतरिक एंग्ज़ायटी (3/4)। बाहरी कारण न होने पर भी आपका खतरा अलार्म अपने आप चल रहा है।',
      'गंभीर स्वायत्त एंग्ज़ायटी और ओवरलोड (4/4)। अभी अपना स्ट्रेस चेक करें और बर्नआउट बनाम स्ट्रेस अंतर जांचें।'
    ],
    primaryBtn: '3-मिनट का मुफ्त स्ट्रेस और एंग्ज़ायटी चेक लें &rarr;',
    subBtn: 'बर्नआउट बनाम स्ट्रेस डिफरेंशियल टूल खोलें &rarr;'
  }
};

const HSP_VS_EMPATH_LOCALES = {
  en: {
    badge: '30-SECOND HSP vs. EMPATH SENSITIVITY SCREENER',
    heading: 'Are You a Highly Sensitive Person (HSP), an Empath, or Both?',
    sub: 'Check the sensory and emotional absorption traits you experience daily:',
    items: [
      '<strong>Sensory Environment Overload (HSP):</strong> Bright fluorescent lights, sirens, scratchy fabrics, or chaotic crowds quickly drain your nervous system.',
      '<strong>Deep Cognitive Processing (HSP):</strong> You notice subtle shifts in tone or layout before others do, and need quiet downtime to process complex days.',
      '<strong>Emotional Sponge Absorption (Empath):</strong> When someone walks into a room angry or anxious, you physically feel their emotion inside your own body.',
      '<strong>Blurred Emotional Ownership (Empath):</strong> You often struggle to tell whether sudden sadness or tension is yours or absorbed from someone nearby.'
    ],
    scoreUnit: 'of 4 HSP &amp; Empath sensitivity signals active',
    verdicts: [
      'Check the items above to map your sensory processing sensitivity (HSP) and emotional absorption profile.',
      'Balanced Sensory Threshold (1/4). You notice your environment without rapid nervous system depletion.',
      'Core HSP Sensory Sensitivity (2/4). Your nervous system processes environmental and subtle stimuli deeply.',
      'High HSP + Empathic Resonance (3/4). Both sensory overload and emotional absorption are taxing your battery.',
      'Full HSP-Empath Dual Profile (4/4). Your nervous system absorbs both sensory and emotional data at maximum depth—take the full HSP Test now.'
    ],
    primaryBtn: 'Take the Official 20-Question HSP Sensitivity Test &rarr;',
    subBtn: 'Clear Absorbed Overload with 60s Sensory Reset &rarr;'
  },
  ko: {
    badge: '30초 초민감자(HSP) vs 엠파스(Empath) 감수성 판별기',
    heading: '나는 감각 처리 민감형(HSP)일까요, 감정 흡수형(Empath)일까요?',
    sub: '일상에서 자주 겪는 감각 과부하 및 타인 감정 흡수 신호를 체크해보세요:',
    items: [
      '<strong>물리적 감각 과부하 (HSP):</strong> 밝은 형광등, 큰 소음, 강한 냄새, 붐비는 공간에 있으면 신경계가 빠르게 지칩니다.',
      '<strong>깊은 정보 처리와 혼자만의 충전 (HSP):</strong> 미세한 분위기 변화를 누구보다 먼저 알아차리며, 하루 끝에는 조용한 혼자만의 시간이 꼭 필요합니다.',
      '<strong>타인 감정의 스펀지 흡수 (Empath):</strong> 누군가 화가 나거나 불안한 상태로 방에 들어오면 그 감정이 내 몸으로 고스란히 옮겨옵니다.',
      '<strong>내 감정과 남의 감정 경계 모호 (Empath):</strong> 갑자기 기분이 가라앉거나 긴장될 때, 이것이 내 감정인지 주변 사람에게서 흡수한 것인지 헷갈립니다.'
    ],
    scoreUnit: '개 HSP · 엠파스 감수성 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내 민감성이 감각 처리(HSP) 중심인지 감정 공명(Empath) 중심인지 확인해보세요.',
      '안정적인 감각 역치(1/4). 주변 자극을 적절히 여과하며 에너지를 유지하고 있습니다.',
      '핵심 HSP 감각 처리 민감형(2/4). 미세한 환경 자극과 정보를 남들보다 깊고 정교하게 처리합니다.',
      '높은 HSP + 엠파스 공명(3/4). 물리적 감각 자극과 타인의 감정 에너지를 동시에 깊게 받아들이고 있습니다.',
      '강한 HSP-엠파스 복합 프로필(4/4). 감각과 감정 스펀지가 모두 최대치로 열려 있습니다. 지금 정밀 HSP 테스트와 감각 리셋을 시작하세요.'
    ],
    primaryBtn: '무료 HSP 민감성 정밀 테스트 시작 &rarr;',
    subBtn: '흡수된 피로를 씻어내는 60초 감각 리셋 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN HSP vs. EMPATHIE SENSITIVITÄTS-CHECK',
    heading: 'Sind Sie hochsensibel (HSP), ein Empath oder beides?',
    sub: 'Wählen Sie die Reiz- und Gefühlsmerkmale aus, die Sie im Alltag erleben:',
    items: [
      '<strong>Sensorische Reizüberflutung (HSP):</strong> Grelles Licht, Lärm, Gerüche oder Menschenmengen erschöpfen Ihr Nervensystem schnell.',
      '<strong>Tiefe Reizverarbeitung (HSP):</strong> Sie bemerken feinste Zwischentöne sofort und brauchen stille Rückzugszeiten.',
      '<strong>Emotionaler Schwamm (Empath):</strong> Wenn jemand gestresst oder wütend den Raum betritt, spüren Sie dessen Gefühl im eigenen Körper.',
      '<strong>Verschwommene Gefühlsgrenzen (Empath):</strong> Sie fragen sich oft, ob plötzliche Schwere Ihre eigene ist oder von anderen stammt.'
    ],
    scoreUnit: 'von 4 HSP- &amp; Empathie-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihr HSP- und Empathie-Profil zu prüfen.',
      'Ausgeglichene Reizschwelle (1/4). Sie nehmen Reize wahr, ohne schnell zu überlasten.',
      'Klassisches HSP-Profil (2/4). Ihr Nervensystem verarbeitet Umweltreize besonders tief.',
      'Hohe HSP- &amp; Empathie-Resonanz (3/4). Sowohl Sinnesreize als auch fremde Stimmungen fordern Ihre Energie.',
      'Volles HSP-Empath-Doppelprofil (4/4). Machen Sie jetzt den vollständigen HSP-Test und nutzen Sie den Sensory Reset.'
    ],
    primaryBtn: 'Kostenlosen HSP-Sensitivitätstest starten &rarr;',
    subBtn: '60-Sekunden Sensory Reset gegen Reizüberflutung öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR PAS (HSP) vs. EMPÁTICO EN 30 SEGUNDOS',
    heading: '¿Eres una Persona Altamente Sensible (PAS), un Empático o ambos?',
    sub: 'Marca los rasgos de sensibilidad sensorial y absorción emocional que vives a diario:',
    items: [
      '<strong>Sobrecarga sensorial ambiental (PAS):</strong> Luces fuertes, ruidos, olores o multitudes agotan rápidamente tu sistema nervioso.',
      '<strong>Procesamiento profundo (PAS):</strong> Captas detalles sutiles antes que nadie y necesitas soledad silenciosa para recargarte.',
      '<strong>Esponja emocional (Empático):</strong> Cuando alguien entra tenso o triste a una sala, sientes su emoción físicamente en tu cuerpo.',
      '<strong>Frontera emocional difusa (Empático):</strong> A menudo dudas si un bajón o ansiedad repentina es tuyo o absorbido de otra persona.'
    ],
    scoreUnit: 'de 4 señales de sensibilidad PAS y Empatía activas',
    verdicts: [
      'Marca los puntos arriba para conocer tu perfil sensorial (PAS) y empático.',
      'Umbral sensorial equilibrado (1/4). Percibes tu entorno sin agotamiento rápido.',
      'Sensibilidad sensorial PAS (2/4). Tu sistema nervioso procesa los estímulos con gran profundidad.',
      'Alta resonancia PAS + Empática (3/4). Tanto los estímulos físicos como las emociones ajenas drenan tu energía.',
      'Perfil dual completo PAS-Empático (4/4). Haz el Test Oficial PAS ahora y limpia la sobrecarga con el Reinicio Sensorial.'
    ],
    primaryBtn: 'Hacer el Test Oficial de Alta Sensibilidad (PAS) &rarr;',
    subBtn: 'Limpiar Sobrecarga con Reinicio Sensorial de 60s &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR HYPERSENSIBLE (HSP) vs EMPATHE EN 30 SECONDES',
    heading: 'Êtes-vous Hypersensible (HSP), Empathe, ou les deux ?',
    sub: 'Cochez les traits de sensibilité sensorielle et d’absorption émotionnelle que vous vivez :',
    items: [
      '<strong>Surcharge sensorielle (HSP) :</strong> Les lumières vives, le bruit ou la foule épuisent rapidement votre système nerveux.',
      '<strong>Traitement cognitif profond (HSP) :</strong> Vous captez les nuances subtiles et avez besoin de calme solitaire pour récupérer.',
      '<strong>Éponge émotionnelle (Empathe) :</strong> Quand quelqu’un est tendu ou triste, vous ressentez physiquement son émotion en vous.',
      '<strong>Frontières émotionnelles floues (Empathe) :</strong> Vous avez parfois du mal à savoir si une émotion soudaine est la vôtre ou celle d’autrui.'
    ],
    scoreUnit: 'sur 4 signaux HSP et Empathe actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour identifier votre profil HSP et Empathe.',
      'Seuil sensoriel équilibré (1/4). Vous percevez votre environnement sans saturation rapide.',
      'Sensibilité sensorielle HSP (2/4). Votre système nerveux traite les informations en profondeur.',
      'Forte résonance HSP + Empathe (3/4). Les stimuli physiques et les émotions d’autrui sollicitent votre batterie.',
      'Profil double HSP-Empathe complet (4/4). Passez le test HSP complet et utilisez la réinitialisation sensorielle.'
    ],
    primaryBtn: 'Passer le Test Officiel d’Hypersensibilité (HSP) &rarr;',
    subBtn: 'Apaiser la Surcharge avec la Réinitialisation Sensorielle &rarr;'
  },
  ja: {
    badge: '30秒 HSP（繊細さん）vs エンパス（共感力）タイプ診断',
    heading: 'あなたは感覚過敏な「HSP」？感情を吸収する「エンパス」？それとも両方？',
    sub: '日常で感じている感覚刺激や他人の感情の受け取り方をチェックしてください：',
    items: [
      '<strong>五感の刺激による消耗（HSP）：</strong> 強い光・大きな音・匂い・人混みにいると神経系があっという間に疲れてしまう。',
      '<strong>深い情報処理と一人時間の必要性（HSP）：</strong> 些細な空気の変化にすぐ気づき、一日の終わりには静かな一人の時間が不可欠。',
      '<strong>感情のスポンジ吸収（エンパス）：</strong> 誰かがイライラ・不安な状態で近くに来ると、その感情が自分の身体に直接流れ込んでくる。',
      '<strong>自他の感情の境界が曖昧（エンパス）：</strong> 急に気分が重くなったとき、自分の感情なのか周囲から貰ったものなのか分からなくなる。'
    ],
    scoreUnit: '/ 4 個のHSP＆エンパス特性サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、あなたの繊細さのタイプを確認しましょう。',
      '安定した感覚バランス（1/4）。周囲の刺激を適度にフィルタリングできています。',
      'HSP（感覚処理感受性）タイプ（2/4）。環境刺激や微細な情報を人一倍深く処理しています。',
      '高いHSP＋エンパス共鳴（3/4）。五感の刺激と他人の感情エネルギーの両方を深く受け取っています。',
      'HSP×エンパス複合プロファイル（4/4）。感覚と感情の両方のアンテナが最大感度です。今すぐ精密HSP診断と感覚リセットを試しましょう。'
    ],
    primaryBtn: '無料の精密HSP（繊細度）診断テストを受ける &rarr;',
    subBtn: '貰い疲れを浄化する「60秒感覚リセット」を開く &rarr;'
  },
  zh: {
    badge: '30秒 高敏感人群（HSP）vs 共情者（Empath）筛查',
    heading: '你是高敏感人群（HSP）、共情体质（Empath），还是两者兼有？',
    sub: '勾选你在日常中经历的感官处理敏感与情绪吸收特征：',
    items: [
      '<strong>环境感官过载（HSP）：</strong> 刺眼的灯光、嘈杂噪音、气味或拥挤人群会迅速耗尽你的神经系统电量。',
      '<strong>深度加工与独处需求（HSP）：</strong> 你比别人更早察觉细微变化，每天结束时必须有安静的独处时间来恢复。',
      '<strong>海绵式情绪吸收（Empath）：</strong> 当别人带着愤怒或焦虑走进房间，你会在自己身体里直接感受到对方的情绪。',
      '<strong>情绪归属边界模糊（Empath）：</strong> 你常常分不清突然涌上的低落或紧绷感是自己的，还是从周围人身上吸过来的。'
    ],
    scoreUnit: '/ 4 个 HSP 与共情者特征信号已激活',
    verdicts: [
      '勾选上方信号，测绘你的感官敏感（HSP）与情绪吸收画像。',
      '感官阈值平衡（1/4）。你能敏锐感知环境而不会迅速陷入神经耗竭。',
      '典型 HSP 感官敏感型（2/4）。你的神经系统对环境与细节信息进行深度加工。',
      '高度 HSP + 共情共振（3/4）。感官过载与情绪吸收正在双重消耗你的精力。',
      '典型 HSP-Empath 双重高敏体质（4/4）。你的感官与情绪天线均处于全开状态，请立即进行完整 HSP 测试。'
    ],
    primaryBtn: '开始免费 HSP 高敏感度完整测试 &rarr;',
    subBtn: '打开 60 秒感官重置清理吸收的过载能量 &rarr;'
  },
  pt: {
    badge: 'RASTREIO PAS (HSP) vs. EMPATA EM 30 SEGUNDOS',
    heading: 'Você é uma Pessoa Altamente Sensível (PAS), um Empata ou ambos?',
    sub: 'Marque os traços de sensibilidade sensorial e absorção emocional que você sente:',
    items: [
      '<strong>Sobrecarga sensorial (PAS):</strong> Luzes fortes, barulho, cheiros ou multidões esgotam rapidamente seu sistema nervoso.',
      '<strong>Processamento profundo (PAS):</strong> Você nota detalhes sutis no ambiente e precisa de silêncio sozinho para recarregar.',
      '<strong>Esponja emocional (Empata):</strong> Quando alguém entra tenso ou irritado no ambiente, você sente a emoção dele no próprio corpo.',
      '<strong>Fronteira emocional confusa (Empata):</strong> Muitas vezes você não sabe se uma tristeza ou tensão repentina é sua ou absorvida de alguém.'
    ],
    scoreUnit: 'de 4 sinais de sensibilidade PAS e Empata ativos',
    verdicts: [
      'Marque os itens acima para mapear seu perfil sensorial (PAS) e empático.',
      'Limiar sensorial equilibrado (1/4). Você percebe o ambiente sem exaustão rápida.',
      'Sensibilidade sensorial PAS (2/4). Seu sistema nervoso processa estímulos com profundidade.',
      'Alta ressonância PAS + Empata (3/4). Tanto o excesso sensorial quanto emoções alheias drenam sua bateria.',
      'Perfil duplo completo PAS-Empata (4/4). Faça o Teste Completo de PAS agora e limpe a sobrecarga com o Reset Sensorial.'
    ],
    primaryBtn: 'Fazer o Teste Oficial de Alta Sensibilidade (PAS) &rarr;',
    subBtn: 'Limpar Sobrecarga com Reset Sensorial de 60s &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ: ВЧЛ (HSP) ИЛИ ЭМПАТ?',
    heading: 'Вы высокочувствительный человек (ВЧЛ), эмпат или и то, и другое?',
    sub: 'Отметьте особенности сенсорного восприятия и эмоционального впитывания:',
    items: [
      '<strong>Сенсорная перегрузка (ВЧЛ):</strong> Яркий свет, шум, запахи и толпа быстро истощают вашу нервную систему.',
      '<strong>Глубокая обработка (ВЧЛ):</strong> Вы замечаете малейшие нюансы и нуждаетесь в тихом уединении для восстановления.',
      '<strong>Эмоциональная губка (Эмпат):</strong> Когда рядом кто-то злится или тревожится, вы физически ощущаете чужую эмоцию в своем теле.',
      '<strong>Размытые границы чувств (Эмпат):</strong> Вам бывает трудно понять — внезапная грусть ваша собственная или «считанная» с другого.'
    ],
    scoreUnit: 'из 4 признаков ВЧЛ и эмпатии активны',
    verdicts: [
      'Отметьте пункты выше, чтобы определить свой профиль чувствительности.',
      'Сбалансированный порог (1/4). Вы замечаете детали без быстрого истощения.',
      'Сенсорная чувствительность ВЧЛ (2/4). Ваша нервная система глубоко обрабатывает внешние стимулы.',
      'Высокий резонанс ВЧЛ + Эмпат (3/4). И сенсорный шум, и чужие эмоции расходуют ваш ресурс.',
      'Полный двойной профиль ВЧЛ-Эмпат (4/4). Пройдите полный тест ВЧЛ и сбросьте напряжение через сенсорную перезагрузку.'
    ],
    primaryBtn: 'Пройти полный бесплатный тест на высокую чувствительность (ВЧЛ) &rarr;',
    subBtn: 'Сбросить перегрузку за 60 секунд (Sensory Reset) &rarr;'
  },
  id: {
    badge: 'SKRINING HSP vs. EMPATH 30 DETIK',
    heading: 'Apakah Anda Pribadi Sangat Sensitif (HSP), Empath, atau Keduanya?',
    sub: 'Centang ciri kepekaan sensorik dan penyerapan emosi yang Anda alami setiap hari:',
    items: [
      '<strong>Kewalahan Sensorik (HSP):</strong> Cahaya terang, suara bising, atau keramaian cepat menguras energi sistem saraf Anda.',
      '<strong>Pemrosesan Mendalam (HSP):</strong> Anda peka terhadap detail halus dan butuh waktu tenang sendirian untuk mengisi ulang energi.',
      '<strong>Spons Emosi (Empath):</strong> Saat orang lain marah atau cemas di dekat Anda, tubuh Anda ikut merasakan emosi mereka.',
      '<strong>Batas Emosi Kabur (Empath):</strong> Anda sering bingung apakah rasa sedih atau tegang mendadak itu milik Anda atau serapan dari orang sekitar.'
    ],
    scoreUnit: 'dari 4 sinyal kepekaan HSP &amp; Empath aktif',
    verdicts: [
      'Centang item di atas untuk memetakan profil HSP dan Empath Anda.',
      'Ambang Sensorik Seimbang (1/4). Anda peka tanpa mudah terkuras.',
      'Kepekaan Sensorik HSP (2/4). Sistem saraf Anda memproses rangsangan lingkungan secara mendalam.',
      'Resonansi Tinggi HSP + Empath (3/4). Rangsangan fisik dan emosi orang lain sama-sama menguras baterai Anda.',
      'Profil Ganda HSP-Empath Penuh (4/4). Ikuti Tes Lengkap HSP sekarang dan bersihkan beban dengan Reset Sensorik.'
    ],
    primaryBtn: 'Ikuti Tes Resmi Kepekaan HSP Gratis &rarr;',
    subBtn: 'Bersihkan Kewalahan dengan Reset Sensorik 60 Detik &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK HSP (ÜSTÜN DUYARLILIK) vs. EMPAT TARAMASI',
    heading: 'Yüksek Duyarlı Bir Kişi (HSP) misiniz, Empat mı, Yoksa İkisi Birden mi?',
    sub: 'Günlük yaşamda deneyimlediğiniz duyusal ve duygusal emilim özelliklerini işaretleyin:',
    items: [
      '<strong>Duyusal Aşırı Yüklenme (HSP):</strong> Parlak ışıklar, yüksek sesler, kokular veya kalabalıklar sinir sisteminizi hızla yoruyor.',
      '<strong>Derin İşleme ve Yalnızlık İhtiyacı (HSP):</strong> İnce detayları herkesten önce fark ediyor ve gün sonunda sessizliğe ihtiyaç duyuyorsunuz.',
      '<strong>Duygusal Sünger (Empat):</strong> Odaya öfkeli veya kaygılı biri girdiğinde onun duygusunu kendi bedeninizde fiziksel olarak hissediyorsunuz.',
      '<strong>Bulanık Duygu Sınırları (Empat):</strong> Ani bir üzüntü veya gerginliğin size mi ait olduğunu yoksa çevreden mi geçtiğini karıştırıyorsunuz.'
    ],
    scoreUnit: '/ 4 HSP ve Empat duyarlılık sinyali aktif',
    verdicts: [
      'Duyusal duyarlılık (HSP) ve duygusal emilim profilinizi görmek için yukarıdakileri işaretleyin.',
      'Dengeli Duyusal Eşik (1/4). Çevrenizi hızla tükenmeden algılıyorsunuz.',
      'Temel HSP Duyusal Hassasiyeti (2/4). Sinir sisteminiz çevresel uyaranları derinlemesine işliyor.',
      'Yüksek HSP + Empatik Rezonans (3/4). Hem duyusal yük hem de başkalarının duyguları pilinizi tüketiyor.',
      'Tam HSP-Empat Çift Profili (4/4). Şimdi tam HSP Testini çözün ve 60 saniyelik Duyusal Sıfırlama ile enerjinizi temizleyin.'
    ],
    primaryBtn: 'Ücretsiz HSP Duyarlılık Testini Başlat &rarr;',
    subBtn: '60 Saniyelik Duyusal Sıfırlama Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड HSP बनाम एम्पैथ (Empath) संवेदनशीलता स्क्रीनर',
    heading: 'क्या आप अति-संवेदनशील व्यक्ति (HSP) हैं, एम्पैथ हैं, या दोनों?',
    sub: 'अपने दैनिक जीवन में महसूस होने वाले इन इंद्रिय और भावनात्मक संकेतों को चुनें:',
    items: [
      '<strong>इंद्रिय ओवरलोड (HSP):</strong> तेज़ रोशनी, शोर, तेज़ गंध या भीड़-भाड़ आपके नर्वस सिस्टम को जल्दी थका देती है।',
      '<strong>गहरा विश्लेषण और एकांत की ज़रूरत (HSP):</strong> आप सूक्ष्म बदलाव तुरंत भांप लेते हैं और दिन के अंत में शांत एकांत चाहते हैं।',
      '<strong>भावनात्मक स्पंज (Empath):</strong> जब कोई गुस्से या चिंता में पास आता है, तो आप उसकी भावना को अपने शरीर में महसूस करने लगते हैं।',
      '<strong>अपनी और दूसरों की भावनाओं में उलझन (Empath):</strong> कई बार यह समझना मुश्किल होता है कि अचानक आई उदासी आपकी अपनी है या किसी और से अवशोषित।'
    ],
    scoreUnit: '/ 4 HSP और एम्पैथ संवेदनशीलता संकेत सक्रिय',
    verdicts: [
      'अपनी संवेदनशीलता प्रोफ़ाइल जानने के लिए ऊपर दिए गए विकल्प चुनें।',
      'संतुलित संवेदनशीलता (1/4)। आप बिना जल्दी थके अपने माहौल को समझते हैं।',
      'मुख्य HSP इंद्रिय संवेदनशीलता (2/4)। आपका नर्वस सिस्टम बाहरी संकेतों को गहराई से प्रोसेस करता है।',
      'उच्च HSP + एम्पैथिक जुड़ाव (3/4)। बाहरी शोर और दूसरों की भावनाएं दोनों आपकी ऊर्जा सोख रही हैं।',
      'पूर्ण HSP-एम्पैथ दोहरी प्रोफ़ाइल (4/4)। अभी पूरा HSP टेस्ट लें और 60-सेकंड सेंसरी रीसेट से ओवरलोड साफ करें।'
    ],
    primaryBtn: 'मुफ्त आधिकारिक HSP संवेदनशीलता टेस्ट लें &rarr;',
    subBtn: '60-सेकंड सेंसरी रीसेट (Sensory Reset) खोलें &rarr;'
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

  // 1. social-anxiety-signs-test.html (12 locales)
  for (const [lang, loc] of Object.entries(SOCIAL_ANXIETY_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'social-anxiety-signs-test.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'socialAnxietyScreener',
      chkClass: 'socanx-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=social_anxiety_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/grounding-exercise.html?lang=${lang}&source=social_anxiety_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/social-anxiety-signs-test.html`);
    console.log(`[PASS] social-anxiety-signs-test (${lang})`);
  }

  // 2. stress-vs-anxiety-difference-test.html (12 locales)
  for (const [lang, loc] of Object.entries(STRESS_VS_ANXIETY_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'stress-vs-anxiety-difference-test.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'stressVsAnxietyScreener',
      chkClass: 'svsa-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=stress_vs_anxiety_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/burnout-stress-differential.html?lang=${lang}&source=stress_vs_anxiety_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/stress-vs-anxiety-difference-test.html`);
    console.log(`[PASS] stress-vs-anxiety-difference-test (${lang})`);
  }

  // 3. hsp-empath-difference-test.html (12 locales)
  for (const [lang, loc] of Object.entries(HSP_VS_EMPATH_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'hsp-empath-difference-test.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'hspVsEmpathScreener',
      chkClass: 'hspemp-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/hsp-test/?lang=${lang}&source=hsp_empath_screener`,
      primaryTargetSlug: 'hsp-test',
      primaryBtn: loc.primaryBtn,
      subHref: `/hsp-test/reset.html?lang=${lang}&source=hsp_empath_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/hsp-empath-difference-test.html`);
    console.log(`[PASS] hsp-empath-difference-test (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 7: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

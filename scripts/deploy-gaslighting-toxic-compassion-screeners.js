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

const GASLIGHTING_RECOVERY_LOCALES = {
  en: {
    badge: '30-SECOND GASLIGHTING & REALITY-DOUBT SCREENER',
    heading: 'Are You Second-Guessing Your Own Memory and Reality?',
    sub: 'Check the cognitive and emotional erosion signals that appear under chronic gaslighting:',
    items: [
      '<strong>Compulsive Evidence Recording:</strong> You feel the urge to screenshot texts or write down conversations just to prove to yourself what actually happened.',
      '<strong>DARVO Reversal Confusion:</strong> You bring up a calm, valid hurt and somehow end up apologizing and comforting the other person by the end of the talk.',
      '<strong>Chronic "Too Sensitive" Doubt:</strong> Before speaking, you constantly ask yourself "Am I overreacting? Am I making this up?"',
      '<strong>Decision Paralysis Without External Validation:</strong> Your trust in your own gut perception has eroded so much that small choices feel overwhelming.'
    ],
    scoreUnit: 'of 4 gaslighting reality-erosion signals active',
    verdicts: [
      'Check the items above to evaluate whether gaslighting is eroding your self-trust and nervous system.',
      'Intact Reality Anchor (1/4). You maintain strong trust in your own memory and emotional perception.',
      'Moderate Self-Doubt Erosion (2/4). Repeated minimization or blame-shifting is clouding your inner compass.',
      'High Gaslighting Impact (3/4). Your nervous system is exhausted from defending basic facts and feelings.',
      'Severe Reality Erosion &amp; Fawn Loop (4/4). Chronic gaslighting is taxing your nervous system—measure your stress load and generate firm boundary scripts now.'
    ],
    primaryBtn: 'Check Your Nervous System Stress &amp; Depletion Load &rarr;',
    subBtn: 'Generate Anti-Gaslighting Boundary Scripts Now &rarr;'
  },
  ko: {
    badge: '30초 가스라이팅(Gaslighting) 및 현실감 침식 판별기',
    heading: '내 기억과 감정조차 스스로 의심하게 되었나요?',
    sub: '반복적인 가스라이팅 속에서 나타나는 자기 확신 침식 신호를 체크해보세요:',
    items: [
      '<strong>증거 기록 강박:</strong> 내가 잘못 기억하는 게 아니라는 걸 확인하기 위해 대화 내용을 캡처하거나 메모해두어야 안심이 됩니다.',
      '<strong>대화 끝의 역전 현상 (DARVO):</strong> 분명 내가 상처받은 일을 차분히 말하기 시작했는데, 대화가 끝날 때쯤엔 오히려 내가 사과하고 상대를 달래고 있습니다.',
      '<strong>"내가 너무 예민한가?" 끊임없는 자기 검열:</strong> 정당한 불편함을 느끼면서도 "내가 과민반응하는 걸까?"라며 내 감정을 먼저 의심합니다.',
      '<strong>직관 마비와 결정 장애:</strong> 내 판단력에 대한 신뢰가 무너져 사소한 결정을 내릴 때도 남의 확인을 받지 않으면 불안합니다.'
    ],
    scoreUnit: '개 가스라이팅 현실감 침식 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 관계 속 가스라이팅이 내 현실감과 신경계를 얼마나 소진시키고 있는지 확인해보세요.',
      '단단한 현실 감각 유지(1/4). 내 기억과 감정에 대한 건강한 신뢰를 유지하고 있습니다.',
      '중등도 자기 의심 침식(2/4). 반복적인 책임 전가와 축소 발언이 내면의 나침반을 흔들고 있습니다.',
      '높은 가스라이팅 신경계 피로(3/4). 기본적인 사실과 감정을 증명하느라 정서적 에너지가 고갈되고 있습니다.',
      '심각한 현실감 침식 및 자기불신 루프(4/4). 지금 신경계 스트레스 부하를 점검하고 단호한 경계 설정 대본으로 나를 보호하세요.'
    ],
    primaryBtn: '3분 신경계 스트레스 및 정서 소진 진단 &rarr;',
    subBtn: '가스라이팅 차단용 경계·거절 대본 빌더 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN GASLIGHTING- &amp; REALITÄTSZWEIFEL-CHECK',
    heading: 'Zweifeln Sie bereits an Ihrem eigenen Gedächtnis und Bauchgefühl?',
    sub: 'Wählen Sie die Anzeichen für schleichende Selbstzweifel durch Gaslighting:',
    items: [
      '<strong>Drang zur Beweissicherung:</strong> Sie machen Screenshots oder Notizen, nur um sich selbst zu beweisen, was wirklich gesagt wurde.',
      '<strong>Täter-Opfer-Umkehr (DARVO):</strong> Sie sprechen eine Verletzung ruhig an, entschuldigen sich am Ende aber plötzlich selbst.',
      '<strong>Chronischer „Zu-empfindlich“-Zweifel:</strong> Sie fragen sich ständig: „Übertreibe ich? Bilde ich mir das nur ein?“.',
      '<strong>Entscheidungslähmung:</strong> Ihr Vertrauen in die eigene Wahrnehmung ist so geschwächt, dass selbst kleine Entscheidungen schwerfallen.'
    ],
    scoreUnit: 'von 4 Gaslighting-Erosionssignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um die Auswirkungen von Gaslighting zu prüfen.',
      'Stabile Selbstwahrnehmung (1/4). Sie vertrauen Ihrem Gedächtnis und Ihren Gefühlen.',
      'Moderate Selbstzweifel-Erosion (2/4). Schuldumkehr und Verharmlosung schwächen Ihren inneren Kompass.',
      'Hohe Gaslighting-Belastung (3/4). Ihr Nervensystem ist vom ständigen Rechtfertigen erschöpft.',
      'Schwere Realitätserosion (4/4). Prüfen Sie jetzt Ihre Stresslast und erstellen Sie klare Grenz-Skripte.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Erschöpfungs-Check starten &rarr;',
    subBtn: 'Anti-Gaslighting Grenz-Skript-Builder öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE GASLIGHTING Y DUDA DE LA REALIDAD EN 30 SEGUNDOS',
    heading: '¿Estás dudando de tu propia memoria y percepción?',
    sub: 'Marca las señales de erosión cognitiva y emocional causadas por el gaslighting:',
    items: [
      '<strong>Necesidad de guardar pruebas:</strong> Sientes el impulso de tomar capturas o anotar conversaciones para demostrarte qué ocurrió realmente.',
      '<strong>Inversión de culpa (DARVO):</strong> Planteas un dolor válido con calma y terminas pidiendo perdón y consolando a la otra persona.',
      '<strong>Duda crónica de «ser exagerado»:</strong> Antes de hablar te preguntas constantemente: «¿Estaré exagerando o imaginando cosas?».',
      '<strong>Parálisis de decisión:</strong> Tu confianza en tu intuición se ha desgastado tanto que te cuesta decidir sin validación externa.'
    ],
    scoreUnit: 'de 4 señales de erosión por gaslighting activas',
    verdicts: [
      'Marca los puntos arriba para evaluar si el gaslighting está desgastando tu sistema nervioso.',
      'Anclaje de realidad intacto (1/4). Conservas una confianza sana en tu memoria y criterio.',
      'Erosión moderada de autoconfianza (2/4). La minimización repetida está nublando tu brújula interna.',
      'Alto impacto de gaslighting (3/4). Tu sistema nervioso está agotado de defender hechos básicos.',
      'Erosión severa de la realidad (4/4). Mide tu carga de estrés ahora y genera guiones firmes de límites.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Desgaste Nervioso &rarr;',
    subBtn: 'Generar Guiones de Límites contra el Gaslighting &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE GASLIGHTING ET DOUTE DE SOI EN 30 SECONDES',
    heading: 'Doutez-vous de votre propre mémoire et de votre perception ?',
    sub: 'Cochez les signes d’érosion de la confiance en soi liés au gaslighting :',
    items: [
      '<strong>Besoin de garder des preuves :</strong> Vous prenez des captures d’écran ou des notes juste pour vérifier que vous n’avez pas rêvé.',
      '<strong>Inversion des rôles (DARVO) :</strong> Vous exprimez une blessure légitime et finissez par vous excuser à la fin de l’échange.',
      '<strong>Doute chronique d’être « trop sensible » :</strong> Vous vous demandez sans cesse : « Est-ce que j’exagère ? Est-ce ma faute ? ».',
      '<strong>Perte de confiance en votre intuition :</strong> Votre jugement intérieur a été si souvent nié que décider seul devient angoissant.'
    ],
    scoreUnit: 'sur 4 signaux d’érosion par gaslighting actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour mesurer l’impact du gaslighting sur votre système nerveux.',
      'Perception intacte (1/4). Vous gardez confiance en votre mémoire et votre ressenti.',
      'Érosion modérée du doute (2/4). La minimisation répétée brouille votre boussole intérieure.',
      'Fort impact de gaslighting (3/4). Votre système nerveux s’épuise à défendre la réalité.',
      'Érosion sévère de la réalité (4/4). Évaluez votre niveau de stress et créez des scripts de limites fermes.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Épuisement Nerveux &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts de Limites &rarr;'
  },
  ja: {
    badge: '30秒 ガスライティング＆自己認識の揺らぎ診断チェック',
    heading: '自分の記憶や感覚さえ信じられなくなっていませんか？',
    sub: '慢性的なガスライティングによって起きる「自己信頼の侵食サイン」をチェックしてください：',
    items: [
      '<strong>証拠を残さないと不安になる：</strong> 自分の記憶違いではないと確かめるために、LINEのスクショや会話のメモを残したくなる。',
      '<strong>会話の終わりには自分が謝っている（DARVO）：</strong> 自分が傷ついた話を冷静に伝えたはずなのに、最後にはなぜか自分が謝罪し相手をなだめている。',
      '<strong>「自分が過敏すぎるのかも」という自己検閲：</strong> 違和感や苦しさを感じても「私が大げさなだけ？考えすぎ？」と自分の感覚を先に疑う。',
      '<strong>直感の麻痺と決断力の低下：</strong> 自分の判断力への自信が削られ、小さな選択でも他人の確認がないと不安になる。'
    ],
    scoreUnit: '/ 4 個のガスライティング侵食サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、ガスライティングによる神経系の消耗度を確認しましょう。',
      '健全な現実感覚（1/4）。自分の記憶や感情に対する信頼を保てています。',
      '中程度の自己疑念（2/4）。繰り返される責任転嫁や過小評価が心のコンパスを揺らしています。',
      '高いガスライティング消耗（3/4）。事実や感情を説明するだけで神経系が疲れ果てています。',
      '深刻な現実感の侵食ループ（4/4）。今すぐ神経系のストレス負荷を測定し、自分を守る境界線スクリプトを作成しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆神経消耗チェックへ &rarr;',
    subBtn: 'ガスライティングから身を守る「境界線スクリプト作成ツール」 &rarr;'
  },
  zh: {
    badge: '30秒 煤气灯效应（Gaslighting）与现实感侵蚀筛查',
    heading: '你是否已经开始怀疑自己的记忆、直觉与清醒度？',
    sub: '勾选在长期煤气灯操控下出现的认知与情绪侵蚀信号：',
    items: [
      '<strong>强迫性留存证据：</strong> 总想截图聊天记录或记下对话细节，只为了向自己证明“我没记错、那件事真的发生过”。',
      '<strong>沟通后的角色倒置（DARVO）：</strong> 明明是你受了委屈去温和沟通，聊到最后却变成你在道歉、反过来安抚对方。',
      '<strong>习惯性怀疑自己“太敏感”：</strong> 每次感到不舒服时，第一反应是怀疑自己：“是不是我太矫情、太玻璃心、想多了？”。',
      '<strong>失去直觉与决策瘫痪：</strong> 对自身判断力的信任被严重削弱，哪怕做小决定也需要别人确认才安心。'
    ],
    scoreUnit: '/ 4 个煤气灯效应侵蚀信号已激活',
    verdicts: [
      '勾选上方信号，评估煤气灯效应是否正在侵蚀你的自我信任与神经系统。',
      '现实锚点稳固（1/4）。你依然对自己的记忆与情绪感知保持清晰信任。',
      '中度自我怀疑侵蚀（2/4）。反复的推卸责任与否定正在干扰你的内心指南针。',
      '高度煤气灯内耗（3/4）。为了自证基本事实与感受，你的神经系统已处于透支状态。',
      '重度现实感侵蚀循环（4/4）。请立即检测你的神经系统压力负荷，并生成坚定的反操控边界话术。'
    ],
    primaryBtn: '开始 3 分钟神经系统压力与内耗测试 &rarr;',
    subBtn: '打开反煤气灯边界与拒绝话术生成器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE GASLIGHTING E DÚVIDA DA REALIDADE EM 30 SEGUNDOS',
    heading: 'Você está duvidando da própria memória e percepção?',
    sub: 'Marque os sinais de erosão emocional que surgem sob gaslighting constante:',
    items: [
      '<strong>Impulso de guardar provas:</strong> Você sente necessidade de tirar prints ou anotar conversas só para provar a si mesmo o que aconteceu.',
      '<strong>Inversão de culpa (DARVO):</strong> Você traz uma mágoa legítima com calma e acaba pedindo desculpas no fim da conversa.',
      '<strong>Dúvida crônica de ser "sensível demais":</strong> Antes de falar, você sempre se pergunta: "Será que estou exagerando ou inventando?".',
      '<strong>Paralisia de decisão:</strong> Sua confiança no próprio taco foi tão minada que pequenas escolhas geram insegurança.'
    ],
    scoreUnit: 'de 4 sinais de erosão por gaslighting ativos',
    verdicts: [
      'Marque os itens acima para avaliar se o gaslighting está minando sua autoconfiança.',
      'Percepção intacta (1/4). Você mantém confiança firme em sua memória e sentimentos.',
      'Erosão moderada de dúvida (2/4). A minimização constante está nublando sua bússola interna.',
      'Alto impacto de gaslighting (3/4). Seu sistema nervoso está exausto de defender fatos básicos.',
      'Erosão severa da realidade (4/4). Meça sua carga de estresse agora e gere roteiros firmes de limites.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Desgaste em 3 Minutos &rarr;',
    subBtn: 'Abrir Gerador de Scripts de Limites contra Gaslighting &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ГАЗЛАЙТИНГ И СОМНЕНИЕ В СЕБЕ',
    heading: 'Вы начали сомневаться в собственной памяти и адекватности?',
    sub: 'Отметьте признаки размывания реальности, возникающие при газлайтинге:',
    items: [
      '<strong>Потребность фиксировать доказательства:</strong> Вам хочется делать скриншоты или записывать разговоры, чтобы доказать себе, что вы не сошли с ума.',
      '<strong>Переворот вины (DARVO):</strong> Вы спокойно говорите о своей обиде, но в итоге сами же извиняетесь и утешаете партнера.',
      '<strong>Хроническое «я слишком накручиваю»:</strong> Вы постоянно сомневаетесь в своих чувствах: «Может, я всё выдумываю и преувеличиваю?».',
      '<strong>Потеря опоры на интуицию:</strong> Вера в собственные ощущения так подорвана, что даже простые решения даются с трудом.'
    ],
    scoreUnit: 'из 4 признаков газлайтинга активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить влияние газлайтинга на вашу нервную систему.',
      'Устойчивая опора на реальность (1/4). Вы доверяете своей памяти и чувствам.',
      'Умеренное размывание уверенности (2/4). Обесценивание сбивает ваш внутренний компас.',
      'Высокая нагрузка от газлайтинга (3/4). Вы тратите огромные силы на защиту очевидных фактов.',
      'Острое разрушение опоры на себя (4/4). Проверьте уровень стресса и создайте четкие фразы для защиты границ.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и истощение &rarr;',
    subBtn: 'Открыть конструктор фраз для защиты личных границ &rarr;'
  },
  id: {
    badge: 'SKRINING GASLIGHTING &amp; KERAGUAN REALITAS 30 DETIK',
    heading: 'Apakah Anda Mulai Meragukan Ingatan dan Perasaan Sendiri?',
    sub: 'Centang sinyal pengikisan kepercayaan diri akibat gaslighting kronis:',
    items: [
      '<strong>Dorongan Menyimpan Bukti:</strong> Anda merasa perlu tangkap layar (screenshot) atau mencatat obrolan demi membuktikan pada diri sendiri apa yang terjadi.',
      '<strong>Pembalikan Kesalahan (DARVO):</strong> Anda menyampaikan keluhan yang wajar dengan tenang, namun berakhir meminta maaf pada lawan bicara.',
      '<strong>Ragukan Diri "Terlalu Sensitif":</strong> Anda terus bertanya pada diri sendiri: "Apakah aku berlebihan? Apakah aku mengada-ada?".',
      '<strong>Lumpuh Mengambil Keputusan:</strong> Kepercayaan pada intuisi sendiri terkikis hingga keputusan kecil pun terasa menakutkan.'
    ],
    scoreUnit: 'dari 4 sinyal erosi gaslighting aktif',
    verdicts: [
      'Centang item di atas untuk melihat apakah gaslighting menguras sistem saraf Anda.',
      'Jangkar Realitas Utuh (1/4). Anda tetap percaya pada ingatan dan perasaan sendiri.',
      'Erosi Keraguan Diri Sedang (2/4). Penyangkalan berulang mulai mengaburkan kompas batin Anda.',
      'Dampak Gaslighting Tinggi (3/4). Sistem saraf Anda terkuras karena terus membela fakta dasar.',
      'Erosi Realitas Berat (4/4). Ukur beban stres Anda sekarang dan buat skrip batasan tegas.'
    ],
    primaryBtn: 'Ikuti Tes Beban Stres &amp; Kelelahan Saraf &rarr;',
    subBtn: 'Buka Pembuat Skrip Batasan Anti-Gaslighting &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK GASLIGHTING VE GERÇEKLİK ŞÜPHESİ TARAMASI',
    heading: 'Kendi Hafızanızdan ve Algınızdan Şüphe mi Duyuyorsunuz?',
    sub: 'Kronik gaslighting altında ortaya çıkan öz-güven aşınması sinyallerini işaretleyin:',
    items: [
      '<strong>Kanıt Toplama İhtiyacı:</strong> Sadece ne yaşandığını kendinize kanıtlamak için ekran görüntüsü alma veya not tutma ihtiyacı hissediyorsunuz.',
      '<strong>Suçu Tersine Çevirme (DARVO):</strong> Haklı bir kırgınlığınızı sakinlikle açıp konuşmanın sonunda özür dileyen taraf oluyorsunuz.',
      '<strong>Kronik "Çok mu Alınganım?" Şüphesi:</strong> Konuşmadan önce sürekli "Abartıyor muyum, kuruntu mu yapıyorum?" diye kendinizi sorguluyorsunuz.',
      '<strong>Sezgi Kaybı ve Karar Felci:</strong> Kendi algınıza güveniniz o kadar aşındı ki küçük kararlarda bile dış onay arıyorsunuz.'
    ],
    scoreUnit: '/ 4 gaslighting aşınma sinyali aktif',
    verdicts: [
      'Gaslighting’in öz-güveninizi ve sinir sisteminizi nasıl etkilediğini görmek için işaretleyin.',
      'Sağlam Gerçeklik Çapası (1/4). Hafızanıza ve duygusal algınıza güveniniz tam.',
      'Orta Düzey Öz-Şüphe Aşınması (2/4). Sürekli küçümseme ve suç aktarımı içsel pusulanızı bulandırıyor.',
      'Yüksek Gaslighting Etkisi (3/4). Temel gerçekleri savunmaktan sinir sisteminiz yorgun düştü.',
      'Şiddetli Gerçeklik Aşınması (4/4). Şimdi stres yükünüzü ölçün ve net sınır cümlelerinizi oluşturun.'
    ],
    primaryBtn: '3 Dakikalık Stres ve Tükenmişlik Testini Başlat &rarr;',
    subBtn: 'Gaslighting Karşıtı Sınır Metin Oluşturucuyu Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड गैसलाइटिंग (Gaslighting) और आत्म-संदेह स्क्रीनर',
    heading: 'क्या आप अपनी ही याददाश्त और समझ पर शक करने लगे हैं?',
    sub: 'लगातार गैसलाइटिंग के कारण दिखने वाले इन मानसिक संकेतों को चुनें:',
    items: [
      '<strong>सबूत सहेजने की मजबूरी:</strong> खुद को यह यकीन दिलाने के लिए कि वास्तव में क्या हुआ था, चैट के स्क्रीनशॉट या नोट्स रखने की ज़रूरत महसूस होना।',
      '<strong>बातचीत के अंत में खुद ही माफ़ी मांगना (DARVO):</strong> अपनी किसी सही तकलीफ पर बात शुरू करना, लेकिन अंत में खुद ही दोषी महसूस कर माफ़ी मांगना।',
      '<strong>"क्या मैं ही ज़्यादा सोच रहा हूँ?" का संदेह:</strong> अपनी भावनाओं पर भरोसा करने के बजाय बार-बार खुद से पूछना कि क्या मैं ओवररिएक्ट कर रहा हूँ।',
      '<strong>निर्णय लेने में आत्मविश्वास खोना:</strong> अपनी समझ पर भरोसा इतना कम हो जाना कि छोटे फैसलों में भी डर लगना।'
    ],
    scoreUnit: '/ 4 गैसलाइटिंग प्रभाव संकेत सक्रिय',
    verdicts: [
      'यह जांचने के लिए ऊपर चुनें कि क्या गैसलाइटिंग आपके आत्मविश्वास को नुकसान पहुंचा रही है।',
      'मजबूत आत्म-विश्वास (1/4)। आपको अपनी याददाश्त और भावनाओं पर स्पष्ट भरोसा है।',
      'मध्यम आत्म-संदेह (2/4)। बार-बार बात को नकारे जाने से आपका आंतरिक भरोसा डगमगा रहा है।',
      'उच्च गैसलाइटिंग प्रभाव (3/4)। बुनियादी बातों को साबित करने में आपका नर्वस सिस्टम थक रहा है।',
      'गंभीर आत्म-संदेह चक्र (4/4)। अभी अपना स्ट्रेस लोड जांचें और स्पष्ट बाउंड्री स्क्रिप्ट तैयार करें।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और मानसिक थकान चेक लें &rarr;',
    subBtn: 'एंटी-गैसलाइटिंग बाउंड्री स्क्रिप्ट टूल खोलें &rarr;'
  }
};

const TOXIC_RELATIONSHIP_LOCALES = {
  en: {
    badge: '30-SECOND TOXIC RELATIONSHIP NERVOUS SYSTEM SCREENER',
    heading: 'How Does Your Body Feel Around This Person?',
    sub: 'Your nervous system detects relational toxicity before your logic does. Check the signals active for you:',
    items: [
      '<strong>Walking on Eggshells:</strong> You pre-scan their mood the moment they walk in or text, adjusting your tone to prevent an outburst or cold withdrawal.',
      '<strong>Intermittent Reinforcement Hook:</strong> Extreme highs of warmth and apologies keep you tolerating recurring cycles of disrespect or stonewalling.',
      '<strong>Shrinking World &amp; Identity:</strong> You have quietly dropped hobbies, friends, or opinions just to keep the peace in the relationship.',
      '<strong>Post-Interaction Somatic Crash:</strong> After spending time together, you feel brain-fogged, anxious, hollow, or physically exhausted.'
    ],
    scoreUnit: 'of 4 toxic relationship nervous system signals active',
    verdicts: [
      'Check the items above to evaluate how this relationship is impacting your nervous system.',
      'Healthy Relational Safety (1/4). Conflicts happen without chronic threat or identity erosion.',
      'Moderate Relational Drain (2/4). Unpredictable moods are pushing your nervous system into vigilance.',
      'High Toxic Cycle Activation (3/4). Eggshell walking and intermittent highs are trapping your attachment system.',
      'Severe Relational Nervous System Depletion (4/4). Your body is in chronic survival mode—map your Attachment Style and prepare boundary scripts now.'
    ],
    primaryBtn: 'Map Your Relationship Pattern with the Attachment Test &rarr;',
    subBtn: 'Build Firm Boundary &amp; Protection Scripts Now &rarr;'
  },
  ko: {
    badge: '30초 해로운 관계(Toxic Relationship) 신경계 반응 판별기',
    heading: '그 사람 곁에 있을 때 내 몸과 신경계는 어떤 상태인가요?',
    sub: '머리보다 몸이 먼저 아는 해로운 관계의 4가지 신경계 경고 신호를 체크해보세요:',
    items: [
      '<strong>살얼음판 걷기(눈치 보기):</strong> 상대의 표정, 말투, 연락 온도를 실시간으로 스캔하며 분노나 냉전을 피하기 위해 내 행동을 맞춥니다.',
      '<strong>간헐적 보상의 덫(온탕과 냉탕):</strong> 상처 주는 행동 뒤 찾아오는 다정한 사과와 애정 표현 때문에 고통스러운 패턴을 끊어내지 못합니다.',
      '<strong>점점 좁아지는 내 세계:</strong> 관계의 평화를 유지하기 위해 내가 좋아하던 취미, 친구 관계, 솔직한 의견을 하나씩 포기했습니다.',
      '<strong>만남 후 몰려오는 신체적 탈진:</strong> 함께 시간을 보내고 나면 충전되기는커녕 머리가 멍해지고 가슴이 답답하거나 녹초가 됩니다.'
    ],
    scoreUnit: '개 해로운 관계 신경계 경고 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 관계가 내 신경계와 자존감에 미치는 영향을 확인해보세요.',
      '안전한 관계 기반(1/4). 갈등이 생겨도 만성적인 공포나 자기 상실 없이 조율 가능한 상태입니다.',
      '중등도 관계 에너지 소모(2/4). 예측하기 어려운 상대의 기분 변화가 신경계를 경계 상태로 만들고 있습니다.',
      '높은 독성 관계 사이클 활성화(3/4). 살얼음판 눈치 보기와 간헐적 보상이 애착 시스템을 묶어두고 있습니다.',
      '심각한 관계성 신경계 고갈(4/4). 몸이 만성 생존 모드에 빠져 있습니다. 지금 애착 유형을 점검하고 나를 지키는 경계 대본을 준비하세요.'
    ],
    primaryBtn: '무료 애착 유형 및 관계 패턴 정밀 진단 &rarr;',
    subBtn: '나를 지키는 단호한 경계·대화 대본 빌더 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN TOXISCHE-BEZIEHUNGS-NERVENSYSTEM-CHECK',
    heading: 'Wie reagiert Ihr Körper in der Nähe dieser Person?',
    sub: 'Ihr Nervensystem erkennt toxische Muster oft vor dem Verstand. Wählen Sie zutreffende Signale:',
    items: [
      '<strong>Gehen wie auf Eierschalen:</strong> Sie scannen ständig die Laune des anderen, um Wutausbrüche oder eisiges Schweigen zu vermeiden.',
      '<strong>Heiß-Kalt-Verstärkung:</strong> Phasen intensiver Zuneigung halten Sie in einem Kreislauf aus Respektlosigkeit oder Rückzug fest.',
      '<strong>Schrumpfende eigene Welt:</strong> Um des Friedens willen haben Sie Hobbys, Freunde oder eigene Meinungen schleichend aufgegeben.',
      '<strong>Körperlicher Crash nach Treffen:</strong> Nach gemeinsamer Zeit fühlen Sie sich benebelt, ängstlich, leer oder völlig ausgelaugt.'
    ],
    scoreUnit: 'von 4 toxischen Beziehungssignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um die Belastung Ihres Nervensystems zu prüfen.',
      'Gesunde Beziehungssicherheit (1/4). Konflikte lassen sich ohne chronische Angst lösen.',
      'Moderate Beziehungsbelastung (2/4). Unberechenbare Stimmungen versetzen Sie in Habachtstellung.',
      'Hohe toxische Zyklus-Aktivierung (3/4). Eierschalen-Gang und Heiß-Kalt-Muster binden Ihre Energie.',
      'Schwere nervliche Erschöpfung durch die Beziehung (4/4). Prüfen Sie jetzt Ihren Bindungsstil und erstellen Sie Schutz-Skripte.'
    ],
    primaryBtn: 'Beziehungsmuster mit dem Bindungsstil-Test prüfen &rarr;',
    subBtn: 'Klare Grenz- &amp; Schutz-Skripte erstellen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE RELACIÓN TÓXICA Y SISTEMA NERVIOSO EN 30 SEGUNDOS',
    heading: '¿Cómo se siente tu cuerpo cuando estás con esa persona?',
    sub: 'Tu sistema nervioso detecta patrones tóxicos antes que la mente. Marca lo que experimentas:',
    items: [
      '<strong>Caminar sobre cáscaras de huevo:</strong> Escaneas su humor al instante y ajustas tus palabras para evitar enfados o ley del hielo.',
      '<strong>Enganche por refuerzo intermitente:</strong> Momentos intensos de afecto y disculpas te mantienen tolerando ciclos de maltrato o frialdad.',
      '<strong>Mundo e identidad reducidos:</strong> Has ido dejando amigos, gustos u opiniones en silencio solo para mantener la paz.',
      '<strong>Agotamiento físico tras verse:</strong> Después de estar juntos te sientes confuso, ansioso, vacío o físicamente exhausto.'
    ],
    scoreUnit: 'de 4 señales de desgaste relacional tóxico activas',
    verdicts: [
      'Marca los puntos arriba para evaluar el impacto de esta relación en tu salud.',
      'Seguridad relacional sana (1/4). Los desacuerdos no destruyen tu paz ni tu identidad.',
      'Desgaste relacional moderado (2/4). Los cambios de humor impredecibles activan tu vigilancia.',
      'Alta activación de ciclo tóxico (3/4). El refuerzo intermitente mantiene atrapado tu sistema de apego.',
      'Agotamiento severo del sistema nervioso (4/4). Evalúa tu Estilo de Apego ahora y prepara guiones de límites.'
    ],
    primaryBtn: 'Evaluar tu Patrón con el Test de Estilo de Apego &rarr;',
    subBtn: 'Crear Guiones Firmes de Límites y Protección &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE RELATION TOXIQUE ET SYSTÈME NERVEUX EN 30 SECONDES',
    heading: 'Comment votre corps réagit-il en présence de cette personne ?',
    sub: 'Votre système nerveux détecte la toxicité avant votre logique. Cochez vos signaux :',
    items: [
      '<strong>Marcher sur des œufs :</strong> Vous scrutez son humeur en permanence pour éviter une colère ou un silence glacial.',
      '<strong>Piège du chaud-froid :</strong> Des moments d’affection intense vous font tolérer des cycles répétés de manque de respect.',
      '<strong>Rétrécissement de votre univers :</strong> Vous avez mis de côté amis, passions ou opinions juste pour préserver la paix.',
      '<strong>Épuisement après les échanges :</strong> Après avoir passé du temps ensemble, vous vous sentez vidé, confus ou anxieux.'
    ],
    scoreUnit: 'sur 4 signaux nerveux de relation toxique actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour mesurer l’impact de cette relation.',
      'Sécurité relationnelle saine (1/4). Les désaccords n’altèrent pas votre intégrité.',
      'Usure relationnelle modérée (2/4). L’imprévisibilité émotionnelle maintient votre corps en alerte.',
      'Cycle toxique actif (3/4). L’alternance chaud-froid piège votre système d’attachement.',
      'Épuisement nerveux relationnel sévère (4/4). Passez le Test d’Attachement et préparez vos scripts de limites.'
    ],
    primaryBtn: 'Identifier vos Schémas avec le Test d’Attachement &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts de Limites &rarr;'
  },
  ja: {
    badge: '30秒 有害な人間関係（トキシック・リレーションシップ）神経系チェック',
    heading: 'その人と一緒にいるとき、あなたの「身体」はどう反応していますか？',
    sub: '頭より先に神経系が察知している「有害な関係性のサイン」をチェックしてください：',
    items: [
      '<strong>常に顔色をうかがう（薄氷を踏む感覚）：</strong> 相手の機嫌や返信の温度を常にスキャンし、怒りや無視を避けるために言動を調整している。',
      '<strong>アメとムチ（間欠強化）の罠：</strong> 傷つけられた後の優しい謝罪や愛情表現があるせいで、苦しいサイクルから抜け出せない。',
      '<strong>自分の世界と個性の縮小：</strong> 波風を立てないために、好きだった趣味・友人関係・自分の意見を少しずつ手放してしまった。',
      '<strong>会った後の激しい消耗感：</strong> 一緒に過ごしたあと、元気が出るどころか頭がボーッとし、不安や強い疲労感に襲われる。'
    ],
    scoreUnit: '/ 4 個の有害な関係性・神経消耗サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、この関係があなたの神経系に与えている影響を確認しましょう。',
      '健全な関係性の土台（1/4）。意見の食い違いがあっても慢性的な恐怖や自己喪失はありません。',
      '中程度の関係性ストレス（2/4）。相手の予測不能な機嫌があなたの神経系を警戒モードにしています。',
      '高いトキシック・サイクル活性化（3/4）。顔色うかがいとアメとムチが愛着システムを縛り付けています。',
      '深刻な関係性による神経消耗（4/4）。身体が慢性的なサバイバル状態です。今すぐ愛着スタイル診断と境界線スクリプトで自分を守りましょう。'
    ],
    primaryBtn: '無料の愛着スタイル＆関係パターン診断へ &rarr;',
    subBtn: '自分を守る「境界線・お断りスクリプト作成ツール」を開く &rarr;'
  },
  zh: {
    badge: '30秒 有毒关系（Toxic Relationship）神经系统反应筛查',
    heading: '当你在那个人身边时，你的身体和神经系统感觉如何？',
    sub: '你的身体往往比理智更早识别出有毒关系。勾选你正在经历的信号：',
    items: [
      '<strong>如履薄冰看脸色：</strong> 时刻扫描对方的语气、脸色和回消息温度，小心翼翼调整自己以防对方发火或冷暴力。',
      '<strong>间歇性奖赏（打一巴掌给颗甜枣）成瘾：</strong> 伤害之后的温存道歉与浪漫，让你一次次容忍循环往复的贬低或冷漠。',
      '<strong>自我世界不断萎缩：</strong> 为了维持表面和平，你不知不觉放弃了自己的爱好、朋友或真实观点。',
      '<strong>相处后的躯体崩溃耗竭：</strong> 每次见完面或聊完天后，不仅没有充能，反而感到脑雾、焦虑、空虚或身体被掏空。'
    ],
    scoreUnit: '/ 4 个有毒关系神经消耗信号已激活',
    verdicts: [
      '勾选上方信号，评估这段关系正在如何影响你的神经系统安全。',
      '健康的关系安全感（1/4）。偶有分歧但不会造成慢性恐惧或自我丧失。',
      '中度关系能量内耗（2/4）。对方不可预测的情绪正迫使你的神经系统保持戒备。',
      '高度有毒循环激活（3/4）。如履薄冰与间歇性温存正在锁死你的依恋系统。',
      '重度关系性神经耗竭（4/4）。你的身体正处于慢性生存警报中，请立即测绘依恋模式并准备保护性边界话术。'
    ],
    primaryBtn: '通过免费依恋类型测试拆解关系模式 &rarr;',
    subBtn: '打开自我保护边界与拒绝话术生成器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE RELAÇÃO TÓXICA E SISTEMA NERVOSO EM 30 SEGUNDOS',
    heading: 'Como seu corpo se sente perto dessa pessoa?',
    sub: 'Seu sistema nervoso detecta padrões tóxicos antes da razão. Marque os sinais ativos:',
    items: [
      '<strong>Pisar em ovos:</strong> Você escaneia o humor da pessoa o tempo todo para evitar explosões ou gelo emocional.',
      '<strong>Armadilha do reforço intermitente:</strong> Momentos intensos de carinho e promessas fazem você tolerar ciclos de desrespeito.',
      '<strong>Encolhimento da própria vida:</strong> Você deixou amigos, hobbies ou opiniões de lado só para manter a paz na relação.',
      '<strong>Exaustão física após encontros:</strong> Depois de passarem tempo juntos, você se sente drenado, confuso ou ansioso.'
    ],
    scoreUnit: 'de 4 sinais de desgaste relacional tóxico ativos',
    verdicts: [
      'Marque os itens acima para avaliar como essa relação afeta seu sistema nervoso.',
      'Segurança relacional saudável (1/4). Conflitos ocorrem sem medo crônico ou perda de identidade.',
      'Desgaste relacional moderado (2/4). Humores imprevisíveis estão deixando seu corpo em alerta.',
      'Alta ativação de ciclo tóxico (3/4). Pisar em ovos e altos e baixos prendem seu sistema de apego.',
      'Esgotamento severo do sistema nervoso (4/4). Mapeie seu Estilo de Apego agora e crie roteiros firmes de limites.'
    ],
    primaryBtn: 'Mapear seu Padrão com o Teste de Estilo de Apego &rarr;',
    subBtn: 'Abrir Gerador de Scripts de Limites e Proteção &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ТОКСИЧНЫЕ ОТНОШЕНИЯ',
    heading: 'Как чувствует себя ваше тело рядом с этим человеком?',
    sub: 'Нервная система распознает токсичность раньше логики. Отметьте знакомые сигналы:',
    items: [
      '<strong>Хождение по тонкому льду:</strong> Вы постоянно считываете настроение партнера, чтобы избежать вспышки гнева или ледяного молчания.',
      '<strong>Крючок «качелей» (тепло-холодно):</strong> Яркие примирения и обещания заставляют вас терпеть повторяющееся неуважение.',
      '<strong>Сужение вашего мира:</strong> Ради мира в паре вы незаметно отказались от друзей, увлечений или собственного мнения.',
      '<strong>Телесное истощение после общения:</strong> После встреч вы чувствуете туман в голове, тревогу, пустоту и упадок сил.'
    ],
    scoreUnit: 'из 4 признаков токсичных отношений активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить влияние этих отношений на вашу нервную систему.',
      'Здоровая безопасность (1/4). Разногласия решаются без страха и потери себя.',
      'Умеренное истощение (2/4). Непредсказуемость партнера держит вашу нервную систему в напряжении.',
      'Активный токсичный цикл (3/4). Эмоциональные качели удерживают вашу систему привязанности.',
      'Тяжелое нервное истощение в отношениях (4/4). Пройдите тест на тип привязанности и подготовьте фразы защиты границ.'
    ],
    primaryBtn: 'Проверить сценарий в бесплатном тесте на тип привязанности &rarr;',
    subBtn: 'Открыть конструктор фраз для защиты личных границ &rarr;'
  },
  id: {
    badge: 'SKRINING HUBUNGAN TOKSIK &amp; SISTEM SARAF 30 DETIK',
    heading: 'Bagaimana Reaksi Tubuh Anda Saat Bersama Orang Ini?',
    sub: 'Sistem saraf mendeteksi hubungan toksik lebih cepat dari logika. Centang sinyal yang aktif:',
    items: [
      '<strong>Berjalan di Atas Cangkang Telur:</strong> Anda terus memindai mood pasangan agar tidak memicu kemarahan atau aksi diam (silent treatment).',
      '<strong>Jebakan Tarik-Ulur (Panas-Dingin):</strong> Momen manis dan permintaan maaf membuat Anda bertahan dalam siklus yang menyakitkan.',
      '<strong>Dunia &amp; Identitas Menyempit:</strong> Anda perlahan meninggalkan hobi, teman, atau pendapat demi menjaga kedamaian semu.',
      '<strong>Kelelahan Fisik Usai Bersama:</strong> Setelah bertemu atau mengobrol, Anda justru merasa cemas, hampa, atau terkuras habis.'
    ],
    scoreUnit: 'dari 4 sinyal hubungan toksik aktif',
    verdicts: [
      'Centang item di atas untuk mengevaluasi dampak hubungan ini pada sistem saraf Anda.',
      'Keamanan Hubungan Sehat (1/4). Perbedaan pendapat tidak merusak rasa aman atau jati diri Anda.',
      'Kuras Energi Sedang (2/4). Mood yang sulit ditebak membuat sistem saraf Anda terus waspada.',
      'Siklus Toksik Aktif (3/4). Pola tarik-ulur mengunci sistem kelekatan Anda.',
      'Kelelahan Sistem Saraf Berat (4/4). Petakan Gaya Kelekatan Anda sekarang dan siapkan skrip batasan tegas.'
    ],
    primaryBtn: 'Petakan Pola Hubungan dengan Tes Gaya Kelekatan &rarr;',
    subBtn: 'Buka Pembuat Skrip Batasan &amp; Perlindungan Diri &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK TOKSİK İLİŞKİ VE SİNİR SİSTEMİ TARAMASI',
    heading: 'Bu Kişinin Yanındayken Bedeniniz Nasıl Hissediyor?',
    sub: 'Sinir sisteminiz toksik döngüyü mantığınızdan önce fark eder. Aktif sinyalleri işaretleyin:',
    items: [
      '<strong>Diken Üstünde Yürümek:</strong> Öfke patlamasını veya soğuk duvarı önlemek için sürekli karşı tarafın ruh halini tarıyorsunuz.',
      '<strong>Aralıklı Pekiştirme (Sıcak-Soğuk) Kancası:</strong> Yoğun sevgi ve özür anları, tekrarlayan saygısızlık döngülerine katlanmanıza neden oluyor.',
      '<strong>Küçülen Dünya ve Kimlik:</strong> Sadece huzur bozulmasın diye hobilerinizi, arkadaşlarınızı veya fikirlerinizi sessizce bıraktınız.',
      '<strong>Buluşma Sonrası Bedensel Çöküş:</strong> Birlikte vakit geçirdikten sonra zihin sisi, kaygı, boşluk veya aşırı yorgunluk hissediyorsunuz.'
    ],
    scoreUnit: '/ 4 toksik ilişki sinir sistemi sinyali aktif',
    verdicts: [
      'Bu ilişkinin sinir sisteminizi nasıl etkilediğini görmek için yukarıdakileri işaretleyin.',
      'Sağlıklı İlişkisel Güven (1/4). Anlaşmazlıklar kronik korku veya kimlik kaybı yaratmıyor.',
      'Orta Düzey İlişkisel Yıpranma (2/4). Öngörülemeyen ruh halleri sinir sisteminizi tetikte tutuyor.',
      'Yüksek Toksik Döngü Aktivasyonu (3/4). Sıcak-soğuk döngüsü bağlanma sisteminizi kilitliyor.',
      'Şiddetli İlişkisel Sinir Sistemi Tükenmesi (4/4). Şimdi Bağlanma Stili Testini çözün ve sınır koruma metinlerinizi hazırlayın.'
    ],
    primaryBtn: 'Bağlanma Stili Testiyle İlişki Kalıbınızı Haritalayın &rarr;',
    subBtn: 'Sınır Koyma ve Koruma Metin Oluşturucuyu Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड टॉक्सिक रिलेशनशिप (Toxic Relationship) स्क्रीनर',
    heading: 'इस व्यक्ति के आसपास आपका शरीर और मन कैसा महसूस करता है?',
    sub: 'आपका नर्वस सिस्टम तर्क से पहले टॉक्सिक पैटर्न भांप लेता है। इन संकेतों को चुनें:',
    items: [
      '<strong>हमेशा डर और सहमे हुए रहना:</strong> सामने वाले के गुस्से या चुप्पी से बचने के लिए लगातार उसके मूड और लहजे को भांपते रहना।',
      '<strong>कभी बहुत प्यार, कभी अनादर का जाल:</strong> बीच-बीच में मिलने वाले अत्यधिक प्यार और माफ़ी के कारण बार-बार होने वाले अपमान को सहते रहना।',
      '<strong>सिमटती दुनिया और पहचान:</strong> रिश्ते में शांति बनाए रखने के लिए अपने दोस्तों, शौक या अपनी राय को चुपचाप छोड़ देना।',
      '<strong>मिलने के बाद शारीरिक और मानसिक थकान:</strong> साथ समय बिताने के बाद तरोताज़ा होने के बजाय दिमाग सुन्न, चिंतित और थका हुआ महसूस होना।'
    ],
    scoreUnit: '/ 4 टॉक्सिक रिलेशनशिप संकेत सक्रिय',
    verdicts: [
      'यह देखने के लिए ऊपर चुनें कि यह रिश्ता आपके नर्वस सिस्टम पर क्या असर डाल रहा है।',
      'स्वस्थ और सुरक्षित रिश्ता (1/4)। मतभेद होने पर भी डर या आत्म-सम्मान की हानि नहीं होती।',
      'मध्यम मानसिक थकान (2/4)। अनिश्चित मूड आपके नर्वस सिस्टम को अलर्ट मोड में रख रहा है।',
      'उच्च टॉक्सिक चक्र सक्रियण (3/4)। उतार-चढ़ाव का यह चक्र आपके अटैचमेंट सिस्टम को उलझा रहा है।',
      'गंभीर नर्वस सिस्टम थकान (4/4)। अभी अटैचमेंट स्टाइल टेस्ट लें और अपनी सुरक्षा के लिए बाउंड्री स्क्रिप्ट तैयार करें।'
    ],
    primaryBtn: 'अटैचमेंट स्टाइल टेस्ट से अपने रिलेशनशिप पैटर्न जानें &rarr;',
    subBtn: 'मजबूत बाउंड्री और सुरक्षा स्क्रिप्ट टूल खोलें &rarr;'
  }
};

const SELF_COMPASSION_LOCALES = {
  en: {
    badge: '30-SECOND INNER CRITIC vs. SELF-COMPASSION SCREENER',
    heading: 'Would You Speak to a Friend the Way You Speak to Yourself?',
    sub: 'Check the self-judgment and inner critic patterns active when you struggle or make a mistake:',
    items: [
      '<strong>Harsh Double Standard:</strong> You offer warm understanding when friends fail, yet attack yourself with brutal insults for the exact same mistake.',
      '<strong>Isolation Illusion:</strong> When you are hurting or struggling, you feel like you are the only person failing while everyone else has life figured out.',
      '<strong>Punishment as "Motivation":</strong> You believe that if you stop beating yourself up, you will become lazy, complacent, or irresponsible.',
      '<strong>Over-Identification Spiral:</strong> One setback quickly fuses with your entire identity ("I made a mistake" instantly becomes "I am a failure").'
    ],
    scoreUnit: 'of 4 harsh inner critic signals active',
    verdicts: [
      'Check the items above to measure whether your inner voice is regulating or attacking your nervous system.',
      'Supportive Inner Voice (1/4). You respond to setbacks with balanced perspective and kindness.',
      'Moderate Inner Critic Pressure (2/4). Self-judgment is adding extra cortisol to everyday challenges.',
      'High Self-Attack Activation (3/4). Your inner critic is triggering threat responses (fight-flight-freeze) against yourself.',
      'Severe Toxic Self-Criticism Loop (4/4). Internal hostility is exhausting your nervous system—check your stress load and build a compassionate regulation plan now.'
    ],
    primaryBtn: 'Check Your Inner Critic Stress &amp; Nervous System Load &rarr;',
    subBtn: 'Build a Self-Compassionate Emotion Regulation Plan &rarr;'
  },
  ko: {
    badge: '30초 내면의 비판자 vs 자기자비(Self-Compassion) 판별기',
    heading: '친구에게도 지금 나에게 하듯 그렇게 가혹하게 말할 건가요?',
    sub: '실수하거나 힘든 순간에 작동하는 자기공격 및 내면 비판자 신호를 체크해보세요:',
    items: [
      '<strong>가혹한 이중 잣대:</strong> 친구가 실수하면 따뜻하게 위로하면서, 내가 똑같은 실수를 하면 용서하지 않고 모질게 몰아세웁니다.',
      '<strong>고립감의 착각:</strong> 힘들거나 실패했을 때 "세상에서 나만 이렇게 못나고 뒤처져 있다"는 고립감에 빠집니다.',
      '<strong>채찍질이 곧 동기부여라는 믿음:</strong> 나에게 관대해지면 나태해지고 망가질 것 같아서 불안한 마음에 계속 스스로를 다그칩니다.',
      '<strong>실수와 정체성의 동일시:</strong> 작은 실수 하나를 했을 뿐인데 "실수했다"가 곧바로 "나는 실패작이야"라는 전체 부정으로 번집니다.'
    ],
    scoreUnit: '개 가혹한 내면 비판자 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 내면의 목소리가 나를 돕고 있는지 신경계를 공격하고 있는지 확인해보세요.',
      '따뜻한 자기자비 기반(1/4). 어려움 앞에서도 균형 잡힌 시각과 자기 돌봄을 유지하고 있습니다.',
      '중등도 내면 비판 압박(2/4). 자기비판이 일상적인 스트레스에 불필요한 코르티솔을 더하고 있습니다.',
      '높은 자기공격 활성화(3/4). 내면의 비판자가 나 자신을 위협으로 인식해 투쟁-도피-동결 반응을 일으키고 있습니다.',
      '심각한 독성 자기비판 루프(4/4). 끝없는 자책이 신경계를 고갈시키고 있습니다. 지금 스트레스 부하를 점검하고 자기자비 정서 조절 플랜을 세우세요.'
    ],
    primaryBtn: '3분 자기비판 스트레스 및 신경계 부하 진단 &rarr;',
    subBtn: '자기자비 기반 맞춤 정서 조절 플래너 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN INNERER KRITIKER vs. SELBSTMITGEFÜHL-CHECK',
    heading: 'Würden Sie mit einem guten Freund so reden wie mit sich selbst?',
    sub: 'Wählen Sie die Muster Ihres inneren Kritikers, die bei Fehlern oder Krisen auftreten:',
    items: [
      '<strong>Harter Doppelstandard:</strong> Freunden verzeihen Sie Fehler sofort, sich selbst greifen Sie für dasselbe gnadenlos an.',
      '<strong>Isolations-Illusion:</strong> Wenn Sie straucheln, haben Sie das Gefühl, dass nur Sie versagen, während alle anderen ihr Leben im Griff haben.',
      '<strong>Selbstbestrafung als „Antrieb“:</strong> Sie glauben, ohne harte Selbstkritik würden Sie faul oder nachlässig werden.',
      '<strong>Über-Identifikation:</strong> Ein einzelner Rückschlag wird sofort zur Identität („Ich habe einen Fehler gemacht“ wird zu „Ich bin ein Versager“).'
    ],
    scoreUnit: 'von 4 Signalen des inneren Kritikers aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihren inneren Kritiker zu prüfen.',
      'Unterstützende innere Stimme (1/4). Sie begegnen Rückschlägen mit gesundem Selbstmitgefühl.',
      'Moderater Kritiker-Druck (2/4). Selbstverurteilung verstärkt Ihren Alltagsstress.',
      'Hohe Selbstangriffs-Aktivierung (3/4). Ihr innerer Kritiker versetzt Ihr eigenes Nervensystem in Alarm.',
      'Toxische Selbstkritik-Schleife (4/4). Prüfen Sie jetzt Ihre Stresslast und erstellen Sie einen Plan zur Emotionsregulation.'
    ],
    primaryBtn: '3-Minuten Stress- &amp; Selbstkritik-Check starten &rarr;',
    subBtn: 'Emotionsregulations-Planer für Selbstmitgefühl öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE CRÍTICO INTERNO vs. AUTOCOMPASIÓN EN 30 SEGUNDOS',
    heading: '¿Le hablarías a un amigo como te hablas a ti mismo?',
    sub: 'Marca los patrones de autocrítica que se activan cuando sufres o cometes un error:',
    items: [
      '<strong>Doble rasero implacable:</strong> Comprensión cálida para tus amigos cuando fallan, pero dureza brutal contigo mismo por lo mismo.',
      '<strong>Ilusión de aislamiento:</strong> Cuando pasas por un mal momento, sientes que eres el único que fracasa mientras los demás pueden con todo.',
      '<strong>Castigo como «motivación»:</strong> Crees que si dejas de machacarte te volverás perezoso o mediocre.',
      '<strong>Sobreidentificación con el fallo:</strong> Un tropiezo puntual se fusiona con tu identidad («Me equivoqué» pasa a ser «Soy un fracaso»).'
    ],
    scoreUnit: 'de 4 señales de crítico interno severo activas',
    verdicts: [
      'Marca los puntos arriba para ver si tu voz interna regula o ataca a tu sistema nervioso.',
      'Voz interna compasiva (1/4). Afrontas los tropiezos con equilibrio y amabilidad.',
      'Presión moderada del crítico interno (2/4). El autojuicio añade cortisol extra a tus retos.',
      'Alta activación de autoataque (3/4). Tu crítico interno dispara respuestas de amenaza contra ti mismo.',
      'Bucle severo de autocrítica tóxica (4/4). Evalúa tu carga de estrés ahora y diseña un plan de regulación emocional.'
    ],
    primaryBtn: 'Hacer el Test de Estrés y Autocrítica en 3 Minutos &rarr;',
    subBtn: 'Abrir Planificador de Regulación Emocional &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR CRITIQUE INTÉRIEUR vs AUTO-COMPASSION EN 30 SECONDES',
    heading: 'Parleriez-vous à un ami comme vous vous parlez à vous-même ?',
    sub: 'Cochez les réflexes d’auto-jugement actifs lorsque vous faites une erreur :',
    items: [
      '<strong>Double standard sévère :</strong> Vous êtes bienveillant envers vos proches, mais impitoyable envers vous-même pour la même erreur.',
      '<strong>Illusion d’isolement :</strong> Dans l’épreuve, vous avez l’impression d’être le seul à échouer pendant que les autres réussissent.',
      '<strong>La punition comme « moteur » :</strong> Vous craignez de devenir paresseux si vous cessez de vous flageller.',
      '<strong>Sur-identification à l’échec :</strong> Une simple erreur devient votre identité (« J’ai raté » devient « Je suis nul »).'
    ],
    scoreUnit: 'sur 4 signaux de critique intérieur sévère actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour évaluer l’impact de votre voix intérieure.',
      'Voix intérieure soutenante (1/4). Vous accueillez les difficultés avec recul et douceur.',
      'Pression modérée du critique (2/4). L’auto-jugement alourdit votre stress quotidien.',
      'Forte auto-attaque nerveuse (3/4). Votre critique intérieur déclenche une alarme de menace contre vous-même.',
      'Boucle sévère d’autocritique toxique (4/4). Mesurez votre stress et créez un plan de régulation bienveillant.'
    ],
    primaryBtn: 'Faire le Bilan Stress et Critique Intérieur &rarr;',
    subBtn: 'Ouvrir le Planificateur de Régulation Émotionnelle &rarr;'
  },
  ja: {
    badge: '30秒 内なる批判者 vs セルフ・コンパッション（自分への慈悲）診断',
    heading: '大切な友人にも、今自分に向けているような厳しい言葉を投げかけますか？',
    sub: '失敗したときや苦しいときに作動する「自己攻撃サイン」をチェックしてください：',
    items: [
      '<strong>自分への厳しい二重基準（ダブルスタンダード）：</strong> 友人の失敗には優しく寄り添えるのに、自分の同じミスには容赦ない罵声を浴びせる。',
      '<strong>孤立感の錯覚：</strong> つらいとき、「みんな普通にできているのに、自分だけがダメで取り残されている」と感じる。',
      '<strong>「自分を責めないと怠ける」という思い込み：</strong> 自分に優しくしたら成長が止まりダメな人間になる気がして、ムチを打ち続けてしまう。',
      '<strong>失敗と人格の同一化：</strong> たった一つのミスが「失敗した」ではなく「自分は価値のない人間だ」という全否定に直結する。'
    ],
    scoreUnit: '/ 4 個の過剰な自己批判サインがアクティブ',
    verdicts: [
      '上の項目をチェックして、心の声があなたを支えているか攻撃しているか確認しましょう。',
      '温かいセルフ・コンパッション（1/4）。困難なときもバランスよく自分をケアできています。',
      '中程度の自己批判プレッシャー（2/4）。自分へのダメ出しが日常のストレスを増幅させています。',
      '高い自己攻撃アラーム（3/4）。内なる批判者が自分自身を攻撃し、神経系を闘争・逃走モードにしています。',
      '深刻な毒性自己批判ループ（4/4）。今すぐストレス負荷をチェックし、自分をすり減らさない感情調整プランを作成しましょう。'
    ],
    primaryBtn: '3分間の無料ストレス＆自己批判負荷チェックへ &rarr;',
    subBtn: '心を整える「感情調整プランナー」を開く &rarr;'
  },
  zh: {
    badge: '30秒 内在批判者 vs 自我关怀（Self-Compassion）筛查',
    heading: '你会用对待自己的那种严苛语气，去对待一个好朋友吗？',
    sub: '勾选当你犯错或陷入低谷时，大脑自动启动的自我攻击信号：',
    items: [
      '<strong>残酷的双重标准：</strong> 朋友犯错时你能温柔体谅，但自己犯了同样的错时却毫不留情地辱骂和苛责自己。',
      '<strong>孤立无援的错觉：</strong> 每当痛苦或受挫时，总觉得“全世界只有我这么失败，别人都能轻松搞定一切”。',
      '<strong>把自我鞭策当成唯一动力：</strong> 深信如果停止苛责自己，自己就会立刻变得懒惰、堕落或一事无成。',
      '<strong>过度认同负面情绪：</strong> 一次小小的失误瞬间上升为全盘人格否定（从“我做错了一件事”变成“我就是个彻头彻尾的失败者”）。'
    ],
    scoreUnit: '/ 4 个严苛内在批判者信号已激活',
    verdicts: [
      '勾选上方信号，查看你的内在声音是在安抚还是在攻击你的神经系统。',
      '温暖支持的内在声音（1/4）。你能以平衡与善意的态度面对挫折。',
      '中度内在批判压力（2/4）。自我苛责正在给日常挑战额外叠加皮质醇负担。',
      '高度自我攻击激活（3/4）。你的内在批判者正把你自己当成敌人，触发神经系统的威胁警报。',
      '重度毒性自我批判循环（4/4）。持续的内在敌意正在透支你的神经系统，请立即检测压力负荷并制定情绪调节方案。'
    ],
    primaryBtn: '开始 3 分钟内在批判与压力负荷测评 &rarr;',
    subBtn: '打开培养自我关怀的情绪调节规划器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE CRÍTICO INTERNO vs. AUTOCOMPAIXÃO EM 30 SEGUNDOS',
    heading: 'Você falaria com um amigo do jeito que fala consigo mesmo?',
    sub: 'Marque os padrões de autojulgamento que surgem quando você erra ou passa por dificuldades:',
    items: [
      '<strong>Dois pesos e duas medidas:</strong> Você acolhe amigos quando erram, mas se ataca sem piedade pelo mesmo motivo.',
      '<strong>Ilusão de isolamento:</strong> Quando sofre, sente que só você está falhando enquanto todo mundo dá conta da vida.',
      '<strong>Punição como "motivação":</strong> Você acredita que se parar de se cobrar duramente ficará preguiçoso ou acomodado.',
      '<strong>Superidentificação com a falha:</strong> Um erro pontual vira sua identidade ("Cometi um erro" vira "Sou um fracasso").'
    ],
    scoreUnit: 'de 4 sinais de crítico interno severo ativos',
    verdicts: [
      'Marque os itens acima para ver se sua voz interna apoia ou ataca seu sistema nervoso.',
      'Voz interna acolhedora (1/4). Você lida com tropeços com equilíbrio e gentileza.',
      'Pressão moderada do crítico interno (2/4). O autojulgamento está somando cortisol extra à sua rotina.',
      'Alta ativação de autoataque (3/4). Seu crítico interno dispara alarmes de ameaça contra você mesmo.',
      'Ciclo severo de autocrítica tóxica (4/4). Meça sua carga de estresse agora e monte um plano de regulação emocional.'
    ],
    primaryBtn: 'Fazer o Teste de Estresse e Autocrítica em 3 Minutos &rarr;',
    subBtn: 'Abrir o Planejador de Regulação Emocional &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ: ВНУТРЕННИЙ КРИТИК ИЛИ САМОСОСТРАДАНИЕ?',
    heading: 'Вы бы стали говорить другу то, что говорите самому себе?',
    sub: 'Отметьте признаки самобичевания, которые включаются при ошибках и трудностях:',
    items: [
      '<strong>Жесткие двойные стандарты:</strong> Друзей вы поддерживаете с теплом, а себя за ту же ошибку беспощадно ругаете.',
      '<strong>Иллюзия изоляции:</strong> В трудные минуты кажется, что только вы не справляетесь с жизнью, а у всех остальных всё идеально.',
      '<strong>Самобичевание как «мотивация»:</strong> Вы боитесь, что если перестанете давить на себя, то сразу обленитесь и деградируете.',
      '<strong>Слияние с неудачей:</strong> Одна ошибка мгновенно обобщается до всей личности («Я ошибся» превращается в «Я неудачник»).'
    ],
    scoreUnit: 'из 4 признаков жесткого внутреннего критика активны',
    verdicts: [
      'Отметьте пункты выше, чтобы понять, поддерживает ли вас внутренний голос или истощает.',
      'Поддерживающий внутренний голос (1/4). Вы относитесь к ошибкам с пониманием и балансом.',
      'Умеренное давление критика (2/4). Самоосуждение усиливает ежедневный стресс.',
      'Высокая самоагрессия (3/4). Внутренний критик включает в вашей нервной системе реакцию угрозы.',
      'Глубокий цикл токсичной самокритики (4/4). Проверьте уровень стресса и составьте бережный план регуляции эмоций.'
    ],
    primaryBtn: 'Пройти 3-минутный тест на стресс и самокритику &rarr;',
    subBtn: 'Открыть планировщик эмоциональной регуляции &rarr;'
  },
  id: {
    badge: 'SKRINING KRITIKUS BATIN vs. SELF-COMPASSION 30 DETIK',
    heading: 'Apakah Anda Tega Berbicara pada Sahabat Seperti Anda Berbicara pada Diri Sendiri?',
    sub: 'Centang pola penghakiman diri yang aktif saat Anda gagal atau mengalami kesulitan:',
    items: [
      '<strong>Standar Ganda yang Keras:</strong> Anda lembut dan memaklumi saat teman salah, namun menghujat diri sendiri atas kesalahan yang sama.',
      '<strong>Ilusi Keterasingan:</strong> Saat terluka atau gagal, Anda merasa hanya Anda yang berantakan sementara orang lain baik-baik saja.',
      '<strong>Hukuman Diri sebagai "Motivasi":</strong> Anda takut jika berhenti menyalahkan diri sendiri, Anda akan menjadi malas dan gagal.',
      '<strong>Spiral Identifikasi Berlebih:</strong> Satu kesalahan langsung melebur jadi identitas ("Aku berbuat salah" menjadi "Aku produk gagal").'
    ],
    scoreUnit: 'dari 4 sinyal kritikus batin keras aktif',
    verdicts: [
      'Centang item di atas untuk melihat apakah suara batin Anda menenangkan atau menyerang sistem saraf Anda.',
      'Suara Batin Mendukung (1/4). Anda merespons kegagalan dengan perspektif seimbang.',
      'Tekanan Kritikus Batin Sedang (2/4). Penghakiman diri menambah beban kortisol harian Anda.',
      'Aktivasi Serangan Diri Tinggi (3/4). Kritikus batin memicu respons ancaman terhadap diri Anda sendiri.',
      'Siklus Kritik Diri Toksik Berat (4/4). Ukur beban stres Anda sekarang dan buat rencana regulasi emosi yang welas asih.'
    ],
    primaryBtn: 'Ikuti Tes Stres &amp; Beban Kritikus Batin 3 Menit &rarr;',
    subBtn: 'Buka Perencana Regulasi Emosi Self-Compassion &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İÇSEL ELEŞTİRMEN vs. ÖZ-ŞEFKAT TARAMASI',
    heading: 'Kendinizle Konuştuğunuz Gibi Bir Arkadaşınızla Konuşur muydunuz?',
    sub: 'Zorlandığınızda veya hata yaptığınızda devreye giren öz-yargılama kalıplarını işaretleyin:',
    items: [
      '<strong>Acımasız Çifte Standart:</strong> Arkadaşlarınız hata yaptığında anlayış gösteriyor, aynı hatada kendinizi acımasızca suçluyorsunuz.',
      '<strong>Yalnızlık Yanılsaması:</strong> Acı çektiğinizde veya zorlandığınızda herkes her şeyi초başarırken bir tek siz başarısızmışsınız gibi hissediyorsunuz.',
      '<strong>"Motivasyon" Olarak Öz-Ceza:</strong> Kendinizi kırbaçlamayı bırakırsanız tembelleşeceğinizden korkuyorsunuz.',
      '<strong>Hata ile Kimliği Birleştirme:</strong> Tek bir aksilik tüm kimliğinize yayılıyor ("Hata yaptım" anında "Ben başarısızın tekiyim"e dönüşüyor).'
    ],
    scoreUnit: '/ 4 sert içsel eleştirmen sinyali aktif',
    verdicts: [
      'İç sesinizin sinir sisteminizi yatıştırıp yatıştırmadığını görmek için yukarıdakileri işaretleyin.',
      'Destekleyici İç Ses (1/4). Aksiliklere dengeli bir bakış ve nezaketle yaklaşıyorsunuz.',
      'Orta Düzey İçsel Eleştirmen Baskısı (2/4). Öz-yargılama günlük stresinize ekstra kortizol ekliyor.',
      'Yüksek Öz-Saldırı Aktivasyonu (3/4). İçsel eleştirmeniniz kendi sinir sisteminize karşı tehdit alarmı çalıyor.',
      'Şiddetli Toksik Öz-Eleştiri Döngüsü (4/4). Şimdi stres yükünüzü ölçün ve şefkatli bir duygu düzenleme planı oluşturun.'
    ],
    primaryBtn: '3 Dakikalık Stres ve İçsel Eleştirmen Testini Başlat &rarr;',
    subBtn: 'Öz-Şefkat Odaklı Duygu Düzenleme Planlayıcısını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड इनर क्रिटिक बनाम सेल्फ-कम्पैशन (Self-Compassion) स्क्रीनर',
    heading: 'क्या आप किसी दोस्त से वैसे बात करेंगे जैसे आप खुद से करते हैं?',
    sub: 'गलती होने या कठिन समय में अपने प्रति सक्रिय होने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>कठोर दोहरा मापदंड:</strong> दोस्तों की गलती पर उन्हें प्यार से समझाना, लेकिन उसी गलती के लिए खुद को बेरहमी से कोसना।',
      '<strong>अकेलेपन का भ्रम:</strong> परेशानी के समय ऐसा लगना कि केवल आप ही असफल हो रहे हैं जबकि बाकी सबका जीवन सही चल रहा है।',
      '<strong>खुद को सज़ा देने को ही "मोटिवेशन" मानना:</strong> यह डर होना कि अगर खुद पर सख्ती नहीं की तो आप आलसी या गैर-जिम्मेदार हो जाएंगे।',
      '<strong>एक गलती को अपनी पहचान बना लेना:</strong> एक छोटी असफलता को तुरंत पूरे व्यक्तित्व से जोड़ लेना ("मुझसे गलती हुई" का "मैं एक असफल इंसान हूँ" बन जाना)।'
    ],
    scoreUnit: '/ 4 कठोर इनर क्रिटिक संकेत सक्रिय',
    verdicts: [
      'यह देखने के लिए ऊपर चुनें कि आपकी आंतरिक आवाज़ आपको सहारा दे रही है या थका रही है।',
      'सहयोगी आंतरिक आवाज़ (1/4)। आप कठिनाइयों का सामना संतुलन और आत्म-करुणा के साथ करते हैं।',
      'मध्यम आत्म-आलोचना दबाव (2/4)। खुद को कोसना आपके दैनिक तनाव को बढ़ा रहा है।',
      'उच्च आत्म-प्रहार सक्रियण (3/4)। आपका इनर क्रिटिक आपके ही नर्वस सिस्टम में खतरे का अलार्म बजा रहा है।',
      'गंभीर टॉक्सिक आत्म-आलोचना चक्र (4/4)। अभी अपना स्ट्रेस लोड जांचें और इमोशन रेगुलेशन प्लान बनाएं।'
    ],
    primaryBtn: '3-मिनट का स्ट्रेस और इनर क्रिटिक लोड चेक लें &rarr;',
    subBtn: 'सेल्फ-कम्पैशन इमोशन रेगुलेशन प्लानर खोलें &rarr;'
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

  // 1. gaslighting-signs-recovery-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(GASLIGHTING_RECOVERY_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'gaslighting-signs-recovery-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'gaslightingRealityScreener',
      chkClass: 'gaslight-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=gaslighting_recovery_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=gaslighting_recovery_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/gaslighting-signs-recovery-guide.html`);
    console.log(`[PASS] gaslighting-signs-recovery-guide (${lang})`);
  }

  // 2. toxic-relationship-patterns-signs.html (12 locales)
  for (const [lang, loc] of Object.entries(TOXIC_RELATIONSHIP_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'toxic-relationship-patterns-signs.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'toxicRelationshipScreener',
      chkClass: 'toxrel-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=toxic_relationship_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=toxic_relationship_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/toxic-relationship-patterns-signs.html`);
    console.log(`[PASS] toxic-relationship-patterns-signs (${lang})`);
  }

  // 3. self-compassion-mental-health-guide.html (12 locales)
  for (const [lang, loc] of Object.entries(SELF_COMPASSION_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'self-compassion-mental-health-guide.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'innerCriticCompassionScreener',
      chkClass: 'scomp-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/stress-check/?lang=${lang}&source=self_compassion_screener`,
      primaryTargetSlug: 'stress-check',
      primaryBtn: loc.primaryBtn,
      subHref: `/portal/tools/emotion-regulation-planner.html?lang=${lang}&source=self_compassion_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/self-compassion-mental-health-guide.html`);
    console.log(`[PASS] self-compassion-mental-health-guide (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 9: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

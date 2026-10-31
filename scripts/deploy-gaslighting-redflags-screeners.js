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

const GASLIGHTING_REL_LOCALES = {
  en: {
    badge: '30-SECOND RELATIONSHIP GASLIGHTING SCREENER',
    heading: 'Is It a Normal Misunderstanding—or Relationship Gaslighting?',
    sub: 'Check the conversational distortion patterns you notice during disagreements:',
    items: [
      '<strong>History Rewriting:</strong> Your partner flatly denies saying or doing things you clearly remember ("I never said that, you’re imagining things").',
      '<strong>Tone Policing Over Content:</strong> Instead of addressing the hurtful behavior you brought up, they attack your tone or reaction as the "real problem."',
      '<strong>Weaponized Sensitivity Labels:</strong> Your valid hurt is dismissed as "crazy," "insecure," "dramatic," or "unable to take a joke."',
      '<strong>Pre-Conversation Rehearsal:</strong> You spend hours rehearsing how to phrase a simple concern gently enough so it cannot be twisted against you.'
    ],
    scoreUnit: 'of 4 relationship gaslighting signals active',
    verdicts: [
      'Check the items above to distinguish honest memory differences from relational gaslighting.',
      'Low Distortion Risk (1/4). Occasional miscommunication without systematic reality denial.',
      'Moderate Defensive Deflection (2/4). Blame-shifting is preventing honest conflict resolution.',
      'High Relational Gaslighting (3/4). Systematic invalidation is eroding your emotional safety and self-trust.',
      'Severe Gaslighting Cycle (4/4). Your reality is being actively rewritten—map your Attachment Style and prepare protective boundary scripts now.'
    ],
    primaryBtn: 'Map Your Relationship Dynamics with the Attachment Test &rarr;',
    subBtn: 'Generate Anti-Gaslighting Boundary Scripts Now &rarr;'
  },
  ko: {
    badge: '30초 연인·부부 관계 가스라이팅(Gaslighting) 판별기',
    heading: '단순한 오해일까요, 기억과 감정을 왜곡하는 가스라이팅일까요?',
    sub: '갈등 상황에서 반복되는 대화 왜곡 및 책임 전가 신호를 체크해보세요:',
    items: [
      '<strong>과거 사실의 전면 부정:</strong> 내가 분명히 기억하는 말이나 행동을 두고 "내가 언제 그랬어? 네가 상상한 거잖아"라며 기억을 부정합니다.',
      '<strong>내용 대신 말투 트집 잡기:</strong> 상처받은 행동 자체는 외면한 채, 문제를 제기하는 내 말투나 표정을 더 큰 잘못으로 몰아갑니다.',
      '<strong>예민함·불안함 프레임 씌우기:</strong> 정당한 서운함을 표현하면 "너 왜 이렇게 예민해?", "농담도 못 받아주냐"라며 내 성격 문제로 축소합니다.',
      '<strong>대화 전 수십 번의 대본 리허설:</strong> 내 말이 꼬투리 잡히거나 왜곡되지 않게 하려고 간단한 부탁조차 머릿속으로 수십 번 연습합니다.'
    ],
    scoreUnit: '개 관계 가스라이팅 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 일상적인 기억 차이와 관계 속 가스라이팅을 구분해보세요.',
      '낮은 왜곡 위험(1/4). 의도적인 현실 부정보다는 일시적인 소통 오해에 가깝습니다.',
      '중등도 방어적 책임 전가(2/4). 회피와 논점 흐리기가 건강한 갈등 해결을 방해하고 있습니다.',
      '높은 관계 가스라이팅 활성화(3/4). 반복적인 감정 부정으로 인해 정서적 안전감과 자기 확신이 깎이고 있습니다.',
      '심각한 가스라이팅 통제 루프(4/4). 내 현실 감각이 체계적으로 흔들리고 있습니다. 지금 애착 관계 패턴을 진단하고 방어 대본을 준비하세요.'
    ],
    primaryBtn: '무료 애착 유형 및 관계 역학 정밀 진단 &rarr;',
    subBtn: '가스라이팅 차단용 대화·경계 대본 빌더 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN BEZIEHUNGS-GASLIGHTING-CHECK',
    heading: 'Normales Missverständnis oder Gaslighting in der Beziehung?',
    sub: 'Wählen Sie die Gesprächsmuster aus, die bei Konflikten mit Ihrem Partner auftreten:',
    items: [
      '<strong>Umschreiben der Realität:</strong> Ihr Partner bestreitet Dinge, an die Sie sich klar erinnern („Das habe ich nie gesagt, du bildest dir das ein“).',
      '<strong>Tonfall statt Inhalt:</strong> Statt über die Verletzung zu sprechen, wird Ihre Reaktion zum „eigentlichen Problem“ erklärt.',
      '<strong>Abwertung als „zu empfindlich“:</strong> Berechtigter Schmerz wird als „dramatisch“, „unsicher“ oder „humorlos“ abgetan.',
      '<strong>Stundenlanges Vorab-Proben:</strong> Sie legen jedes Wort auf die Goldwaage, damit Ihr Anliegen nicht gegen Sie verdreht werden kann.'
    ],
    scoreUnit: 'von 4 Beziehungs-Gaslighting-Signalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um ehrliche Missverständnisse von Gaslighting zu trennen.',
      'Geringes Verzerrungsrisiko (1/4). Punktuelle Kommunikationsprobleme ohne systematische Manipulation.',
      'Moderate Schuldumkehr (2/4). Abwehrhaltungen blockieren eine faire Konfliktlösung.',
      'Hohes Beziehungs-Gaslighting (3/4). Systematische Entwertung untergräbt Ihr Selbstvertrauen.',
      'Akuter Gaslighting-Kreislauf (4/4). Prüfen Sie jetzt Ihren Bindungsstil und erstellen Sie klare Grenz-Skripte.'
    ],
    primaryBtn: 'Beziehungsdynamik mit dem Bindungstest prüfen &rarr;',
    subBtn: 'Anti-Gaslighting Grenz-Skript-Builder öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE GASLIGHTING EN LA PAREJA EN 30 SEGUNDOS',
    heading: '¿Es un malentendido normal o gaslighting en tu relación?',
    sub: 'Marca los patrones de distorsión que notas durante las discusiones:',
    items: [
      '<strong>Reescritura de los hechos:</strong> Tu pareja niega rotundamente cosas que recuerdas con claridad («Nunca dije eso, te lo imaginas»).',
      '<strong>Ataque al tono en vez del hecho:</strong> En lugar de hablar de lo que te dolió, convierte tu reacción en el «verdadero problema».',
      '<strong>Etiquetas de «exagerado o loco»:</strong> Tu dolor válido se invalida llamándote «inseguro», «dramático» o «incapaz de aguantar una broma».',
      '<strong>Ensayo previo agotador:</strong> Pasas horas pensando cómo decir algo básico con suavidad para que no lo usen en tu contra.'
    ],
    scoreUnit: 'de 4 señales de gaslighting en pareja activas',
    verdicts: [
      'Marca los puntos arriba para distinguir diferencias de memoria del gaslighting.',
      'Bajo riesgo de distorsión (1/4). Desacuerdos puntuales sin manipulación sistemática.',
      'Desvío defensivo moderado (2/4). La evasión de culpa impide resolver conflictos.',
      'Alto gaslighting relacional (3/4). La invalidación constante erosiona tu seguridad emocional.',
      'Ciclo severo de gaslighting (4/4). Evalúa tu Estilo de Apego ahora y prepara guiones firmes de límites.'
    ],
    primaryBtn: 'Evaluar tu Relación con el Test de Estilo de Apego &rarr;',
    subBtn: 'Generar Guiones de Límites contra el Gaslighting &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE GASLIGHTING EN COUPLE EN 30 SECONDES',
    heading: 'Simple malentendu ou gaslighting dans votre relation ?',
    sub: 'Cochez les distorsions de communication que vous observez lors des désaccords :',
    items: [
      '<strong>Réécriture de l’histoire :</strong> Votre partenaire nie des faits ou paroles dont vous vous souvenez clairement (« Je n’ai jamais dit ça »).',
      '<strong>Critique du ton plutôt que du fond :</strong> Au lieu d’aborder son comportement blessant, il fait de votre réaction le « vrai problème ».',
      '<strong>Étiquette « trop sensible » :</strong> Votre douleur légitime est balayée comme « dramatique », « paranoïaque » ou « sans humour ».',
      '<strong>Répétition mentale épuisante :</strong> Vous cherchez vos mots pendant des heures pour éviter que votre demande ne soit retournée contre vous.'
    ],
    scoreUnit: 'sur 4 signaux de gaslighting relationnel actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour distinguer un malentendu d’une manipulation.',
      'Faible risque de distorsion (1/4). Incompréhension ponctuelle sans déni systématique.',
      'Déflection défensive modérée (2/4). Le renvoi de faute bloque le dialogue.',
      'Gaslighting relationnel élevé (3/4). L’invalidation répétée fragilise votre confiance.',
      'Cycle sévère de gaslighting (4/4). Passez le Test d’Attachement et créez vos scripts de protection.'
    ],
    primaryBtn: 'Analyser votre Couple avec le Test d’Attachement &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts de Limites &rarr;'
  },
  ja: {
    badge: '30秒 恋愛・パートナーシップのガスライティング診断',
    heading: 'ただの「すれ違い」？それとも記憶を書き換える「ガスライティング」？',
    sub: '話し合いや喧嘩のときに繰り返される会話の歪みサインをチェックしてください：',
    items: [
      '<strong>過去の事実の全面否定：</strong> はっきり覚えている発言や出来事を「そんなこと言ってない、君の妄想だ」と真っ向から否定される。',
      '<strong>内容ではなく「言い方」へのすり替え：</strong> 傷ついた原因ではなく、伝えたときのあなたの声色や態度の方を「問題だ」と責められる。',
      '<strong>「被害妄想・神経質」のレッテル貼り：</strong> 正当な悲しみを伝えても「気にしすぎ」「冗談も通じないのか」と性格の問題にされる。',
      '<strong>伝える前の過剰な脳内リハーサル：</strong> 揚げ足を取られないよう、簡単なお願いでさえ何時間も言い方をシミュレーションして疲弊する。'
    ],
    scoreUnit: '/ 4 個の関係性ガスライティング信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、単なる記憶違いとガスライティングを見分けましょう。',
      '歪みリスクは低め（1/4）。意図的な操作ではなく一時的なコミュニケーション不足です。',
      '中程度の責任転嫁（2/4）。論点のすり替えが健全な話し合いを妨げています。',
      '高い関係性ガスライティング（3/4）。繰り返される感情の否定があなたの自己信頼を削っています。',
      '深刻なガスライティング支配ループ（4/4）。今すぐ愛着スタイル診断で関係パターンを把握し、自分を守る境界線スクリプトを作成しましょう。'
    ],
    primaryBtn: '無料の愛着スタイル＆関係ダイナミクス診断へ &rarr;',
    subBtn: 'すり替えを防ぐ「境界線スクリプト作成ツール」を開く &rarr;'
  },
  zh: {
    badge: '30秒 亲密关系煤气灯操控（Gaslighting）筛查',
    heading: '这只是普通的沟通误会，还是亲密关系中的“煤气灯操控”？',
    sub: '勾选在争执或沟通过程中反复出现的事实扭曲信号：',
    items: [
      '<strong>篡改与否认既定事实：</strong> 对方斩钉截铁地否认你清楚记得的话或事（“我根本没说过，是你自己脑补的”）。',
      '<strong>抓着语气不放而逃避问题本身：</strong> 不去解决伤害你的行为本身，反而把你的情绪反应或语气说成是“真正的问题”。',
      '<strong>贴上“太敏感/开不起玩笑”标签：</strong> 你合理的委屈被贬低为“太玻璃心、疑神疑鬼、太作或开不起玩笑”。',
      '<strong>开口前精疲力竭的打草稿：</strong> 为了防止话被曲解或倒打一耙，连提一个很小的诉求都要在脑子里排练几十遍。'
    ],
    scoreUnit: '/ 4 个亲密关系煤气灯信号已激活',
    verdicts: [
      '勾选上方信号，区分正常的记忆偏差与系统性的煤气灯操控。',
      '低扭曲风险（1/4）。属于偶发的沟通误会，而非系统性否定现实。',
      '中度防御性甩锅（2/4）。转移焦点正在阻碍健康的冲突解决。',
      '高度关系煤气灯操控（3/4）。持续的情感否定正在侵蚀你的安全感与判断力。',
      '重度煤气灯控制循环（4/4）。请立即通过依恋测试测绘关系动力，并生成反操控边界话术保护自己。'
    ],
    primaryBtn: '通过免费依恋类型测试拆解亲密关系动力 &rarr;',
    subBtn: '打开反煤气灯边界与拒绝话术生成器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE GASLIGHTING NO RELACIONAMENTO EM 30 SEGUNDOS',
    heading: 'É um mal-entendido normal ou Gaslighting no relacionamento?',
    sub: 'Marque os padrões de distorção que você nota durante desacordos:',
    items: [
      '<strong>Reescrita da história:</strong> Seu parceiro nega coisas que você lembra claramente ("Eu nunca disse isso, você está inventando").',
      '<strong>Ataque ao tom em vez do fato:</strong> Em vez de falar sobre a atitude que magoou você, transforma sua reação no "verdadeiro problema".',
      '<strong>Rótulos de "sensível ou louco":</strong> Sua dor válida é descartada como "drama", "insegurança" ou "não saber levar na brincadeira".',
      '<strong>Ensaio exaustivo antes de falar:</strong> Você passa horas ensaiando como falar algo simples para que não seja distorcido contra você.'
    ],
    scoreUnit: 'de 4 sinais de gaslighting no relacionamento ativos',
    verdicts: [
      'Marque os itens acima para diferenciar falhas de comunicação de gaslighting.',
      'Baixo risco de distorção (1/4). Desencontros pontuais sem manipulação sistemática.',
      'Desvio defensivo moderado (2/4). A transferência de culpa impede a resolução justa.',
      'Alto gaslighting relacional (3/4). A invalidação constante está corroendo sua autoconfiança.',
      'Ciclo severo de gaslighting (4/4). Mapeie seu Estilo de Apego agora e gere roteiros firmes de limites.'
    ],
    primaryBtn: 'Mapear sua Relação com o Teste de Estilo de Apego &rarr;',
    subBtn: 'Abrir Gerador de Scripts de Limites contra Gaslighting &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ГАЗЛАЙТИНГ В ОТНОШЕНИЯХ',
    heading: 'Это обычное недопонимание или газлайтинг в паре?',
    sub: 'Отметьте приемы искажения реальности, возникающие во время споров:',
    items: [
      '<strong>Переписывание прошлого:</strong> Партнер уверенно отрицает слова или поступки, которые вы точно помните («Я такого не говорил, тебе показалось»).',
      '<strong>Претензии к тону вместо сути:</strong> Вместо обсуждения обидного поступка виноватой объявляется ваша реакция или тон голоса.',
      '<strong>Ярлыки «неадекватности»:</strong> Ваша боль обесценивается фразами «ты накручиваешь», «у тебя нет чувства юмора» или «ты истеришь».',
      '<strong>Долгая репетиция перед разговором:</strong> Вы часами подбираете слова перед простой просьбой, чтобы их не перевернули против вас.'
    ],
    scoreUnit: 'из 4 признаков газлайтинга в паре активны',
    verdicts: [
      'Отметьте пункты выше, чтобы отличить недопонимание от манипуляции реальностью.',
      'Низкий риск искажения (1/4). Обычные трудности перевода без систематического давления.',
      'Умеренное перекладывание вины (2/4). Защитные манипуляции мешают честному диалогу.',
      'Высокий уровень газлайтинга (3/4). Постоянное обесценивание разрушает вашу опору на себя.',
      'Тяжелый цикл газлайтинга (4/4). Пройдите тест на тип привязанности и создайте твердые фразы защиты границ.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности в паре &rarr;',
    subBtn: 'Открыть конструктор фраз для защиты личных границ &rarr;'
  },
  id: {
    badge: 'SKRINING GASLIGHTING DALAM HUBUNGAN 30 DETIK',
    heading: 'Salah Paham Biasa atau Gaslighting dalam Hubungan?',
    sub: 'Centang pola distorsi percakapan yang muncul saat terjadi ketidaksepakatan:',
    items: [
      '<strong>Menulis Ulang Kejadian:</strong> Pasangan menyangkal hal yang jelas Anda ingat ("Aku tidak pernah bilang begitu, kamu mengarang").',
      '<strong>Menyerang Nada Bicara, Bukan Isi:</strong> Alih-alih membahas perilakunya yang menyakitkan, ia menyalahkan reaksi Anda sebagai "masalah utama".',
      '<strong>Label "Baper" atau "Drama":</strong> Rasa sakit Anda dianggap "lebay", "tidak bisa bercanda", atau "terlalu curiga".',
      '<strong>Latihan Bicara Berjam-jam:</strong> Anda harus menyusun kata berjam-jam sebelum menyampaikan hal kecil agar tidak diputarbalikkan.'
    ],
    scoreUnit: 'dari 4 sinyal gaslighting hubungan aktif',
    verdicts: [
      'Centang item di atas untuk membedakan salah paham biasa dari gaslighting.',
      'Risiko Distorsi Rendah (1/4). Miskomunikasi sesekali tanpa manipulasi sistematis.',
      'Pengalihan Defensif Sedang (2/4). Lempar kesalahan menghambat penyelesaian masalah.',
      'Gaslighting Hubungan Tinggi (3/4). Pengabaian perasaan secara berulang mengikis rasa percaya diri Anda.',
      'Siklus Gaslighting Berat (4/4). Petakan Gaya Kelekatan Anda sekarang dan siapkan skrip batasan tegas.'
    ],
    primaryBtn: 'Petakan Dinamika Hubungan dengan Tes Gaya Kelekatan &rarr;',
    subBtn: 'Buka Pembuat Skrip Batasan Anti-Gaslighting &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İLİŞKİDE GASLIGHTING TARAMASI',
    heading: 'Normal Bir Yanlış Anlaşılma mı Yoksa İlişkide Gaslighting mi?',
    sub: 'Anlaşmazlıklar sırasında fark ettiğiniz iletişim çarpıtma kalıplarını işaretleyin:',
    items: [
      '<strong>Geçmişi Yeniden Yazma:</strong> Partneriniz net hatırladığınız sözleri veya olayları kesin bir dille inkar ediyor ("Böyle bir şey demedim, uyduruyorsun").',
      '<strong>İçerik Yerine Ses Tonunu Suçlama:</strong> Kırıcı davranışını konuşmak yerine sizin tepkinizi veya tonunuzu "asıl sorun" ilan ediyor.',
      '<strong>"Çok Alıngansın" Etiketleri:</strong> Haklı kırgınlığınız "delilik", "güvensizlik", "dram" veya "şaka kaldıramama" olarak küçümseniyor.',
      '<strong>Konuşma Öncesi Saatlerce Prova:</strong> Sözleriniz çarpıtılmasın diye en basit konuyu bile nasıl söyleyeceğinizi saatlerce prova ediyorsunuz.'
    ],
    scoreUnit: '/ 4 ilişkisel gaslighting sinyali aktif',
    verdicts: [
      'Dürüst iletişim kazalarını ilişkisel gaslighting’den ayırmak için yukarıdakileri işaretleyin.',
      'Düşük Çarpıtma Riski (1/4). Sistematik gerçeklik inkarı olmadan dönemsel iletişim kopukluğu.',
      'Orta Düzey Savunmacı Saptırma (2/4). Suç aktarımı sağlıklı çatışma çözümünü engelliyor.',
      'Yüksek İlişkisel Gaslighting (3/4). Sürekli geçersiz kılınma duygusal güvenliğinizi aşındırıyor.',
      'Şiddetli Gaslighting Döngüsü (4/4). Şimdi Bağlanma Stili Testini çözün ve koruyucu sınır cümlelerinizi hazırlayın.'
    ],
    primaryBtn: 'Bağlanma Stili Testiyle İlişki Dinamiğinizi Haritalayın &rarr;',
    subBtn: 'Gaslighting Karşıtı Sınır Metin Oluşturucuyu Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड रिलेशनशिप गैसलाइटिंग (Gaslighting) स्क्रीनर',
    heading: 'क्या यह सामान्य गलतफहमी है—या रिश्ते में गैसलाइटिंग?',
    sub: 'बहस या मतभेद के दौरान बातचीत में दिखने वाले इन संकेतों को चुनें:',
    items: [
      '<strong>पुरानी बातों को सीधे नकारना:</strong> जो बात या घटना आपको साफ याद है, पार्टनर उसे पूरी तरह नकार देता है ("मैंने ऐसा कभी नहीं कहा, तुम कल्पना कर रहे हो")।',
      '<strong>मुद्दे के बजाय आपके लहजे को दोष देना:</strong> अपनी गलती पर बात करने के बजाय आपकी प्रतिक्रिया या बोलने के तरीके को ही "असली समस्या" बना देना।',
      '<strong>"तुम बहुत ओवर-सेंसिटिव हो" का टैग:</strong> आपकी सही तकलीफ को "ड्रामा", "शक" या "मज़ाक न समझ पाना" कहकर खारिज कर देना।',
      '<strong>बात करने से पहले घंटों रिहर्सल:</strong> आपकी बात को तोड़-मरोड़ कर आपके ही खिलाफ न मोड़ दिया जाए, इसलिए छोटी बात कहने से पहले भी घंटों शब्द सोचना।'
    ],
    scoreUnit: '/ 4 रिलेशनशिप गैसलाइटिंग संकेत सक्रिय',
    verdicts: [
      'सामान्य गलतफहमी और गैसलाइटिंग में अंतर करने के लिए ऊपर चुनें।',
      'कम जोखिम (1/4)। बिना किसी जानबूझकर किए गए हेरफेर के सामान्य संवाद की कमी।',
      'मध्यम दोषारोपण (2/4)। जिम्मेदारी से बचना स्वस्थ बातचीत को रोक रहा है।',
      'उच्च रिलेशनशिप गैसलाइटिंग (3/4)। बार-बार भावनाओं को नकारना आपके आत्मविश्वास को कम कर रहा है।',
      'गंभीर गैसलाइटिंग चक्र (4/4)। अभी अटैचमेंट स्टाइल टेस्ट लें और अपनी सुरक्षा के लिए बाउंड्री स्क्रिप्ट तैयार करें।'
    ],
    primaryBtn: 'अटैचमेंट स्टाइल टेस्ट से अपने रिश्ते के पैटर्न जानें &rarr;',
    subBtn: 'एंटी-गैसलाइटिंग बाउंड्री स्क्रिप्ट टूल खोलें &rarr;'
  }
};

const RELATIONSHIP_RED_FLAGS_LOCALES = {
  en: {
    badge: '30-SECOND RELATIONSHIP RED FLAG BLIND-SPOT SCREENER',
    heading: 'Are You Ignoring Early Relationship Red Flags?',
    sub: 'Check the relational warning signs your attachment system might be rationalizing:',
    items: [
      '<strong>Words vs. Consistency Gap:</strong> Grand promises and intense chemistry are paired with canceled plans, vague excuses, or vanishing acts.',
      '<strong>Boundary Testing as "Passion":</strong> When you ask for space or a slower pace, they guilt-trip, sulk, or push past your limit in the name of romance.',
      '<strong>All Exes Were "Crazy":</strong> They take zero accountability for past relationship endings and paint every former partner or colleague as a villain.',
      '<strong>Selective Empathy &amp; Public Charm:</strong> They are charming and generous in public, yet dismissive, cold, or critical behind closed doors.'
    ],
    scoreUnit: 'of 4 relationship red flag signals active',
    verdicts: [
      'Check the items above to evaluate whether chemistry is masking critical relationship red flags.',
      'Clear Green-Flag Baseline (1/4). Words and actions align with mutual respect for boundaries.',
      'Yellow-to-Red Flag Caution (2/4). Inconsistency or boundary pressure deserves slow observation.',
      'High Red-Flag Exposure (3/4). Your attachment system may be mistaking unpredictability for chemistry.',
      'Critical Red-Flag Cluster (4/4). Do not ignore your nervous system—map your Attachment Blind Spots and prepare firm boundary scripts now.'
    ],
    primaryBtn: 'Discover Your Relationship Blind Spots with the Attachment Test &rarr;',
    subBtn: 'Build Firm Dating &amp; Relationship Boundary Scripts &rarr;'
  },
  ko: {
    badge: '30초 연애 레드플래그(Red Flag) 사각지대 판별기',
    heading: '설렘 때문에 위험한 관계 신호(Red Flag)를 합리화하고 있나요?',
    sub: '내 애착 시스템이 사랑이라고 착각하기 쉬운 4가지 위험 신호를 체크해보세요:',
    items: [
      '<strong>화려한 말과 일관성 없는 행동의 괴리:</strong> 달콤한 약속과 강한 끌림 뒤에는 잦은 연락 두절, 애매한 핑계, 약속 취소가 반복됩니다.',
      '<strong>애정으로 포장된 경계 침범:</strong> 천천히 알아가자거나 혼자만의 시간을 요청하면 서운해하며 죄책감을 주거나 내 선을 넘습니다.',
      '<strong>"전 연인들이 다 이상했다"는 무책임:</strong> 과거 관계의 실패에서 본인의 책임은 전혀 인정하지 않고 이전 상대들을 모두 악마화합니다.',
      '<strong>밖에서의 매력과 둘만 있을 때의 냉담함:</strong> 남들 앞에서는 완벽하고 친절하지만, 단둘이 있을 때는 내 감정을 무시하거나 차갑게 평가합니다.'
    ],
    scoreUnit: '개 연애 레드플래그 위험 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 강한 끌림이 위험한 관계 패턴을 가리고 있지 않은지 확인해보세요.',
      '건강한 그린플래그 기반(1/4). 말과 행동이 일치하며 서로의 경계를 존중하고 있습니다.',
      '옐로-레드플래그 주의 단계(2/4). 일관성 부족이나 경계 압박이 관찰되므로 속도를 늦추고 지켜봐야 합니다.',
      '높은 레드플래그 노출(3/4). 애착 시스템이 불안정한 롤러코스터 긴장감을 설렘으로 착각하고 있을 수 있습니다.',
      '위험한 핵심 레드플래그 경보(4/4). 직관을 무시하지 마세요. 지금 내 애착 사각지대를 진단하고 단호한 경계 대본을 준비하세요.'
    ],
    primaryBtn: '무료 애착 유형 및 연애 사각지대 정밀 테스트 &rarr;',
    subBtn: '선을 넘는 상대에게 쓰는 경계·거절 대본 빌더 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN BEZIEHUNGS-RED-FLAG-CHECK',
    heading: 'Übersehen Sie frühe Warnsignale (Red Flags) durch Verliebtheit?',
    sub: 'Wählen Sie die Warnzeichen aus, die Ihr Bindungssystem möglicherweise schönredet:',
    items: [
      '<strong>Kluft zwischen Worten &amp; Taten:</strong> Große Versprechen paaren sich mit unzuverlässigem Verhalten, Ausreden oder Funkstille.',
      '<strong>Grenzüberschreitung als „Leidenschaft“:</strong> Wenn Sie um Raum oder langsameres Tempo bitten, reagiert der andere mit Vorwürfen oder Druck.',
      '<strong>„Alle Ex-Partner waren verrückt“:</strong> Null Eigenverantwortung für frühere Trennungen; schuld sind immer nur die anderen.',
      '<strong>Charme außen, Kälte innen:</strong> Vor anderen charmant und großzügig, unter vier Augen jedoch abwertend oder kühl.'
    ],
    scoreUnit: 'von 4 Red-Flag-Warnsignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um blinde Flecken in Ihrer Partnerwahl zu prüfen.',
      'Grüner Bereich (1/4). Worte und Verhalten stimmen respektvoll überein.',
      'Gelb-Rote Warnstufe (2/4). Unbeständigkeit oder Grenzdruck erfordern Achtsamkeit.',
      'Hohe Red-Flag-Dichte (3/4). Ihr Bindungssystem verwechselt womöglich Unsicherheit mit Chemie.',
      'Akutes Red-Flag-Muster (4/4). Prüfen Sie jetzt Ihre Bindungs-Blinden-Flecken und erstellen Sie klare Grenz-Skripte.'
    ],
    primaryBtn: 'Blinde Flecken mit dem Bindungsstil-Test aufdecken &rarr;',
    subBtn: 'Interaktiven Grenz- &amp; Nein-Skript-Builder öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE BANDERAS ROJAS (RED FLAGS) EN 30 SEGUNDOS',
    heading: '¿Estás pasando por alto banderas rojas por la química inicial?',
    sub: 'Marca las señales de alerta que tu sistema de apego podría estar justificando:',
    items: [
      '<strong>Brecha entre palabras y hechos:</strong> Grandes promesas e intensidad combinadas con planes cancelados, excusas o desapariciones.',
      '<strong>Invasión de límites disfrazada de «pasión»:</strong> Si pides espacio o ir más despacio, responde con culpa, enfado o presión.',
      '<strong>«Todas mis exparejas estaban locas»:</strong> Cero autocrítica sobre su pasado; siempre culpa al 100 % a los demás.',
      '<strong>Encanto público, frialdad privada:</strong> Es encantador frente a otros, pero frío, crítico o invalidante en privado.'
    ],
    scoreUnit: 'de 4 señales de bandera roja activas',
    verdicts: [
      'Marca los puntos arriba para ver si la intensidad está ocultando banderas rojas.',
      'Base saludable (1/4). Coherencia entre palabras, hechos y respeto a tus límites.',
      'Alerta amarilla-roja (2/4). La inconsistencia o presión requiere bajar el ritmo.',
      'Alta exposición a banderas rojas (3/4). Tu apego puede estar confundiendo ansiedad con química.',
      'Conjunto crítico de banderas rojas (4/4). Descubre tus puntos ciegos con el Test de Apego y crea guiones de límites.'
    ],
    primaryBtn: 'Descubrir Puntos Ciegos con el Test de Estilo de Apego &rarr;',
    subBtn: 'Crear Guiones Firmes de Límites en Pareja &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE RED FLAGS AMOUREUX EN 30 SECONDES',
    heading: 'Ignorez-vous des signaux d’alarme (Red Flags) au nom de la passion ?',
    sub: 'Cochez les signaux que votre système d’attachement tente peut-être de minimiser :',
    items: [
      '<strong>Écart entre paroles et actes :</strong> De belles promesses suivies d’annulations, de flou ou de silences soudains.',
      '<strong>Pression sur vos limites :</strong> Lorsque vous demandez du temps ou de l’espace, l’autre culpabilise ou insiste au nom de l’amour.',
      '<strong>« Tous mes ex étaient fous » :</strong> Aucune remise en question sur ses échecs passés, la faute incombe toujours aux autres.',
      '<strong>Charme en public, froideur en privé :</strong> Adorable devant témoins, mais distant, critique ou dédaigneux en tête-à-tête.'
    ],
    scoreUnit: 'sur 4 signaux Red Flags actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour repérer d’éventuels angles morts amoureux.',
      'Base saine (1/4). Cohérence entre les paroles, les actes et le respect mutuel.',
      'Vigilance orange-rouge (2/4). L’incohérence ou la pression mérite de ralentir.',
      'Forte exposition aux Red Flags (3/4). Votre attachement confond peut-être montagnes russes et alchimie.',
      'Alerte Red Flags critique (4/4). Identifiez vos angles morts avec le Test d’Attachement et préparez vos limites.'
    ],
    primaryBtn: 'Révéler vos Angles Morts avec le Test d’Attachement &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts de Limites &rarr;'
  },
  ja: {
    badge: '30秒 恋愛レッドフラッグ（危険サイン）死角チェック',
    heading: '「好き」という気持ちで、危険なレッドフラッグを見逃していませんか？',
    sub: '愛着システムが「情熱」と勘違いしやすい4つの警戒サインをチェックしてください：',
    items: [
      '<strong>言葉と行動の不一致：</strong> 甘い言葉や強いアプローチの裏で、ドタキャン・曖昧な言い訳・急な音信不通が繰り返される。',
      '<strong>「愛情」を理由にした境界線の侵害：</strong> 自分のペースや一人時間を求めると、不機嫌になったり罪悪感を植え付けたりして踏み込んでくる。',
      '<strong>「元恋人はみんなおかしかった」と語る：</strong> 過去の破局について自分の非を一切認めず、歴代の相手ばかりを悪者にする。',
      '<strong>外面の良さと二人きりの時の冷たさ：</strong> 周囲の前では魅力的で優しいのに、二人きりになると冷淡・批判的になる。'
    ],
    scoreUnit: '/ 4 個の恋愛レッドフラッグ信号がアクティブ',
    verdicts: [
      '上の項目をチェックして、恋愛のドキドキが危険サインを隠していないか確認しましょう。',
      '健全なグリーンフラッグ圏内（1/4）。言葉と行動が一致し、お互いの境界線が守られています。',
      'イエロー〜レッドフラッグ注意報（2/4）。言動の不一致や境界線への圧力が見られます。少しペースを落として観察しましょう。',
      '高いレッドフラッグ露出（3/4）。愛着システムが「不安なジェットコースター」を「運命のときめき」と錯覚している可能性があります。',
      '重大なレッドフラッグ警報（4/4）。直感を無視しないでください。今すぐ愛着スタイル診断で恋愛の死角を知り、境界線スクリプトを用意しましょう。'
    ],
    primaryBtn: '無料の愛着スタイル＆恋愛の死角診断へ &rarr;',
    subBtn: '踏み込ませない「境界線・お断りスクリプト作成ツール」 &rarr;'
  },
  zh: {
    badge: '30秒 恋爱红旗（Red Flags）盲区筛查',
    heading: '你是否因为“上头与心动”，正在合理化危险的恋爱红旗信号？',
    sub: '勾选那些容易被你的依恋系统误当成“深情或化学反应”的危险预警：',
    items: [
      '<strong>甜言蜜语与实际行动严重割裂：</strong> 一边是山盟海誓和强烈推拉，一边却是频繁放鸽子、敷衍借口或突然冷淡失联。',
      '<strong>打着“太爱你”旗号越界：</strong> 当你要求慢一点或需要个人空间时，对方用冷脸、卖惨或道德绑架逼你退让。',
      '<strong>“我的前任全都是疯子”：</strong> 对过去感情的失败毫无自省，把所有前任或前同事都描述成彻头彻尾的恶人。',
      '<strong>人前魅力四射，人后冷漠挑剔：</strong> 在外人面前体贴大方，关起门独处时却对你冷淡、敷衍或百般挑剔。'
    ],
    scoreUnit: '/ 4 个恋爱红旗预警信号已激活',
    verdicts: [
      '勾选上方信号，测试你是否正因多巴胺上头而忽视关键关系红旗。',
      '健康的绿旗基准（1/4）。言行一致，彼此尊重个人边界。',
      '黄旗至红旗预警（2/4）。言行不一或边界施压已出现，建议放慢节奏观察。',
      '高度红旗暴露（3/4）。你的依恋系统可能正把“忽冷忽热的焦虑”误当成“心动”。',
      '高危红旗密集警报（4/4）。别忽视身体的警报，请立即测绘你的依恋盲区并准备坚定的边界话术。'
    ],
    primaryBtn: '通过免费依恋类型测试揭开你的恋爱盲区 &rarr;',
    subBtn: '打开恋爱边界与温和拒绝话术生成器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE RED FLAGS NO RELACIONAMENTO EM 30 SEGUNDOS',
    heading: 'Você está ignorando Red Flags por causa da química inicial?',
    sub: 'Marque os sinais de alerta que seu sistema de apego pode estar racionalizando:',
    items: [
      '<strong>Abismo entre palavras e atitudes:</strong> Grandes promessas combinadas com sumiços, desculpas vagas ou planos cancelados.',
      '<strong>Invasão de limites como "paixão":</strong> Quando você pede espaço ou calma, a pessoa faz chantagem emocional ou força a barra.',
      '<strong>"Todos os meus ex eram loucos":</strong> Zero responsabilidade pelo passado; a culpa é sempre 100% dos outros.',
      '<strong>Charme em público, frieza no privado:</strong> Encantador na frente dos outros, mas frio, crítico ou indiferente a sós.'
    ],
    scoreUnit: 'de 4 sinais de Red Flag ativos',
    verdicts: [
      'Marque os itens acima para ver se a paixão está mascarando sinais de alerta.',
      'Base saudável (1/4). Palavras e ações caminham juntas com respeito.',
      'Alerta amarelo-vermelho (2/4). Inconsistência ou pressão nos limites pedem cautela.',
      'Alta exposição a Red Flags (3/4). Seu apego pode estar confundindo instabilidade com química.',
      'Alerta crítico de Red Flags (4/4). Descubra seus pontos cegos no Teste de Apego e prepare roteiros de limites.'
    ],
    primaryBtn: 'Descobrir Pontos Ciegos com o Teste de Estilo de Apego &rarr;',
    subBtn: 'Abrir Gerador de Scripts de Limites e Proteção &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА «КРАСНЫЕ ФЛАГИ» В ОТНОШЕНИЯХ',
    heading: 'Вы оправдываете опасные «красные флаги» из-за сильного притяжения?',
    sub: 'Отметьте тревожные звоночки, которые ваша система привязанности может принимать за страсть:',
    items: [
      '<strong>Разрыв между словами и делами:</strong> Красивые обещания сочетаются с отменой встреч, отговорками или внезапными исчезновениями.',
      '<strong>Давление на границы под видом «любви»:</strong> Просьба не торопить события или дать личное время вызывает обиды и манипуляции.',
      '<strong>«Все бывшие были ненормальными»:</strong> Полное отсутствие ответственности за прошлый опыт; виноваты всегда только другие.',
      '<strong>Обаяние на людях и холод наедине:</strong> На публике человек идеален, но за закрытой дверью становится холодным и критичным.'
    ],
    scoreUnit: 'из 4 сигналов «красных флагов» активны',
    verdicts: [
      'Отметьте пункты выше, чтобы проверить, не закрывает ли влюбленность глаза на факты.',
      'Здоровая база (1/4). Слова совпадают с поступками при уважении к границам.',
      'Желто-красный сигнал (2/4). Непоследовательность или давление требуют сбавить темп.',
      'Высокий риск «красных флагов» (3/4). Ваша система привязанности может путать тревожные качели со страстью.',
      'Критический набор «красных флагов» (4/4). Проверьте слепые зоны в тесте на тип привязанности и создайте фразы защиты границ.'
    ],
    primaryBtn: 'Узнать свои слепые зоны в тесте на тип привязанности &rarr;',
    subBtn: 'Открыть конструктор фраз для защиты личных границ &rarr;'
  },
  id: {
    badge: 'SKRINING RED FLAG HUBUNGAN 30 DETIK',
    heading: 'Apakah Anda Mengabaikan Red Flag Karena Terbuai Chemistry?',
    sub: 'Centang tanda bahaya hubungan yang mungkin sedang dirasionalisasi oleh sistem kelekatan Anda:',
    items: [
      '<strong>Jarak Antara Janji &amp; Bukti:</strong> Janji manis dan obrolan intens dibarengi batal janji, alasan kabur, atau menghilang tiba-tiba.',
      '<strong>Melanggar Batas Atas Nama "Sayang":</strong> Saat Anda meminta ruang atau tempo lebih pelan, ia merajuk atau memaksa.',
      '<strong>"Semua Mantanku Gila":</strong> Nol tanggung jawab atas kegagalan masa lalu; selalu menyalahkan mantan sepenuhnya.',
      '<strong>Manis di Depan Umum, Dingin Saat Berdua:</strong> Terlihat ramah di depan orang lain, namun dingin atau meremehkan saat berdua.'
    ],
    scoreUnit: 'dari 4 sinyal red flag hubungan aktif',
    verdicts: [
      'Centang item di atas untuk melihat apakah chemistry menutupi red flag penting.',
      'Dasar Green-Flag Sehat (1/4). Kata dan tindakan selaras dengan respek batasan.',
      'Waspada Kuning-Merah (2/4). Ketidakkonsistenan atau tekanan batasan perlu diamati perlahan.',
      'Paparan Red-Flag Tinggi (3/4). Sistem kelekatan Anda mungkin mengira ketidakpastian sebagai cinta.',
      'Kluster Red-Flag Kritis (4/4). Cek titik buta kelekatan Anda sekarang dan siapkan skrip batasan tegas.'
    ],
    primaryBtn: 'Temukan Titik Buta Anda di Tes Gaya Kelekatan &rarr;',
    subBtn: 'Buka Pembuat Skrip Batasan &amp; Menolak dengan Tegas &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İLİŞKİ KIRMIZI BAYRAK (RED FLAG) TARAMASI',
    heading: 'İlk Heyecan Yüzünden Tehlikeli Kırmızı Bayrakları Görmezden mi Geliyorsunuz?',
    sub: 'Bağlanma sisteminizin "tutku" sanarak mantığa bürüdüğü uyarı sinyallerini işaretleyin:',
    items: [
      '<strong>Sözler ve Davranışlar Arası Uçurum:</strong> Büyük vaatler ve yoğun çekim; iptal edilen planlar, bahaneler veya ani kayboluşlarla birlikte yürüyor.',
      '<strong>"Aşk" Adına Sınır İhlali:</strong> Biraz alan veya daha yavaş bir tempo istediğinizde suçluluk yaratıyor ya da sınırınızı zorluyor.',
      '<strong>"Tüm Eski Partnerlerim Deliydi":</strong> Geçmiş ilişkilerinde sıfır sorumluluk alıyor; tüm eski partnerlerini kötü ilan ediyor.',
      '<strong>Dışarıda Büyüleyici, Baş Başa Soğuk:</strong> Başkalarının yanında çok nazik ve ilgiliyken baş başa kaldığınızda soğuk ve eleştirel.'
    ],
    scoreUnit: '/ 4 kırmızı bayrak sinyali aktif',
    verdicts: [
      'Yoğun çekimin kritik kırmızı bayrakları gizleyip gizlemediğini görmek için işaretleyin.',
      'Sağlıklı Yeşil Bayrak Dengesi (1/4). Sözler ve eylemler sınırlarınıza saygıyla örtüşüyor.',
      'Sarı-Kırmızı Uyarı (2/4). Tutarsızlık veya sınır baskısı tempoyu düşürüp gözlem yapmayı gerektiriyor.',
      'Yüksek Kırmızı Bayrak Riski (3/4). Bağlanma sisteminiz belirsizlik kaygısını "kimya" sanıyor olabilir.',
      'Kritik Kırmızı Bayrak Kümesi (4/4). Şimdi Bağlanma Stili Testiyle kör noktalarınızı görün ve net sınır metinlerinizi hazırlayın.'
    ],
    primaryBtn: 'Bağlanma Stili Testiyle İlişki Kör Noktalarınızı Keşfedin &rarr;',
    subBtn: 'Sınır Koyma ve Koruma Metin Oluşturucuyu Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड रिलेशनशिप रेड फ्लैग (Red Flag) स्क्रीनर',
    heading: 'क्या आप शुरुआती आकर्षण में रिश्ते के खतरे के संकेतों (Red Flags) को नज़रअंदाज़ कर रहे हैं?',
    sub: 'उन चेतावनी संकेतों को चुनें जिन्हें आपका मन "प्यार" समझकर अनदेखा कर सकता है:',
    items: [
      '<strong>बातों और व्यवहार में बड़ा अंतर:</strong> बड़े-बड़े वादे करना, लेकिन बार-बार प्लान कैंसिल करना, बहाने बनाना या अचानक गायब हो जाना।',
      '<strong>"प्यार" के नाम पर आपकी सीमाओं को लांघना:</strong> जब आप थोड़ा स्पेस या समय मांगते हैं, तो नाराज़ होना या अपराधबोध दिलाना।',
      '<strong>"मेरे सारे एक्स (Ex) गलत थे":</strong> पिछले रिश्तों के टूटने में अपनी कोई भी गलती न मानना और हमेशा दूसरों को ही दोषी ठहराना।',
      '<strong>सबके सामने आकर्षक, अकेले में ठंडा व्यवहार:</strong> बाहर लोगों के सामने बहुत अच्छा दिखना, लेकिन अकेले में आपकी भावनाओं की अनदेखी करना।'
    ],
    scoreUnit: '/ 4 रिलेशनशिप रेड फ्लैग संकेत सक्रिय',
    verdicts: [
      'यह जांचने के लिए ऊपर चुनें कि कहीं आकर्षण महत्वपूर्ण रेड फ्लैग्स को छुपा तो नहीं रहा।',
      'स्वस्थ ग्रीन-फ्लैग आधार (1/4)। बातों और व्यवहार में समानता और सम्मान है।',
      'सावधानी आवश्यक (2/4)। व्यवहार में अस्थिरता या सीमाओं पर दबाव दिख रहा है।',
      'उच्च रेड-फ्लैग जोखिम (3/4)। आपका अटैचमेंट सिस्टम अनिश्चितता की घबराहट को आकर्षण समझ सकता है।',
      'गंभीर रेड-फ्लैग चेतावनी (4/4)। अभी अटैचमेंट स्टाइल टेस्ट से अपने ब्लाइंड स्पॉट्स जानें और बाउंड्री स्क्रिप्ट तैयार करें।'
    ],
    primaryBtn: 'अटैचमेंट स्टाइल टेस्ट से अपने रिलेशनशिप पैटर्न जानें &rarr;',
    subBtn: 'मजबूत बाउंड्री और सुरक्षा स्क्रिप्ट टूल खोलें &rarr;'
  }
};

const WARNING_SIGNS_RED_FLAG_LOCALES = {
  en: {
    badge: '30-SECOND DATING WARNING SIGNS & BOUNDARY SCREENER',
    heading: 'How Safe Is Your Nervous System in This Relationship?',
    sub: 'Check the early warning signs that predict long-term relational burnout:',
    items: [
      '<strong>Future Faking &amp; Breadcrumbing:</strong> They talk about trips and long-term plans early on, yet give only minimal effort in daily follow-through.',
      '<strong>Defensive Conflict Escalation:</strong> Bringing up a minor boundary results in silent treatment, sarcasm, or threats to end the relationship.',
      '<strong>Emotional Scorekeeping:</strong> Kindness always comes with strings attached, and past favors or mistakes are brought up as ammunition during arguments.',
      '<strong>Shrinkage of Your Authentic Voice:</strong> You censor your opinions, accomplishments, or needs to keep them comfortable.'
    ],
    scoreUnit: 'of 4 relational warning sign signals active',
    verdicts: [
      'Check the items above to test whether this dynamic supports long-term emotional safety.',
      'High Relational Safety (1/4). Mutual accountability and consistent follow-through are present.',
      'Early Boundary Friction (2/4). Pay close attention to how they respond when you say "no."',
      'High Warning-Sign Density (3/4). Breadcrumbing or defensive escalation is taxing your attachment security.',
      'Severe Relational Warning Cluster (4/4). Protect your peace—map your Attachment Style and generate clear boundary scripts now.'
    ],
    primaryBtn: 'Take the Free Attachment Style &amp; Relationship Audit &rarr;',
    subBtn: 'Generate Clear Boundary &amp; Refusal Scripts Now &rarr;'
  },
  ko: {
    badge: '30초 연애 경고 신호(Warning Signs) 및 경계 침식 판별기',
    heading: '이 관계에서 내 마음과 신경계는 정말 안전한가요?',
    sub: '장기적인 관계 소진을 예고하는 초기 경고 신호 4가지를 체크해보세요:',
    items: [
      '<strong>미래 약속 남발과 희망고문 (Future Faking):</strong> 말로는 먼 미래와 여행을 약속하지만 정작 일상의 작은 약속과 연락에는 성의가 없습니다.',
      '<strong>작은 요청에도 폭발하는 방어적 태도:</strong> 사소한 불편함이나 경계를 말했을 뿐인데 냉전(잠수), 비꼬기, 이별 협박으로 반응합니다.',
      '<strong>호의의 계산서 청구:</strong> 잘해준 일을 다툼 때마다 무기로 꺼내 들거나, 과거의 실수를 끝없이 들춰내며 우위를 점하려 합니다.',
      '<strong>내 솔직한 목소리의 위축:</strong> 상대의 기분을 거스르지 않기 위해 내 의견, 성취, 정당한 욕구를 스스로 검열하고 숨깁니다.'
    ],
    scoreUnit: '개 관계 경고 신호 활성화 (총 4개)',
    verdicts: [
      '위 항목을 체크하여 현재 관계가 장기적인 정서적 안전감을 줄 수 있는지 확인해보세요.',
      '높은 관계 안전감(1/4). 상호 책임감과 일관된 행동이 뒷받침되고 있습니다.',
      '초기 경계 마찰 감지(2/4). 내가 거절하거나 다른 의견을 낼 때 상대가 어떻게 반응하는지 주의 깊게 살펴보세요.',
      '높은 경고 신호 밀도(3/4). 희망고문이나 방어적 태도가 내 애착 안정성을 흔들고 있습니다.',
      '심각한 관계 경고 클러스터(4/4). 내 평온함을 먼저 지키세요. 지금 애착 유형 진단과 단호한 경계 대본 빌더를 활용하세요.'
    ],
    primaryBtn: '무료 애착 유형 및 관계 안전도 정밀 진단 &rarr;',
    subBtn: '상황별 단호한 경계·거절 대본 빌더 열기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN BEZIEHUNGS-WARNSIGNALE-CHECK',
    heading: 'Wie sicher ist Ihr Nervensystem in dieser Verbindung?',
    sub: 'Wählen Sie die frühen Warnzeichen aus, die auf langfristige Erschöpfung hindeuten:',
    items: [
      '<strong>Future Faking &amp; Breadcrumbing:</strong> Große Zukunftspläne in Worten, aber minimaler Einsatz im tatsächlichen Alltag.',
      '<strong>Eskalation bei kleinen Grenzen:</strong> Ein ruhiges Ansprechen führt sofort zu Schweigemauern, Sarkasmus oder Trennungsdrohungen.',
      '<strong>Emotionales Aufrechnen:</strong> Gefälligkeiten sind an Bedingungen geknüpft und werden im Streit als Waffe genutzt.',
      '<strong>Selbstzensur der eigenen Stimme:</strong> Sie halten Meinungen, Erfolge oder Wünsche zurück, um die Stimmung nicht zu kippen.'
    ],
    scoreUnit: 'von 4 Beziehungs-Warnsignalen aktiv',
    verdicts: [
      'Wählen Sie die Punkte oben aus, um Ihre emotionale Sicherheit zu prüfen.',
      'Hohe Beziehungssicherheit (1/4). Verlässlichkeit und gegenseitiger Respekt sind spürbar.',
      'Frühe Grenzreibung (2/4). Achten Sie genau darauf, wie auf ein „Nein“ reagiert wird.',
      'Hohe Warnsignal-Dichte (3/4). Unverbindlichkeit oder Abwehr belasten Ihre Bindungssicherheit.',
      'Kritische Warnsignal-Häufung (4/4). Prüfen Sie jetzt Ihren Bindungsstil und erstellen Sie klare Grenz-Skripte.'
    ],
    primaryBtn: 'Bindungsstil- &amp; Beziehungs-Check starten &rarr;',
    subBtn: 'Interaktiven Grenz- &amp; Nein-Skript-Builder öffnen &rarr;'
  },
  es: {
    badge: 'EVALUADOR DE SEÑALES DE ALERTA EN PAREJA EN 30 SEGUNDOS',
    heading: '¿Qué tan seguro está tu sistema nervioso en esta relación?',
    sub: 'Marca las señales tempranas que predicen desgaste emocional a largo plazo:',
    items: [
      '<strong>Falsas promesas de futuro (Future Faking):</strong> Habla de grandes planes futuros pero muestra mínimo esfuerzo real en el día a día.',
      '<strong>Escalada defensiva ante límites:</strong> Plantear un límite pequeño provoca ley del hielo, sarcasmo o amenazas de ruptura.',
      '<strong>Contabilidad emocional:</strong> Sus favores tienen precio y saca a relucir errores pasados como arma en cada discusión.',
      '<strong>Autocensura de tu voz:</strong> Callas tus opiniones, logros o necesidades para evitar que se incomode.'
    ],
    scoreUnit: 'de 4 señales de alerta relacional activas',
    verdicts: [
      'Marca los puntos arriba para evaluar si esta dinámica ofrece seguridad emocional.',
      'Alta seguridad relacional (1/4). Hay coherencia y responsabilidad mutua.',
      'Fricción temprana de límites (2/4). Observa con atención cómo reacciona cuando dices «no».',
      'Alta densidad de alertas (3/4). Las migajas emocionales o la actitud defensiva dañan tu paz.',
      'Conjunto severo de señales de alerta (4/4). Evalúa tu Estilo de Apego ahora y genera guiones firmes de límites.'
    ],
    primaryBtn: 'Hacer el Test Gratuito de Apego y Seguridad Relacional &rarr;',
    subBtn: 'Generar Guiones Claros de Límites y Negativa &rarr;'
  },
  fr: {
    badge: 'ÉVALUATEUR DE SIGNAUX D’ALERTE AMOUREUX EN 30 SECONDES',
    heading: 'Votre système nerveux est-il en sécurité dans cette relation ?',
    sub: 'Cochez les signes avant-coureurs d’épuisement relationnel :',
    items: [
      '<strong>Promesses de futur sans suite (Future Faking) :</strong> De grands projets en paroles, mais très peu d’investissement concret au quotidien.',
      '<strong>Escalade défensive :</strong> Poser une simple limite déclenche bouderie glaciale, sarcasme ou menaces de rupture.',
      '<strong>Comptabilité émotionnelle :</strong> Les attentions sont intéressées et les erreurs passées servent de munitions lors des conflits.',
      '<strong>Auto-censure constante :</strong> Vous taisez vos avis, vos réussites ou vos besoins pour ménager sa susceptibilité.'
    ],
    scoreUnit: 'sur 4 signaux d’alerte relationnels actifs',
    verdicts: [
      'Cochez les éléments ci-dessus pour tester la sécurité émotionnelle de ce lien.',
      'Haute sécurité relationnelle (1/4). Écoute mutuelle et constance sont au rendez-vous.',
      'Friction précoce sur les limites (2/4). Observez attentivement sa réaction face à un « non ».',
      'Forte densité de signaux d’alerte (3/4). L’inconstance ou la défensive fragilise votre sécurité.',
      'Alerte relationnelle sévère (4/4). Passez le Test d’Attachement et préparez vos scripts de limites.'
    ],
    primaryBtn: 'Faire le Bilan d’Attachement et de Sécurité Relationnelle &rarr;',
    subBtn: 'Ouvrir le Générateur de Scripts de Limites &rarr;'
  },
  ja: {
    badge: '30秒 恋愛の危険信号（ワーニングサイン）＆境界線チェック',
    heading: 'この関係の中で、あなたの心と神経系は本当に安全ですか？',
    sub: '長期的な消耗を予測する4つの初期ワーニングサインをチェックしてください：',
    items: [
      '<strong>未来の口約束と日頃の不誠実さ（フューチャー・フェイキング）：</strong> 将来の話は盛り上がるのに、日常の約束や連絡のフォローは雑。',
      '<strong>小さな境界線に対する過剰な逆ギレ・無視：</strong> 控えめに希望を伝えただけで、不機嫌な無視・皮肉・別れ話に発展する。',
      '<strong>恩着せがましさと過去の蒸し返し：</strong> 親切にいつも見返りを求め、喧嘩のたびに過去のミスを武器として持ち出す。',
      '<strong>自分の本音や喜びの自己検閲：</strong> 相手の機嫌を損ねないよう、自分の意見・達成したこと・欲求を隠すようになっている。'
    ],
    scoreUnit: '/ 4 個の関係性ワーニングサインがアクティブ',
    verdicts: [
      '上の項目をチェックして、この関係が長期的な安心感につながるか確認しましょう。',
      '高い関係安全性（1/4）。誠実な対話と行動の一貫性が保たれています。',
      '初期の境界線摩擦（2/4）。あなたが「ノー」と言ったときの相手の反応を注意深く観察してください。',
      '高い警戒サイン密度（3/4）。言葉だけの約束や防衛的な態度があなたの愛着を揺さぶっています。',
      '深刻な警戒サイン集中（4/4）。自分の平穏を最優先してください。今すぐ愛着スタイル診断と境界線スクリプト作成ツールを活用しましょう。'
    ],
    primaryBtn: '無料の愛着スタイル＆関係安全性チェックへ &rarr;',
    subBtn: '自分を守る「境界線・お断りスクリプト作成ツール」を開く &rarr;'
  },
  zh: {
    badge: '30秒 感情危险预警（Warning Signs）与边界筛查',
    heading: '在这段关系里，你的神经系统真的处于安全区吗？',
    sub: '勾选预示着长期感情内耗的 4 个早期危险信号：',
    items: [
      '<strong>画大饼与面包屑式敷衍（Future Faking）：</strong> 嘴上畅谈遥远的未来承诺，但在日常行动与兑现上却只给一丁点敷衍回应。',
      '<strong>面对微小边界时的防卫升级：</strong> 你只是温和提出一个小底线，对方就用冷暴力、阴阳怪气或威胁分手来反击。',
      '<strong>情感记账与翻旧账：</strong> 对你的好总是附带条件，每次争吵都会把过去的付出或你的小失误拿出来当武器。',
      '<strong>真实自我的不断静音：</strong> 为了照顾对方的情绪，你开始习惯性隐瞒自己的想法、成就或正常需求。'
    ],
    scoreUnit: '/ 4 个关系危险预警信号已激活',
    verdicts: [
      '勾选上方信号，测试这段关系是否具备长期的情绪安全性。',
      '高关系安全感（1/4）。彼此有担当且言行一致。',
      '早期边界摩擦（2/4）。请密切观察当你说出“不”时对方的真实反应。',
      '高密度危险信号（3/4）。画饼敷衍或防卫升级正在消耗你的依恋安全感。',
      '严重危险预警集群（4/4）。请优先保护自己的内心平静，立即进行依恋测试并准备清晰的边界话术。'
    ],
    primaryBtn: '开始免费依恋类型与关系安全度测评 &rarr;',
    subBtn: '打开清晰边界与温和拒绝话术生成器 &rarr;'
  },
  pt: {
    badge: 'RASTREIO DE SINAIS DE ALERTA NO NAMORO EM 30 SEGUNDOS',
    heading: 'Quão seguro está seu sistema nervoso nesta relação?',
    sub: 'Marque os sinais precoces que indicam desgaste emocional a longo prazo:',
    items: [
      '<strong>Falsas promessas de futuro (Future Faking):</strong> Fala de grandes planos lá na frente, mas entrega esforço mínimo no dia a dia.',
      '<strong>Escalada defensiva:</strong> Colocar um limite simples gera tratamento de silêncio, sarcasmo ou ameaças de término.',
      '<strong>Contabilidade emocional:</strong> Favores vêm com cobrança e erros antigos viram munição em qualquer discussão.',
      '<strong>Encolhimento da sua voz:</strong> Você censura suas opiniões, conquistas ou necessidades para não desagradar.'
    ],
    scoreUnit: 'de 4 sinais de alerta relacional ativos',
    verdicts: [
      'Marque os itens acima para testar se essa dinâmica sustenta segurança emocional.',
      'Alta segurança relacional (1/4). Há responsabilidade mútua e constância.',
      'Atrito inicial de limites (2/4). Observe bem como a pessoa reage quando você diz "não".',
      'Alta densidade de alertas (3/4). Migalhas afetivas ou defensividade estão drenando sua segurança.',
      'Conjunto severo de alertas (4/4). Proteja sua paz—mapeie seu Estilo de Apego e gere roteiros firmes de limites.'
    ],
    primaryBtn: 'Fazer o Teste Gratuito de Estilo de Apego &rarr;',
    subBtn: 'Abrir Gerador de Scripts de Limites e Recusa &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ ТЕСТ НА ТРЕВОЖНЫЕ ЗВОНОЧКИ В ОТНОШЕНИЯХ',
    heading: 'Насколько безопасно вашей нервной системе в этих отношениях?',
    sub: 'Отметьте ранние признаки, предвещающие эмоциональное выгорание в паре:',
    items: [
      '<strong>Иллюзия будущего (Future Faking):</strong> Громкие разговоры о совместном будущем при минимальных усилиях в реальной жизни.',
      '<strong>Агрессивная защита при границах:</strong> Спокойная просьба вызывает молчаливый бойкот, сарказм или угрозы расстаться.',
      '<strong>Эмоциональная бухгалтерия:</strong> Забота всегда требует расплаты, а прошлые промахи используются как оружие в спорах.',
      '<strong>Заглушение собственного голоса:</strong> Вы скрываете свои мысли, успехи или потребности, чтобы не спровоцировать партнера.'
    ],
    scoreUnit: 'из 4 тревожных сигналов в отношениях активны',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить долгосрочную безопасность этой связи.',
      'Высокая надежность (1/4). В паре есть взаимная ответственность и уважение.',
      'Раннее трение границ (2/4). Внимательно следите за реакцией партнера на ваше «нет».',
      'Высокая плотность тревожных сигналов (3/4). Манипуляции подрывают вашу уверенность.',
      'Острый кластер угроз (4/4). Берегите себя — пройдите тест на тип привязанности и подготовьте четкие фразы границ.'
    ],
    primaryBtn: 'Пройти бесплатный тест на тип привязанности &rarr;',
    subBtn: 'Открыть конструктор фраз для защиты границ &rarr;'
  },
  id: {
    badge: 'SKRINING TANDA BAHAYA &amp; BATASAN HUBUNGAN 30 DETIK',
    heading: 'Seberapa Aman Sistem Saraf Anda dalam Hubungan Ini?',
    sub: 'Centang tanda peringatan dini yang memicu kelelahan emosional jangka panjang:',
    items: [
      '<strong>Janji Masa Depan Palsu (Future Faking):</strong> Membicarakan rencana besar di masa depan, namun minim usaha nyata sehari-hari.',
      '<strong>Eskalasi Defensif Saat Dibatasi:</strong> Menyampaikan batasan kecil dibalas aksi diam, sarkasme, atau ancaman putus.',
      '<strong>Perhitungan Emosional:</strong> Kebaikan selalu menuntut balasan dan kesalahan lama diungkit sebagai senjata saat berdebat.',
      '<strong>Membungkam Suara Sendiri:</strong> Anda menyensor pendapat, pencapaian, atau kebutuhan agar pasangan tidak tersinggung.'
    ],
    scoreUnit: 'dari 4 sinyal peringatan hubungan aktif',
    verdicts: [
      'Centang item di atas untuk menguji apakah hubungan ini mendukung rasa aman jangka panjang.',
      'Keamanan Hubungan Tinggi (1/4). Ada tanggung jawab bersama dan konsistensi nyata.',
      'Gesekan Batasan Dini (2/4). Perhatikan baik-baik bagaimana ia merespons saat Anda berkata "tidak".',
      'Kepadatan Tanda Bahaya Tinggi (3/4). Sikap defensif mulai menguras rasa aman kelekatan Anda.',
      'Kluster Peringatan Berat (4/4). Lindungi ketenangan Anda—petakan Gaya Kelekatan dan buat skrip batasan sekarang.'
    ],
    primaryBtn: 'Ikuti Tes Gratis Gaya Kelekatan &amp; Audit Hubungan &rarr;',
    subBtn: 'Buka Pembuat Skrip Batasan &amp; Penolakan Tegas &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK İLİŞKİ UYARI İŞARETLERİ VE SINIR TARAMASI',
    heading: 'Bu İlişkide Sinir Sisteminiz Ne Kadar Güvende?',
    sub: 'Uzun vadeli ilişkisel tükenmişliği haber veren erken uyarı sinyallerini işaretleyin:',
    items: [
      '<strong>Sahte Gelecek Vaatleri (Future Faking):</strong> Erkenden büyük gelecek planları anlatılıyor ama günlük hayatta somut çaba çok az.',
      '<strong>Sınır Koyunca Savunmacı Tırmanış:</strong> Küçük bir sınır belirttiğinizde küslük, iğneleme veya ayrılık tehdidiyle karşılaşıyorsunuz.',
      '<strong>Duygusal Çetele Tutma:</strong> İyilikler hep karşılık bekliyor ve geçmiş hatalar tartışmalarda silah olarak kullanılıyor.',
      '<strong>Kendi Sesinizi Kısma:</strong> Onun keyfi kaçmasın diye fikirlerinizi, başarılarınızı veya ihtiyaçlarınızı sansürlüyorsunuz.'
    ],
    scoreUnit: '/ 4 ilişkisel uyarı sinyali aktif',
    verdicts: [
      'Bu dinamiğin uzun vadeli duygusal güvenliği destekleyip desteklemediğini görmek için işaretleyin.',
      'Yüksek İlişkisel Güven (1/4). Karşılıklı sorumluluk ve tutarlılık mevcut.',
      'Erken Sınır Sürtüşmesi (2/4). "Hayır" dediğinizde nasıl tepki verdiğine dikkatle bakın.',
      'Yüksek Uyarı Yoğunluğu (3/4). Savunmacı tırmanış bağlanma güvenliğinizi yoruyor.',
      'Şiddetli İlişkisel Uyarı Kümesi (4/4). Huzurunuzu koruyun—Bağlanma Stili Testini çözün ve sınır cümlelerinizi oluşturun.'
    ],
    primaryBtn: 'Ücretsiz Bağlanma Stili ve İlişki Analizini Başlat &rarr;',
    subBtn: 'Net Sınır Koyma ve "Hayır" Deme Aracını Aç &rarr;'
  },
  hi: {
    badge: '30-सेकंड रिलेशनशिप वार्निंग साइन्स (Warning Signs) स्क्रीनर',
    heading: 'इस रिश्ते में आपका नर्वस सिस्टम कितना सुरक्षित है?',
    sub: 'लंबे समय में भावनात्मक थकान पैदा करने वाले इन शुरुआती संकेतों को चुनें:',
    items: [
      '<strong>भविष्य के झूठे वादे (Future Faking):</strong> भविष्य की बड़ी योजनाएं बनाना, लेकिन रोज़मर्रा के व्यवहार में बहुत कम प्रयास दिखाना।',
      '<strong>छोटी सीमा तय करने पर भी तीखी प्रतिक्रिया:</strong> कोई सामान्य बात या सीमा बताने पर चुप्पी साध लेना, ताने मारना या रिश्ता तोड़ने की धमकी देना।',
      '<strong>एहसान गिनना और पुरानी गलतियां उछालना:</strong> हर मदद के बदले उम्मीद रखना और बहस में पुरानी बातों को हथियार की तरह इस्तेमाल करना।',
      '<strong>अपनी असली आवाज़ को दबाना:</strong> सामने वाले का मूड ठीक रखने के लिए अपनी राय, उपलब्धियों या ज़रूरतों को छुपाना।'
    ],
    scoreUnit: '/ 4 रिलेशनशिप वार्निंग संकेत सक्रिय',
    verdicts: [
      'यह जांचने के लिए ऊपर चुनें कि क्या यह रिश्ता भावनात्मक सुरक्षा देता है।',
      'उच्च रिलेशनशिप सुरक्षा (1/4)। आपसी समझ और व्यवहार में स्थिरता मौजूद है।',
      'शुरुआती बाउंड्री टकराव (2/4)। ध्यान दें कि आपके "ना" कहने पर सामने वाला कैसे प्रतिक्रिया देता है।',
      'उच्च चेतावनी संकेत (3/4)। अस्थिर व्यवहार आपकी भावनात्मक सुरक्षा को थका रहा है।',
      'गंभीर चेतावनी संकेत (4/4)। अपनी शांति की रक्षा करें—अटैचमेंट स्टाइल टेस्ट लें और स्पष्ट बाउंड्री स्क्रिप्ट बनाएं।'
    ],
    primaryBtn: 'मुफ्त अटैचमेंट स्टाइल और रिलेशनशिप टेस्ट लें &rarr;',
    subBtn: 'स्पष्ट बाउंड्री और अस्वीकृति स्क्रिप्ट टूल खोलें &rarr;'
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

  // 1. gaslighting-signs-relationship.html (12 locales)
  for (const [lang, loc] of Object.entries(GASLIGHTING_REL_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'gaslighting-signs-relationship.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'gaslightingRelationshipScreener',
      chkClass: 'gasrel-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=gaslighting_relationship_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=gaslighting_relationship_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/gaslighting-signs-relationship.html`);
    console.log(`[PASS] gaslighting-signs-relationship (${lang})`);
  }

  // 2. relationship-red-flags-quiz.html (12 locales)
  for (const [lang, loc] of Object.entries(RELATIONSHIP_RED_FLAGS_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'relationship-red-flags-quiz.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'relationshipRedFlagsScreener',
      chkClass: 'relrf-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=relationship_red_flags_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=relationship_red_flags_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/relationship-red-flags-quiz.html`);
    console.log(`[PASS] relationship-red-flags-quiz (${lang})`);
  }

  // 3. red-flag-test-relationship-warning-signs.html (12 locales)
  for (const [lang, loc] of Object.entries(WARNING_SIGNS_RED_FLAG_LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'red-flag-test-relationship-warning-signs.html');
    if (!fs.existsSync(filePath)) continue;
    applyScreenerToFile(filePath, {
      lang,
      id: 'warningSignsRedFlagScreener',
      chkClass: 'warnrf-screener-chk',
      badge: loc.badge,
      heading: loc.heading,
      sub: loc.sub,
      items: loc.items,
      scoreUnit: loc.scoreUnit,
      verdicts: loc.verdicts,
      primaryHref: `/attachment-style/?lang=${lang}&source=warning_signs_red_flag_screener`,
      primaryTargetSlug: 'attachment-style',
      primaryBtn: loc.primaryBtn,
      subHref: `/stress-check/script.html?lang=${lang}&source=warning_signs_red_flag_screener`,
      subBtn: loc.subBtn
    });
    changedUrls.push(`https://dopabrain.com/portal/blog/${lang}/red-flag-test-relationship-warning-signs.html`);
    console.log(`[PASS] red-flag-test-relationship-warning-signs (${lang})`);
  }

  let blogSitemap = fs.readFileSync(BLOG_SITEMAP, 'utf8');
  let portalSitemap = fs.readFileSync(PORTAL_SITEMAP, 'utf8');
  for (const url of changedUrls) {
    blogSitemap = updateSitemapUrl(blogSitemap, url);
    portalSitemap = updateSitemapUrl(portalSitemap, url);
  }
  fs.writeFileSync(BLOG_SITEMAP, blogSitemap, 'utf8');
  fs.writeFileSync(PORTAL_SITEMAP, portalSitemap, 'utf8');
  console.log(`[PASS] Session 10: Updated lastmod=${TODAY} for ${changedUrls.length} blog URLs in sitemaps.`);
}

run();

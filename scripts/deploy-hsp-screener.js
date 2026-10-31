'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTAL_BLOG = path.join(ROOT, 'projects', 'portal', 'blog');
const SITEMAP_PATH = path.join(PORTAL_BLOG, 'sitemap.xml');
const TODAY = '2026-10-31';

const LOCALES = {
  en: {
    badge: '30-SECOND QUICK TRIAGE',
    heading: 'Are You a Highly Sensitive Person (HSP)?',
    sub: 'Check the core sensory and emotional traits you regularly experience:',
    items: [
      '<strong>Depth of Processing:</strong> You reflect deeply on subtle nuances, replay past interactions, and need time to analyze before making decisions.',
      '<strong>Overstimulation:</strong> Loud noise, bright artificial lights, large crowds, or chaotic multi-tasking rapidly deplete your energy.',
      '<strong>Emotional Empathy:</strong> You absorb the mood and stress of people around you instinctively, often feeling their tension in your own body.',
      '<strong>Sensing Subtleties:</strong> You notice tiny shifts others miss—slight changes in voice tone, room temperature, faint scents, or nonverbal cues.'
    ],
    scoreUnit: 'of 4 core SPS dimensions checked',
    verdicts: [
      'Select any traits above to evaluate your real-time sensitivity profile.',
      'Mild sensitivity traits observed. You notice subtle cues while maintaining stable nervous resilience.',
      'Moderate sensitivity indicators. You experience selective depth of processing and sensory saturation in busy environments.',
      'High sensitivity profile. Your nervous system processes environmental and emotional input with profound depth.',
      'Classic Highly Sensitive Person (HSP) profile. You align across all 4 core SPS DOES dimensions.'
    ],
    primaryBtn: 'Take the Full Free HSP Test &rarr;',
    subBtn: 'Try 2-Minute Sensory Reset &rarr;'
  },
  ko: {
    badge: '30초 자가 진단 트리아지',
    heading: '당신은 매우 민감한 사람(HSP)일까요?',
    sub: '일상에서 자주 경험하는 핵심 감각 및 감정 특성을 체크해보세요:',
    items: [
      '<strong>깊은 정보 처리:</strong> 미묘한 뉘앙스를 깊이 곱씹고, 결정을 내리기 전에 상황을 다각도로 분석하며 신중하게 접근합니다.',
      '<strong>감각적 과부하:</strong> 시끄러운 소음, 강한 조명, 복잡한 군중이나 촉박한 마감 압박에 에너지가 급격히 소진됩니다.',
      '<strong>정서적 공감:</strong> 주변 사람들의 기분이나 긴장감을 스펀지처럼 흡수하여 내 몸의 긴장처럼 생생하게 느낍니다.',
      '<strong>미세한 자극 감지:</strong> 목소리 톤의 변화, 미세한 냄새, 공간의 분위기 등 남들이 쉽게 놓치는 디테일을 즉각 알아챕니다.'
    ],
    scoreUnit: '개 핵심 SPS 차원 체크됨',
    verdicts: [
      '해당하는 항목을 체크하여 실시간 민감성 프로필을 확인해보세요.',
      '경미한 민감성 경향입니다. 환경 신호를 잘 감지하면서도 신경계 항상성을 안정적으로 유지합니다.',
      '중간 수준의 민감성입니다. 분주한 환경에서 선택적 깊은 처리와 감각 포화를 경험합니다.',
      '높은 민감성 프로필입니다. 주변 환경 자극과 정서적 에너지를 매우 깊이 수용하고 처리합니다.',
      '전형적인 고감수성(HSP) 프로필입니다. SPS 이론의 4대 DOES 핵심 차원에 모두 일치합니다.'
    ],
    primaryBtn: '무료 정밀 HSP 테스트 받기 &rarr;',
    subBtn: '2분 감각 리셋 도구 체험하기 &rarr;'
  },
  de: {
    badge: '30-SEKUNDEN SCHNELL-TRIAGE',
    heading: 'Sind Sie eine hochsensible Person (HSP)?',
    sub: 'Wählen Sie die sensorischen und emotionalen Muster aus, die Sie regelmäßig erleben:',
    items: [
      '<strong>Tiefe Verarbeitung:</strong> Sie denken gründlich über Nuancen nach und wägen Entscheidungen sehr sorgfältig ab.',
      '<strong>Reizüberflutung:</strong> Laute Geräusche, grelles Licht, Menschenmengen oder Hektik rauben Ihnen schnell Energie.',
      '<strong>Emotionale Empathie:</strong> Sie nehmen Stimmungen und Spannungen Ihrer Mitmenschen wie ein Schwamm auf.',
      '<strong>Feine Wahrnehmung:</strong> Sie bemerken subtile Veränderungen im Tonfall oder in der Umgebung, die andere übersehen.'
    ],
    scoreUnit: 'von 4 zentralen SPS-Dimensionen ausgewählt',
    verdicts: [
      'Wählen Sie die Merkmale oben aus, um Ihr Sensibilitätsprofil zu bewerten.',
      'Leichte Sensibilitätsmerkmale beobachtet. Sie nehmen feine Reize wahr bei stabiler Belastbarkeit.',
      'Moderate Sensibilität erkannt. In reizintensiven Umgebungen neigen Sie zu sensorischer Sättigung.',
      'Ausgeprägtes Sensibilitätsprofil. Ihr Nervensystem verarbeitet Reize und Emotionen besonders intensiv.',
      'Klassisches HSP-Profil. Sie stimmen mit allen 4 zentralen DOES-Dimensionen überein.'
    ],
    primaryBtn: 'Vollständigen kostenlosen HSP-Test machen &rarr;',
    subBtn: '2-Minuten Sensorik-Reset ausprobieren &rarr;'
  },
  es: {
    badge: 'TRIAJE RÁPIDO DE 30 SEGUNDOS',
    heading: '¿Eres una persona altamente sensible (PAS)?',
    sub: 'Marca los patrones sensoriales y emocionales que experimentas con regularidad:',
    items: [
      '<strong>Procesamiento profundo:</strong> Reflexionas intensamente sobre cada detalle y necesitas tiempo para analizar antes de decidir.',
      '<strong>Sobreestimulación:</strong> Los ruidos fuertes, luces intensas, multitudes o prisas agotan tu energía rápidamente.',
      '<strong>Empatía emocional:</strong> Absorbes el estado de ánimo y la tensión de quienes te rodean con gran intensidad física.',
      '<strong>Percepción de sutilezas:</strong> Notas cambios sutiles en el tono de voz, olores o detalles que otros pasan por alto.'
    ],
    scoreUnit: 'de 4 dimensiones esenciales de PAS marcadas',
    verdicts: [
      'Marca los rasgos anteriores para evaluar tu perfil de sensibilidad en tiempo real.',
      'Rasgos leves de sensibilidad. Percibes sutilezas manteniendo una buena resistencia nerviosa.',
      'Sensibilidad moderada detectada. Experimentas saturación sensorial en entornos caóticos.',
      'Alto perfil de sensibilidad. Tu sistema nervioso procesa estímulos con gran profundidad.',
      'Perfil clásico de Persona Altamente Sensible (PAS). Coincides con las 4 dimensiones DOES.'
    ],
    primaryBtn: 'Hacer el test completo gratuito de PAS &rarr;',
    subBtn: 'Probar el reset sensorial de 2 minutos &rarr;'
  },
  fr: {
    badge: 'TRIAGE RAPIDE EN 30 SECONDES',
    heading: 'Êtes-vous une personne hypersensible (HSP) ?',
    sub: 'Cochez les traits sensoriels et émotionnels que vous ressentez régulièrement :',
    items: [
      '<strong>Traitement en profondeur :</strong> Vous analysez les nuances en détail et prenez le temps de peser vos décisions.',
      '<strong>Surstimulation :</strong> Les bruits forts, les lumières vives et les foules vous épuisent rapidement le système nerveux.',
      '<strong>Empathie émotionnelle :</strong> Vous absorbez les émotions et tensions des personnes qui vous entourent comme une éponge.',
      '<strong>Perception des subtilités :</strong> Vous remarquez les infimes changements d ambiance ou de ton que les autres manquent.'
    ],
    scoreUnit: 'sur 4 dimensions clés de la sensibilité cochées',
    verdicts: [
      'Cochez les critères ci-dessus pour évaluer votre profil de sensibilité.',
      'Sensibilité légère observée. Vous remarquez les nuances avec une bonne résilience nerveuse.',
      'Sensibilité modérée détectée. Tendance à la saturation sensorielle en milieu stimulant.',
      'Profil de haute sensibilité. Votre système nerveux traite stimuli et émotions avec grande intensité.',
      'Profil classique d hypersensibilité (HSP). Vous répondez aux 4 critères majeurs du modèle DOES.'
    ],
    primaryBtn: 'Faire le test HSP complet et gratuit &rarr;',
    subBtn: 'Essayer le reset sensoriel de 2 minutes &rarr;'
  },
  ja: {
    badge: '30秒クイック診断',
    heading: 'あなたはHSP（非常に敏感な人）でしょうか？',
    sub: '日常生活で当てはまる感覚や感情のパターンにチェックを入れてください：',
    items: [
      '<strong>深い情報処理：</strong> 物事のニュアンスを深く考え込み、決断を下す前に状況を慎重に多角的に分析します。',
      '<strong>過度な刺激への消耗：</strong> 大きな音、強い照明、人混みや時間に追われる環境で急激にエネルギーを消耗します。',
      '<strong>高い共感性：</strong> 周囲の人の機嫌や緊張感をスポンジのように吸収し、自分の身体の緊張のように感じます。',
      '<strong>微細な刺激の察知：</strong> 声のトーンの些細な変化、匂い、空間の違和感など他人が見落とす微細な変化に気づきます。'
    ],
    scoreUnit: '項目が該当（4次元中）',
    verdicts: [
      '上の項目をチェックして、あなたの敏感性プロファイルを確認してください。',
      '軽度の敏感性が見られます。環境のサインを察知しつつ、安定した神経系の回復力を保っています。',
      '中程度の敏感性です。刺激の多い環境では選択的な深い情報処理と感覚の飽和を経験します。',
      '高い敏感性プロファイルです。周囲の刺激や感情的エネルギーを非常に深く受け止めます。',
      '典型的なHSP（高度感受性）プロファイルです。DOESフレームワークの4次元すべてに合致します。'
    ],
    primaryBtn: '無料の本格HSP診断を受ける &rarr;',
    subBtn: '2分間の感覚リセットを試す &rarr;'
  },
  zh: {
    badge: '30秒快速自测',
    heading: '您是高敏感人群（HSP）吗？',
    sub: '勾选您在日常生活中经常体验到的核心感官与情绪特征：',
    items: [
      '<strong>深度加工：</strong> 深入反复思考细节与言外之意，做决定前需要充分时间权衡与分析。',
      '<strong>容易过度受刺激：</strong> 嘈杂的声音、刺眼的灯光、拥挤的人群或紧迫的时间会迅速耗尽您的精力。',
      '<strong>强烈共情：</strong> 容易像海绵一样吸收周围人的情绪与紧张感，感同身受。',
      '<strong>敏锐察觉细微变化：</strong> 他人容易忽略的语气变化、气味或环境微妙转变，您能立刻捕捉。'
    ],
    scoreUnit: '项已选（共4项SPS核心维度）',
    verdicts: [
      '勾选上方特征以评估您的实时敏感特质。',
      '轻度敏感特质。您能捕捉细微线索，同时保持稳定的神经韧性。',
      '中度高敏感倾向。在嘈杂环境中容易出现感官饱和与深度情绪消耗。',
      '显著的高敏感特质。您的神经系统对环境和情绪输入具有极高的感知精度与深度。',
      '典型的高敏感人群（HSP）特征。完全符合SPS理论的DOES四大核心维度。'
    ],
    primaryBtn: '参加完整免费高敏感（HSP）测试 &rarr;',
    subBtn: '体验2分钟感官重置工具 &rarr;'
  },
  pt: {
    badge: 'TRIAGEM RÁPIDA DE 30 SEGUNDOS',
    heading: 'Você é uma pessoa altamente sensível (PAS)?',
    sub: 'Marque os padrões sensoriais e emocionais que você vivencia com frequência:',
    items: [
      '<strong>Processamento profundo:</strong> Você reflete profundamente sobre nuances e analisa com cuidado antes de tomar decisões.',
      '<strong>Superestimulação:</strong> Barulhos altos, luzes fortes, multidões ou pressão de tempo esgotam sua energia rapidamente.',
      '<strong>Empatia emocional:</strong> Você absorve o humor e a tensão das pessoas ao seu redor quase instintivamente no próprio corpo.',
      '<strong>Percepção de sutilezas:</strong> Você percebe pequenas mudanças de tom, odores ou detalhes que outros passam batido.'
    ],
    scoreUnit: 'de 4 dimensões essenciais de PAS marcadas',
    verdicts: [
      'Marque os traços acima para avaliar seu perfil de sensibilidade.',
      'Traços leves de sensibilidade. Você percebe sutilezas mantendo boa estabilidade nervosa.',
      'Sensibilidade moderada detectada. Tendência à saturação sensorial em ambientes movimentados.',
      'Alto perfil de sensibilidade. Seu sistema nervoso processa estímulos com profunda intensidade.',
      'Perfil clássico de Pessoa Altamente Sensível (PAS). Você se alinha às 4 dimensões do modelo DOES.'
    ],
    primaryBtn: 'Fazer o teste completo gratuito de PAS &rarr;',
    subBtn: 'Experimentar o reset sensorial de 2 minutos &rarr;'
  },
  ru: {
    badge: '30-СЕКУНДНЫЙ СКРИНИНГ',
    heading: 'Вы высокочувствительный человек (HSP)?',
    sub: 'Отметьте сенсорные и эмоциональные особенности, которые вы регулярно испытываете:',
    items: [
      '<strong>Глубокая обработка:</strong> Вы глубоко анализируете детали и долго взвешиваете решения, прежде чем действовать.',
      '<strong>Сенсорная перегрузка:</strong> Громкие звуки, яркий свет, толпа и спешка быстро истощают ваши энергетические запасы.',
      '<strong>Эмоциональная эмпатия:</strong> Вы впитываете настроение и напряжение окружающих людей, ощущая их физически.',
      '<strong>Восприятие нюансов:</strong> Вы сразу замечаете малейшие изменения в тоне, запахах и обстановке, которые упускают другие.'
    ],
    scoreUnit: 'из 4 ключевых критериев чувствительности отмечено',
    verdicts: [
      'Отметьте пункты выше, чтобы оценить свой профиль чувствительности.',
      'Мягкие признаки чувствительности. Вы замечаете нюансы, сохраняя хорошую устойчивость нервной системы.',
      'Умеренная чувствительность. В насыщенной среде вы сталкиваетесь с сенсорным насыщением.',
      'Высокий уровень чувствительности. Ваша нервная система глубоко воспринимает любые стимулы.',
      'Классический профиль высокочувствительного человека (HSP). Полное совпадение по 4 критериям DOES.'
    ],
    primaryBtn: 'Пройти полный бесплатный HSP-тест &rarr;',
    subBtn: 'Попробовать 2-минутный сенсорный перезапуск &rarr;'
  },
  id: {
    badge: 'TRIASE CEPAT 30 DETIK',
    heading: 'Apakah Anda Orang yang Sangat Sensitif (HSP)?',
    sub: 'Centang pola sensorik dan emosional yang sering Anda alami sehari-hari:',
    items: [
      '<strong>Pemrosesan mendalam:</strong> Anda memikirkan detail secara mendalam dan butuh waktu menganalisis sebelum mengambil keputusan.',
      '<strong>Stimulasi berlebih:</strong> Suara bising, lampu menyilaukan, dan keramaian cepat menguras energi mental Anda.',
      '<strong>Empati emosional:</strong> Anda menyerap suasana hati dan ketegangan orang di sekitar Anda layaknya spons.',
      '<strong>Kepekaan terhadap hal halus:</strong> Anda menyadari perubahan nada suara, aroma, atau detail kecil yang terlewatkan orang lain.'
    ],
    scoreUnit: 'dari 4 dimensi inti sensitivitas tercentang',
    verdicts: [
      'Centang sifat di atas untuk mengevaluasi profil sensitivitas Anda.',
      'Sifat sensitivitas ringan terlihat. Anda peka terhadap isyarat lingkungan dengan ketahanan saraf yang stabil.',
      'Sensitivitas moderat terdeteksi. Mengalami kejenuhan sensorik dalam situasi yang padat stimulasi.',
      'Profil sensitivitas tinggi. Sistem saraf Anda memproses rangsangan lingkungan dan emosi secara mendalam.',
      'Profil klasik Highly Sensitive Person (HSP). Cocok di seluruh 4 dimensi kerangka kerja DOES.'
    ],
    primaryBtn: 'Ikuti Tes HSP Lengkap & Gratis &rarr;',
    subBtn: 'Coba Reset Sensorik 2 Menit &rarr;'
  },
  tr: {
    badge: '30 SANİYELİK HIZLI DEĞERLENDİRME',
    heading: 'Yüksek Hassasiyetli Bir Birey (HSP) misiniz?',
    sub: 'Günlük yaşamınızda düzenli olarak deneyimlediğiniz temel duyusal ve duygusal özellikleri işaretleyin:',
    items: [
      '<strong>Derin işleme:</strong> Ayrıntıları derinlemesine düşünür ve karar vermeden önce durumları çok yönlü analiz edersiniz.',
      '<strong>Aşırı uyarılma:</strong> Yüksek sesler, parlak ışıklar, kalabalıklar veya telaş enerjinizi hızla tüketir.',
      '<strong>Duygusal empati:</strong> Çevrenizdekilerin ruh halini ve gerilimini bir sünger gibi emer, derinden hissedersiniz.',
      '<strong>İnce ayrıntıları fark etme:</strong> Başkalarının gözden kaçırdığı ses tonu veya ortamdaki ince değişiklikleri hemen sezersiniz.'
    ],
    scoreUnit: 'temel SPS boyutu işaretlendi (toplam 4)',
    verdicts: [
      'Hassasiyet profilinizi gerçek zamanlı değerlendirmek için yukarıdaki özellikleri işaretleyin.',
      'Hafif hassasiyet özellikleri gözlemlendi. Çevresel ipuçlarını fark ederken sinir sistemi dengesini koruyorsunuz.',
      'Orta düzeyde hassasiyet tespit edildi. Yoğun ortamlarda duyusal doyum ve derin işlemleme yaşıyorsunuz.',
      'Yüksek hassasiyet profili. Sinir sisteminiz çevresel ve duygusal girdileri derinlemesine işliyor.',
      'Klasik Yüksek Hassasiyetli Kişi (HSP) profili. DOES çerçevesinin 4 temel boyutunun tümüyle uyumlusunuz.'
    ],
    primaryBtn: 'Ücretsiz Tam HSP Testini Çöz &rarr;',
    subBtn: '2 Dakikalık Duyusal Sıfırlamayı Dene &rarr;'
  },
  hi: {
    badge: '30-सेकंड त्वरित जांच',
    heading: 'क्या आप एक अत्यधिक संवेदनशील व्यक्ति (HSP) हैं?',
    sub: 'उन संवेदी और भावनात्मक लक्षणों को चुनें जिन्हें आप नियमित रूप से अनुभव करते हैं:',
    items: [
      '<strong>गहन प्रसंस्करण:</strong> आप बारीकियों पर गहराई से विचार करते हैं और निर्णय लेने से पहले स्थितियों का विश्लेषण करते हैं।',
      '<strong>अत्यधिक उत्तेजना:</strong> तेज आवाजें, तेज रोशनी, भीड़ या हड़बड़ी आपकी मानसिक ऊर्जा को तेजी से खत्म कर देती हैं।',
      '<strong>भावनात्मक सहानुभूति:</strong> आप अपने आसपास के लोगों के मूड और तनाव को गहराई से महसूस करते हैं।',
      '<strong>सूक्ष्मताओं को भांपना:</strong> आप आवाज के लहजे या माहौल में होने वाले सूक्ष्म बदलावों को तुरंत भांप लेते हैं।'
    ],
    scoreUnit: 'मुख्य संवेदनशीलता पैमाने चुने गए (कुल 4)',
    verdicts: [
      'अपनी संवेदनशीलता प्रोफ़ाइल का मूल्यांकन करने के लिए ऊपर दिए गए लक्षणों को चुनें।',
      'हल्की संवेदनशीलता के लक्षण दिखे। आप सूक्ष्म संकेतों को समझते हुए मानसिक संतुलन बनाए रखते हैं।',
      'मध्यम संवेदनशीलता पाई गई। व्यस्त वातावरण में आप संवेदी अधिभार महसूस करते हैं।',
      'उच्च संवेदनशीलता प्रोफ़ाइल। आपका तंत्रिका तंत्र उत्तेजनाओं को गहराई से संसाधित करता है।',
      'पारंपरिक Highly Sensitive Person (HSP) प्रोफ़ाइल। आप DOES मॉडल के सभी 4 आयामों से मेल खाते हैं।'
    ],
    primaryBtn: 'पूरा निःशुल्क HSP टेस्ट लें &rarr;',
    subBtn: '2-मिनट संवेदी रीसेट आजमाएं &rarr;'
  }
};

const CSS_SNIPPET = `
        /* 30-Second Quick HSP Screener */
        .screener-box { background: linear-gradient(145deg, rgba(230,126,34,0.12), rgba(15,23,42,0.95)); border: 1.5px solid rgba(240,160,75,0.35); border-radius: 18px; padding: 26px 22px; margin: 32px 0; }
        .screener-head { text-align: center; margin-bottom: 18px; }
        .screener-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(240,160,75,0.2); border: 1px solid rgba(240,160,75,0.35); color: #fde8c8; font-size: 11px; font-weight: 800; letter-spacing: .08em; margin-bottom: 8px; }
        .screener-head h3 { margin: 6px 0 8px; color: var(--primary-light, #f0a04b); font-size: 1.25rem; font-weight: 700; }
        .screener-head p { margin: 0; color: var(--text-secondary, #94a3b8); font-size: 0.92rem; }
        .screener-list { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
        .screener-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: rgba(30,41,59,0.7); border: 1px solid rgba(240,160,75,0.2); border-radius: 12px; cursor: pointer; min-height: 48px; touch-action: manipulation; transition: all .2s; }
        .screener-item:hover { border-color: rgba(240,160,75,0.6); background: rgba(240,160,75,0.12); }
        .screener-item.is-checked { border-color: #f0a04b; background: rgba(240,160,75,0.2); }
        .screener-item input[type="checkbox"] { width: 22px; height: 22px; accent-color: #e67e22; cursor: pointer; flex-shrink: 0; }
        .screener-item .screener-text { font-size: 14.5px; color: var(--text-primary, #f0f0f8); line-height: 1.4; text-align: left; }
        .screener-feedback { text-align: center; padding-top: 16px; border-top: 1px solid rgba(240,160,75,0.2); }
        .screener-score { font-size: 15px; font-weight: 700; color: #f5c98a; margin-bottom: 6px; }
        .screener-feedback p { font-size: 14px; color: var(--text-secondary, #94a3b8); margin-bottom: 16px; min-height: 20px; }
        .screener-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .screener-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; max-width: 380px; min-height: 48px; padding: 12px 24px; background: linear-gradient(135deg, #e67e22, #f0a04b); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(230,126,34,0.35); transition: all 0.25s; }
        .screener-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(230,126,34,0.5); color: #fff; }
        .screener-sub-btn { display: inline-block; padding: 10px 16px; color: #f0a04b; text-decoration: none; font-size: 13.5px; font-weight: 600; min-height: 44px; line-height: 24px; }
        .screener-sub-btn:hover { text-decoration: underline; color: #f5c98a; }
`;

function buildHtmlSnippet(loc, lang) {
  const itemsHtml = loc.items.map((item, idx) => `        <label class="screener-item">
          <input type="checkbox" class="hsp-screener-chk" value="1">
          <span class="screener-text">${item}</span>
        </label>`).join('\n');

  return `<div class="screener-box" id="hspScreener">
      <div class="screener-head">
        <span class="screener-badge">${loc.badge}</span>
        <h3>${loc.heading}</h3>
        <p>${loc.sub}</p>
      </div>
      <div class="screener-list" role="group" aria-label="HSP checklist">
${itemsHtml}
      </div>
      <div class="screener-feedback">
        <div class="screener-score">
          <span id="hspScreenerCount">0</span> ${loc.scoreUnit}
        </div>
        <p id="hspScreenerVerdict">${loc.verdicts[0]}</p>
        <div class="screener-actions">
          <a class="screener-btn" href="/hsp-test/?lang=${lang}">${loc.primaryBtn}</a>
          <a class="screener-sub-btn" href="/hsp-test/reset.html?lang=${lang}">${loc.subBtn}</a>
        </div>
      </div>
    </div>`;
}

function buildScriptSnippet(loc) {
  const verdictsJson = JSON.stringify(loc.verdicts);
  return `<script>
(function initHspScreener() {
  const chks = document.querySelectorAll('.hsp-screener-chk');
  const countEl = document.getElementById('hspScreenerCount');
  const verdictEl = document.getElementById('hspScreenerVerdict');
  if (!chks.length || !countEl || !verdictEl) return;
  
  const verdicts = ${verdictsJson};
  
  function update() {
    let checked = 0;
    chks.forEach(function(c) {
      const parent = c.closest('.screener-item');
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

function deploy() {
  console.log('=== Deploying 30s HSP Screener across 12 locales ===');
  let updatedCount = 0;

  for (const [lang, loc] of Object.entries(LOCALES)) {
    const filePath = path.join(PORTAL_BLOG, lang, 'am-i-highly-sensitive-person-signs.html');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Update dateModified in meta and JSON-LD
    content = content.replace(
      /"dateModified":\s*"[^"]+"/,
      `"dateModified": "${TODAY}"`
    );

    // 2. Add CSS if not present
    if (!content.includes('.screener-box {')) {
      const styleCloseIdx = content.indexOf('</style>');
      if (styleCloseIdx !== -1) {
        content = content.slice(0, styleCloseIdx) + CSS_SNIPPET + '\n    ' + content.slice(styleCloseIdx);
      }
    }

    // 3. Replace .cta-box with screener
    const ctaBoxRegex = /<div class="cta-box">[\s\S]*?<\/div>/;
    if (ctaBoxRegex.test(content)) {
      const screenerHtml = buildHtmlSnippet(loc, lang);
      content = content.replace(ctaBoxRegex, screenerHtml);
    } else {
      console.warn(`cta-box not found in ${lang}`);
    }

    // 4. Add script before </body> if not present
    if (!content.includes('initHspScreener')) {
      const scriptHtml = buildScriptSnippet(loc);
      const bodyCloseIdx = content.lastIndexOf('</body>');
      if (bodyCloseIdx !== -1) {
        content = content.slice(0, bodyCloseIdx) + scriptHtml + '\n\n' + content.slice(bodyCloseIdx);
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[PASS] Deployed to ${lang}: am-i-highly-sensitive-person-signs.html`);
    updatedCount++;
  }

  // Update sitemap.xml
  if (fs.existsSync(SITEMAP_PATH)) {
    let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
    for (const lang of Object.keys(LOCALES)) {
      const targetUrl = `https://dopabrain.com/portal/blog/${lang}/am-i-highly-sensitive-person-signs.html`;
      const regex = new RegExp(`(<loc>${targetUrl.replace(/\//g, '\\/')}<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`);
      if (regex.test(sitemap)) {
        sitemap = sitemap.replace(regex, `$1${TODAY}$2`);
      }
    }
    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log(`[PASS] Updated blog/sitemap.xml lastmod to ${TODAY}`);
  }

  console.log(`=== Done! ${updatedCount} articles upgraded with interactive CRO screener ===`);
}

deploy();

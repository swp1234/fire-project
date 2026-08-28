#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const localeDir = path.resolve(__dirname, '..', 'projects', 'brain-type', 'js', 'locales');
const copy = {
  en: { start: 'Start the Free Quiz', retry: 'Try Again', title: 'Calculating your choice pattern...', steps: ['Reading your choices...', 'Comparing answer weights...', 'Grouping preference patterns...', 'Building your reflection profile...', 'Selecting the closest profile...', 'Profile ready!'], metrics: 'Profile Dimensions', stat: 'Your answers map most closely to 1 of 8 reflection profiles.' },
  ko: { start: '무료 퀴즈 시작', retry: '다시 하기', title: '선택 패턴을 계산하고 있어요...', steps: ['선택 내용을 읽는 중...', '답변 가중치를 비교하는 중...', '선호 패턴을 묶는 중...', '성찰용 프로필을 만드는 중...', '가장 가까운 프로필을 고르는 중...', '프로필 완성!'], metrics: '프로필 지표', stat: '답변 패턴과 가장 가까운 8가지 성찰용 프로필 중 하나입니다.' },
  ja: { start: '無料クイズを始める', retry: 'もう一度試す', title: '選択パターンを計算中...', steps: ['回答を読み取り中...', '回答の重みを比較中...', '好みのパターンを整理中...', '振り返り用プロフィールを作成中...', '最も近いプロフィールを選択中...', 'プロフィール完成！'], metrics: 'プロフィール指標', stat: '回答は8つの振り返り用プロフィールのうち1つに最も近いパターンです。' },
  zh: { start: '开始免费测验', retry: '再试一次', title: '正在计算你的选择模式…', steps: ['正在读取选择…', '正在比较答案权重…', '正在整理偏好模式…', '正在生成反思型资料…', '正在选择最接近的资料…', '资料已完成！'], metrics: '资料维度', stat: '你的答案最接近8种反思型资料中的一种。' },
  es: { start: 'Empezar el quiz gratis', retry: 'Intentar de nuevo', title: 'Calculando tu patrón de elección...', steps: ['Leyendo tus elecciones...', 'Comparando el peso de las respuestas...', 'Agrupando preferencias...', 'Creando tu perfil de reflexión...', 'Eligiendo el perfil más cercano...', '¡Perfil listo!'], metrics: 'Dimensiones del perfil', stat: 'Tus respuestas se aproximan a 1 de 8 perfiles de reflexión.' },
  pt: { start: 'Começar o quiz grátis', retry: 'Tentar novamente', title: 'Calculando seu padrão de escolhas...', steps: ['Lendo suas escolhas...', 'Comparando os pesos das respostas...', 'Agrupando preferências...', 'Criando seu perfil de reflexão...', 'Selecionando o perfil mais próximo...', 'Perfil pronto!'], metrics: 'Dimensões do perfil', stat: 'Suas respostas se aproximam de 1 dos 8 perfis de reflexão.' },
  id: { start: 'Mulai Kuis Gratis', retry: 'Coba Lagi', title: 'Menghitung pola pilihanmu...', steps: ['Membaca pilihanmu...', 'Membandingkan bobot jawaban...', 'Mengelompokkan pola preferensi...', 'Menyusun profil refleksi...', 'Memilih profil terdekat...', 'Profil siap!'], metrics: 'Dimensi Profil', stat: 'Jawabanmu paling dekat dengan 1 dari 8 profil refleksi.' },
  tr: { start: 'Ücretsiz Testi Başlat', retry: 'Tekrar Dene', title: 'Seçim örüntün hesaplanıyor...', steps: ['Seçimlerin okunuyor...', 'Yanıt ağırlıkları karşılaştırılıyor...', 'Tercih örüntüleri gruplanıyor...', 'Düşünme profilin oluşturuluyor...', 'En yakın profil seçiliyor...', 'Profil hazır!'], metrics: 'Profil Boyutları', stat: 'Yanıtların 8 düşünme profilinden 1’ine en yakın örüntüyü gösteriyor.' },
  de: { start: 'Kostenloses Quiz starten', retry: 'Erneut versuchen', title: 'Dein Auswahlmuster wird berechnet...', steps: ['Auswahl wird gelesen...', 'Antwortgewichte werden verglichen...', 'Präferenzmuster werden gruppiert...', 'Reflexionsprofil wird erstellt...', 'Nächstes Profil wird gewählt...', 'Profil ist fertig!'], metrics: 'Profildimensionen', stat: 'Deine Antworten passen am ehesten zu 1 von 8 Reflexionsprofilen.' },
  fr: { start: 'Commencer le quiz gratuit', retry: 'Réessayer', title: 'Calcul de votre schéma de choix...', steps: ['Lecture de vos choix...', 'Comparaison du poids des réponses...', 'Regroupement des préférences...', 'Création du profil de réflexion...', 'Sélection du profil le plus proche...', 'Profil prêt !'], metrics: 'Dimensions du profil', stat: 'Vos réponses se rapprochent de 1 des 8 profils de réflexion.' },
  hi: { start: 'मुफ़्त क्विज़ शुरू करें', retry: 'फिर से आज़माएँ', title: 'आपके चुनाव पैटर्न की गणना हो रही है...', steps: ['चुनाव पढ़े जा रहे हैं...', 'उत्तर भार की तुलना हो रही है...', 'पसंद के पैटर्न जोड़े जा रहे हैं...', 'रिफ्लेक्शन प्रोफ़ाइल बन रही है...', 'सबसे नज़दीकी प्रोफ़ाइल चुनी जा रही है...', 'प्रोफ़ाइल तैयार!'], metrics: 'प्रोफ़ाइल आयाम', stat: 'आपके उत्तर 8 रिफ्लेक्शन प्रोफ़ाइल में से 1 के सबसे करीब हैं।' },
  ru: { start: 'Начать бесплатный тест', retry: 'Попробовать снова', title: 'Рассчитываем ваш паттерн выбора...', steps: ['Читаем ваши ответы...', 'Сравниваем веса ответов...', 'Группируем предпочтения...', 'Создаём профиль для самоанализа...', 'Выбираем ближайший профиль...', 'Профиль готов!'], metrics: 'Параметры профиля', stat: 'Ваши ответы ближе всего к 1 из 8 профилей для самоанализа.' },
};

for (const [lang, text] of Object.entries(copy)) {
  const file = path.join(localeDir, `${lang}.json`);
  const locale = JSON.parse(fs.readFileSync(file, 'utf8'));
  locale.button.start = text.start;
  locale.button.retry = text.retry;
  [locale.analyzing.mapping, locale.analyzing.synapses, locale.analyzing.patterns, locale.analyzing.cognitive, locale.analyzing.finalizing, locale.analyzing.complete] = text.steps;
  locale.analyzing.title = text.title;
  locale.result.neural_metrics = text.metrics;
  delete locale.result.percentileStat;
  locale.result.profileStat = text.stat;
  fs.writeFileSync(file, `${JSON.stringify(locale, null, 2)}\n`, 'utf8');
}

console.log(`Updated ${Object.keys(copy).length} brain-type trust locales.`);

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const localeDir = path.resolve(__dirname, '..', 'projects', 'root-domain', 'js', 'locales');
const signals = {
  en: { label: 'Fresh culture signal', badge: 'Korean edition', title: 'Why The Odyssey and Spider-Man ruled 2026', desc: 'A spoiler-free look at return, memory and identity reset — then connect the story to your own choice pattern.', cta: 'Read the signal →' },
  ko: { label: '새로운 문화 시그널', badge: '한국어', title: '오딧세이와 스파이더맨이 2026년 극장을 장악한 이유', desc: '귀환, 기억, 정체성 리셋을 스포일러 없이 읽고 내 선택 패턴까지 연결합니다.', cta: '시그널 읽기 →' },
  ja: { label: 'カルチャーシグナル', badge: '韓国語版', title: '『オデッセイ』とスパイダーマンが2026年を制した理由', desc: '帰還・記憶・アイデンティティの再構築を、ネタバレなしで読み解きます。', cta: '記事を読む →' },
  es: { label: 'Nueva señal cultural', badge: 'Edición coreana', title: 'Por qué The Odyssey y Spider-Man dominaron 2026', desc: 'Un análisis sin spoilers sobre regreso, memoria y reinicio de identidad.', cta: 'Leer la señal →' },
  pt: { label: 'Novo sinal cultural', badge: 'Edição coreana', title: 'Por que The Odyssey e Spider-Man dominaram 2026', desc: 'Uma leitura sem spoilers sobre retorno, memória e reinício de identidade.', cta: 'Ler o sinal →' },
  zh: { label: '最新文化信号', badge: '韩文版', title: '《奥德赛》和蜘蛛侠为何称霸2026年', desc: '无剧透解析归来、记忆与身份重启，并连接你的选择模式。', cta: '阅读文章 →' },
  id: { label: 'Sinyal budaya terbaru', badge: 'Edisi Korea', title: 'Mengapa The Odyssey dan Spider-Man menguasai 2026', desc: 'Ulasan tanpa spoiler tentang kepulangan, ingatan, dan reset identitas.', cta: 'Baca sinyal →' },
  tr: { label: 'Yeni kültür sinyali', badge: 'Korece sürüm', title: 'The Odyssey ve Spider-Man 2026’ya neden damga vurdu?', desc: 'Dönüş, hafıza ve kimlik sıfırlaması üzerine spoilersız bir okuma.', cta: 'Yazıyı oku →' },
  de: { label: 'Neues Kultursignal', badge: 'Koreanische Ausgabe', title: 'Warum The Odyssey und Spider-Man 2026 dominierten', desc: 'Eine spoilerfreie Analyse über Rückkehr, Erinnerung und Identitätsneustart.', cta: 'Signal lesen →' },
  fr: { label: 'Nouveau signal culturel', badge: 'Édition coréenne', title: 'Pourquoi The Odyssey et Spider-Man ont dominé 2026', desc: 'Une lecture sans spoilers du retour, de la mémoire et du renouveau identitaire.', cta: 'Lire le signal →' },
  hi: { label: 'नया कल्चर सिग्नल', badge: 'कोरियाई संस्करण', title: 'The Odyssey और Spider-Man ने 2026 पर राज क्यों किया', desc: 'वापसी, याद और पहचान के रीसेट पर बिना स्पॉइलर की पड़ताल।', cta: 'लेख पढ़ें →' },
  ru: { label: 'Новый культурный сигнал', badge: 'Корейская версия', title: 'Почему The Odyssey и Spider-Man покорили 2026 год', desc: 'Без спойлеров: возвращение, память и перезапуск личности.', cta: 'Читать материал →' },
};

for (const [lang, signal] of Object.entries(signals)) {
  const file = path.join(localeDir, `${lang}.json`);
  const locale = JSON.parse(fs.readFileSync(file, 'utf8'));
  locale.signal = signal;
  fs.writeFileSync(file, `${JSON.stringify(locale, null, 2)}\n`, 'utf8');
}

console.log(`Updated ${Object.keys(signals).length} root signal locales.`);

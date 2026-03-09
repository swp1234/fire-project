const CACHE_NAME = '__APP_SLUG__-v1';
const ASSETS = [
  '/__APP_SLUG__/',
  '/__APP_SLUG__/index.html',
  '/__APP_SLUG__/css/style.css',
  '/__APP_SLUG__/js/app.js',
  '/__APP_SLUG__/js/i18n.js',
  '/__APP_SLUG__/js/locales/ko.json',
  '/__APP_SLUG__/js/locales/en.json',
  '/__APP_SLUG__/js/locales/ja.json',
  '/__APP_SLUG__/js/locales/zh.json',
  '/__APP_SLUG__/js/locales/hi.json',
  '/__APP_SLUG__/js/locales/ru.json',
  '/__APP_SLUG__/js/locales/es.json',
  '/__APP_SLUG__/js/locales/pt.json',
  '/__APP_SLUG__/js/locales/id.json',
  '/__APP_SLUG__/js/locales/tr.json',
  '/__APP_SLUG__/js/locales/de.json',
  '/__APP_SLUG__/js/locales/fr.json',
  '/__APP_SLUG__/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

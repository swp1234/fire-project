// Service Worker for BMI Calculator

const CACHE_NAME = 'bmi-calculator-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './js/app.js',
    './js/i18n.js',
    './js/locales/ko.json',
    './js/locales/en.json',
    './js/locales/zh.json',
    './js/locales/hi.json',
    './js/locales/ru.json',
    './js/locales/ja.json',
    './js/locales/es.json',
    './js/locales/pt.json',
    './js/locales/id.json',
    './js/locales/tr.json',
    './js/locales/de.json',
    './js/locales/fr.json',
    './icon-192.svg',
    './icon-512.svg'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // Return cached version if network fails
                return caches.match(event.request)
                    .then(response => {
                        return response || caches.match('./index.html');
                    });
            })
    );
});

// Push notification event (optional)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: './icon-192.svg',
            badge: './icon-192.svg'
        };

        event.waitUntil(
            self.registration.showNotification('BMI Calculator', options)
        );
    }
});

// Background sync event (optional)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    try {
        // Sync logic here
        console.log('Background sync completed');
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

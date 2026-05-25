const CACHE = 'thm-notes-v1';

const PRECACHE = [
  '/tryhackme/',
  '/tryhackme/networking/',
  '/tryhackme/nmap/',
  '/tryhackme/mac-addresses/',
  '/tryhackme/web-recon/',
  '/tryhackme/defenses/',
];

// Pre-cache all known pages on install
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting(); // activate immediately, don't wait for old tabs to close
});

// Remove old caches when a new version activates
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // take control of already-open pages
});

// Stale-while-revalidate: serve from cache instantly, update in background
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached); // offline: fall back to cache

        return cached ?? fresh; // if cached: return immediately, refresh in background
      })
    )
  );
});

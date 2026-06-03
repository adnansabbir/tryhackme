const CACHE = 'thm-notes-v11';

const PRECACHE = [
  '/tryhackme/',
  '/tryhackme/linux/',
  '/tryhackme/linux-basics/',
  '/tryhackme/linux-system/',
  '/tryhackme/vim/',
  '/tryhackme/windows/',
  '/tryhackme/windows-basics/',
  '/tryhackme/networking/',
  '/tryhackme/networking-basics/',
  '/tryhackme/mac-addresses/',
  '/tryhackme/recon/',
  '/tryhackme/nmap/',
  '/tryhackme/web-recon/',
  '/tryhackme/search-skills/',
  '/tryhackme/defenses/',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);

        return cached ?? fresh;
      })
    )
  );
});

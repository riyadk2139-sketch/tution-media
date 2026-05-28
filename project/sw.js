// Tution Media — service worker. Network-first so the latest code shows when
// online, with a cache fallback so the installed PWA still opens offline.
const CACHE = 'tm-v2';

// Paths are relative to this SW's location (…/tution-media/project/), so they
// resolve correctly under the GitHub Pages subpath.
const PRECACHE = [
  'Tution%20Media%20-%20Tutor%20App.html',
  'manifest.json',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
  'vendor/react.development.js',
  'vendor/react-dom.development.js',
  'vendor/babel.min.js',
  'src/tokens.jsx',
  'src/ui.jsx',
  'src/data.jsx',
  'src/store.jsx',
  'src/android-frame.jsx',
  'src/design-canvas.jsx',
  'src/tweaks-panel.jsx',
  'src/screens-a.jsx',
  'src/screens-b.jsx',
  'src/screens-c.jsx',
  'src/screens-guardian.jsx',
  'src/screens-extra.jsx',
  'src/mobile-app.jsx',
  'src/app.jsx',
];

self.addEventListener('install', e =>
  e.waitUntil(
    caches.open(CACHE)
      // Don't let one missing file abort the whole install.
      .then(c => Promise.allSettled(PRECACHE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  )
);

self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
);

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Only manage same-origin requests; let CDNs (fonts) hit the network directly.
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(c => c || caches.match('Tution%20Media%20-%20Tutor%20App.html')))
  );
});

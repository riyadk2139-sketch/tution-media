const CACHE = 'tm-v1';
const PRECACHE = [
  '/Tution%20Media%20-%20Tutor%20App.html',
  '/vendor/react.development.js',
  '/vendor/react-dom.development.js',
  '/vendor/babel.min.js',
  '/src/tokens.jsx',
  '/src/ui.jsx',
  '/src/data.jsx',
  '/src/android-frame.jsx',
  '/src/design-canvas.jsx',
  '/src/tweaks-panel.jsx',
  '/src/screens-a.jsx',
  '/src/screens-b.jsx',
  '/src/screens-c.jsx',
  '/src/screens-guardian.jsx',
  '/src/app.jsx',
];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
);

self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
);

self.addEventListener('fetch', e =>
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  )
);

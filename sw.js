/* Service worker du « Tableau magique » : fait fonctionner le portail et tous ses outils sans internet,
   et installe automatiquement les nouvelles versions.
   Le numéro de version vient de version.js (seul fichier à modifier à chaque nouvelle version).
   M. Guitton — fichier mis au point avec l'aide de Claude AI. */
importScripts('version.js', 'outils.js');
const CACHE = 'tableau-magique-' + self.APP_VERSION;

/* Tous les fichiers à garder pour le hors ligne : ceux du portail, puis ceux de chaque outil,
   tirés de la liste outils.js (rien à modifier ici pour ajouter un outil). */
const FILES = [
  './', 'version.js', 'outils.js', 'portail.js', 'manifest.webmanifest', 'fonts/fredoka.woff2',
  'icone-tbi-192.png', 'icone-tbi-512.png', 'icone-tbi-maskable-512.png', 'icone-tbi-apple.png', 'icone-tbi-favicon.png',
  ...self.OUTILS.flatMap(o => [
    './' + o.dossier + '/',
    'images/' + o.dossier + '.jpg',
    ...(o.fichiers || []).map(f => './' + o.dossier + '/' + f)
  ])
];

/* Installation : on télécharge toute la nouvelle version (sans passer par le cache du navigateur),
   puis on l'active tout de suite. */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

/* Activation : on supprime les anciennes versions. */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('tableau-magique-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Utilisation : tout vient du cache (donc aussi sans connexion).
   « dossier/index.html » et « dossier/ » désignent la même page. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;               // liens externes (licence…) : laissés au navigateur
  const cle = url.pathname.endsWith('/index.html') ? url.pathname.slice(0, -10) : url.pathname;
  e.respondWith(
    caches.match(cle, { ignoreSearch: true })
      .then(r => r || fetch(e.request))
      .catch(() => caches.match('./'))
  );
});

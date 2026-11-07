/* Service worker du « Tableau magique » : fait fonctionner le portail et tous ses outils sans internet,
   et installe automatiquement les nouvelles versions.
   Mise à jour outil par outil : chaque outil a sa propre réserve (cache), nommée avec son numéro de version
   (outils.js). Quand un numéro change, seul cet outil est retéléchargé ; les autres réserves sont gardées.
   La réserve du portail (accueil, icônes, police, scripts communs) suit le numéro de version.js.
   M. Guitton — fichier mis au point avec l'aide de Claude AI. */
importScripts('version.js', 'outils.js');
const PREFIXE = 'tableau-magique-';

/* Empreinte de la liste des outils : elle change dès qu'un outil est ajouté, retiré ou mis à jour */
const texteListe = JSON.stringify(self.OUTILS);
let empreinte = 0;
for (let i = 0; i < texteListe.length; i++) empreinte = (empreinte * 31 + texteListe.charCodeAt(i)) | 0;

/* Les réserves attendues : nom → liste des fichiers */
const RESERVES = {
  [PREFIXE + 'liste-' + (empreinte >>> 0).toString(36)]: ['outils.js'],
  [PREFIXE + 'portail-' + self.APP_VERSION]: [
    './', 'version.js', 'portail.js', 'manifest.webmanifest', 'fonts/fredoka.woff2',
    'icone-tbi-192.png', 'icone-tbi-512.png', 'icone-tbi-maskable-512.png', 'icone-tbi-apple.png', 'icone-tbi-favicon.png'
  ]
};
self.OUTILS.forEach(o => {
  RESERVES[PREFIXE + o.dossier + '-' + o.version] = [
    './' + o.dossier + '/',
    'images/' + o.dossier + '.jpg',
    ...(o.fichiers || []).map(f => './' + o.dossier + '/' + f)
  ];
});

/* Remplit une réserve, sauf si elle est déjà complète (outil inchangé) */
async function remplir(nom, fichiers) {
  const c = await caches.open(nom);
  if ((await c.keys()).length >= fichiers.length) return;
  await c.addAll(fichiers.map(f => new Request(f, { cache: 'reload' })));   // sans passer par le cache du navigateur
}

/* Installation : on ne télécharge que ce qui a changé, puis on active tout de suite. */
self.addEventListener('install', e => {
  e.waitUntil(
    Promise.all(Object.entries(RESERVES).map(([nom, fichiers]) => remplir(nom, fichiers)))
      .then(() => self.skipWaiting())
  );
});

/* Activation : on supprime les réserves des anciennes versions. */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n.startsWith(PREFIXE) && !(n in RESERVES)).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/* Utilisation : tout vient des réserves (donc aussi sans connexion).
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

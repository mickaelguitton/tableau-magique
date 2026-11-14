/* Lien entre un outil et le portail « Le tableau magique ».
   Chargé par le portail ET par chaque outil (<script src="../portail.js">).
   - affiche le numéro de version (venu de version.js) dans la signature ;
   - affiche les boutons « Accueil » (cachés quand l'outil est ouvert seul, hors du portail) ;
   - gère la page d'accueil du site : « Installer l'application » ou « Découvrir en ligne » ;
   - envoie des statistiques anonymes d'utilisation (aucun affichage) ;
   - active le fonctionnement hors ligne et la mise à jour automatique.
   M. Guitton — fichier mis au point avec l'aide de Claude AI. */
(function () {
  const racine = new URL('./', document.currentScript.src);          // adresse du portail
  const enLigne = /^https?:$/.test(location.protocol);

  /* 1. On est dans le portail : les boutons « Accueil » deviennent visibles */
  document.documentElement.classList.add('dans-portail');

  /* 2. Trois façons d'arriver :
     - dans l'APPLI INSTALLÉE : les tuiles s'affichent directement ;
     - sur le SITE, dans un onglet : la page d'accueil (titre, « Installer l'application », « Découvrir en ligne »,
       aperçus des outils) s'affiche à chaque nouvelle visite (classe « bienvenue », voir index.html) ;
     - après « Découvrir en ligne » : les tuiles et les outils s'utilisent dans l'onglet, jusqu'à sa fermeture
       (marque gardée en mémoire de session ; classe « en-ligne »).
     Un outil ouvert directement (lien partagé, moteur de recherche) s'utilise tout de suite, comme après
     « Découvrir en ligne » : son bouton « Accueil » mène aux tuiles et au bouton « Installer l'application ».
     Le fichier ouvert depuis le disque (file://) n'est pas concerné. */
  const dansAppli = ['fullscreen', 'standalone', 'minimal-ui', 'window-controls-overlay']
    .some(m => matchMedia('(display-mode: ' + m + ')').matches) || navigator.standalone === true;
  const surAccueil = new URL('./', location.href).href === racine.href;
  // Titre de la page : long pour les moteurs de recherche, court (data-court) dans l'appli et les statistiques
  const titreCourt = (document.querySelector('title') || {}).dataset?.court || document.title;
  if (dansAppli) document.title = titreCourt;
  let modeEnLigne = false;
  try { modeEnLigne = sessionStorage.getItem('tableau-en-ligne') === '1'; } catch (e) {}
  // Sur l'accueil, les tuiles ne restent affichées que si l'on revient d'un outil (bouton « Accueil »,
  // retour arrière) ou si l'on recharge la page. Adresse tapée, favori, lien venu d'ailleurs :
  // la page d'accueil (« Installer l'application » / « Découvrir en ligne ») s'affiche à nouveau.
  if (modeEnLigne && surAccueil && !dansAppli) {
    const nav = (performance.getEntriesByType('navigation')[0] || {}).type;
    const depuisPortail = document.referrer.startsWith(racine.href);
    if (!depuisPortail && nav !== 'reload' && nav !== 'back_forward') {
      modeEnLigne = false;
      try { sessionStorage.removeItem('tableau-en-ligne'); } catch (e) {}
    }
  }
  // L'appli installée laisse une marque (même site = même mémoire) : l'onglet du navigateur
  // saura ainsi qu'elle est déjà installée sur cet ordinateur.
  if (enLigne && dansAppli) { try { localStorage.setItem('tableau-installe', '1'); } catch (e) {} }
  if (enLigne && !dansAppli) {
    if (!surAccueil && !modeEnLigne) {
      try { sessionStorage.setItem('tableau-en-ligne', '1'); } catch (e) {}
      modeEnLigne = true;
    }
    document.documentElement.classList.add(modeEnLigne ? 'en-ligne' : 'bienvenue');
    // Chrome / Edge / Brave proposent l'installation par cet événement, parfois très tôt :
    // on le garde de côté pour le bouton « Installer l'application ».
    addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      window.propositionInstall = e;
      document.dispatchEvent(new Event('installation-possible'));
    });
  }
  /* Utilisé par la page d'accueil : passer en mode « Découvrir en ligne », ou revenir à l'accueil */
  window.TableauMagique = {
    decouvrirEnLigne() {
      try { sessionStorage.setItem('tableau-en-ligne', '1'); } catch (e) {}
      document.documentElement.classList.replace('bienvenue', 'en-ligne');
      modeEnLigne = true;
      compterPage();
    },
    revenirAccueil() {
      try { sessionStorage.removeItem('tableau-en-ligne'); } catch (e) {}
      document.documentElement.classList.replace('en-ligne', 'bienvenue');
      modeEnLigne = false;
      compterPage();
    }
  };

  /* 2 bis. Téléphone tenu en portrait (appli installée, ou outils utilisés en ligne) : message « Tourne ton téléphone ».
     Les outils sont pensés pour l'écran projeté, donc pour le paysage. Seuls les petits écrans tactiles
     sont concernés (téléphones) : les tablettes et les ordinateurs ne voient jamais ce message.
     La page d'accueil (avant le choix) n'est pas concernée : on peut installer en portrait. */
  if (enLigne) {
    const style = document.createElement('style');
    style.textContent = `
      #tourne-telephone{display:none}
      @media (orientation:portrait) and (max-width:599px) and (pointer:coarse){
        html:not(.bienvenue) #tourne-telephone{
          display:flex;position:fixed;inset:0;z-index:2147483647;flex-direction:column;align-items:center;justify-content:center;
          gap:24px;padding:32px;text-align:center;color:#26215c;font:600 24px 'Fredoka',system-ui,sans-serif;
          background:linear-gradient(120deg,#DDEFFF 0%,#E9E3FF 50%,#FFE6F1 100%);
        }
        #tourne-telephone svg{width:120px;height:120px;animation:tourne-tel 2.4s ease-in-out infinite}
        #tourne-telephone small{display:block;margin-top:8px;font-size:17px;line-height:1.35;font-weight:500;color:#5B6785}
      }
      @keyframes tourne-tel{0%,25%{transform:rotate(0)}55%,85%{transform:rotate(-90deg)}100%{transform:rotate(0)}}
      @media (prefers-reduced-motion:reduce){#tourne-telephone svg{animation:none;transform:rotate(-90deg)}}`;
    document.head.appendChild(style);
    const poser = () => {
      const d = document.createElement('div');
      d.id = 'tourne-telephone';
      d.setAttribute('role', 'alert');
      d.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="18" y="6" width="28" height="52" rx="6" fill="#fff" stroke="#8E6CEF" stroke-width="4"/>'
        + '<rect x="23" y="13" width="18" height="34" rx="2" fill="#E9E3FF"/><circle cx="32" cy="52" r="2.5" fill="#8E6CEF"/></svg>'
        + '<div>Tourne ton téléphone<br><small>Le tableau magique s’utilise en mode paysage.</small></div>';
      document.body.appendChild(d);
    };
    if (document.body) poser(); else document.addEventListener('DOMContentLoaded', poser);
  }

  /* 3. Numéro de version dans la signature : celui de l'outil (outils.js), ou celui du portail sur l'accueil */
  function afficherVersion() {
    const dossier = location.pathname.replace(racine.pathname, '').split('/')[0];
    const outil = (self.OUTILS || []).find(o => o.dossier === dossier);
    const version = outil ? outil.version : (typeof APP_VERSION !== 'undefined' ? APP_VERSION : null);
    if (!version) return;
    document.querySelectorAll('.app-version').forEach(e => { e.textContent = ' – v' + version; });
    const vnum = document.getElementById('vnum');                    // ligne existante du calcul mental
    if (vnum) vnum.textContent = ' – v' + version;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afficherVersion);
  else afficherVersion();

  /* 3 bis. « À propos de l'outil » : chaque outil a, en fin de page, une présentation pour les collègues
     (<dialog id="aPropos">, lisible aussi par les moteurs de recherche) et un lien dans sa signature
     (bouton data-a-propos). Ici : la mise en forme commune, aux couleurs de l'outil, et l'ouverture / fermeture. */
  function brancherAPropos() {
    const fenetre = document.getElementById('aPropos');
    if (!fenetre) return;
    const dossier = location.pathname.replace(racine.pathname, '').split('/')[0];
    const outil = (self.OUTILS || []).find(o => o.dossier === dossier) || {};
    const c = outil.couleur || '#6A4BD1';
    const style = document.createElement('style');
    style.textContent = `
      .lien-a-propos{all:unset;cursor:pointer;font-weight:700;text-decoration:underline;color:${c}}
      .lien-a-propos:focus-visible{outline:2px solid ${c};outline-offset:2px}
      #aPropos{position:fixed!important;inset:0!important;margin:auto!important;height:fit-content;border:none!important;border-radius:22px;padding:0!important;width:min(760px,94vw)!important;max-width:none!important;max-height:88vh;color:#222!important;background:#fff!important;
        box-shadow:0 10px 40px rgba(0,0,0,.25);font:16px/1.5 "Segoe UI","Helvetica Neue",Arial,sans-serif;text-align:left}
      #aPropos article:focus,#aPropos:focus{outline:none}
      #aPropos::backdrop{background:rgba(0,0,0,.4)}
      #aPropos article{margin:0;border:none;background:none;box-shadow:none;padding:24px 30px 8px;overflow-y:auto;max-height:calc(88vh - 70px);box-sizing:border-box}
      #aPropos h2{margin:0 0 4px;color:${c};font-weight:700;font-size:1.5rem;line-height:1.25;font-family:inherit;text-shadow:none;letter-spacing:0}
      #aPropos .chapeau{margin:0 0 10px;font-weight:600;color:#444}
      #aPropos h3{margin:18px 0 4px;color:${c};font-weight:700;font-size:1.08rem;line-height:1.3;font-family:inherit;text-shadow:none;letter-spacing:0}
      #aPropos p,#aPropos li{font-size:.98rem;color:#222;margin:4px 0}
      #aPropos ul{margin:4px 0;padding-left:1.3em;list-style:disc}
      #aPropos b{color:#111}
      #aPropos .bas{display:flex;justify-content:flex-end;padding:10px 22px 16px;border-top:2px solid #eee}
      #aPropos .bas button{all:unset;cursor:pointer;border-radius:999px;padding:9px 20px;background:${c};color:#fff;font-weight:700}`;
    document.head.appendChild(style);
    document.querySelectorAll('[data-a-propos]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      fenetre.showModal();
    }));
    fenetre.querySelector('[data-fermer-a-propos]').addEventListener('click', () => fenetre.close());
    fenetre.addEventListener('click', e => { if (e.target === fenetre) fenetre.close(); });   // clic à côté
    // Les touches tapées dans la fenêtre ne pilotent pas l'outil (Espace, flèches…) ; Échap la ferme
    fenetre.addEventListener('keydown', e => e.stopPropagation());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancherAPropos);
  else brancherAPropos();

  /* 4. Statistiques anonymes (GoatCounter, tableau de bord : https://cartable-magique.goatcounter.com)
     Rien n'est affiché dans l'appli. Aucune donnée personnelle, aucun cookie, aucun identifiant :
     - « Installation »        : quelqu'un vient d'installer l'appli ;
     - « Nouvel ordinateur »   : première ouverture de l'appli sur un ordinateur (envoyé une seule fois par ordinateur) ;
     - pages « /accueil », « /calcul-mental »… : chaque ouverture du portail ou d'un outil dans l'appli ;
     - pages « /bienvenue » : la page d'accueil du site (avant le choix « Installer » / « Découvrir en ligne ») ;
     - pages « /en-ligne/accueil », « /en-ligne/calcul-mental »… : le même usage, sans installation.
     Le nombre de « Nouvel ordinateur » = nombre d'ordinateurs différents qui utilisent l'appli.
     Sans internet, rien n'est envoyé (l'appli fonctionne normalement). */
  const STATS = 'https://cartable-magique.goatcounter.com/count';
  function compter(chemin, titre, evenement, quandEnvoye) {
    if (!enLigne || !navigator.onLine) return;
    const img = new Image();
    if (quandEnvoye) img.onload = quandEnvoye;
    img.src = STATS + '?p=' + encodeURIComponent(chemin) + '&t=' + encodeURIComponent(titre)
            + (evenement ? '&e=true' : '') + '&rnd=' + Math.random().toString(36).slice(2);
  }
  addEventListener('appinstalled', () => compter('installation', 'Installation de l’appli', true));
  /* Ouverture de la page en cours (accueil ou outil), selon la façon d'utiliser le tableau magique */
  function compterPage() {
    if (!enLigne) return;
    const page = surAccueil ? 'accueil' : location.pathname.replace(racine.pathname, '').replace(/\/(index\.html)?$/, '');
    if (dansAppli) compter('/' + page, titreCourt || page, false);
    else if (modeEnLigne) compter('/en-ligne/' + page, 'En ligne : ' + (titreCourt || page), false);
    else compter('/bienvenue', 'Page d’accueil (avant installation)', false);
  }
  compterPage();
  if (enLigne && dansAppli) {
    // Une seule fois par ordinateur : la marque n'est posée qu'une fois l'envoi réussi
    let dejaCompte = false;
    // (clé héritée de l'ancien nom « Le cartable magique » : un appareil déjà compté ne l'est pas une 2e fois)
    try { dejaCompte = localStorage.getItem('cartable-compte') === '1'; } catch (e) {}
    if (!dejaCompte) compter('nouvel-ordinateur', 'Nouvel ordinateur', true,
      () => { try { localStorage.setItem('cartable-compte', '1'); } catch (e) {} });
  }

  /* 5. Hors ligne et mise à jour automatique (seulement sur le site hébergé) */
  if (!enLigne || !('serviceWorker' in navigator)) return;
  const avaitVersion = !!navigator.serviceWorker.controller;          // faux à la toute première visite
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Nouvelle version installée : l'accueil se recharge tout de suite ;
    // dans un outil, on ne coupe pas l'activité : la nouvelle version servira au prochain retour à l'accueil.
    if (avaitVersion && surAccueil) location.reload();
  });
  navigator.serviceWorker.register(new URL('sw.js', racine), { scope: racine.pathname, updateViaCache: 'none' })
    .then(reg => {
      const verifier = () => { if (navigator.onLine) reg.update().catch(() => {}); };
      verifier();
      setInterval(verifier, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) verifier(); });
    })
    .catch(() => {});
})();

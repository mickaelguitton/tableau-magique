/* SAUVEGARDE UNIQUE du « Tableau magique » : toutes les données de tous les outils dans un seul fichier.
   - « Sauvegarder mes données » : télécharge un fichier .json avec tout ce que les outils ont enregistré
     dans ce navigateur (listes d'élèves, phrases, séances, réglages…).
   - « Restaurer une sauvegarde » : relit ce fichier sur un autre appareil, montre ce qu'il contient,
     puis, après confirmation, remplace les données de cet appareil.
   Un nouvel outil est pris en compte automatiquement (tout le contenu du navigateur pour ce site est sauvegardé).
   M. Guitton — fichier mis au point avec l'aide de Claude AI. */
(function () {
  'use strict';

  const TYPE = 'sauvegarde-tableau-magique';
  const FORMAT = 1;
  // marques propres à l'appareil, jamais sauvegardées ni remplacées
  const PROPRES_APPAREIL = ['tableau-installe', 'cartable-compte'];

  /* ---------- 1. Lire et écrire la mémoire du navigateur ---------- */
  function lireTout() {
    const donnees = {};
    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (!PROPRES_APPAREIL.includes(cle)) donnees[cle] = localStorage.getItem(cle);
    }
    return donnees;
  }
  function remplacerTout(donnees) {
    const aEffacer = [];
    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (!PROPRES_APPAREIL.includes(cle)) aEffacer.push(cle);
    }
    aEffacer.forEach(cle => localStorage.removeItem(cle));
    Object.entries(donnees).forEach(([cle, valeur]) => {
      if (!PROPRES_APPAREIL.includes(cle) && typeof valeur === 'string') localStorage.setItem(cle, valeur);
    });
  }

  /* ---------- 2. Résumé lisible : quels outils ont des données ---------- */
  function resumer(donnees) {
    const noms = [];
    let autres = 0;
    Object.keys(donnees).forEach(cle => {
      const outil = (self.OUTILS || []).find(o => (o.donnees || []).some(d => cle.startsWith(d)));
      if (outil) { if (!noms.includes(outil.nom)) noms.push(outil.nom); }
      else autres++;
    });
    // dans l'ordre des tuiles
    const ordre = (self.OUTILS || []).map(o => o.nom);
    noms.sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b));
    if (autres) noms.push('autres réglages');
    return noms;
  }
  const dateLisible = iso => {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                         + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  /* ---------- 3. Sauvegarder : téléchargement du fichier ---------- */
  function sauvegarder() {
    const donnees = lireTout();
    if (!Object.keys(donnees).length) { message('Rien à sauvegarder pour l’instant : aucun outil n’a encore enregistré de données sur cet appareil.'); return; }
    const contenu = {
      type: TYPE, format: FORMAT, date: new Date().toISOString(),
      portail: typeof APP_VERSION !== 'undefined' ? APP_VERSION : '', donnees
    };
    const jour = new Date().toLocaleDateString('fr-CA');               // 2026-11-07
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(new Blob([JSON.stringify(contenu, null, 1)], { type: 'application/json' }));
    lien.download = 'tableau-magique-sauvegarde-' + jour + '.json';
    document.body.appendChild(lien); lien.click(); lien.remove();
    setTimeout(() => URL.revokeObjectURL(lien.href), 4000);
    message('Sauvegarde téléchargée : ' + lien.download + ' (' + resumer(donnees).join(', ') + ').');
  }

  /* ---------- 4. Restaurer : lecture, résumé, confirmation ---------- */
  let enAttente = null;
  function lireFichier(fichier) {
    const lecteur = new FileReader();
    lecteur.onload = () => {
      let contenu = null;
      try { contenu = JSON.parse(lecteur.result); } catch (e) {}
      if (!contenu || contenu.type !== TYPE || typeof contenu.donnees !== 'object' || !contenu.donnees) {
        message('Ce fichier n’est pas une sauvegarde du Tableau magique. Rien n’a été modifié.'); return;
      }
      enAttente = contenu.donnees;
      const quand = dateLisible(contenu.date);
      const noms = resumer(enAttente);
      document.getElementById('resume-sauvegarde').textContent =
        'Sauvegarde' + (quand ? ' du ' + quand : '') + ' : ' + (noms.length ? noms.join(', ') : 'aucune donnée') + '.';
      montrer('confirmation');
    };
    lecteur.onerror = () => message('Impossible de lire ce fichier. Rien n’a été modifié.');
    lecteur.readAsText(fichier);
  }
  function restaurer() {
    if (!enAttente) return;
    try { remplacerTout(enAttente); }
    catch (e) { message('La restauration n’a pas pu se faire (mémoire du navigateur pleine ou bloquée).'); return; }
    location.reload();                                                  // tout s'affiche avec les données restaurées
  }

  /* ---------- 5. Affichage dans la fenêtre « Données sur cet appareil » ---------- */
  function montrer(partie) {
    document.getElementById('donnees-infos').hidden = partie !== 'infos';
    document.getElementById('donnees-confirmation').hidden = partie !== 'confirmation';
    if (partie === 'infos') enAttente = null;
  }
  function message(texte) {
    const m = document.getElementById('donnees-message');
    m.textContent = texte; m.hidden = !texte;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const choix = document.getElementById('fichier-sauvegarde');
    if (!choix) return;
    document.getElementById('sauver').addEventListener('click', () => { message(''); sauvegarder(); });
    document.getElementById('restaurer').addEventListener('click', () => { message(''); choix.value = ''; choix.click(); });
    choix.addEventListener('change', () => { if (choix.files[0]) lireFichier(choix.files[0]); });
    document.getElementById('confirmer-restauration').addEventListener('click', restaurer);
    document.getElementById('annuler-restauration').addEventListener('click', () => { montrer('infos'); message(''); });
    // à chaque réouverture de la fenêtre : retour aux explications
    document.getElementById('donnees').addEventListener('click', () => { montrer('infos'); message(''); });
  });
})();

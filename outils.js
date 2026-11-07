/* LISTE DES OUTILS du « Tableau magique » — le seul endroit à modifier pour ajouter ou retirer un outil.
   À partir de cette liste sont fabriqués automatiquement :
   - les tuiles du portail (appli installée et « Découvrir en ligne ») ;
   - les aperçus et leurs bulles d'explication sur la page d'accueil ;
   - la liste des fichiers gardés pour le fonctionnement hors ligne (sw.js).

   POUR AJOUTER UN OUTIL :
   1. créer son dossier (ex. frise/) avec son index.html (copier les lignes « Portail » du <head> d'un autre outil) ;
   2. mettre sa capture d'écran dans images/ (format 16/9, ex. 800 × 450) ;
   3. ajouter un bloc ci-dessous, dans l'ordre d'affichage voulu ;
   4. changer le numéro dans version.js.

   M. Guitton — fichier mis au point avec l'aide de Claude AI. */
self.OUTILS = [
  {
    dossier: 'calcul-mental',
    nom: 'Calcul mental',
    niveau: 'du CP au CM2',
    texte: 'Compétences du programme. Projection de calculs au tableau. Les élèves répondent sur leur ardoise. '
         + 'Correction au tableau. Chrono. Différentes options. Impression de fiches personnalisées.',
    couleur: '#3D6FD9', ombre: '#B7D3FB'
  },
  {
    dossier: 'gym-des-mots',
    nom: 'La gym des mots',
    niveau: 'cycles 2 et 3',
    texte: 'Application inspirée du blog de Charivari. Les élèves identifient la nature de chaque mot de la phrase '
         + 'projetée au tableau. Ils la miment par un geste. La bonne réponse s’affiche ensuite. '
         + 'Déroulement manuel ou automatique. Phrases fournies ou les vôtres.',
    couleur: '#E07B00', ombre: '#FFD69A',
    fichiers: ['lexique.js']                    // fichiers en plus de index.html, à garder pour le hors ligne
  },
  {
    dossier: 'machine-conjugaison',
    nom: 'Machine à conjuguer',
    niveau: 'cycles 2 et 3',
    texte: 'La machine tire au sort un sujet, un verbe et un temps. Les élèves conjuguent sur l’ardoise puis on affiche '
         + 'la réponse. Options : choix des sujets, des verbes, des temps de conjugaison. Impression de fiches personnalisées.',
    couleur: '#D9443C', ombre: '#F9B9B4'
  },
  {
    dossier: 'a-qui-le-tour',
    nom: 'À qui le tour ?',
    niveau: 'tous niveaux',
    texte: 'Une roue colorée tire au sort un élève de la liste de la classe, avec l’historique des tirages.',
    couleur: '#16A497', ombre: '#A6E6DF'
  },
  {
    dossier: 'cartes-a-la-carte',
    nom: 'Cartes à la carte',
    niveau: 'du CP à la 6e',
    texte: 'Cartes de France, d’Europe et du monde à projeter, classées selon les thèmes du programme de géographie. '
         + 'On choisit ce qu’on affiche (régions, pays, fleuves, population, climats…), on zoome et on situe l’école.',
    couleur: '#6A4BD1', ombre: '#CFC4F7'
  }
];

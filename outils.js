/* LISTE DES OUTILS du « Tableau magique » — le seul endroit à modifier pour ajouter ou retirer un outil.
   À partir de cette liste sont fabriqués automatiquement :
   - les tuiles du portail (appli installée et « Découvrir en ligne ») ;
   - les aperçus et leurs bulles d'explication sur la page d'accueil ;
   - la liste des fichiers gardés pour le fonctionnement hors ligne (sw.js).

   POUR AJOUTER UN OUTIL :
   1. créer son dossier (ex. frise/) avec son index.html (copier les lignes « Portail » du <head> d'un autre outil) ;
   2. mettre sa capture d'écran dans images/ (format 16/9, ex. 800 × 450) ;
   3. ajouter un bloc ci-dessous, dans l'ordre d'affichage voulu ;
   4. ajouter son adresse dans sitemap.xml.
   (« donnees » : début du nom des données que l'outil enregistre dans le navigateur ; sert seulement à
   afficher le résumé d'une sauvegarde. Une donnée non listée est quand même sauvegardée.)

   METTRE À JOUR UN OUTIL : modifier son index.html, puis changer son numéro « version » ci-dessous.
   Seul cet outil est retéléchargé par les applis installées ; son numéro s'affiche dans sa signature.
   Le numéro de version.js ne concerne que le portail lui-même (page d'accueil, icônes, police, portail.js).

   M. Guitton — fichier mis au point avec l'aide de Claude AI. */
self.OUTILS = [
  {
    dossier: 'calcul-mental',
    version: '1.2',                             // numéro de CET outil : à changer quand on le modifie
    nom: 'Calculs en tête',
    niveau: 'calcul mental · du CP au CM2',
    texte: 'Compétences du programme. Projection de calculs au tableau. Les élèves répondent sur leur ardoise. '
         + 'Correction au tableau. Chrono. Différentes options. Impression de fiches personnalisées.',
    donnees: ['rcm-'],   // début du nom de ses données dans le navigateur (résumé de la sauvegarde)
    couleur: '#3D6FD9', ombre: '#B7D3FB'
  },
  {
    dossier: 'geometrie',
    version: '2.2',
    nom: 'La fabrique à figures',
    niveau: 'cycle 3',
    texte: 'Un outil de géométrie plus simple et plus facile à utiliser au tableau interactif que GeoGebra. '
         + 'Points, segments, droites, cercles et arcs de cercle, perpendiculaires, parallèles, milieu et symétrique. '
         + 'Les instruments s’animent : l’équerre, la règle et le compas tracent sous les yeux des élèves. '
         + 'Longueurs, codages, noms des points, sur quadrillage ou feuille blanche.',
    donnees: ['fabrique-a-figures'],
    couleur: '#D6336C', ombre: '#F8C3D5'
  },
  {
    dossier: 'droites-graduees',
    version: '1.0',
    nom: 'La route des nombres',
    niveau: 'droites graduées · du CP au CM2',
    texte: 'Des droites graduées à projeter, sur le modèle des évaluations nationales. Trouver le nombre montré par la flèche, '
         + 'placer un nombre, ou explorer en zoomant de 10 en 10. Entiers, décimaux et fractions, trois niveaux de difficulté. '
         + 'Fiches Word à imprimer, avec corrigé.',
    donnees: ['route-des-nombres'],
    couleur: '#F2662E', ombre: '#FFD0BC'
  },
  {
    dossier: 'cartes-a-la-carte',
    version: '1.0',
    nom: 'Cartes à la carte',
    niveau: 'du CP à la 6e',
    texte: 'Cartes de France, d’Europe et du monde à projeter, classées selon les thèmes du programme de géographie. '
         + 'On choisit ce qu’on affiche (régions, pays, fleuves, population, climats…), on zoome et on situe l’école. '
         + 'Cartes muettes. Préparation de séances. Conception d’évaluations. Impression ou copie pour Word.',
    donnees: ['cartes-a-la-carte'],
    couleur: '#6A4BD1', ombre: '#CFC4F7'
  },
  {
    dossier: 'tirage-au-sort',
    version: '1.0',
    nom: 'À qui le tour ?',
    niveau: 'tous niveaux',
    texte: 'Une roue colorée tire au sort un élève de la liste de la classe, avec l’historique des tirages.',
    donnees: ['dernier_liste_utilisee', 'son_actif', 'son_style', 'son_fin'],
    couleur: '#16A497', ombre: '#A6E6DF'
  },
  {
    dossier: 'nature-des-mots',
    version: '1.2',
    nom: 'La gym des mots',
    niveau: 'cycles 2 et 3',
    texte: 'Application inspirée de l’outil du Blog Charivari à l’école. Les élèves identifient la nature de chaque mot de la phrase '
         + 'projetée au tableau. Ils la miment par un geste. La bonne réponse s’affiche ensuite. '
         + 'Déroulement manuel ou automatique. Phrases fournies ou les vôtres.',
    donnees: ['gymDesMots'],
    couleur: '#E07B00', ombre: '#FFD69A',
    fichiers: ['lexique.js']                    // fichiers en plus de index.html, à garder pour le hors ligne
  },
  {
    dossier: 'machine-conjugaison',
    version: '1.0',
    nom: 'Machine à conjuguer',
    niveau: 'cycles 2 et 3',
    texte: 'La machine tire au sort un sujet, un verbe et un temps. Les élèves conjuguent sur l’ardoise puis on affiche '
         + 'la réponse. Options : choix des sujets, des verbes, des temps de conjugaison. Impression de fiches personnalisées.',
    donnees: ['machine-conjugaison'],
    couleur: '#D9443C', ombre: '#F9B9B4'
  },
  {
    dossier: 'copie-guidee',
    version: '1.1',
    nom: 'La copie guidée',
    niveau: 'cycles 2 et 3',
    texte: 'Application inspirée de l’outil Copilote de Mathilde Lollier, pour faciliter la copie d’un texte. '
         + 'Le texte est projeté au tableau et découpé en groupes de sens qui s’affichent un par un, au rythme choisi. '
         + 'Majuscules, ponctuation et repères « à la ligne » / « saute une ligne » sont mis en valeur. '
         + 'La mise en page du texte collé est respectée. Lecture à voix haute possible. '
         + 'Polices Arial, Belle Allure ou OpenDyslexic.',
    donnees: ['copieGuidee.'],
    couleur: '#2F9E44', ombre: '#B9E8C3'
  },
  {
    dossier: 'syllabes-en-couleur',
    version: '1.0',
    nom: 'Syllabes en couleur',
    niveau: 'adapter un texte · dys',
    texte: 'Pour préparer des textes adaptés à la lecture des élèves avec des troubles d’apprentissage / dys. '
         + 'On colle un texte : les syllabes s’alternent en bleu et rouge, les lettres muettes sont grisées, '
         + 'la mise en page est entièrement conservée. Police Arial ou OpenDyslexic. '
         + 'Copie dans Word, impression ou affichage en plein écran.',
    donnees: ['syllabes-en-couleur'],
    couleur: '#0B7FB8', ombre: '#B5E0F5'
  },
  {
    dossier: 'jeu-de-revision',
    version: '1.1',
    nom: 'À la poursuite des diamants',
    niveau: 'jeu de révision · tous niveaux',
    texte: 'Jeu de révision en équipes. Trois ou quatre équipages de pirates tournent autour de l’île : une bonne réponse '
         + 'fait avancer d’une case, une mauvaise fait reculer. En dépassant un rival, on s’empare de ses diamants. '
         + 'Le premier équipage à tous les réunir gagne. L’enseignant prépare les questions, sur le thème de son choix, '
         + 'et peut les faire afficher au tableau avec leur réponse.',
    donnees: ['poursuite-des-diamants'],
    couleur: '#B8860B', ombre: '#F2D98C'
  }
];

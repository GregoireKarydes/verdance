// =============================================================
// content/config.js — RÉGLAGES ENSEIGNANT (à modifier avant de déployer)
// Voir README.md, section « Configuration ».
// =============================================================
export const CONFIG = {
  /** Titre affiché dans le jeu et sur le bilan. */
  courseName: 'Green IT — Numérique responsable',
  schoolName: '',            // ex. « École d'ingénieurs X — Master 2 » (laisser vide pour ne rien afficher)

  /** Code du mode enseignant (à saisir dans Options › Mode enseignant, ou via l'URL ?prof). CHANGEZ-LE. */
  teacherCode: 'GARDIEN-2026',

  /** Mot de passe « propriétaire » du PDF : empêche la modification du bilan dans les lecteurs PDF. CHANGEZ-LE. */
  pdfOwnerPassword: 'verdance-prof-2026',
  /**
   * Mot de passe d'OUVERTURE du PDF (optionnel). Laisser '' pour que l'élève puisse relire son bilan.
   * Attention : sur un site statique, ce mot de passe est lisible dans le code source.
   */
  pdfUserPassword: '',

  /** Secret de signature du bilan (code d'intégrité vérifié par correction.html). CHANGEZ-LE. */
  integritySecret: 'change-moi-verdance-secret',

  /** Barème (sur 20). Le bloc « questions ouvertes » est noté par l'enseignant. */
  grading: {
    qcm: 10,          // QCM + énigmes (réussite au 1er essai, pondérée)
    progression: 4,   // quêtes principales, secondaires, exploration
    engagement: 2,    // dialogues lus, vidéos, missions terrain
    open: 4,          // questions ouvertes (note enseignant)
    hintPenalty: 0.25, maxHintPenalty: 2,
    weights: { main: 3, side: 1, combat: 0.5 },
  },

  /** Nombre minimal de mots conseillé pour une réponse ouverte. */
  openMinWords: 25,
  /** Durée minimale (s) avant de pouvoir valider une vidéo obligatoire. */
  videoMinSeconds: 45,
  /** Nombre de bilans conservés dans le navigateur. */
  maxStoredReports: 12,
  /** Afficher le bouton « Exporter JSON » de secours. */
  allowJsonExport: true,
};

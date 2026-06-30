/*
==========================================================
Timeline AAP Recherche
grist.js
==========================================================
*/

console.log("✅ grist.js chargé");

window.aapData = [];

/**
 * Convertit une valeur Grist en Date JavaScript
 */
function parseDate(value) {

  if (!value) return null;

  // Déjà un objet Date
  if (value instanceof Date) {
    return value;
  }

  // Timestamp
  if (typeof value === "number") {
    return new Date(value * 1000);
  }

  // Chaîne
  if (typeof value === "string") {

    // ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value);
    }

    // JJ-MM-AAAA
    const p = value.split("-");

    if (p.length === 3) {
      return new Date(
        Number(p[2]),
        Number(p[1]) - 1,
        Number(p[0])
      );
    }
  }

  return null;
}

/**
 * Préparation des données
 */
function prepare(records) {

  return records.map(r => ({

    id: r.id,

    nom: r.nom_appel,

    financeur: r.financeur,

    couleur: r.couleur_financeur || "#1976d2",

    annee: r.annee_appel,

    ouverture1: parseDate(r.date_ouverture_phase1),

    fermeture1: parseDate(r.date_fermeture_phase1),

    ouverture2: parseDate(r.date_ouverture_phase2),

    fermeture2: parseDate(r.date_fermeture_phase2),

    resultat1: parseDate(r.date_resultats_phase1),

    resultat2: parseDate(r.date_resultats_phase2),

    lien: r.lien_AAP,

    enCours: r.AAP_en_cours

  }));

}

grist.ready();

console.log("✅ grist.ready() exécuté");

grist.onRecords(function(records) {

  console.log("✅ onRecords appelé");

  console.log(records);

  window.aapData = prepare(records);

  console.table(window.aapData);

  document.dispatchEvent(
    new CustomEvent("aap-data-loaded")
  );

});

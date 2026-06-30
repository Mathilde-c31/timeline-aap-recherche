/*
==========================================================
 Timeline AAP Recherche
 grist.js
==========================================================
*/

window.aapData = [];

/**
 * Convertit une date Grist en objet Date.
 * Accepte :
 *  - Date JavaScript
 *  - "15-09-2025"
 *  - "2025-09-15"
 */
function parseDate(value) {

    if (!value) return null;

    if (value instanceof Date) {
        return value;
    }

    if (typeof value !== "string") {
        return null;
    }

    // format ISO
    if (value.includes("-") && value.substring(0,4).match(/^\d{4}$/)) {
        return new Date(value);
    }

    // format JJ-MM-AAAA
    const parts = value.split("-");

    if (parts.length !== 3) {
        return null;
    }

    const day = parseInt(parts[0],10);
    const month = parseInt(parts[1],10)-1;
    const year = parseInt(parts[2],10);

    return new Date(year,month,day);

}


/**
 * Prépare les données pour la timeline
 */
function prepareRecords(records){

    return records.map(r => ({

        id : r.id,

        nom : r.nom_appel,

        financeur : r.financeur,

        couleur : r.couleur_financeur || "#4CAF50",

        annee : r.annee_appel,

        phase1Debut : parseDate(r.date_ouverture_phase1),

        phase1Fin : parseDate(r.date_fermeture_phase1),

        phase2Debut : parseDate(r.date_ouverture_phase2),

        phase2Fin : parseDate(r.date_fermeture_phase2),

        resultat1 : parseDate(r.date_resultats_phase1),

        resultat2 : parseDate(r.date_resultats_phase2),

        lien : r.lien_AAP,

        enCours : r.AAP_en_cours

    }));

}


/**
 * Initialisation du widget
 */

grist.ready({

    requiredAccess: "read table"

});


/**
 * Réception des données
 */

grist.onRecords(records => {

    console.log("Records reçus :",records.length);

    window.aapData = prepareRecords(records);

    console.table(window.aapData);

    document.dispatchEvent(

        new CustomEvent("aap-data-loaded")

    );

});

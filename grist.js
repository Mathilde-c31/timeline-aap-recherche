// grist.js

// Les données reçues depuis Grist seront stockées ici.
window.gristData = [];

// Le widget est prêt à recevoir des données.
grist.ready({
  requiredAccess: 'read table'
});

// À chaque modification de la table, Grist renvoie les enregistrements.
grist.onRecords((records) => {

  console.log("Nombre d'enregistrements :", records.length);

  window.gristData = records;

  // Prévient script.js que les données sont disponibles.
  document.dispatchEvent(
    new CustomEvent("grist-data-loaded")
  );

});

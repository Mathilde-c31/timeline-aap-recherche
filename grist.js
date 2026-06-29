// grist.js

window.gristRecords = [];

grist.ready({
  requiredAccess: "read table"
});

grist.onRecords((records) => {

  console.log("=== Données Grist reçues ===");
  console.table(records);

  window.gristRecords = records;

  document.dispatchEvent(
    new CustomEvent("recordsLoaded")
  );

});

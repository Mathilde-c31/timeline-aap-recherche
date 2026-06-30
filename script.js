console.log("=== script.js chargé ===");

document.addEventListener("aap-data-loaded", () => {
 console.log("=== événement reçu ===");
 console.log(window.aapData);
});

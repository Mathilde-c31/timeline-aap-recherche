document.addEventListener("grist-data-loaded", () => {

    console.log(window.gristData);

    const timeline = document.getElementById("timeline");

    timeline.innerHTML = "";

    window.gristData.forEach(aap => {

        const ligne = document.createElement("div");

        ligne.className = "ligne";

        ligne.innerHTML = `
            <strong>${aap.nom_appel}</strong><br>
            ${aap.date_ouverture_phase1}
        `;

        timeline.appendChild(ligne);

    });

});

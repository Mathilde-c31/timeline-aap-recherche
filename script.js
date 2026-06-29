document.addEventListener("recordsLoaded", () => {

    const zone = document.getElementById("timeline");

    zone.innerHTML = "";

    const titre = document.createElement("h2");

    titre.textContent = `${window.gristRecords.length} appel(s) trouvé(s)`;

    zone.appendChild(titre);

    const ul = document.createElement("ul");

    window.gristRecords.forEach(record => {

        const li = document.createElement("li");

        li.textContent =
            `${record.nom_appel}
             (${record.financeur})
             - ${record.date_ouverture_phase1}`;

        ul.appendChild(li);

    });

    zone.appendChild(ul);

});

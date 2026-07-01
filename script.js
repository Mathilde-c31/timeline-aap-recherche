/*
==========================================================
 Timeline AAP Recherche
 script.js
 Version 0.1
==========================================================
*/

class TimelineAAP {

    constructor() {

        this.container = document.getElementById("timeline");
        this.loading = document.getElementById("loading");

        this.records = [];

        this.minDate = null;
        this.maxDate = null;

        this.pixelsPerDay = 4;

        this.rowHeight = 34;
        this.leftColumnWidth = 320;

        this.today = new Date();

    }

    /**
     * Chargement des données provenant de grist.js
     */
    load(records) {

        this.records = records.filter(r => r.ouverture1 && r.fermeture1);

        this.computeBounds();

        this.render();

    }

    /**
     * Recherche de la première et dernière date
     */
    computeBounds() {

        const dates = [];

        this.records.forEach(r => {

            dates.push(r.ouverture1);
            dates.push(r.fermeture1);

        });

        this.minDate = new Date(Math.min(...dates));

        this.maxDate = new Date(Math.max(...dates));

        /*
         on ajoute une marge de 15 jours
        */

        this.minDate.setDate(this.minDate.getDate() - 15);

        this.maxDate.setDate(this.maxDate.getDate() + 15);

    }

    /**
     * Conversion Date -> X
     */

    dateToX(date){

        const oneDay = 1000*60*60*24;

        const delta = (date - this.minDate)/oneDay;

        return delta * this.pixelsPerDay;

    }

 /**
 * Largeur de la timeline
 */
getTimelineWidth() {

    return this.dateToX(this.maxDate) + 100;

}

/**
 * Durée entre deux dates
 */
durationToWidth(start, end) {

    const oneDay = 1000 * 60 * 60 * 24;

    const days = (end - start) / oneDay;

    return Math.max(days * this.pixelsPerDay, 4);

}

 /**
 * Construit l'axe des mois
 */
renderHeader(parent) {

    const header = document.createElement("div");
    header.className = "timeline-header";

    header.style.width = this.getTimelineWidth() + "px";

    const current = new Date(
        this.minDate.getFullYear(),
        this.minDate.getMonth(),
        1
    );

    const mois = [
        "Jan","Fév","Mar","Avr","Mai","Juin",
        "Juil","Août","Sept","Oct","Nov","Déc"
    ];

    while (current <= this.maxDate) {

        const month = document.createElement("div");
        month.className = "timeline-month";

        const x = this.dateToX(current);

        month.style.left = x + "px";

        month.innerHTML =
            `<strong>${mois[current.getMonth()]}</strong><br>${current.getFullYear()}`;

        header.appendChild(month);

        current.setMonth(current.getMonth() + 1);

    }

    parent.appendChild(header);

}

 /**
 * Ligne verticale Aujourd'hui
 */
renderTodayLine(parent) {

    const today = document.createElement("div");

    today.className = "today-line";

    today.style.left =
        this.dateToX(new Date()) + "px";

    parent.appendChild(today);

}

    /**
     * Nettoyage de la zone graphique
     */

    clear(){

        this.container.innerHTML = "";

    }

    render() {

    this.clear();

    if (this.loading) {
        this.loading.style.display = "none";
    }

    // Conteneur principal
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-wrapper";

    // Colonne de gauche
    const left = document.createElement("div");
    left.className = "timeline-left";

    // Zone de droite
    const right = document.createElement("div");
    right.className = "timeline-right";

     // Axe des mois
     this.renderHeader(right);

    // Une ligne par AAP
  this.records.forEach(record => {

    const row = document.createElement("div");
    row.className = "timeline-row";

    // ... création de la barre ...

    right.appendChild(row);

});
     
     // UNE SEULE ligne Aujourd'hui

this.renderTodayLine(right);

        // Colonne gauche
        const label = document.createElement("div");
        label.className = "timeline-label";

        label.innerHTML =
            `<strong>${record.financeur}</strong> │ ${record.nom}`;

        left.appendChild(label);

        // Colonne droite (vide pour l'instant)
        const row = document.createElement("div");
row.className = "timeline-row";

row.style.width = this.getTimelineWidth() + "px";

// Création de la barre
const bar = document.createElement("div");
bar.className = "timeline-bar";

bar.style.left =
    this.dateToX(record.ouverture1) + "px";

bar.style.width =
    this.durationToWidth(
        record.ouverture1,
        record.fermeture1
    ) + "px";

bar.style.background = record.couleur;

bar.title =
    record.nom;

bar.onclick = () => {

    if(record.lien){

        window.open(record.lien,"_blank");

    }

};

row.appendChild(bar);

right.appendChild(row);

    });

    wrapper.appendChild(left);
    wrapper.appendChild(right);

    this.container.appendChild(wrapper);

    console.log("Timeline affichée");

}

}


/*
==========================================================
Initialisation
==========================================================
*/

const timeline = new TimelineAAP();


document.addEventListener(

    "aap-data-loaded",

    () => {

        timeline.load(window.aapData);

    }

);

/*
==========================================================
 Timeline AAP Recherche
 script.js
 Version 1.0
==========================================================
*/

class TimelineAAP {

    constructor() {

        this.container = document.getElementById("timeline");
        this.loading = document.getElementById("loading");

        this.records = [];

        this.minDate = null;
        this.maxDate = null;

        /* Échelle */
        this.pixelsPerDay = 4;

        /* Dimensions */
        this.leftWidth = 320;
        this.headerHeight = 40;
        this.rowHeight = 38;

        /* Aujourd'hui */
        this.today = new Date();

    }

    /*
    ==========================================
    Chargement des données
    ==========================================
    */

    load(records){

        this.records = records.filter(r =>
            r.ouverture1 && r.fermeture1
        );

        if(this.records.length === 0){

            this.container.innerHTML =
                "<p>Aucune donnée à afficher.</p>";

            return;

        }

        this.computeBounds();

        this.render();

    }

    /*
    ==========================================
    Calcul des bornes
    ==========================================
    */

    computeBounds(){

        const dates = [];

        this.records.forEach(record => {

            dates.push(record.ouverture1);
            dates.push(record.fermeture1);

            if(record.ouverture2) dates.push(record.ouverture2);
            if(record.fermeture2) dates.push(record.fermeture2);

        });

        this.minDate = new Date(
            Math.min(...dates)
        );

        this.maxDate = new Date(
            Math.max(...dates)
        );

        this.minDate.setDate(
            this.minDate.getDate() - 15
        );

        this.maxDate.setDate(
            this.maxDate.getDate() + 15
        );

    }

    /*
    ==========================================
    Outils de calcul
    ==========================================
    */

    dateToX(date){

        const oneDay = 1000 * 60 * 60 * 24;

        return (
            (date - this.minDate) / oneDay
        ) * this.pixelsPerDay;

    }

    duration(start,end){

        const oneDay = 1000 * 60 * 60 * 24;

        return Math.max(

            ((end-start)/oneDay)
            * this.pixelsPerDay,

            4

        );

    }

    timelineWidth(){

        return this.dateToX(
            this.maxDate
        ) + 80;

    }

    /*
    ==========================================
    Nettoyage
    ==========================================
    */

    clear(){

        this.container.innerHTML = "";

    }

/*
==========================================
Construction de la structure
==========================================
*/

createLayout(){

    const wrapper = document.createElement("div");
    wrapper.className = "timeline-wrapper";

    const left = document.createElement("div");
    left.className = "timeline-left";

    const right = document.createElement("div");
    right.className = "timeline-right";

    /* En-tête */

    const header = document.createElement("div");
    header.className = "timeline-header";

    /* Corps */

    const body = document.createElement("div");
    body.className = "timeline-body";

    /* Couche grille */

    const gridLayer = document.createElement("div");
    gridLayer.className = "timeline-grid-layer";

    /* Couche Aujourd'hui */

    const todayLayer = document.createElement("div");
    todayLayer.className = "timeline-today-layer";

    /* Couche des barres */

    const rowsLayer = document.createElement("div");
    rowsLayer.className = "timeline-rows-layer";

    body.appendChild(gridLayer);
    body.appendChild(todayLayer);
    body.appendChild(rowsLayer);

    right.appendChild(header);
    right.appendChild(body);

    wrapper.appendChild(left);
    wrapper.appendChild(right);

    this.container.appendChild(wrapper);

    return{

        wrapper,

        left,

        right,

        header,

        body,

        gridLayer,

        todayLayer,

        rowsLayer

    };

}

/*
==========================================
Libellés de gauche
==========================================
*/

createLabel(record){

    const label = document.createElement("div");

    label.className = "timeline-label";

    label.style.height = this.rowHeight + "px";

    label.innerHTML =
        `<strong>${record.nom}</strong>
         <span class="financeur">
            — ${record.financeur}
         </span>`;

    return label;

}

renderLabels(left){

    this.records.forEach(record=>{

        left.appendChild(
            this.createLabel(record)
        );

    });

}

/*
==========================================
Axe des mois
==========================================
*/

createMonth(date){

    const months = [
        "Jan","Fév","Mar","Avr","Mai","Juin",
        "Juil","Août","Sept","Oct","Nov","Déc"
    ];

    const div = document.createElement("div");

    div.className = "timeline-month";

    div.textContent =
        months[date.getMonth()] +
        " " +
        date.getFullYear();

    div.style.left =
        this.dateToX(date) + "px";

    return div;

}

renderHeader(header){

    header.style.width =
        this.timelineWidth() + "px";

    let current = new Date(
        this.minDate.getFullYear(),
        this.minDate.getMonth(),
        1
    );

    while(current <= this.maxDate){

        header.appendChild(
            this.createMonth(current)
        );

        current = new Date(
            current.getFullYear(),
            current.getMonth()+1,
            1
        );

    }

}

 /*
==========================================
Création d'une barre
==========================================
*/

createBar(record){

    const bar = document.createElement("div");

    bar.className = "timeline-bar";

    bar.style.left =
        this.dateToX(record.ouverture1) + "px";

    bar.style.width =
        this.duration(
            record.ouverture1,
            record.fermeture1
        ) + "px";

    bar.style.background =
        record.couleur;

    bar.title = record.nom;

    if(record.lien){

        bar.style.cursor = "pointer";

        bar.onclick = () => {

            window.open(record.lien,"_blank");

        };

    }

    return bar;

}

/*
==========================================
Création d'une ligne
==========================================
*/

createRow(record){

    const row = document.createElement("div");

    row.className = "timeline-row";

    row.style.width =
        this.timelineWidth() + "px";

    row.style.height =
        this.rowHeight + "px";

    row.appendChild(
        this.createBar(record)
    );

    return row;

}

renderRows(body){

    this.records.forEach(record=>{

        body.appendChild(

            this.createRow(record)

        );

    });

}

/*
==========================================
Grille mensuelle
==========================================
*/

renderGrid(body){

    let current = new Date(

        this.minDate.getFullYear(),

        this.minDate.getMonth(),

        1

    );

    while(current <= this.maxDate){

        const line = document.createElement("div");

        line.className = "timeline-grid-line";

        line.style.left =
            this.dateToX(current) + "px";

        body.appendChild(line);

        current = new Date(

            current.getFullYear(),

            current.getMonth()+1,

            1

        );

    }

}

/*
==========================================
Ligne Aujourd'hui
==========================================
*/

renderToday(body){

    const line = document.createElement("div");

    line.className = "today-line";

    line.style.left =
        this.dateToX(
            new Date()
        ) + "px";

    body.appendChild(line);

}

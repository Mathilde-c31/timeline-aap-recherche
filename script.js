/*
==========================================================
 Timeline AAP Recherche
 script.js
 Version 2.0
==========================================================
*/

class TimelineAAP {

    constructor(){

        this.container =
            document.getElementById("timeline");

        this.loading =
            document.getElementById("loading");

        this.records = [];

        this.minDate = null;
        this.maxDate = null;

        /* Dimensions */

        this.leftWidth = 320;
        this.headerHeight = 42;
        this.rowHeight = 38;

        /* Échelle */

        this.pixelsPerDay = 4;

        this.today = new Date();

    }

    /*
    ==========================================
    Chargement
    ==========================================
    */

    load(records){

        this.records = records.filter(r =>
            r.ouverture1 &&
            r.fermeture1
        );

        if(this.records.length === 0){

            this.container.innerHTML =
                "<p>Aucune donnée.</p>";

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

        this.records.forEach(record=>{

            dates.push(record.ouverture1);
            dates.push(record.fermeture1);

            if(record.ouverture2)
                dates.push(record.ouverture2);

            if(record.fermeture2)
                dates.push(record.fermeture2);

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
    Outils
    ==========================================
    */

    dateToX(date){

        const day = 86400000;

        return (
            (date - this.minDate) / day
        ) * this.pixelsPerDay;

    }

    duration(start,end){

        const day = 86400000;

        return Math.max(

            ((end-start)/day)
            * this.pixelsPerDay,

            4

        );

    }

    timelineWidth(){

        return this.dateToX(
            this.maxDate
        ) + 100;

    }

    timelineHeight(){

        return this.records.length
            * this.rowHeight;

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

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "timeline-wrapper";

        /* Colonne gauche */

        const left =
            document.createElement("div");

        left.className =
            "timeline-left";

        /* Colonne droite */

        const right =
            document.createElement("div");

        right.className =
            "timeline-right";

        /* En-tête */

        const header =
            document.createElement("div");

        header.className =
            "timeline-header";

     header.appendChild(headerContent);

        /* Zone scrollable */

        const body =
            document.createElement("div");

        body.className =
            "timeline-body";

        /* Conteneur de toute la timeline */

        const canvas =
            document.createElement("div");

        canvas.className =
            "timeline-canvas";

        canvas.style.width =
            this.timelineWidth() + "px";

        canvas.style.height =
            this.timelineHeight() + "px";

        /* Les couches */

        const gridLayer =
            document.createElement("div");

        gridLayer.className =
            "timeline-grid-layer";

        const todayLayer =
            document.createElement("div");

        todayLayer.className =
            "timeline-today-layer";

        const rowsLayer =
            document.createElement("div");

        rowsLayer.className =
            "timeline-rows-layer";

        canvas.appendChild(gridLayer);
        canvas.appendChild(todayLayer);
        canvas.appendChild(rowsLayer);

        body.appendChild(canvas);

        right.appendChild(header);
        right.appendChild(body);

        wrapper.appendChild(left);
        wrapper.appendChild(right);

        this.container.appendChild(wrapper);

       return{

    left,

    header,

    headerContent,

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

    label.innerHTML = `
        <strong>${record.nom}</strong>
        <span class="financeur">
            — ${record.financeur}
        </span>
    `;

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

    const months=[
        "Jan","Fév","Mar","Avr","Mai","Juin",
        "Juil","Août","Sept","Oct","Nov","Déc"
    ];

    const div=document.createElement("div");

    div.className="timeline-month";

    div.textContent=
        months[date.getMonth()] +
        " " +
        date.getFullYear();

    div.style.left=
        this.dateToX(date)+"px";

    return div;

}

renderHeader(header){

    header.innerHTML="";

    header.style.width=
        this.timelineWidth()+"px";

    let current=new Date(
        this.minDate.getFullYear(),
        this.minDate.getMonth(),
        1
    );

    while(current<=this.maxDate){

        header.appendChild(
            this.createMonth(current)
        );

        current=new Date(
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

    const bar=document.createElement("div");

    bar.className="timeline-bar";

    bar.style.left=
        this.dateToX(record.ouverture1)+"px";

    bar.style.width=
        this.duration(
            record.ouverture1,
            record.fermeture1
        )+"px";

    bar.style.background=
        record.couleur;

    bar.title=
        record.nom;

    if(record.lien){

        bar.onclick=()=>{

            window.open(
                record.lien,
                "_blank"
            );

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

    const row=document.createElement("div");

    row.className="timeline-row";

    row.style.height=
        this.rowHeight+"px";

    row.style.width=
        this.timelineWidth()+"px";

    row.appendChild(
        this.createBar(record)
    );

    return row;

}

renderRows(rowsLayer){

    rowsLayer.innerHTML="";

    rowsLayer.style.width=
        this.timelineWidth()+"px";

    rowsLayer.style.height=
        this.timelineHeight()+"px";

    this.records.forEach(record=>{

        rowsLayer.appendChild(

            this.createRow(record)

        );

    });

}

/*
==========================================
Grille mensuelle
==========================================
*/

renderGrid(gridLayer){

    gridLayer.innerHTML = "";

    gridLayer.style.width =
        this.timelineWidth() + "px";

    gridLayer.style.height =
        this.timelineHeight() + "px";

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

        gridLayer.appendChild(line);

        current = new Date(
            current.getFullYear(),
            current.getMonth()+1,
            1
        );

    }

}

/*
==========================================
Aujourd'hui
==========================================
*/

renderToday(todayLayer){

    todayLayer.innerHTML = "";

    todayLayer.style.width =
        this.timelineWidth() + "px";

    todayLayer.style.height =
        this.timelineHeight() + "px";

    const line = document.createElement("div");

    line.className = "today-line";

    line.style.left =
        this.dateToX(this.today) + "px";

    todayLayer.appendChild(line);

}

/*
==========================================
Synchronisation du scroll
==========================================
*/

bindScroll(layout){

    layout.body.addEventListener("scroll", ()=>{

        layout.header.scrollLeft =
            layout.body.scrollLeft;

    });

}

/*
==========================================
Rendu principal
==========================================
*/

render(){

    this.clear();

    if(this.loading){

        this.loading.style.display="none";

    }

    const layout =
        this.createLayout();

    this.renderLabels(layout.left);

    this.renderHeader(layout.header);

    this.renderGrid(layout.gridLayer);

    this.renderRows(layout.rowsLayer);

    this.renderToday(layout.todayLayer);

    this.bindScroll(layout);

    console.log("Timeline V2 prête");

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

    ()=>{

        timeline.load(window.aapData);

    }

);

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
     
     /* Drag horizontal */

this.isDragging = false;

this.dragStartX = 0;
this.dragStartY = 0;

this.scrollLeftStart = 0;
this.scrollTopStart = 0;
     this.hasDragged = false;

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

     /* Coin vide */

     const leftHeader = document.createElement("div");

leftHeader.className = "timeline-left-header";

left.appendChild(leftHeader);

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

     const headerContent =
    document.createElement("div");

headerContent.className =
    "timeline-header-content";

     header.appendChild(headerContent);

        /* Zone scrollable */

        const body =
            document.createElement("div");

        body.className =
            "timeline-body";

     /* Tooltip */

const tooltip =
    document.createElement("div");

tooltip.className =
    "timeline-tooltip";

body.appendChild(tooltip);

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
    leftHeader,

    header,
    headerContent,

    body,
    tooltip,
    canvas,

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

renderHeader(headerContent){

    headerContent.innerHTML = "";

    headerContent.style.position = "relative";

    headerContent.style.width =
        this.timelineWidth() + "px";

    headerContent.style.height =
        this.headerHeight + "px";

    let current = new Date(
        this.minDate.getFullYear(),
        this.minDate.getMonth(),
        1
    );

    while(current <= this.maxDate){

        headerContent.appendChild(
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
Couleur selon l'état de l'AAP
==========================================
*/

getStatusColor(record){

    const today = new Date();

    // Une période est actuellement ouverte ?

    const period1Open =
        today >= record.ouverture1 &&
        today <= record.fermeture1;

    const period2Open =
        record.ouverture2 &&
        record.fermeture2 &&
        today >= record.ouverture2 &&
        today <= record.fermeture2;

    if(period1Open || period2Open){

        return "#2e7d32";   // Vert

    }

    // Toutes les périodes sont terminées ?

    const lastClosing = record.fermeture2
        ? record.fermeture2
        : record.fermeture1;

    if(today > lastClosing){

        return "#9e9e9e";   // Gris

    }

    // Sinon : appel futur

    return "#1976d2";       // Bleu

}

 /*
==========================================
Création d'une barre de période
==========================================
*/

createPeriodBar(record, start, end, color){

    const bar = document.createElement("div");

    bar.className = "timeline-bar";

    bar.style.left =
        this.dateToX(start) + "px";

    bar.style.width =
        this.duration(start, end) + "px";

    bar.style.background = color;

    /* Tooltip */

 bar.addEventListener("mouseenter",(e)=>{

    console.log("mouseenter :", record.nom);

    this.showTooltip(this.layout, record, e);

});

    bar.addEventListener("mousemove",(e)=>{

        this.moveTooltip(this.layout, e);

    });

    bar.addEventListener("mouseleave",()=>{

        this.hideTooltip(this.layout);

    });

    return bar;

}

/*
==========================================
Création des barres d'un AAP
==========================================
*/

createBar(record){

    const container = document.createElement("div");

    container.className = "timeline-bars";

    /* Première période */

    container.appendChild(

        this.createPeriodBar(

         record,

            record.ouverture1,
            record.fermeture1,
           this.getStatusColor(record)

        )

    );

    /* Deuxième période (si présente) */

    if(
        record.ouverture2 &&
        record.fermeture2
    ){

        container.appendChild(

            this.createPeriodBar(

             record,

                record.ouverture2,
                record.fermeture2,
               this.getStatusColor(record)

            )

        );

    }

    /* Gestion du clic */

    if(record.lien){

        container.style.cursor = "pointer";

        container.onclick = ()=>{

            window.open(
                record.lien,
                "_blank"
            );

        };

    }

 return container;

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

        layout.headerContent.style.transform =
            `translateX(${-layout.body.scrollLeft}px)`;

    });

}

 /*
==========================================
Afficher le tooltip
==========================================
*/

showTooltip(layout, record, event){

    const tooltip = layout.tooltip;

    tooltip.innerHTML = `
        <strong>${record.nom}</strong>

        <div>
            <span class="label">Financeur :</span>
            ${record.financeur}
        </div>

        <div>
            <span class="label">Ouverture :</span>
            ${record.ouverture1.toLocaleDateString("fr-FR")}
        </div>

        <div>
            <span class="label">Fermeture :</span>
            ${record.fermeture1.toLocaleDateString("fr-FR")}
        </div>
    `;

    tooltip.style.display = "block";

    this.moveTooltip(layout, event);

}

/*
==========================================
Déplacer le tooltip
==========================================
*/

moveTooltip(layout, event){

    const tooltip = layout.tooltip;

    tooltip.style.left =
        (event.offsetX + 18) + "px";

    tooltip.style.top =
        (event.offsetY + 18) + "px";

}

/*
==========================================
Masquer le tooltip
==========================================
*/

hideTooltip(layout){

    layout.tooltip.style.display = "none";

}

 /*
==========================================
Déplacement par glisser-déposer
==========================================
*/

enableDrag(layout){

    const body = layout.body;

    body.addEventListener("mousedown",(e)=>{

    e.preventDefault();

        this.isDragging = true;

     this.hasDragged = false;

body.classList.add("dragging");

        body.classList.add("dragging");

        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        this.scrollLeftStart = body.scrollLeft;
        this.scrollTopStart = body.scrollTop;

    });

    window.addEventListener("mouseup",()=>{

        this.isDragging = false;

        body.classList.remove("dragging");

    });

    body.addEventListener("mousemove",(e)=>{

        if(!this.isDragging) return;

        const dx = e.clientX - this.dragStartX;
const dy = e.clientY - this.dragStartY;

if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {

    this.hasDragged = true;

}

body.scrollLeft = this.scrollLeftStart - dx;
body.scrollTop = this.scrollTopStart - dy;

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

 this.layout = layout;

    this.renderLabels(layout.left);

   this.renderHeader(layout.headerContent);

    this.renderGrid(layout.gridLayer);

    this.renderRows(layout.rowsLayer);

    this.renderToday(layout.todayLayer);

    this.bindScroll(layout);

 this.enableDrag(layout);

  console.log(layout);

    console.log(this.records.length);

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

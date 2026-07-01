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
        this.leftWidth = 320;
        this.rowHeight = 34;

    }

    /*
    ==========================================
    Chargement
    ==========================================
    */

    load(records){

        this.records = records.filter(r => r.ouverture1 && r.fermeture1);

        if(this.records.length===0){

            this.container.innerHTML="<p>Aucune donnée.</p>";
            return;

        }

        this.computeBounds();

        this.render();

    }

    /*
    ==========================================
    Bornes de la timeline
    ==========================================
    */

    computeBounds(){

        const dates=[];

        this.records.forEach(r=>{

            dates.push(r.ouverture1);
            dates.push(r.fermeture1);

        });

        this.minDate=new Date(Math.min(...dates));
        this.maxDate=new Date(Math.max(...dates));

        this.minDate.setDate(this.minDate.getDate()-15);
        this.maxDate.setDate(this.maxDate.getDate()+15);

    }

    /*
    ==========================================
    Outils
    ==========================================
    */

    dateToX(date){

        const day=1000*60*60*24;

        return ((date-this.minDate)/day)*this.pixelsPerDay;

    }

    duration(start,end){

        const day=1000*60*60*24;

        return Math.max(
            ((end-start)/day)*this.pixelsPerDay,
            4
        );

    }

    timelineWidth(){

        return this.dateToX(this.maxDate)+80;

    }

    clear(){

        this.container.innerHTML="";

    }

    /*
    ==========================================
    Construction HTML
    ==========================================
    */

    createLayout(){

        const wrapper=document.createElement("div");
        wrapper.className="timeline-wrapper";

        const left=document.createElement("div");
        left.className="timeline-left";

        const right=document.createElement("div");
        right.className="timeline-right";

        wrapper.appendChild(left);
        wrapper.appendChild(right);

        this.container.appendChild(wrapper);

        return {
            wrapper,
            left,
            right
        };

    }

    /*
    ==========================================
    Colonne de gauche
    ==========================================
    */

    renderLabels(left){

        this.records.forEach(record=>{

            const label=document.createElement("div");

            label.className="timeline-label";

            label.innerHTML=
                `<strong>${record.financeur}</strong><br>${record.nom}`;

            left.appendChild(label);

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

        const layout=this.createLayout();

        this.renderLabels(layout.left);

        console.log("V0.1 - Partie 1 OK");

    }

}

/*
==========================================================
 Initialisation
==========================================================
*/

const timeline=new TimelineAAP();

document.addEventListener(

    "aap-data-loaded",

    ()=>{

        timeline.load(window.aapData);

    }

);

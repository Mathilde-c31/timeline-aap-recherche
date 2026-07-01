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
    Axe des mois
    ==========================================
    */

    renderHeader(right){

        const header=document.createElement("div");

        header.className="timeline-header";
        header.style.width=this.timelineWidth()+"px";

        const months=[
            "Jan","Fév","Mar","Avr","Mai","Juin",
            "Juil","Août","Sept","Oct","Nov","Déc"
        ];

        let current=new Date(
            this.minDate.getFullYear(),
            this.minDate.getMonth(),
            1
        );

        while(current<=this.maxDate){

            const x=this.dateToX(current);

            const month=document.createElement("div");

            month.className="timeline-month";

            month.style.left=x+"px";

            month.innerHTML=
                `<strong>${months[current.getMonth()]}</strong><br>${current.getFullYear()}`;

            header.appendChild(month);

            current.setMonth(current.getMonth()+1);

        }

        right.appendChild(header);

    }

    /*
    ==========================================
    Lignes
    ==========================================
    */

    renderRows(right){

        this.records.forEach(record=>{

            const row=document.createElement("div");

            row.className="timeline-row";

            row.style.width=this.timelineWidth()+"px";

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

            if(record.lien){

                bar.style.cursor="pointer";

                bar.onclick=()=>{

                    window.open(record.lien,"_blank");

                };

            }

            row.appendChild(bar);

            right.appendChild(row);

        });

    }

    /*
    ==========================================
    Aujourd'hui
    ==========================================
    */

    renderToday(right){

        const today=document.createElement("div");

        today.className="today-line";

        today.style.left=
            this.dateToX(new Date())+"px";

        right.appendChild(today);

    }

    /*
    ==========================================
    Grille mensuelle
    ==========================================
    */

    renderGrid(right){

        let current=new Date(
            this.minDate.getFullYear(),
            this.minDate.getMonth(),
            1
        );

        while(current<=this.maxDate){

            const line=document.createElement("div");

            line.className="timeline-grid-line";

            line.style.left=
                this.dateToX(current)+"px";

            right.appendChild(line);

            current.setMonth(current.getMonth()+1);

        }

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

        this.renderHeader(layout.right);

        this.renderGrid(layout.right);

        this.renderRows(layout.right);

        this.renderToday(layout.right);

        console.log("V0.1 - Partie 2 OK");

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

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
     * Nettoyage de la zone graphique
     */

    clear(){

        this.container.innerHTML = "";

    }

    render(){

        this.clear();

        if(this.loading){

            this.loading.style.display="none";

        }

        /*
         les méthodes de dessin
         seront ajoutées dans la partie 2
        */

        console.log("Timeline prête.");

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

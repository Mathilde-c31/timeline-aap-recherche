/*
==========================================================
Timeline AAP Recherche
Timeline.js
==========================================================
*/

class TimelineAAP {

    constructor(containerId = "timeline") {

        this.container = document.getElementById(containerId);
        this.loading = document.getElementById("loading");

        this.records = [];

        this.minDate = null;
        this.maxDate = null;

        this.today = new Date();

        this.pixelsPerDay = 4;

        this.leftWidth = 320;
        this.headerHeight = 40;
        this.rowHeight = 38;

    }

    load(records){

        this.records = records.filter(r =>
            r.ouverture1 && r.fermeture1
        );

        if(!this.records.length){

            this.container.innerHTML =
                "<p>Aucune donnée.</p>";

            return;

        }

        this.computeBounds();

        this.render();

    }

    computeBounds(){

        const dates = [];

        this.records.forEach(r=>{

            dates.push(r.ouverture1);
            dates.push(r.fermeture1);

            if(r.ouverture2) dates.push(r.ouverture2);
            if(r.fermeture2) dates.push(r.fermeture2);

        });

        this.minDate = new Date(Math.min(...dates));
        this.maxDate = new Date(Math.max(...dates));

        this.minDate.setDate(this.minDate.getDate()-15);
        this.maxDate.setDate(this.maxDate.getDate()+15);

    }

    dateToX(date){

        const day = 86400000;

        return ((date-this.minDate)/day)
                * this.pixelsPerDay;

    }

    duration(start,end){

        const day = 86400000;

        return Math.max(
            ((end-start)/day)*this.pixelsPerDay,
            4
        );

    }

    timelineWidth(){

        return this.dateToX(this.maxDate)+80;

    }

}

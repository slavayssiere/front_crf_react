import { EventEmitter } from "events";
import AppStore from './AppStore';
import ConnectStore from './ConnectStore';

class StatsStore extends EventEmitter {
    constructor() {
        super();
        this.formations = {};
        this.maraudes = {};
        this.fcs = {};
        this.mls = {};
        this.reseaux = {};
    }

    getFormations() {
        return this.formations;
    }

    getMaraudes(){
        return this.maraudes;
    }

    getFcs(){
        return this.fcs;
    }

    getReseaux(){
        return this.reseaux;
    }

    getMissionsLocales(){
        return this.mls;
    }

    getFormationsStats(year) {
        fetch('http://' + AppStore.getPegassAPI() + '/stats/formations?year='+year+'&ul=' + ConnectStore.getUl(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.formations = json;
                this.emit("get_formations");
            });
    }

    getMaraudesStats(year) {
        fetch('http://' + AppStore.getPegassAPI() + '/stats/maraude?year='+year+'&ul=' + ConnectStore.getUl(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.maraudes = json;
                this.emit("get_maraudes");
            });
    }

    getFormationContinueStats(year) {
        fetch('http://' + AppStore.getPegassAPI() + '/stats/fc?year='+year+'&ul=' + ConnectStore.getUl(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.fcs = json;
                this.emit("get_fcs");
            });
    }

    getReseauxStats(year) {
        fetch('http://' + AppStore.getPegassAPI() + '/stats/reseau?year='+year+'&ul=' + ConnectStore.getUl(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.reseaux = json;
                this.emit("get_reseaux");
            });
    }

    getMissionLocaleStats(year) {
        fetch('http://' + AppStore.getPegassAPI() + '/stats/ml?year='+year+'&ul=' + ConnectStore.getUl(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.mls = json;
                this.emit("get_mls");
            });
    }
}

const statsStore = new StatsStore();

export default statsStore;
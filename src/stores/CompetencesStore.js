import { EventEmitter } from "events";
import AppStore from './AppStore';
import ConnectStore from './ConnectStore';

class CompetencesStore extends EventEmitter {
    constructor() {
        super();
        this.benevoles = [];
        this.competences = [];
        this.nominations = [];
        this.formations = [];
        this.change = null;
    }

    getAllBenevoles() {
        return this.benevoles;
    }

    getAllCompetences() {
        return this.competences;
    }

    getAllNominations() {
        return this.nominations;
    }

    getAllFormations() {
        return this.formations;
    }

    getBenevolesARecycler(id, geoType) {
        var page = 0;
        this.benevoles = [];

        var geoTypeRequest = 'ul=' + ConnectStore.getUl();
        var requestPage = 'recyclages'
        if (geoType === "dd") {
            geoTypeRequest = 'dd=75';
            requestPage = 'recyclagesdd'
        }
        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/' + requestPage + '/' + id + '?' + geoTypeRequest + '&page=' + page, {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.benevoles = this.benevoles.concat(json.list);
                this.getEmails(json);
                this.emit("receive_recyclage", {
                    pages: json.pages,
                });
                if (json.pages !== 0) {
                    for (page = 1; page !== json.pages; page++) {
                        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/' + requestPage + '/' + id + '?' + geoTypeRequest + '&page=' + page, {
                            method: "GET",
                            headers: ConnectStore.getHeaders(),
                        }).then(response => response.json())
                            .then(json => {
                                this.benevoles = this.benevoles.concat(json.list);
                                this.getEmails(json);
                                this.emit("receive_recyclage", {
                                    pages: json.pages,
                                });
                            });
                    }
                }
            });
    }

    getBenevolesWithCompetence(type, id) {
        var page = 0;
        this.benevoles = [];
        fetch('http://' + AppStore.getPegassAPI() + '/competences/' + type + '/' + id + '?ul=' + ConnectStore.getUl() + '&page=' + page, {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.benevoles = this.benevoles.concat(json.list);
                this.getEmails(json, 0);
                this.emit("receive_benevoles", {
                    pages: json.pages,
                    current: 0,
                });
                if (json.pages !== 0) {
                    for (page = 1; page !== json.pages; page++) {
                        fetch('http://' + AppStore.getPegassAPI() + '/competences/' + type + '/' + id + '?ul=' + ConnectStore.getUl() + '&page=' + page, {
                            method: "GET",
                            headers: ConnectStore.getHeaders(),
                        }).then(response => response.json())
                            .then(json => {
                                this.benevoles = this.benevoles.concat(json.list);
                                this.getEmails(json);
                                this.emit("receive_benevoles", {
                                    pages: json.pages,
                                });
                            });
                    }
                }
            });
    }

    getBenevolesWithoutCompetence(type, id) {
        var page = 0;
        this.benevoles = [];
        // /competences/:type/:competenceid/no
        fetch('http://' + AppStore.getPegassAPI() + '/competences/' + type + '/' + id + '/no?ul=' + ConnectStore.getUl() + '&page=' + page, {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.benevoles = this.benevoles.concat(json.list);
                this.getEmails(json, 0);
                this.emit("receive_benevoles", {
                    pages: json.pages,
                    current: 0,
                });
                if (json.pages !== 0) {
                    for (page = 1; page !== json.pages; page++) {
                        fetch('http://' + AppStore.getPegassAPI() + '/competences/' + type + '/' + id + '/no?ul=' + ConnectStore.getUl() + '&page=' + page, {
                            method: "GET",
                            headers: ConnectStore.getHeaders(),
                        }).then(response => response.json())
                            .then(json => {
                                this.benevoles = this.benevoles.concat(json.list);
                                this.getEmails(json);
                                this.emit("receive_benevoles", {
                                    pages: json.pages,
                                });
                            });
                    }
                }
            });
    }

    getEmails(struct_benevoles) {
        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/emails', {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(struct_benevoles),
        }).then(response => response.json())
            .then(json => {
                for (var i = 0; i !== json.list.length; i++) {
                    for (var j = 0; j !== this.benevoles.length; j++) {
                        if (json.list[i].nivol === this.benevoles[j].nivol) {
                            this.benevoles[j].email = json.list[i].email;
                            this.benevoles[j].portable = json.list[i].portable;
                        }
                    }
                }
                this.emit("receive_benevoles_emails", {
                    pages: struct_benevoles.pages,
                });
                this.emit("receive_recyclage_emails", {
                    pages: struct_benevoles.pages,
                });
            });
    }

    getCompetences() {
        fetch('http://' + AppStore.getPegassAPI() + '/competences', {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.competences = json.competences;
                this.nominations = json.nominations;
                this.formations = json.formations;
                this.emit("get_competences");
            });
    }

    getListEmails() {
        var listEmails = '';
        for (var j = 0; j !== this.benevoles.length; j++) {
            if (this.benevoles[j].email) {
                listEmails += this.benevoles[j].email + '; ';
            }
        }
        return listEmails;
    }
}

const competencesStore = new CompetencesStore();

export default competencesStore;
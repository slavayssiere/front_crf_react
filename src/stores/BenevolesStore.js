import { EventEmitter } from "events";
import AppStore from './AppStore';
import ConnectStore from './ConnectStore';

class BenevolesStore extends EventEmitter {
    constructor() {
        super();
        this.benevoles = [];
        this.change = null;
    }

    getAllBenevoles() {
        return this.benevoles;
    }

    getBenevoles() {
        var page = 0;
        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/all?ul=' + ConnectStore.getUl() + '&page=' + page, {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.benevoles = this.benevoles.concat(json.list);
                this.getEmails(json);
                this.emit("change", {
                    pages: json.pages,
                });
                for (page = 1; page !== json.pages; page++) {
                    fetch('http://' + AppStore.getPegassAPI() + '/benevoles/all?ul=' + ConnectStore.getUl() + '&page=' + page, {
                        method: "GET",
                        headers: ConnectStore.getHeaders(),
                    }).then(response => response.json())
                        .then(json => {
                            this.benevoles = this.benevoles.concat(json.list);
                            this.getEmails(json);
                            this.emit("change", {
                                pages: json.pages,
                            });
                        });
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
                        if (json.list[i].nivol === this.benevoles[j].id) {
                            this.benevoles[j].email = json.list[i].email;
                            this.benevoles[j].portable = json.list[i].portable;
                        }
                    }
                }
                this.emit("get_emails", {
                    pages: struct_benevoles.pages,
                });
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

    changeEmail(nivol, data_struct) {
        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/changeinfo/' + nivol, {
            method: "PUT",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(data_struct),
        }).then(function (resp) {
            console.log(resp);
        });
    }
}

const benevolesStore = new BenevolesStore();

export default benevolesStore;
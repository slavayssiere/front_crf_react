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
                this.emit("change");
                for (page = 1; page !== json.pages; page++) {
                    fetch('http://' + AppStore.getPegassAPI() + '/benevoles/all?ul=' + ConnectStore.getUl() + '&page=' + page, {
                        method: "GET",
                        headers: ConnectStore.getHeaders(),
                    }).then(response => response.json())
                        .then(json => {
                            this.benevoles = this.benevoles.concat(json.list);
                            this.emit("change");
                        });
                }
                this.emit("change");
            });
    }

    getEmails(struct_benevoles){
        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/emails', {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(struct_benevoles),
        }).then(function (resp){
            console.log(resp);
        });
    }

    changeEmail(nivol, data_struct){
         fetch('http://' + AppStore.getPegassAPI() + '/benevoles/changeinfo/' + nivol, {
            method: "PUT",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(data_struct),
        }).then(function (resp){
            console.log(resp);
        });
    }
}

const benevolesStore = new BenevolesStore();

export default benevolesStore;
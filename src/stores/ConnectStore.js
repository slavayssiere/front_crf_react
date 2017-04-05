import { EventEmitter } from "events";
import AppStore from './AppStore';

class ConnectStore extends EventEmitter {
    constructor() {
        super();
        this.pegass = {
            connect: false,
        }
        this.google = {
            connect: false,
        }
    }

    connectToGoogle(token) {
        fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(json => {
                console.log(json);
                this.google = json;
                this.google.token = token;
                this.google.connect = true;

                this.emit("connect_google");
            });
    }

    connectToPegass(login, password) {
        fetch('http://' + AppStore.getPegassAPI() + '/connect', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'username': login,
                'password': password
            }
        }).then(response => response.json())
            .then(json => {
                this.pegass = json;
                this.pegass.login = login;
                this.pegass.connect = true;
                this.emit("connect_pegass");
            });
    }

    getGaiaData() {
        fetch('http://' + AppStore.getPegassAPI() + '/benevoles/address/' + this.getGaiaId(), {
            method: "GET",
            headers: this.getHeaders(),
        }).then(response => response.json())
            .then(json => {
                this.gaia = json;
                this.emit("connect_gaia");
            });
    }


    isPegassConnected() {
        return this.pegass.connect;
    }

    isPegassAdmin() {
        return this.pegass.admin.peutAdministrer;
    }

    isGoogleConnected() {
        return this.google.connect;
    }

    getNivol(){
        return this.pegass.utilisateur.id;
    }

    getGaiaId(){
        return this.pegass.utilisateur.gaia_id;
    }

    getUsername() {
        return this.pegass.utilisateur.prenom + ' ' + this.pegass.utilisateur.nom;
    }

    getUl() {
        return this.pegass.utilisateur.structure.id;
    }

    getRole() {
        return this.pegass.role;
    }

    isInTeamFormat() {
        return this.isInTeamFormat;
    }

    getGoogleName() {
        return this.google.name;
    }

    getGoogleEmail() {
        return this.google.email;
    }

    getAdresse() {
        return this.gaia.adresseLine1 + ' ' + this.gaia.adresseLine2 + ' ' + this.gaia.adresseLine3;
    }

    getAccidentContact() {
        return this.gaia.persContPrin;
    }

    getStructure(){
        return this.pegass.structuresAdministrees[0].libelle;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'F5-ST': this.pegass.F5_ST,
            'LastMRH-Session': this.pegass.LastMRH_Session,
            'MRHSession': this.pegass.MRHSession,
            'SAML': this.pegass.SAML,
            'JSESSIONID': this.pegass.JSESSIONID
        }
    }
}

const connectStore = new ConnectStore();

export default connectStore;
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
        this.accessToken= '';
        this.checkStatus = this.checkStatus.bind(this);
        this.connectToAll = this.connectToAll.bind(this);
        AppStore.on("config_receive", this.connectToAll);
    }

    connectToAll() {
        var token = sessionStorage.getItem("GoogleToken");
        var login = sessionStorage.getItem("PegassLogin");
        var password = sessionStorage.getItem("PegassPassword");
        var accesstoken = sessionStorage.getItem("AccessToken");

        if (token) {
            this.setAccessToken(accesstoken);
            this.connectToGoogle(token);
        }

        if (login && password) {
            this.connectToPegass(login, password);
        }
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    connectToGoogle(token) {
        fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(this.checkStatus)
            .then(response => response.json())
            .then(json => {
                this.google = json;
                this.google.token = token;
                this.google.connect = true;
                sessionStorage.setItem("GoogleToken", token);

                this.emit("connect_google");
            })
            .catch(function (error) {
                console.log('request failed', error);
                sessionStorage.removeItem("GoogleToken");
                if(this.google){
                    this.google.connect = false;
                }
            });
    }

    connectToPegass(login, password) {

        this.emit("connecting_pegass");

        sessionStorage.setItem("PegassLogin", login);
        sessionStorage.setItem("PegassPassword", password);

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

    setAccessToken(accessToken){
        sessionStorage.setItem("AccessToken", accessToken);
        this.accessToken = accessToken;
    }

    getAccessToken(){
        return this.accessToken;
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

    getNivol() {
        return this.pegass.utilisateur.id;
    }

    getGaiaId() {
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
        if (this.gaia) {
            return this.gaia.adresseLine1 + ' ' + this.gaia.adresseLine2 + ' ' + this.gaia.adresseLine3;
        } else {
            return '';
        }
    }

    getAccidentContact() {
        if (this.gaia) {
            return this.gaia.persContPrin;
        } else {
            return '';
        }
    }

    getStructure() {
        return this.pegass.structuresAdministrees[0].libelle;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'F5-ST': this.pegass.F5_ST,
            'LastMRH-Session': this.pegass.LastMRH_Session,
            'MRHSession': this.pegass.MRHSession,
            'SAML': this.pegass.SAML,
            'JSESSIONID': this.pegass.JSESSIONID,
            'Authorization': 'Bearer '+this.getAccessToken(), 
        }
    }
}

const connectStore = new ConnectStore();

export default connectStore;
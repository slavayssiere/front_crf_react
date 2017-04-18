import { EventEmitter } from "events";

class AppStore extends EventEmitter {
    constructor() {
        super();
        this.getData();
    }

    getData() {
        fetch('/config.json', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(json => {
                console.log(json);
                this.url_ws_pegass = json.url_ws_pegass;
                this.url_ws_google = json.url_ws_google;
                this.front_version = json.version;
                this.fetchGoogleVersion();
                this.fetchPegassVersion();

                this.emit("config_receive");
            });
    }

    fetchGoogleVersion() {
        fetch('http://' + this.getGoogleAPI() + '/info', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(json => {
                this.google_version = json.app.version;
                this.emit("config_receive");
            });
    }

    fetchPegassVersion() {
        fetch('http://' + this.getPegassAPI() + '/version', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(json => {
                this.pegass_version = json.version;
                this.emit("config_receive");
            });
    }

    getPegassAPI() {
        return this.url_ws_pegass;
    }

    getGoogleAPI() {
        return this.url_ws_google;
    }

    getPegassVersion() {
        return this.pegass_version;
    }

    getGoogleVersion() {
        return this.google_version;
    }

    getFrontVersion() {
        return this.front_version;
    }
}

const appStore = new AppStore();

export default appStore;


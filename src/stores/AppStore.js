import { EventEmitter } from "events";

class AppStore extends EventEmitter {
    constructor() {
        super();
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
                this.emit("config_receive");
            });
    }

    getPegassAPI() {
        return this.url_ws_pegass;
    }

    getGoogleAPI() {
        return this.url_ws_google;
    }
}

const appStore = new AppStore();

export default appStore;


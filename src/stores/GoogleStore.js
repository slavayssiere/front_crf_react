import { EventEmitter } from "events";
import AppStore from './AppStore';
import ConnectStore from './ConnectStore';

class GoogleStore extends EventEmitter {
    constructor() {
        super();
        this.sessions = [];
        this.newsession = {};
        this.session = {};
        this.emails = [];
        this.checkStatus = this.checkStatus.bind(this);
    }

    getSessions() {
        return this.sessions;
    }

    getNewSession() {
        return this.newsession;
    }

    getSession() {
        return this.session;
    }

    getEmails() {
        return this.emails;
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText);
            error.response = response
            throw error
        }
    }

    getEmailsList() {
        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/getemails?token=' + ConnectStore.getAccessToken(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(this.checkStatus)
            .then(response => response.json())
            .then(json => {
                this.emails = json;
                this.emit("get_emails");
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    getDataSession(dateFormation, typeFormation) {
        var data = {
            date: dateFormation,
            type: typeFormation
        };

        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/state?token=' + ConnectStore.getAccessToken(), {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(data),
        }).then(this.checkStatus)
            .then(response => response.json())
            .then(json => {
                this.session = json;
                this.emit("get_session_selected");
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    sendInscription(dataSession, emailData) {
        var google_id = dataSession.google_id;
        var row = dataSession.emptyRows[0];

        console.log("dataSession", dataSession);
        console.log("emailData", emailData);

        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/inscription/' + google_id + '/' + row + '?token=' + ConnectStore.getAccessToken(), {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(emailData),
        }).then(this.checkStatus)
            .then(response => {
                //delete in liste
                this.deleteRow(emailData);

                //send emails
                fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/' + google_id + '/sendinscrits?token=' + ConnectStore.getAccessToken(), {
                    method: "PUT",
                    headers: ConnectStore.getHeaders(),
                })
                    .then(this.checkStatus)
                    .then(response => {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log('request failed', error);
                    })
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    sendComplete(dataSession, emailData) {
        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/complete?token=' + ConnectStore.getAccessToken(), {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(emailData),
        }).then(this.checkStatus)
            .then(response => {
                //delete in liste
                this.deleteRow(emailData);
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    createDraft(emailData) {
        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/draft?token=' + ConnectStore.getAccessToken(), {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(emailData),
        })
            .then(this.checkStatus)
            .then(response => {
                console.log(response);
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    deleteRow(emailData) {
        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/getemails/' + emailData.row + '?token=' + ConnectStore.getAccessToken(), {
            method: "DELETE",
            headers: ConnectStore.getHeaders(),
        })
            .then(this.checkStatus)
            .then(response => {
                console.log(response);
                var index = this.emails.indexOf(emailData);
                this.emails.splice(index, 1);
                this.emit("get_emails");
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    getSessionsStates() {
        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/state?token=' + ConnectStore.getAccessToken(), {
            method: "GET",
            headers: ConnectStore.getHeaders(),
        }).then(this.checkStatus)
            .then(response => response.json())
            .then(json => {
                this.sessions = json;
                this.emit("get_sessions");
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }

    createSession(data) {
        fetch('http://' + AppStore.getGoogleAPI() + '/api/sheets/create?token=' + ConnectStore.getAccessToken(), {
            method: "POST",
            headers: ConnectStore.getHeaders(),
            body: JSON.stringify(data),
        }).then(this.checkStatus)
            .then(response => response.json())
            .then(json => {
                this.newsession = json;
                this.emit("create_session");
            })
            .catch(function (error) {
                console.log('request failed', error);
            });
    }
}

const googleStore = new GoogleStore();

export default googleStore;
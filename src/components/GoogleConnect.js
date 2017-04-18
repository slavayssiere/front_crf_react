import React from "react";

import GoogleLogin from 'react-google-login';

import ConnectStore from '../stores/ConnectStore';

export default class PegassConnect extends React.Component {
    constructor() {
        super();

        this.state = {
            connect: false,
            teamFormat: false,
        }

        this.getData = this.getData.bind(this);
        this.getTeamFormat = this.getTeamFormat.bind(this);
    }

    componentWillMount() {
        ConnectStore.on("connect_google", this.getData);
        ConnectStore.on("connect_pegass", this.getTeamFormat);
    }

    componentWillUnmount() {
        ConnectStore.removeListener("connect_google", this.getData);
        ConnectStore.removeListener("connect_pegass", this.getTeamFormat);
    }

    getData() {
        this.setState({
            connect: true,
        });
    }

    getTeamFormat() {
        this.setState({
            teamFormat: ConnectStore.isInTeamFormat(),
        });
    }

    successResponseGoogle = (response) => {
        ConnectStore.setAccessToken(response.accessToken);
        ConnectStore.connectToGoogle(response.tokenId);
    }

    failResponseGoogle = (response) => {
        console.log("failed", response);
    }

    loading = () => {
        console.log('loading');
    }


    render() {
        if (ConnectStore.isGoogleConnected()) {
            return (
                <div>
                    Connect with {ConnectStore.getGoogleName()}!
                </div>
            );
        }
        else {
            if(this.state.teamFormat){
                return (
                    <GoogleLogin
                        clientId="794502709562-bgo3mjvn9jhpifvd0no50vebts8j9050.apps.googleusercontent.com"
                        onSuccess={this.successResponseGoogle}
                        onFailure={this.failResponseGoogle}
                        onRequest={this.loading}
                        scope="profile email https://mail.google.com/ https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.scripts https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/script.external_request"
                        className="btn btn-sm btn-default">
                        Connect to gmail
                    </GoogleLogin>
                );
            } else {
                return null;
            }
        }
    }
}
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
                        clientId="1037173200559-4ddejjtnncjtjdmobipmrg7gbsammpfu.apps.googleusercontent.com"
                        onSuccess={this.successResponseGoogle}
                        onFailure={this.failResponseGoogle}
                        onRequest={this.loading}
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
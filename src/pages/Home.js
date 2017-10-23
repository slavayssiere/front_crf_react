import React from "react";
import {Jumbotron, Col, Panel } from "react-bootstrap";

import ConnectStore from '../stores/ConnectStore';
import PegassConnect from '../components/PegassConnect';
import GoogleConnect from '../components/GoogleConnect';

export default class Home extends React.Component {
    constructor() {
        super();
        
        this.state = {
            connectPegass: ConnectStore.isPegassConnected(),
            connectGoogle: ConnectStore.isGoogleConnected(),
            adresse: ConnectStore.getAdresse(),
            accidentContact: ConnectStore.getAccidentContact(),
        }
        this.getData = this.getData.bind(this);
        this.getDataGaia = this.getDataGaia.bind(this);
    }

    componentWillMount() {
        ConnectStore.on("connect_pegass", this.getData);
        ConnectStore.on("connect_google", this.getData);
        ConnectStore.on("connect_gaia", this.getDataGaia);
    }

    componentWillUnmount() {
        ConnectStore.removeListener("connect_pegass", this.getData);
        ConnectStore.removeListener("connect_google", this.getData);
        ConnectStore.removeListener("connect_gaia", this.getDataGaia);
    }

    getData() {
        this.setState({
            connectPegass: ConnectStore.isPegassConnected(),
            connectGoogle: ConnectStore.isGoogleConnected(),
        })

        if(ConnectStore.isPegassConnected()){
            ConnectStore.getGaiaData();
        }
    }

    getDataGaia() {
        this.setState({
            adresse: ConnectStore.getAdresse(),
            accidentContact: ConnectStore.getAccidentContact(),
        })
    }

    render() {
        let DataGoogle = null;
        if(this.state.connectGoogle){
            DataGoogle = <Panel>
                    <p>Connect to Google with: {ConnectStore.getGoogleEmail()} ({ConnectStore.getGoogleName()})</p>
                    <p>{ConnectStore.getGoogleEmail() === 'inscription.crf7511@gmail.com' ? 'Vous pouvez gérer les emails' : 'Attention, on ne peut pas gérer les emails avec cette adresse'}</p>
                </Panel>;
        }
        if(this.state.connectPegass){
            return (
                <Col xs={8} xsOffset={2}>
                    <Jumbotron>
                        <h2>Salut, {ConnectStore.getUsername()}</h2>
                        <Panel>
                            <p>Role (dans cette application): {ConnectStore.getRole()}</p>
                            <p>Admin Pegass: {ConnectStore.isPegassAdmin() ? 'oui' : 'non'}</p>
                            <p>Nivol: {ConnectStore.getNivol()}</p>
                            <p>Structure administrable: {ConnectStore.getStructure()}</p>
                            <p>Adresse: {this.state.adresse}</p>
                            <p>En cas d'accident: {this.state.accidentContact}</p>
                        </Panel>
                        {DataGoogle}
                    </Jumbotron>
                </Col>
            );
        } else {
            return (
                <Col xs={8} xsOffset={2}>
                    <Jumbotron>
                        <h1>Bonjour !</h1>
                        <p>Pour commencer, connecte toi ci dessus avec ton login et password Pegass/Gaia.</p>
                        <Panel header="Connexion">
                            <PegassConnect />
                            <GoogleConnect />
                        </Panel>
                    </Jumbotron>
                </Col>
            );
        }
    }
}
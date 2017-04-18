import React from "react";

import { FormControl, Button } from 'react-bootstrap';


import ConnectStore from '../stores/ConnectStore';

export default class PegassConnect extends React.Component {
    constructor() {
        super();

        this.state = {
            nivol: 'login pegass',
            password: 'password',
            connect: false,
            loading: false,
        }
        this.getData = this.getData.bind(this);
        this.getLoading = this.getLoading.bind(this);
    }

    componentWillMount() {
        ConnectStore.on("connect_pegass", this.getData);
        ConnectStore.on("connecting_pegass", this.getLoading);
    }

    componentWillUnmount() {
        ConnectStore.removeListener("connect_pegass", this.getData);
        ConnectStore.removeListener("connecting_pegass", this.getLoading);
    }

    getLoading() {
        this.setState({
            loading: true,
        })
    }

    getData() {
        this.setState({
            connect: true,
            loading: false,
        });
    }

    connect() {
        console.log("connect with", this.state.nivol, this.state.password)
        ConnectStore.connectToPegass(this.state.nivol, this.state.password);
    }

    handleChange(event) {
        var target = event.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value,
        })
    }

    render() {
        if (this.state.loading) {
            return <div>Connexion en cours...</div>;
        } else {
            if (ConnectStore.isPegassConnected()) {
                return (
                    <div>
                        Bienvenue, {ConnectStore.getUsername()}. ({ConnectStore.getRole()})
                </div>
                );
            }
            else {
                return (
                    <div>
                        <FormControl name="nivol" bsSize="small" type="input" placeholder={this.state.nivol} onChange={this.handleChange.bind(this)} />
                        <FormControl name="password" bsSize="small" type="password" placeholder={this.state.password} onChange={this.handleChange.bind(this)} />
                        <Button bsSize="small" type="submit" onClick={this.connect.bind(this)}>Connect to Pegass</Button>
                    </div>
                );
            }
        }
    }
}
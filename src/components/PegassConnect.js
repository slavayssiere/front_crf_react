import React from "react";

import { FormControl, Button } from 'react-bootstrap';


import ConnectStore from '../stores/ConnectStore';

export default class PegassConnect extends React.Component {
    constructor() {
        super();

        this.state = {
            nivol: 'nivol',
            password: 'password',
            connect: false,
        }

        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        ConnectStore.on("connect_pegass", this.getData);
    }

    componentWillUnmount() {
        ConnectStore.removeListener("connect_pegass", this.getData);
    }

    getData(){
        this.setState({
            connect: true,
        });
    }

    connect(){
        console.log("connect with", this.state.nivol, this.state.password)
        ConnectStore.connectToPegass(this.state.nivol, this.state.password);
    }

    handleChange(event){
        var target = event.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value,
        })
    }

    render() {
        if(ConnectStore.isPegassConnected()){
            return (
                <div>
                    Welcome, {ConnectStore.getUsername()}. ({ConnectStore.getRole()})
                </div>
            );
        }
        else {
            return (
                <div>
                    <FormControl name="nivol" bsSize="small" type="input" placeholder={this.state.nivol} onChange={this.handleChange.bind(this)} />
                    <FormControl name="password" bsSize="small" type="password" placeholder={this.state.password} onChange={this.handleChange.bind(this)}/>
                    <Button bsSize="small" type="submit" onClick={this.connect.bind(this)}>Connect to Pegass</Button>
                </div>
            );
        }
    }
}
import React from "react";
import { Col } from "react-bootstrap";
import GoogleStore from '../../stores/GoogleStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import MDSpinner from 'react-md-spinner';

export default class SessionsInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            sessions: null,
            loading: true,
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        GoogleStore.on("get_sessions", this.getData);
        GoogleStore.getSessionsStates();
    }

    componentWillUnmount() {
        GoogleStore.removeListener("get_sessions", this.getData);
    }

    getData() {
        this.setState({
            sessions: GoogleStore.getSessions(),
            loading: false,
        })
    }

    linkFormatter(cell, row){
        return (
            <a href={"https://docs.google.com/spreadsheets/d/"+cell+"/edit#gid=0"}>{row.google_name}</a>
            )
    }
    
    dateFormatter(cell, row){
        var date = new Date(cell);
        return (
            <p>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</p>
            )
    }

    render() {

        let Spinner = null;
        if(this.state.loading){
            Spinner = <p>Chargement...<MDSpinner /></p>;
        }

        let ListSessions = null;
        if (this.state.sessions) {
            ListSessions = <BootstrapTable data={this.state.sessions}>
                <TableHeaderColumn dataField='formateur' isKey={true}>Formateur</TableHeaderColumn>
                <TableHeaderColumn dataField='date' dataFormat={this.dateFormatter.bind(this)}>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='type' dataSort={true}>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='nb_empty'>Nombre de places restantes</TableHeaderColumn>
                <TableHeaderColumn dataField='google_id' dataFormat={this.linkFormatter.bind(this)}>Lien google</TableHeaderColumn>
            </BootstrapTable>;
        }

        return (
            <Col xs={8} xsOffset={2}>

                <h2>Sessions</h2>
                {Spinner}
                {ListSessions}
            </Col>
        );
    }
}

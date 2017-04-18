import React from "react";
import { Col, Panel, Button } from "react-bootstrap";
import GoogleStore from '../../stores/GoogleStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class SessionsManagements extends React.Component {
    constructor() {
        super();
        this.state = {
            emails: null,
            loading: true,
            row: null,
            session: null,
        }
        this.getEmails = this.getEmails.bind(this);
        this.getSession = this.getSession.bind(this);
    }

    componentWillMount() {
        GoogleStore.on("get_emails", this.getEmails);
        GoogleStore.on("get_session_selected", this.getSession);
        GoogleStore.getEmailsList();
    }

    componentWillUnmount() {
        GoogleStore.removeListener("get_emails", this.getEmails);
        GoogleStore.removeListener("get_session_selected", this.getSession);
    }

    getEmails() {
        this.setState({
            emails: GoogleStore.getEmails(),
            loading: false,
        })
    }

    getSession() {
        this.setState({
            session: GoogleStore.getSession(),
            loading: false,
        })
    }

    linkFormatter(cell, row) {
        return (
            <a href={"https://docs.google.com/spreadsheets/d/" + cell + "/edit#gid=0"}>{row.google_name}</a>
        )
    }

    dateFormatter(cell, row) {
        var date = new Date(cell);
        return (
            <p>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</p>
        )
    }

    deleteFormatter(cell, row) {
        return (
            <i className="fa fa-times" onClick={this.deleteRow.bind(this, row)}></i>
        )
    }

    emailFormatter(cell, row) {
        return (
            <i className="fa fa-envelope" onClick={this.createDraft.bind(this, row)}></i>
        )
    }

    selectFormatter(cell, row) {
        return (
            <i className="fa fa-search" onClick={this.onRowSelect.bind(this, row)}></i>
        )
    }

    onRowSelect(row) {
        console.log("onRowSelect", row);
        this.setState({
            loading: true,
            row: row,
        })
        GoogleStore.getDataSession(row.dateFormation, row.typeFormation);
    }

    deleteRow(row) {
        console.log("deleteRow", row);
        GoogleStore.deleteRow(row);
    }

    createDraft(row) {
        console.log("createDraft", row);
        GoogleStore.createDraft(row);
    }

    inscriptionSelect(){
        GoogleStore.sendInscription(this.state.session, this.state.row);
        this.setState({
            row: null,
            session: null,
        })
    }

    sessionComplete(){
        GoogleStore.sendComplete(this.state.session, this.state.row);
        this.setState({
            row: null,
            session: null,
        })
    }
    

    render() {
        let ListEmails = null;

        if (this.state.emails) {
            ListEmails = <BootstrapTable data={this.state.emails}>
                <TableHeaderColumn dataFormat={this.selectFormatter.bind(this)}>Selectionner</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.deleteFormatter.bind(this)}>Supprimer la ligne</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.emailFormatter.bind(this)}>Préparer un email</TableHeaderColumn>
                <TableHeaderColumn dataField='row' isKey={true}>Ligne</TableHeaderColumn>
                <TableHeaderColumn dataField='dateFormation' dataSort={true} dataFormat={this.dateFormatter.bind(this)}>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='typeFormation'>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='message'>Message</TableHeaderColumn>
                <TableHeaderColumn dataField='civilite'>Civilite</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
            </BootstrapTable>;
        }

        let SessionSelect = null;
        if(this.state.session){
            let ButtonSelect = null;
            if(this.state.session.nb_empty > 0){
                ButtonSelect = <Button onClick={this.inscriptionSelect.bind(this)}>Inscrire le participant sur cette session</Button>;
            } else {
                ButtonSelect = <Button onClick={this.sessionComplete.bind(this)}>Session complète, l'informer !</Button>;
            }
            SessionSelect = <div>
                <Panel header="Session">
                    <p>Formateur: {this.state.session.formateur}</p>
                    <p>Nom du fichier: {this.state.session.google_name}</p>
                    <p>Place(s) disponible(s): {this.state.session.nb_empty}</p>

                    {ButtonSelect}
                </Panel>
            </div>
        }

        let RowSelect = null;
        if(this.state.row){
            RowSelect = <div>
                <Panel header="Participant selectionné">
                    <p>{this.state.row.civilite} {this.state.row.prenom} {this.state.row.nom}</p>
                    <p>Email: {this.state.row.email}</p>
                    <p>{this.state.row.message}</p>
                </Panel>
            </div>
        }

        return (
            <Col xs={8} xsOffset={2}>

                <h2>Emails</h2>
                {SessionSelect}
                {RowSelect}
                {ListEmails}
            </Col>
        );
    }
}

import React from "react";
import { Col, ControlLabel, FormGroup, FormControl, Panel, Button } from "react-bootstrap";
import GoogleStore from '../../stores/GoogleStore';
import CompetencesStore from '../../stores/CompetencesStore';
import DatePicker from 'react-bootstrap-date-picker';

export default class SessionCreate extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            date: new Date().toISOString(),
            formattedValue: '',
            type: 'PSC1',
            heure: '9',
            formateur: '',
            formateurNivol: '',
            list_formateurs: [],
            session: null,
        }
        this.getData = this.getData.bind(this);
        this.getFormateurs = this.getFormateurs.bind(this);
    }

    componentWillMount() {
        GoogleStore.on("create_session", this.getData);
        CompetencesStore.on("receive_benevoles_finish", this.getFormateurs);
        CompetencesStore.getBenevolesWithCompetence("FORM", "286");
    }

    componentWillUnmount() {
        GoogleStore.removeListener("create_session", this.getData);
        CompetencesStore.removeListener("receive_benevoles_finish", this.getFormateurs);
    }

    componentDidUpdate(){
        var hiddenInputElement = document.getElementById("example-datepicker");
        console.log(hiddenInputElement.value); // ISO String, ex: "2016-11-19T12:00:00.000Z" 
        console.log(hiddenInputElement.getAttribute('data-formattedvalue')) // Formatted String, ex: "11/19/2016" 
    }

    getFormateurs(){
        this.setState({
            list_formateurs: CompetencesStore.getAllBenevoles(),
            loading: false,
        })
    }

    getData() {
        this.setState({
            session: GoogleStore.getNewSession(),
            loading: false,
        })

    }

    createSession(){
         this.setState({
            loading: true,
        })

        GoogleStore.createSession({
            formateur: this.state.formateur,
            nivol: this.state.formateurNivol,
            address: "12 rue Auguste Laurent 75011 Paris",
            date: this.state.date,
            type: this.state.type,
            heure: this.state.heure
        })
    }

    handleChange(value, formattedValue) {
        this.setState({
            date: value, // ISO String, ex: "2016-11-19T12:00:00.000Z" 
            formattedValue: formattedValue // Formatted String, ex: "11/19/2016" 
        });
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

     handleSelect(event){
        
        var target = event.target;
        var value = target.value;
        var name = target.name;
        this.setState({
            [name]: value,
        })

        if(name==='formateurNivol'){
            for(var i = 0; i !== this.state.list_formateurs.length; i++){
                if(this.state.list_formateurs[i].nivol === value){
                    this.setState({
                        formateur: this.state.list_formateurs[i].prenom + ' ' + this.state.list_formateurs[i].nom,
                    })
                    break;
                }
            }
        }
    }

    render() {

        let ListFormateurs = this.state.list_formateurs.map((formateur) => {
            return <option key={formateur.nivol} value={formateur.nivol}>{formateur.prenom} {formateur.nom}</option>
        });

        let PanelNewSession = null;
        if(this.state.session !== null){
            //{"formateur":"Maureen Mahe","address":null,"date":1469138400000,"id":0,"type":"PSC1","google_id":"1W2a8PELm7wNsNLZpjRNn57UkMPgmj0jhXxD83rcLcBY","google_name":"ANNULEE - 2016 - 07 - 22 PSC1 Maureen","inscriptions":[],"emptyRows":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"nb_empty":15}
            var date = new Date(this.state.session.date);
            PanelNewSession = <Panel>
                    <p>{this.state.session.formateur}</p>
                    <p>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</p>
                    <p>{this.state.session.type}</p>
                    <h2>Tu dois aller dans la feuille, puis cliquer dans le menu "emails" sur "add triggers"</h2>
                    <p>Le document: <a href={"https://docs.google.com/spreadsheets/d/"+this.state.session.google_id+"/edit#gid=0"}>{this.state.session.google_name}</a></p>
                </Panel>;
        }
        
        return (
            <Col xs={8} xsOffset={2}>
                <h2>Création d'une nouvelle session</h2>
                <FormGroup>
                    <ControlLabel>Date:</ControlLabel>
                    <DatePicker id="example-datepicker" disabled={this.state.loading} value={this.state.date} onChange={this.handleChange.bind(this)} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Type:</ControlLabel>
                    <FormControl componentClass="select" disabled={this.state.loading} name="type" placeholder="select" onChange={this.handleSelect.bind(this)}>
                        <option value="PSC1">PSC1</option>
                        <option value="IPSEN">IPSEN</option>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Heure de début (9 pour 9:00, 10 pour 10:00, etc):</ControlLabel>
                    <FormControl type="input" disabled={this.state.loading} id="formControlsText" name="heure" label="Text" placeholder="Heure..." />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Formateurs:</ControlLabel>
                    <FormControl componentClass="select" disabled={this.state.loading} name="formateurNivol" placeholder="select" onChange={this.handleSelect.bind(this)}>
                        {ListFormateurs}
                    </FormControl>
                </FormGroup>
                <Panel>
                    <h3>Avec les paramètres:</h3>
                    <p>Date: {this.state.formattedValue}</p>
                    <p>Type: {this.state.type}</p>
                    <p>Heure: {this.state.heure}</p>
                    <p>Formateur: {this.state.formateur} (Nivol: {this.state.formateurNivol})</p>
                    <p><Button disabled={this.state.loading} onClick={this.createSession.bind(this)}>Créer la session</Button></p>
                </Panel>
                {PanelNewSession}
            </Col>
        );
    }
}

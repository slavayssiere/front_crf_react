import React from "react";
import { Col, Table, Panel, Button, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import CompetencesStore from '../../stores/CompetencesStore';
import Benevole from '../../components/Benevole';

export default class NotCompetences extends React.Component {
    constructor() {
        super();
        this.state = {
            competences: [],
            nominations: [],
            formations: [],
            benevoles: [],
            open: false,
            listEmails: '',
            loading: false,
            pages: 0,
            nb_pages_receive: 0,
        }
        this.getComp = this.getComp.bind(this);
        this.getBen = this.getBen.bind(this);
        this.getBenContact = this.getBenContact.bind(this);
    }

    componentWillMount() {
        CompetencesStore.on("get_competences", this.getComp);
        CompetencesStore.on("receive_benevoles", this.getBen);
        CompetencesStore.on("receive_benevoles_emails", this.getBenContact);
        CompetencesStore.getCompetences();
    }

    componentWillUnmount() {
        CompetencesStore.removeListener("get_competences", this.getComp);
        CompetencesStore.removeListener("receive_benevoles", this.getBen);
        CompetencesStore.removeListener("receive_benevoles_emails", this.getBenContact);
    }

    getComp() {
        this.setState({
            competences: CompetencesStore.getAllCompetences(),
            nominations: CompetencesStore.getAllNominations(),
            formations: CompetencesStore.getAllFormations(),
        })
    }

    getBen(data) {
        this.setState({
            benevoles: CompetencesStore.getAllBenevoles(),
        })
    }

    getBenContact(data) {
        this.setState({
            benevoles: CompetencesStore.getAllBenevoles(),
            pages: data.pages,
            nb_pages_receive: (this.state.nb_pages_receive + 1),
        })

        if (this.state.nb_pages_receive === this.state.pages) {
            this.setState({
                loading: false,
            })
        }
    }

    getEmails() {
        this.setState({
            open: !this.state.open,
            listEmails: CompetencesStore.getListEmails(),
        });

    }

    handleSelectComp(event) {
        this.setState({
            open: false,
            loading: true,
            pages: 0,
            nb_pages_receive: 0,
        })
        var target = event.target;
        var value = target.value;
        var name = target.name;
        //type: COMP, NOMI, FORM
        CompetencesStore.getBenevolesWithoutCompetence(name, value);
    }

    render() {
        let ListBenevoles = this.state.benevoles.map((benevole) => {
            benevole.id = benevole.nivol;
            return <Benevole key={benevole.id} {...benevole} admin={false} />
        });

        let ListCompetences = this.state.competences.map((competence) => {
            return <option key={competence.id} value={competence.id}>{competence.libelle}</option>
        });

        let ListNominations = this.state.nominations.map((nomination) => {
            return <option key={nomination.id} value={nomination.id}>{nomination.libelle}</option>
        });

        let ListFormations = this.state.formations.map((formation) => {
            return <option key={formation.id} value={formation.id}>{formation.libelle}</option>
        });

        return (
            <Col xs={8} xsOffset={2}>
                <div>
                    <Button onClick={this.getEmails.bind(this)} disabled={this.state.loading}>
                        Récupérer la liste des emails
                    </Button>
                    <Panel collapsible expanded={this.state.open}>
                        <p>{this.state.listEmails}</p>
                    </Panel>
                </div>
                <FormGroup controlId="formControlsCompAcq">
                    <ControlLabel>Rechercher une non-competence</ControlLabel>
                    <FormControl componentClass="select" name="COMP" placeholder="select" onChange={this.handleSelectComp.bind(this)}>
                        {ListCompetences}
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="formControlsCompAcq">
                    <ControlLabel>Rechercher une non-nomination</ControlLabel>
                    <FormControl componentClass="select" name="NOMI" placeholder="select" onChange={this.handleSelectComp.bind(this)}>
                        {ListNominations}
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="formControlsCompAcq">
                    <ControlLabel>Rechercher une non-formation</ControlLabel>
                    <FormControl componentClass="select" name="FORM" placeholder="select" onChange={this.handleSelectComp.bind(this)}>
                        {ListFormations}
                    </FormControl>
                </FormGroup>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Nivol</th>
                            <th>Prenom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Portable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ListBenevoles}
                    </tbody>
                </Table>
            </Col>
        );
    }
}
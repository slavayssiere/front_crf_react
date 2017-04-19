import React from "react";
import { Col, Table, Panel, Button, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import CompetencesStore from '../../stores/CompetencesStore';
import Benevole from '../../components/Benevole';
import MDSpinner from 'react-md-spinner';

export default class Recyclages extends React.Component {
    constructor(props) {
        super();
        this.state = {
            formations: [],
            benevoles: [],
            open: false,
            listEmails: '',
            loading: false,
            geoType: props.geoType,
        }
        this.getFormations = this.getFormations.bind(this);
        this.getBen = this.getBen.bind(this);
        this.finishLoad = this.finishLoad.bind(this);
    }

    componentWillMount() {
        CompetencesStore.on("get_competences", this.getFormations);
        CompetencesStore.on("receive_recyclage", this.getBen);
        CompetencesStore.on("receive_recyclage_finish", this.finishLoad);
        CompetencesStore.getCompetences();
    }

    componentWillUnmount() {
        CompetencesStore.removeListener("get_competences", this.getFormations);
        CompetencesStore.removeListener("receive_recyclage", this.getBen);
        CompetencesStore.removeListener("receive_recyclage_finish", this.finishLoad);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            geoType: nextProps.geoType,
        })
    }

    finishLoad() {
        this.setState({
            loading: false,
        })
    }

    getFormations() {
        this.setState({
            formations: CompetencesStore.getAllFormations(),
        })
    }

    getBen() {
        this.setState({
            benevoles: CompetencesStore.getAllBenevoles(),
        })
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
        })
        var target = event.target;
        var value = target.value;
        CompetencesStore.getBenevolesARecycler(value, this.state.geoType);
    }

    render() {
        let ListBenevoles = this.state.benevoles.map((benevole) => {
            benevole.id = benevole.nivol;
            return <Benevole key={benevole.id} {...benevole} admin={false} />
        });

        let ListFormations = this.state.formations.map((formation) => {
            return <option key={formation.id} value={formation.id}>{formation.libelle}</option>
        });

        let Spinner = null;
        if(this.state.loading){
            Spinner = <p><MDSpinner /></p>;
        }

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
                    <ControlLabel>Rechercher une formation</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.handleSelectComp.bind(this)}>
                        {ListFormations}
                    </FormControl>
                </FormGroup>
                <h2>A recycler cette année pour {this.state.geoType}</h2>
                {Spinner}
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Nivol</th>
                            <th>Prenom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Portable</th>
                            <th>Date</th>
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
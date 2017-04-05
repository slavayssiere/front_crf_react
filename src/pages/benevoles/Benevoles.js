import React from "react";
import { Col, Table, Panel, Button } from "react-bootstrap";
import BenevolesStore from '../../stores/BenevolesStore';
import Benevole from '../../components/Benevole';

export default class Benevoles extends React.Component {
    constructor() {
        super();
        this.state = {
            benevoles: [],
            open: false,
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        BenevolesStore.on("change", this.getData);
        BenevolesStore.getBenevoles();
    }

    componentWillUnmount() {
        BenevolesStore.removeListener("change", this.getData);
    }

    getData() {
        this.setState({
            benevoles: BenevolesStore.getAllBenevoles(),
        })
    }

    getEmails(){
        this.setState({ open: !this.state.open });
    }

    render() {
        let ListBenevoles = this.state.benevoles.map((benevole) => {
            return <Benevole key={benevole.id} {...benevole} />
        });

        let ListEmails = this.state.benevoles.map((benevole) => {
            return benevole.email + ';'
        });

        return (
            <Col xs={8} xsOffset={2}>

                <div>
                    <Button onClick={this.getEmails.bind(this)}>
                        Récupérer la liste des emails
                    </Button>
                    <Panel collapsible expanded={this.state.open}>
                        'test'
                    </Panel>
                </div>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Nivol</th>
                            <th>Prenom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Exterieur</th>
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
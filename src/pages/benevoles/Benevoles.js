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
            listEmails: '',
            loading: true,
        }
        this.getData = this.getData.bind(this);
        this.finishLoad = this.finishLoad.bind(this);
    }

    componentWillMount() {
        BenevolesStore.on("change", this.getData);
        BenevolesStore.on("change_finish", this.finishLoad);
        BenevolesStore.getBenevoles();
    }

    componentWillUnmount() {
        BenevolesStore.removeListener("change", this.getData);
        BenevolesStore.removeListener("change_finish", this.finishLoad);
    }

    finishLoad(){
        this.setState({
            loading: false,
        })
    }

    getData() {
        this.setState({
            benevoles: BenevolesStore.getAllBenevoles(),
        })
    }

    getEmails() {
        this.setState({ 
            open: !this.state.open,
            listEmails: BenevolesStore.getListEmails(),
        });

    }

    render() {
        let ListBenevoles = this.state.benevoles.map((benevole) => {
            return <Benevole key={benevole.id} {...benevole} admin={true} />
        });

        return (
            <Col xs={8} xsOffset={2}>

                <div>
                    <Button onClick={this.getEmails.bind(this)} disabled={this.state.loading}>
                        Récupérer la liste des emails
                    </Button>
                    <Panel collapsible expanded={this.state.open}>
                         <Col xs={12} xsOffset={0}>
                            {this.state.listEmails}
                        </Col>
                    </Panel>
                </div>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Nivol</th>
                            <th>Prenom</th>
                            <th>Nom</th>
                            <th>Accept Email</th>
                            <th>Exterieur</th>
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
import React from "react";
import { Col, Table, Panel, Button } from "react-bootstrap";
import BenevolesStore from '../../stores/BenevolesStore';
import Benevole from '../../components/Benevole';
import MDSpinner from 'react-md-spinner';

export default class Benevoles extends React.Component {
    constructor() {
        super();
        this.state = {
            benevoles: [],
            open: false,
            listEmails: '',
            loading: true,
            pages: 0,
            nb_pages_receive: 0,
        }
        this.getData = this.getData.bind(this);
        this.getContacts = this.getContacts.bind(this);
    }

    componentWillMount() {
        BenevolesStore.on("change", this.getData);
        BenevolesStore.on("get_emails", this.getContacts);
        BenevolesStore.getBenevoles();
    }

    componentWillUnmount() {
        BenevolesStore.removeListener("change", this.getData);
        BenevolesStore.removeListener("get_emails", this.getContacts);
    }

    getData(data) {
        this.setState({
            benevoles: BenevolesStore.getAllBenevoles(),
        })
    }


    getContacts(data) {
        this.setState({
            benevoles: BenevolesStore.getAllBenevoles(),
            pages: data.pages,
            nb_pages_receive: (this.state.nb_pages_receive + 1),
        });

        if (this.state.nb_pages_receive === this.state.pages) {
            this.setState({
                loading: false,
            })
        }
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
                        <Col xs={12} xsOffset={0}>
                            {this.state.listEmails}
                        </Col>
                    </Panel>
                </div>
                {Spinner}
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
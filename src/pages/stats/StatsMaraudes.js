import React from "react";
import { Col } from "react-bootstrap";
import StatsStore from '../../stores/StatsStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class StatsMaraudes extends React.Component {
    constructor() {
        super();
        this.state = {
            maraudes: null,
            loading: true,
            year: new Date().getFullYear(),
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        StatsStore.on("get_maraudes", this.getData);
        StatsStore.getMaraudesStats(this.state.year);
    }

    componentWillUnmount() {
        StatsStore.removeListener("get_maraudes", this.getData);
    }

    getData() {
        this.setState({
            maraudes: StatsStore.getMaraudes(),
            loading: false,
        })
    }

    handleYearChange(event) {
        const target = event.target;
        const value = target.value;
        StatsStore.getMaraudesStats(Math.floor(value));
        this.setState({
            year: Math.floor(value)
        });
    }

    render() {
        let ListCE = null;
        let ListMaraudeur = null;
        let SessionsIncompletes = null;
        let SessionsAnnulees = null;
        let NbMaraudes = null;

        if (this.state.maraudes) {
            NbMaraudes = <h3>Nombre de maraudes: {this.state.maraudes.nb_maraude}</h3>;

            ListCE = <BootstrapTable data={this.state.maraudes.chef}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            ListMaraudeur = <BootstrapTable data={this.state.maraudes.maraudeur}>
                <TableHeaderColumn dataField='id' isKey={true} >Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            SessionsIncompletes = <BootstrapTable data={this.state.maraudes.incomplete}>
                <TableHeaderColumn dataField='date' isKey={true} dataSort={true}>Date</TableHeaderColumn>
            </BootstrapTable>;

            SessionsAnnulees = <BootstrapTable data={this.state.maraudes.annulee}>
                <TableHeaderColumn dataField='date' isKey={true} dataSort={true}>Date</TableHeaderColumn>
            </BootstrapTable>;

        }

        var YearListComponent = [(new Date().getFullYear() - 1), (new Date().getFullYear()), (new Date().getFullYear() + 1)].map((year) => {
            return <option key={year} value={year}>{year}</option>;
        })

        return (
            <Col xs={8} xsOffset={2}>
                <div className="form-group">
                    <label htmlFor="year">Année:</label>
                    <select name="year" id="year" className="form-control" value={this.state.year}  disabled={this.state.loading} onChange={this.handleYearChange.bind(this)}>
                        <option key="0" value="0">Please select</option>
                        {YearListComponent}
                    </select>
                </div>
                {NbMaraudes}
                <h2>Stats par CE</h2>
                {ListCE}
                <h2>Stats par maraudeur</h2>
                {ListMaraudeur}
                <h2>Sessions incompletes</h2>
                {SessionsIncompletes}
                <h2>Sessions annulées</h2>
                {SessionsAnnulees}
            </Col>
        );
    }
}

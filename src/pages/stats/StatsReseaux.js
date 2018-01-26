import React from "react";
import { Col } from "react-bootstrap";
import StatsStore from '../../stores/StatsStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import MDSpinner from 'react-md-spinner';

export default class StatsReseaux extends React.Component {
    constructor() {
        super();
        this.state = {
            reseaux: null,
            loading: true,
            year: new Date().getFullYear(),
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        StatsStore.on("get_reseaux", this.getData);
        StatsStore.getReseauxStats(this.state.year);
    }

    componentWillUnmount() {
        StatsStore.removeListener("get_reseaux", this.getData);
    }

    getData() {
        this.setState({
            reseaux: StatsStore.getReseaux(),
            loading: false,
        })
    }

    handleYearChange(event) {
        const target = event.target;
        const value = target.value;
        StatsStore.getReseauxStats(Math.floor(value));
        this.setState({
            year: Math.floor(value),
            loading: true,
        });
    }

    render() {
        let ListCI = null;
        let ListCH = null;
        let ListPSE1 = null;
        let ListPSE2 = null;
        let NbReseaux = null;

        if (this.state.reseaux) {

            NbReseaux = <h3>Nombre de réseaux: {this.state.reseaux.nb_mission}</h3>;

            ListCI = <BootstrapTable data={this.state.reseaux.ci}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            ListCH = <BootstrapTable data={this.state.reseaux.ch}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            ListPSE1 = <BootstrapTable data={this.state.reseaux.pse1}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            ListPSE2 = <BootstrapTable data={this.state.reseaux.pse2}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;
        }

        var YearListComponent = [(new Date().getFullYear() - 2), (new Date().getFullYear() - 1), (new Date().getFullYear())].map((year) => {
            return <option key={year} value={year}>{year}</option>;
        })

        let Spinner = null;
        if(this.state.loading){
            Spinner = <p>Chargement...<MDSpinner /></p>;
        }

        return (
            <Col xs={8} xsOffset={2}>
                <div className="form-group">
                    <label htmlFor="year">Année:</label>
                    <select name="year" id="year" className="form-control" value={this.state.year}  disabled={this.state.loading} onChange={this.handleYearChange.bind(this)}>
                        <option key="0" value="0">Please select</option>
                        {YearListComponent}
                    </select>
                </div>

                {Spinner}

                {NbReseaux}

                <h2>Stats par CI</h2>
                {ListCI}
                <h2>Stats par CH</h2>
                {ListCH}
                <h2>Stats par PSE2</h2>
                {ListPSE2}
                <h2>Stats par PSE1</h2>
                {ListPSE1}
            </Col>
        );
    }
}

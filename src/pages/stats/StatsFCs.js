import React from "react";
import { Col } from "react-bootstrap";
import StatsStore from '../../stores/StatsStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class StatsFCs extends React.Component {
    constructor() {
        super();
        this.state = {
            formations: null,
            loading: true,
            year: new Date().getFullYear(),
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        StatsStore.on("get_fcs", this.getData);
        StatsStore.getFormationContinueStats(this.state.year);
    }

    componentWillUnmount() {
        StatsStore.removeListener("get_fcs", this.getData);
    }

    getData() {
        this.setState({
            formations: StatsStore.getFcs(),
            loading: false,
        })
    }

    handleYearChange(event) {
        const target = event.target;
        const value = target.value;
        StatsStore.getFormationContinueStats(Math.floor(value));
        this.setState({
            year: Math.floor(value)
        });
    }

    render() {
        let ListFormateurs = null;
        let ListParticipants = null;

        if (this.state.formations) {
            ListFormateurs = <BootstrapTable data={this.state.formations.formateurs}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            ListParticipants = <BootstrapTable data={this.state.formations.participants}>
                <TableHeaderColumn dataField='id' isKey={true} >Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;
        }

        var YearListComponent = [(new Date().getFullYear() - 2), (new Date().getFullYear() -1), (new Date().getFullYear())].map((year) => {
            return <option key={year} value={year}>{year}</option>;
        })

        return (
            <Col xs={8} xsOffset={2}>
                <div className="form-group">
                    <label htmlFor="year">Année:</label>
                    <select name="year" id="year" className="form-control"  disabled={this.state.loading} value={this.state.year} onChange={this.handleYearChange.bind(this)}>
                        <option key="0" value="0">Please select</option>
                        {YearListComponent}
                    </select>
                </div>

                <h2>Stats par formateur</h2>
                {ListFormateurs}
                <h2>Stats par participants</h2>
                {ListParticipants}
            </Col>
        );
    }
}

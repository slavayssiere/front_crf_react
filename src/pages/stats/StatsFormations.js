import React from "react";
import { Col } from "react-bootstrap";
import StatsStore from '../../stores/StatsStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class StatsFormations extends React.Component {
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
        StatsStore.on("get_formations", this.getData);
        StatsStore.getFormationsStats(this.state.year);
    }

    componentWillUnmount() {
        StatsStore.removeListener("get_formations", this.getData);
    }

    getData() {
        this.setState({
            formations: StatsStore.getFormations(),
            loading: false,
        })
    }

    handleYearChange(event) {
        const target = event.target;
        const value = target.value;
        StatsStore.getFormationsStats(Math.floor(value));
        this.setState({
            year: Math.floor(value)
        });
    }

    render() {
        let ListFormateurs = null;
        let ListAssistants = null;
        let SessionsIncompletes = null;
        let SessionsAnnulees = null;

        if (this.state.formations) {
            ListFormateurs = <BootstrapTable data={this.state.formations.formateurs}>
                <TableHeaderColumn dataField='id' isKey={true}>Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            ListAssistants = <BootstrapTable data={this.state.formations.assistants}>
                <TableHeaderColumn dataField='id' isKey={true} >Nivol</TableHeaderColumn>
                <TableHeaderColumn dataField='prenom'>Prenom</TableHeaderColumn>
                <TableHeaderColumn dataField='nom'>Nom</TableHeaderColumn>
                <TableHeaderColumn dataField='nombre' dataSort={true}>Nombre</TableHeaderColumn>
            </BootstrapTable>;

            SessionsIncompletes = <BootstrapTable data={this.state.formations.session_incomplete}>
                <TableHeaderColumn dataField='date' isKey={true} dataSort={true}>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='formateur'>Formateur</TableHeaderColumn>
            </BootstrapTable>;

            SessionsAnnulees = <BootstrapTable data={this.state.formations.session_annulee}>
                <TableHeaderColumn dataField='date' isKey={true} dataSort={true}>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='formateur'>Formateur</TableHeaderColumn>
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

                <h2>Stats par formateur</h2>
                {ListFormateurs}
                <h2>Stats par assistant</h2>
                {ListAssistants}
                <h2>Sessions incompletes</h2>
                {SessionsIncompletes}
                <h2>Sessions annulées</h2>
                {SessionsAnnulees}
            </Col>
        );
    }
}

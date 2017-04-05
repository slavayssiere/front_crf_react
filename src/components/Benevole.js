import React from 'react';

import BenevolesStore from '../stores/BenevolesStore';
import ConnectStore from '../stores/ConnectStore';

export default class Benevole extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: props.id,
            prenom: props.prenom,
            nom: props.nom,
            allow_email: props.allow_email,
            allow_external: props.allow_external,
            mailMoyenComId: props.mailMoyenComId,
        }
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    changeEmail(event) {
        if(ConnectStore.isPegassAdmin()){
            var data_struct = {
                inscriptionsExternes: this.state.allow_external,
                contactParMail: !this.state.allow_email,
                mailMoyenComId: this.state.mailMoyenComId
            }

            BenevolesStore.changeEmail(this.state.id, data_struct);
            this.setState({
                allow_email: data_struct.contactParMail,
                allow_external: data_struct.inscriptionsExternes,
            });
        }
    }

    changeExternal(event) {
        if(ConnectStore.isPegassAdmin()){
            var data_struct = {
                inscriptionsExternes: !this.state.allow_external,
                contactParMail: this.state.allow_email,
                mailMoyenComId: this.state.mailMoyenComId
            }

            BenevolesStore.changeEmail(this.state.id, data_struct);
            this.setState({
                allow_email: data_struct.contactParMail,
                allow_external: data_struct.inscriptionsExternes,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: nextProps.id,
            prenom: nextProps.prenom,
            nom: nextProps.nom,
            allow_email: nextProps.allow_email,
            allow_external: nextProps.allow_external,
        })
    }

    render() {
        let CheckEmail = null;
        if (this.state.allow_email) {
            CheckEmail = <i name="email" className="fa fa-check" style={{ 'color': 'green' }} onClick={this.changeEmail.bind(this)}></i>
        } else {
            CheckEmail = <i name="email" className="fa fa-times" style={{ 'color': 'red' }} onClick={this.changeEmail.bind(this)}></i>
        }

        let CheckExt = null;
        if (this.state.allow_external) {
            CheckExt = <i className="fa fa-check" style={{ 'color': 'green' }} onClick={this.changeExternal.bind(this)}></i>
        } else {
            CheckExt = <i className="fa fa-times" style={{ 'color': 'red' }} onClick={this.changeExternal.bind(this)}></i>
        }


        return (
            <tr>
                <td>{this.state.id}</td>
                <td>{this.state.prenom}</td>
                <td>{this.state.nom}</td>
                <td>{CheckEmail}</td>
                <td>{CheckExt}</td>
            </tr>
    );
    }
}
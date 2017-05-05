import React from 'react';

import { Button } from 'react-bootstrap';
import BenevolesStore from '../stores/BenevolesStore';
import ConnectStore from '../stores/ConnectStore';
import DownloadButton from './DownloadButton';
import vCard from 'vcards-js';

export default class Benevole extends React.Component {
    constructor(props) {
        super();

        var email, portable;

        if (props.email) {
            email = props.email;
        } else {
            email = '';
        }

        if (props.portable) {
            portable = props.portable;
        } else {
            portable = '';
        }

        this.state = {
            id: props.id,
            prenom: props.prenom,
            nom: props.nom,
            allow_email: props.allow_email,
            allow_external: props.allow_external,
            mailMoyenComId: props.mailMoyenComId,
            email,
            portable,
            date: props.date,
            admin: props.admin,
            date_naissance: props.date_naissance,
            benevole_data: null,
        }
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    changeEmail(event) {
        if (ConnectStore.isPegassAdmin()) {
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
        if (ConnectStore.isPegassAdmin()) {
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
            benevole_data: nextProps.benevole_data,
        })

        if (nextProps.email) {
            this.setState({
                email: nextProps.email,
            })
        }

        if (nextProps.portable) {
            this.setState({
                portable: nextProps.portable,
            })
        }
    }

    getBenevoleData(){
        BenevolesStore.getBenevoleData(this.state.id);
    }

    getVCard() {

        console.log(this.state.benevole_data);

        let meCard = vCard();
        meCard.firstName = this.state.prenom;
        meCard.lastName = this.state.nom;
        meCard.organization = 'Croix-Rouge française à Paris XI';
        meCard.birthday = new Date(this.state.date_naissance);
        meCard.title = 'Benevole';
        meCard.email = this.state.email;
        meCard.cellPhone = this.state.portable;
        meCard.note = "Nivol: " + this.state.id;

        return {
            mime: 'text/vcard',
            filename: this.state.id + '.vcard',
            contents: meCard.getFormattedString(),
        }

    }

    render() {

        let CheckEmail = null;
        let CheckExt = null;

        if (this.state.admin) {
            if (this.state.allow_email) {
                CheckEmail = <td><i name="email" className="fa fa-check" style={{ 'color': 'green' }} onClick={this.changeEmail.bind(this)}></i></td>
            } else {
                CheckEmail = <td><i name="email" className="fa fa-times" style={{ 'color': 'red' }} onClick={this.changeEmail.bind(this)}></i></td>
            }

            if (this.state.allow_external) {
                CheckExt = <td><i className="fa fa-check" style={{ 'color': 'green' }} onClick={this.changeExternal.bind(this)}></i></td>
            } else {
                CheckExt = <td><i className="fa fa-times" style={{ 'color': 'red' }} onClick={this.changeExternal.bind(this)}></i></td>
            }
        }

        let DateElement = null;
        if (this.state.date) {
            DateElement = <td>{this.state.date}</td>
        }

        let vCardButton = null;
        if(this.state.benevole_data){
            vCardButton = <td><DownloadButton
                    async={false}
                    genFile={this.getVCard.bind(this)}
                    generateTitle={'Prepare'}
                />
                </td>
        } else {
            vCardButton = <td><Button onClick={this.getBenevoleData.bind(this)}>Prepare</Button></td>
        }

        return (
            <tr>
                <td>{this.state.id}</td>
                <td>{this.state.prenom}</td>
                <td>{this.state.nom}</td>
                {CheckEmail}
                {CheckExt}
                <td>{this.state.email}</td>
                <td>{this.state.portable}</td>
                {DateElement}
                {vCardButton}
            </tr>
        );
    }
}
import React from "react";

import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import PegassConnect from './PegassConnect';
import GoogleConnect from './GoogleConnect';

import ConnectStore from '../stores/ConnectStore';

export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            connectPegass: false,
            connectGoogle: false,
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        ConnectStore.on("connect_pegass", this.getData);
        ConnectStore.on("connect_google", this.getData);
    }

    componentWillUnmount() {
        ConnectStore.removeListener("connect_pegass", this.getData);
        ConnectStore.removeListener("connect_google", this.getData);
    }

    getData() {
        this.setState({
            connectPegass: ConnectStore.isPegassConnected(),
            connectGoogle: ConnectStore.isGoogleConnected(),
        })
    }

    render() {
        let MenuConnectPegass = null;
        let MenuRecyclage = null;
        let MenuStats = null;
        let MenuGoogle = null;
        if(this.state.connectPegass){
            MenuConnectPegass = <NavDropdown eventKey={1} title="Bénévoles" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1}><Link to="/benevoles">Liste</Link></MenuItem>
                            <MenuItem eventKey={1.2}><Link to="/competences">Compétences</Link></MenuItem>
                            <MenuItem eventKey={1.2}><Link to="/nocompetences">Non-Compétence</Link></MenuItem>
                        </NavDropdown>;
            MenuRecyclage = <NavDropdown eventKey={2} title="Recyclage" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.2}><Link to="/recyclageul">UL</Link></MenuItem>
                            <MenuItem eventKey={2.3}><Link to="/recyclagedd">DD</Link></MenuItem>
                        </NavDropdown>;
            MenuStats = <NavDropdown eventKey={3} title="Stats" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.2}><Link to="/statsformation">Formation</Link></MenuItem>
                            <MenuItem eventKey={3.3}><Link to="/statsmaraudes">Maraude</Link></MenuItem>
                            <MenuItem eventKey={3.4}><Link to="/statsfcs">FC PSE</Link></MenuItem>
                            <MenuItem eventKey={3.5}><Link to="/statsmls">Mission locale</Link></MenuItem>
                            <MenuItem eventKey={3.6}><Link to="/statsreseaux">Réseau</Link></MenuItem>
                        </NavDropdown>;
        }

        if(this.state.connectGoogle){
            if(ConnectStore.getGoogleEmail() === 'inscription.crf7511@gmail.com'){
                MenuGoogle = <NavDropdown eventKey={4} title="Inscriptions" id="basic-nav-dropdown">
                                <MenuItem eventKey={4.1}><Link to="/sessionsinfo">Etat des sessions</Link></MenuItem>
                                <MenuItem eventKey={4.2}><Link to="/sessioncreate">Ouvrir une session</Link></MenuItem>
                                <MenuItem eventKey={4.3}><Link to="/sessionmanagements">Gérer les emails</Link></MenuItem>
                            </NavDropdown>;
            }
        }
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Home</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav>
                        {MenuConnectPegass}
                        {MenuRecyclage}
                        {MenuStats}
                        {MenuGoogle}
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1}>
                            <PegassConnect />
                        </NavItem>
                        <NavItem eventKey={2}>
                            <GoogleConnect />
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
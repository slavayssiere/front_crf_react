import React from 'react';
import { Panel, Col } from 'react-bootstrap';

import AppStore from '../stores/AppStore';
import vCard from 'vcards-js';

export default class Footer extends React.Component {
  constructor() {
    super();
    this.state = {
      pegass_version: '',
      google_version: '',
      front_version: '',
    }

    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    AppStore.on("config_receive", this.getData);
  }

  componentWillUnmount() {
    AppStore.removeListener("config_receive", this.getData);
  }

  getData() {
    this.setState({
      pegass_version: AppStore.getPegassVersion(),
      google_version: AppStore.getGoogleVersion(),
      front_version: AppStore.getFrontVersion(),
    })
  }

  getVCard(){
    let meCard = vCard();
    meCard.firstName = 'Sébastien';
    meCard.lastName = 'Lavayssière';
    meCard.organization = 'Croix-Rouge française à Paris XI';
    meCard.birthday = new Date('01-01-1903');
    meCard.title = 'DLUSAF';
    meCard.note = 'Nop';

    console.log(meCard.getFormattedString());

    return {
      mime: 'text/vcard',
      filename: 'format7511.vcard',
      contents: meCard.getFormattedString(),
    }

  }

  render() {

    return (
      <footer>
        <Col xs={12} md={12}>
          <Panel>
            <Col xs={8} xsOffset={2}><a href="https://github.com/slavayssiere/front_crf_react/" rel="noopener noreferrer" target="_blank"><b>Front version:</b>{this.state.front_version}</a></Col>
            <Col xs={8} xsOffset={2}><a href="https://github.com/slavayssiere/ws_pegass/" rel="noopener noreferrer" target="_blank"><b>API Pegass version:</b>{this.state.pegass_version}</a></Col>
            <Col xs={8} xsOffset={2}><a href="https://github.com/slavayssiere/ws_google_tools/" rel="noopener noreferrer" target="_blank"><b>API Google version:</b> {this.state.google_version}</a></Col>
          </Panel>
        </Col>
      </footer>
    );
  }
}
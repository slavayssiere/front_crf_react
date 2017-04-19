import React from 'react';
import { Panel, Col } from 'react-bootstrap';

import AppStore from '../stores/AppStore';

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

  render() {
    return (
      <footer>
        <Col xs={12} md={12}>
          <Panel>
            <Col xs={8} xsOffset={2}><a href="https://github.com/slavayssiere/front_crf_react/" target="_blank"><b>Front version:</b>{this.state.front_version}</a></Col>
            <Col xs={8} xsOffset={2}><a href="https://github.com/slavayssiere/ws_pegass/" target="_blank"><b>API Pegass version:</b>{this.state.pegass_version}</a></Col>
            <Col xs={8} xsOffset={2}><a href="https://github.com/slavayssiere/ws_google_tools/" target="_blank"><b>API Google version:</b> {this.state.google_version}</a></Col>
          </Panel>
        </Col>
      </footer>
    );
  }
}
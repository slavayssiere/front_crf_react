import React, { Component } from 'react';
import ReactGA from 'react-ga';

import Header from './components/Header';
import Footer from './components/Footer';

// Import routing components
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './pages/Home';
import Test from './pages/Test';
import NoMatch from './pages/NoMatch';
import Benevoles from './pages/benevoles/Benevoles';
import Competences from './pages/benevoles/Competences';
import Recyclages from './pages/recyclages/Recyclages';
import StatsFCs from './pages/stats/StatsFCs';
import StatsFormations from './pages/stats/StatsFormations';
import StatsMaraudes from './pages/stats/StatsMaraudes';
import StatsMLs from './pages/stats/StatsMLs';
import StatsReseaux from './pages/stats/StatsReseaux';
import SessionsInfo from './pages/google/SessionsInfo';
import SessionCreate from './pages/google/SessionCreate';
import SessionsManagements from './pages/google/SessionsManagements';

import 'whatwg-fetch';

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

class TrackPageView extends React.Component {
    componentWillMount() { logPageView() }
    componentWillUpdate() { logPageView() }
    render() { return <Route children={this.props.children}/> }
}

class App extends Component {
  RecyclagesUL = (props) => {
    return (
      <Recyclages geoType='ul' {...props} />
    );
  }

  RecyclagesDD = (props) => {
    return (
      <Recyclages geoType='dd' {...props} />
    );
  }


  render() {
    return (
      <Router history={history}>
        <TrackPageView>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/test" component={Test} />
              <Route path="/benevoles" component={Benevoles} />
              <Route path="/competences" component={Competences} />
              <Route path="/recyclageul" render={this.RecyclagesUL.bind(this)} />
              <Route path="/recyclagedd" render={this.RecyclagesDD.bind(this)} />
              <Route path="/statsfcs" component={StatsFCs} />
              <Route path="/statsformation" component={StatsFormations} />
              <Route path="/statsmaraudes" component={StatsMaraudes} />
              <Route path="/statsmls" component={StatsMLs} />
              <Route path="/statsreseaux" component={StatsReseaux} />
              <Route path="/sessionsinfo" component={SessionsInfo} />
              <Route path="/sessioncreate" component={SessionCreate} />
              <Route path="/sessionmanagements" component={SessionsManagements} />
              <Route component={NoMatch} />
            </Switch>
            <Footer />
          </div>
        </TrackPageView>
      </Router>
    );
  }
}

export default App;

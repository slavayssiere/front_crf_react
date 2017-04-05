import React from 'react';
import ReactDOM from 'react-dom';

// Import routing components
import {
  BrowserRouter as Router,
  Route,
  Switch,
  history
} from 'react-router-dom';

import Home from './pages/Home';
import Test from './pages/Test';
import NoMatch from './pages/NoMatch';
import Benevoles from './pages/benevoles/Benevoles';

import 'whatwg-fetch';


import Header from './components/Header';
import Footer from './components/Footer';

ReactDOM.render(
  <Router history={history}>
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/test" component={Test} />
        <Route path="/benevoles" component={Benevoles} />
        <Route component={NoMatch}/>
      </Switch>
      <Footer />
    </div>
  </Router>,
  document.getElementById('root')
);

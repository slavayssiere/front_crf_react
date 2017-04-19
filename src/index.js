import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import App from './App';

ReactGA.initialize('UA-79192612-1');
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

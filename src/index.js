import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import './css/style.css';
import App from './App';
import MhzCrystalSMD from './components/mhz-crystal-smd';
import NotFound from './components/NotFound';

const Root = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/mhz-crystal-smd" component={MhzCrystalSMD} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}


render(<Root />,document.querySelector('#root'));
registerServiceWorker();
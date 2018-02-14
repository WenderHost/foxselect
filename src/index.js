import React from 'react';
//import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import './index.css';
//import App from './App';
import Configurator from './components/Configurator';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
render(<Configurator/>,document.querySelector('#root'));
registerServiceWorker();

import React from 'react';
import { render } from 'react-dom';
import { unregister } from './registerServiceWorker';
import 'core-js/es7/array';

import './css/style.css';
import App from './App';

const Root = () => {
  return (
    <div>
      <App />
    </div>
  );
}


render(<Root />,document.querySelector('#root'));
//registerServiceWorker();
unregister();
import React from 'react' // , { Component }
import { render } from 'react-dom'
import { unregister } from './registerServiceWorker'
import 'core-js/es7/array'

import './css/bootstrap-ns.css'
import './css/style.css'
import App from './App'
import { API_ENV } from './api-config';

/**
 * Setup our initialization method.
 *
 * When we're loading directly inside a browser (i.e. API_ENV == `web`),
 * we simply call `init()` directly. When API_ENV == `salesforce`, we
 * provide the `init` method via a global `FoxSelect` object which
 * can then be accessed inside the Salesforce environment.
 *
 * @param      object  el       The DOM object we're attaching to
 * @param      object  service  Connection for passing the Part No. back to Salesforce
 */
export var init = function(el, service){
  render((
    <App dataService={service} />
    ),el)
}

if( 'web' === API_ENV ){
  init(document.querySelector('#root'),null)
} else {
  var FoxSelect = {}
  FoxSelect.init = init;
  window.FoxSelect = FoxSelect;
}

unregister()
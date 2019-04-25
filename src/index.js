import React, { Suspense } from 'react' // , { Component }
import { render } from 'react-dom'
import { unregister } from './registerServiceWorker'
import 'core-js/es7/array'

import './css/bootstrap-ns.css'
import './css/style.css'

const hostname = window && window.location && window.location.hostname
let apiEnv = ''
if( -1 < hostname.indexOf( 'force' ) ){
  apiEnv = 'salesforce'
} else if ( -1 < hostname.indexOf('localhost') ){
  apiEnv = 'localhost'
} else {
  apiEnv = 'web'
}

const App = React.lazy(() => import('./App'))

/**
 * Setup our initialization method.
 *
 * When we're loading directly inside a browser (i.e. API_ENV == `localhost`),
 * we simply call `init()` directly. When API_ENV == `salesforce` or `web`, we
 * provide the `init` method via a global `FoxSelect` object which can then be
 * accessed inside the Salesforce environment or the browser as a global
 * object attached to the `window`.
 *
 * @param      object  el       The DOM object we're attaching to
 * @param      object  service  Connection for passing the Part No. back to Salesforce
 */
export var init = function(el, service){
  render((
    <Suspense fallback={<div className="alert alert-info text-center">Loading...</div>}>
      <App dataService={service} />
    </Suspense>
    ),el)
}

let FoxSelect = {}
if( 'web' === apiEnv || 'salesforce' === apiEnv ){
  FoxSelect.init = init;
  window.FoxSelect = FoxSelect;
} else {
  init(document.querySelector('#root'),null)
}

unregister()
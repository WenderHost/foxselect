let apiHost;
let apiRoot;
const apiVersion = 'v1';
const hostname = window && window.location && window.location.hostname;

switch( hostname ){
  case 'foxonline.wenderhost.com':
  case 'foxonline--foxselect.lightning.force.com':
    apiHost = 'https://foxonline.wenderhost.com/'
    break

  case 'foxselect.ngrok.io':
    apiHost = 'https://foxwebsite.ngrok.io/'
    break

  default:
    apiHost = 'http://foxelectronics.loco/'
}

if( -1 < apiHost.indexOf( 'force' ) ){
  apiRoot = `${apiHost}services/apexrest/PartService/`
} else {
  apiRoot = `${apiHost}wp-json/foxparts/${apiVersion}/get_options/`
}

export const API_ROOT = apiRoot;

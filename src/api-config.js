let apiHost;
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

const apiEnv = ( -1 < hostname.indexOf( 'force' ) )? 'salesforce' : 'web'

export const API_HOST = hostname;
export const API_ENV = apiEnv;
export const API_ROOT = `${apiHost}wp-json/foxparts/${apiVersion}/get_options/`;

//console.log('API_HOST',API_HOST,"\nAPI_ENV ", API_ENV,"\nAPI_ROOT",API_ROOT)
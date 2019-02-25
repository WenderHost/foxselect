//import axios from 'axios';
import WP from './components/WordPressAPI'

let apiHost;
const apiVersion = 'v1';
const hostname = window && window.location && window.location.hostname;

let apiEnv = ( -1 < hostname.indexOf( 'force' ) )? 'salesforce' : 'web'

switch( apiEnv ){
  case 'salesforce':
    apiHost = 'https://foxonline.wenderhost.com'
    break

  default:
    apiHost = ( 'localhost' === hostname || 'foxelectronics.loco' === hostname )? 'http://foxelectronics.loco' : 'https://foxonline.wenderhost.com'
}

export const API_HOST = hostname;
export const API_ENV = apiEnv;
export const API_ROOT = `${apiHost}/wp-json/foxparts/${apiVersion}/get_options/`;
export const AUTH_ROOT = `${apiHost}/wp-json/jwt-auth/v1/token`;
export const API_REST = `${apiHost}/wp-json/`;
export const API_USER = process.env.REACT_APP_API_USER;
export const API_PASS = process.env.REACT_APP_API_PASS;

// Connect to WP REST API
export let API_TOKEN = WP.getAppToken( AUTH_ROOT, API_USER, API_PASS ).then(function(result){
  //console.log('[api-config] WP.getAppToken has returned:', result );
  return result;
});


console.log('API_HOST', API_HOST,"\nAPI_ENV ", API_ENV,"\nAPI_ROOT", API_ROOT,"\nAUTH_ROOT",AUTH_ROOT,'\nAPI_TOKEN',API_TOKEN,'\nAPI_USER',API_USER)
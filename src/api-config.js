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

console.log('API_HOST', API_HOST,"\nAPI_ENV ", API_ENV,"\nAPI_ROOT", API_ROOT,"\nAUTH_ROOT",AUTH_ROOT)
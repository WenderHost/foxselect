let apiHost;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'foxonline.wenderhost.com'){
  apiHost = 'https://foxonline.wenderhost.com/'
} else if(hostname === 'foxelectronics.loco'){
  apiHost = 'http://foxelectronics.loco'
} else {
  apiHost = 'http://foxelectronics.loco'
}

export const API_ROOT = `${apiHost}/wp-json/foxparts/${apiVersion}/get_options/`;
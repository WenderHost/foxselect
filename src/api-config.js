let apiHost;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'foxonline.wenderhost.com'){
  apiHost = 'https://foxapi.wenderhost.com';
} else {
  apiHost = 'http://wordpress.test'
}

export const API_ROOT = `${apiHost}/wp-json/foxparts/${apiVersion}/get_options/part=`;
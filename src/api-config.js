import WP from './components/WordPressAPI'

const apiVersion = 'v1'
const hostname = window && window.location && window.location.hostname

const apiEnv = ( -1 < hostname.indexOf( 'force' ) )? 'salesforce' : 'web'

export const HOSTNAME = hostname
export const API_ENV = apiEnv
export const API_ROOT = `${process.env.REACT_APP_WPAPI_EP}/wp-json/foxparts/${apiVersion}/get_options/`
export const FOXPART_API_ROOT = `${process.env.REACT_APP_WPAPI_EP}/wp-json/foxparts/${apiVersion}/get_web_part`
export const AUTH_ROOT = `${process.env.REACT_APP_WPAPI_EP}/wp-json/jwt-auth/v1/token`
export const API_REST = `${process.env.REACT_APP_WPAPI_EP}/wp-json/`
export const API_USER = process.env.REACT_APP_API_USER
export const API_PASS = process.env.REACT_APP_API_PASS

// Connect to WP REST API
export let API_TOKEN = WP.getAppToken( AUTH_ROOT, API_USER, API_PASS ).then(function(result){
  return result
})

//console.log("API_ENV ", API_ENV,"\nAPI_ROOT", API_ROOT,"\nAUTH_ROOT",AUTH_ROOT,'\nAPI_TOKEN',API_TOKEN,'\nAPI_USER',API_USER)
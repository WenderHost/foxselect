//import { Component } from 'react';
import axios from 'axios';

// Alerts
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

let WordPressAPI = {

  /**
   * Creates an user via the WP REST API.
   *
   * @param      {string}  url        Our WordPress REST API endpoint
   * @param      {object}  user       The user object
   * @param      {string}  token      API authentication token
   * @param      {string}  auth_root  The Authorization URI
   */
  createUser : function(url,user,token,auth_root){
    token.then( token => {
      // TODO: Validate the token before trying to create the user

      /**
       * Creating user via standard call to REST API
       */
      const config = {
        method: 'post',
        url: url + 'wp/v2/users',
        data: user,
        headers: {'Authorization': 'Bearer ' + token }
      }
      console.log('[createUser] config = ', config)

      axios(config)
      .then( response => {
        console.log('[WP REST] User created.', response.data )
        this.validateUser( auth_root, user.email, user.password )
      })
      .catch( error => {
        console.log( error );
      });
    });
  },

  getAppToken : function(url,user,pass){
    if( localStorage.hasOwnProperty('foxselect-wp_api_token') ){
      let wpApiToken = localStorage.getItem('foxselect-wp_api_token')

      //console.log('[WP.getAppToken] Attempting to validate our token.')

      const validPromise = WordPressAPI.validateAppToken( url + '/validate', wpApiToken )
      .then( result => {
        //console.log('[WP.getAppToken] We returned a response from WP.validateAppToken...', "\nresult = ", result)

        // 04/18/2019 (11:49) - `result` can actually be a string indicating an Error
        // When I'm testing on localhost, Chrome retrictions for non-https endpoints
        // always result in validateAppToken failing with a 403.

        if( result.data ){
          return result.data.data.token;
        } else {
          // Our token is not valid so we need to
          // 1) delete the token in localStorage, and
          // 2) get a new token.
          //console.log('[WP.getAppToken] removing `foxselect-wp_api_token` and calling _self to generate a new token.', "\nurl = ", url)
          localStorage.removeItem('foxselect-wp_api_token');
          let newTokenPromise = WordPressAPI.getAppToken(url,user,pass).then( result => {
            return result;
          });
          return newTokenPromise;
        }
      })
      .catch( error => {
        console.log('[WP.getAppToken calling WP.validateAppToken] Token is NOT valid.', error );
      });

      return validPromise;
    } else {
      //console.log('[WP.getAppToken] foxselect-wp_api_token not found in localStorage. Attempting to retrieve a new one from:', "\nurl = ", url)
      const tokenPromise = axios({
        method: 'post',
        url: url,
        data: {
          username: user,
          password: pass
        }
      })
      .then( response => {
        //console.log('[WP.getAppToken] New token retrieved.' )
        localStorage.setItem('foxselect-wp_api_token', response.data.token )
        return response.data.token
      })
      .catch( error => {
        console.log("[WP.getAppToken] Error! Unable to retrieve token.\n", error )
      });

      return tokenPromise;
    }
  },

  logoutUser: function(){
    localStorage.removeItem('foxselect-userdata');
    Alert.info('You have been logged out.',{
      position: 'top',
      effect: 'slide',
      timeout: 2000
    })

    return true
  },

  submitRFQ: function(url,rfq,cart,user,token){
    token.then( token => {

      /**
       * Send the RFQ to WordPress
       */
      const config = {
        headers: {'Authorization': 'Bearer ' + token }
      }

      axios.post(url, {rfq: rfq, cart: cart, user: user}, config)
      .then( response => {
        console.log('[WP REST] Response from /postRFQ/', response.data )
      })
      .catch( error => {
        console.log( error );
      });
    });
  },

  validateAppToken: function(url,token){
    const validPromise = axios({
      method: 'post',
      url: url,
      headers: {'Authorization': 'Bearer ' + token }
    })
    .then( response => {
      response.data.data.token = token;
      //console.log('[WP.validateAppToken] Token is valid.', response );
      return response;
    })
    .catch( error => {
      //console.log('[WP.validateAppToken] Token is NOT valid.') //,"\nTried:\n\n---\n" + token + "\n---\n\nand got:\n\n", error );
      return error;
    })

    return validPromise;
  },

  /**
   * Validates a user
   *
   * @param      {string}  url   API endpoint
   * @param      {string}  user  The username
   * @param      {string}  pass  The password
   */
  validateUser: function(url,user,pass){
    const validatedUser = axios({
      method: 'post',
      url: url,
      data: {
        username: user,
        password: pass
      }
    })
    .then(response => {
      console.log('Saving userData to `localStorage`...', response.data)
      localStorage.setItem('foxselect-userdata', JSON.stringify( response.data ) )
      localStorage.setItem('foxselect-currentview', 'loggedin')
      Alert.success('Login was successful.',{
        position: 'top',
        effect: 'slide',
        timeout: 1000
      })
      return response.data
    })
    .catch(error => {
      //console.log('[Axios] Invalid Credentials')
      Alert.error('Invalid credentials. Please check your username/password.',{
        position: 'top',
        effect: 'slide',
        timeout: 2000
      })
      return error
    });

    return validatedUser;
  }
}

export default WordPressAPI;
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
    if( localStorage.hasOwnProperty('wpApiToken') ){
      let wpApiToken = localStorage.getItem('wpApiToken')

      const validPromise = WordPressAPI.validateAppToken( url + '/validate', wpApiToken )
        .then( result => {
          if( result.data ){
            return result.data.data.token;
          } else {
            // Our token is not valid so we need to
            // 1) delete the token in localStorage, and
            // 2) get a new token.
            localStorage.removeItem('wpApiToken');
            let newTokenPromise = WordPressAPI.getAppToken(url,user,pass).then( result => {
              return result;
            });
            return newTokenPromise;
          }
        })
        .catch( error => {
          console.log('[WP.validateAppToken] Token is NOT valid.', error );
        });

      return validPromise;
    } else {
      const tokenPromise = axios({
        method: 'post',
        url: url,
        data: {
          username: user,
          password: pass
        }
      })
      .then( response => {
        console.log('[WP.getAppToken] New token retrieved.', response.data )
        localStorage.setItem('wpApiToken', response.data.token )
        return response.data.token
      })
      .catch( error => {
        console.log('[WP.getAppToken] Error! Unable to retrieve token. ', error )
      });

      return tokenPromise;
    }
  },

  logoutUser: function(){
    localStorage.removeItem('userData');
    Alert.info('You have been logged out.',{
      position: 'top',
      effect: 'slide',
      timeout: 2000,
      onClose: function(){
        window.location.reload();
      }
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
      console.log('[WP.validateAppToken] Token is valid.', response );
      return response;
    })
    .catch( error => {
      console.log('[WP.validateAppToken] Token is NOT valid.', error );
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
      console.log('Saving userData to `localStorage`...', response.data);
      localStorage.setItem('userData', JSON.stringify( response.data ) );
      Alert.success('Login was successful.',{
        position: 'top',
        effect: 'slide',
        timeout: 1000,
        onClose: function(){
          window.location.reload();
        }
      })
    })
    .catch(error => {
      console.log('[Axios] Invalid Credentials')
      Alert.error('Invalid credentials. Please check your username/password.',{
        position: 'top',
        effect: 'slide',
        timeout: 2000
      })
    });

    return validatedUser;
  }
}

export default WordPressAPI;
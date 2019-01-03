//import { Component } from 'react';
import axios from 'axios';

// Alerts
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

let WordPressAPI = {
  createUser : function(url,user,token){
    //const wpApiToken = localStorage.getItem('wpApiToken');

    /*
    let example_user = {
      username: 'foxselect@michaelwender.com',
      name: 'Foxy Mike',
      first_name: 'Foxy',
      last_name: 'Mike',
      email: 'foxselect@michaelwender.com',
      password: 'testing123'
    }
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
    })
    .catch( error => {
      console.log( error );
    });
  },

  getAppToken : function(url,user,pass){
    let token = false;

    axios({
      method: 'post',
      url: url,
      data: {
        username: user,
        password: pass
      }
    })
    .then( response => {
      console.log('[WP] Success! Storing token...', response.data )
      localStorage.setItem('wpApiToken', response.data.token )
      token = response.data.token;
    })
    .catch( error => {
      console.log('[WP] Error! Unable to retrieve token. ', error )
    })

    return token;
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
    const valid = axios({
      method: 'post',
      url: url,
      headers: {'Authorization': 'Bearer ' + token }
    })
    .then( response => {
      return true;
    })
    .catch( error => {
      //console.log('[WP] App Token is not valid.');
      return false;
    })

    return valid;
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
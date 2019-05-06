import React, { Component } from 'react';
import { AUTH_ROOT } from '../api-config';
import axios from 'axios';

// Alerts
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class LoginForm extends Component{
  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(e){
    let formValue = {};
    formValue[e.target.name] = e.target.value;
    this.setState(formValue);
  }

  handleLogin(){
    const { email, password } = this.state
    const { hydrateStateWithLocalStorage } = this.props
    console.log('auth_root = ', AUTH_ROOT)

    axios({
      method: 'post',
      url: AUTH_ROOT,
      data: {
        username: email,
        password: password
      }
    })
    .then( response => {
      console.log('Saving userData to `localStorage`...', response.data)
      localStorage.setItem('foxselect-userdata', JSON.stringify( response.data ) )
      localStorage.setItem('foxselect-currentview', 'loggedin')
      Alert.success('Login was successful.',{
        position: 'top',
        effect: 'slide',
        timeout: 1000,
        onClose: function(){
          hydrateStateWithLocalStorage()
        }
      })
    })
    .catch( error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        //console.log(error.response.data,error.response.status,error.response.headers);
        Alert.error(error.response.data.message,{
          position: 'top',
          effect: 'slide',
          timeout: 21000,
          html: true
        })
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log('error.config = ', error.config);
    })
  }

  render(){
    return(
      <form>
        <h3>Login to Your Account</h3>
        <div className="form-row">
          <div className="col">
            <input type="email" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="col">
            <input type="password" name="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
          </div>
        </div>
        <hr/>
        <div className="form-row">
          <div className="col text-right">
            <button type="button" className="btn btn-primary" name="checkout-guest" onClick={this.handleLogin}>Login</button>
          </div>
        </div>
      </form>
    )
  }
}

export default LoginForm;
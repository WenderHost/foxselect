import React, { Component } from 'react';
import WP from './WordPressAPI';
import { AUTH_ROOT } from '../api-config';

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

  handleLogin(e){
    const { email, password } = this.state;
    return WP.validateUser( AUTH_ROOT, email, password );
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
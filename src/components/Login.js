import React, { Component } from 'react';
import LoginForm from './LoginForm';
import WP from './WordPressAPI';
import SelectState from './selects/SelectState';
import SelectCompanyType from './selects/SelectCompanyType';
import ReactPasswordStrength from 'react-password-strength';
import { AUTH_ROOT, API_REST, API_TOKEN } from '../api-config';

class Login extends Component{

  constructor(){
    super();

    this.state = {
      new_user: {
        username: '',
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        password: null,
        company_name: '',
        company_type: '',
        company_street: '',
        company_city: '',
        company_state: '',
        company_zip: ''
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleRegister(e){
    console.log('[Login.handleRegister] Creating user...');
    const { new_user } = this.state;

    const user = {};
    const meta = {};
    for( var property in new_user ){
      if( new_user.hasOwnProperty( property ) ){
        if( -1 < property.indexOf('company_') ){
          meta[property] = new_user[property];
        } else {
          user[property] = new_user[property];
        }
      }
    }
    user['meta'] = meta;

    WP.createUser( API_REST, user, API_TOKEN, AUTH_ROOT );
  }

  handleChange(e){
    const { new_user } = this.state;
    new_user[e.target.name] = e.target.value;

    new_user.name = ( '' !== new_user.first_name && '' !== new_user.last_name )? new_user.first_name + ' ' + new_user.last_name : '';
    new_user.username = ( '' !== new_user.email )? new_user.email : '';

    this.setState({new_user: new_user});
  }

  handlePassword( status, result ){
    if( status.isValid ){
      const { new_user } = this.state;
      new_user['password'] = status.password;
      this.setState({new_user: new_user});
    }

  }

  render(){
    const { user } = this.props;
    const { new_user } = this.state;
    //console.log('[CHECKOUT] user', user);

    /**
     * If we're logged in, show the user details (dashboard)
     */
    const account = user ? (
      <div>
        <h3>Your Account Details</h3>
        <p>Welcome back <em>{user.user_display_name}</em>.</p>
        <table className="table table-sm">
          <tbody>
            <tr>
              <td>Your email:</td>
              <td>{user.user_email}</td>
            </tr>
            <tr>
              <td>Your status:</td>
              <td>{user.status}</td>
            </tr>
          </tbody>
        </table>
        <div className="text-right">
          <hr/>
          <button className="btn btn-primary" type="button" onClick={WP.logoutUser}>Logout</button>
        </div>
      </div>

    ) : (
      <LoginForm />
    );

    return(
      <div className="checkout">
        <div className="row">
          <div className="col-lg">
            {account}
          </div>
          <div className="col-lg">
            <h3>Create an Account</h3>
            <form>
              <div className="form-row">
                <div className="col">
                  <input type="text" className="form-control" placeholder="First name" name="first_name" value={new_user.first_name} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <input type="text" className="form-control" placeholder="Last name" name="last_name" value={new_user.last_name} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <input type="email" className="form-control" placeholder="Your company email" autoComplete="off" name="email" value={new_user.email} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                  <div className="col">
                    <ReactPasswordStrength
                      style={{ border: "none" }}
                      inputProps={{ className: "form-control", placeholder: "Password", autoComplete: "new-password" }}
                      minLength={5}
                      minScore={2}
                      changeCallback={this.handlePassword}
                    />
                  </div>
              </div>
              <hr />
              <div className="form-row">
                <div className="col-md-9">
                  <input type="text" className="form-control" placeholder="Company/Account Name" autoComplete="off" name="company_name" value={new_user.company_name} onChange={this.handleChange} />
                </div>
                <div className="col-md-3">
                  <SelectCompanyType handleChange={this.handleChange} name="company_type" value={new_user.company_type} />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <input type="text" className="form-control" placeholder="Address" name="company_street" value={new_user.company_street} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="City" name="company_city" value={new_user.company_city} onChange={this.handleChange} />
                </div>
                <div className="col-md-4">
                  <SelectState handleChange={this.handleChange} name="company_state" value={new_user.company_state} />
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="Zip" name="company_zip" value={new_user.company_zip} onChange={this.handleChange} />
                </div>
              </div>
              <hr/>
              <div className="form-row">
                <div className="col text-right">
                  <button type="button" className="btn btn-primary" name="register-user" onClick={this.handleRegister}>Register</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
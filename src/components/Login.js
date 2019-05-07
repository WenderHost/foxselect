import React, { Component } from 'react';
import LoginForm from './LoginForm';
import WP from './WordPressAPI';
import Select, { Creatable } from 'react-select';
import { companyTypeOptions, stateOptions } from './data/data';
import ReactPasswordStrength from 'react-password-strength';
import { AUTH_ROOT, API_REST, API_TOKEN } from '../api-config';
import axios from 'axios';

// Alerts
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

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
        company_zip: '',
        company_country: ''
      },
      isRegistering: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeCompanyType = this.handleChangeCompanyType.bind(this)
    this.handleChangeCompanyState = this.handleChangeCompanyState.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
  }

  handleRegister(e){
    console.clear()
    console.log('[Login.js]->handleRegister()')
    const { new_user } = this.state;

    this.setState({isRegistering: true})

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
    user['meta'] = meta

    //WP.createUser( API_REST, user, API_TOKEN, AUTH_ROOT );
    API_TOKEN.then( token => {
      // TODO: Validate the token before trying to create the user

     /**
       * Creating user via standard call to REST API
       */
      const config = {
        method: 'post',
        url: API_REST + 'wp/v2/users',
        data: user,
        headers: {'Authorization': 'Bearer ' + token }
      }
      axios(config)
      .then( response => {
        const httpStatusCode = response.status
        console.log("[WP REST] We attempted to create a user.\n• httpStatusCode =", httpStatusCode, "\n• response = ", response )

        switch( httpStatusCode ){
          case 200:
          case 201:
            //const validatedUser =
            WP.validateUser( AUTH_ROOT, user.email, user.password )
            .then( response => {
              this.props.hydrateStateWithLocalStorage()
            })
            .catch( error => {
              console.log('WP.validateUser returned error = ', error)
            })
            .finally( () => {
              this.setState({isRegistering: false})
            })
            break

          default:
            console.log('No logic for handling httpStatusCode = ', httpStatusCode)
        }
      })
      .catch( error => {
        this.setState({isRegistering: false})
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx


          const responseData = error.response.data
          console.log("\n\nresponseData = ", responseData)

          const error_code = ( responseData.data && typeof responseData.data.code !== 'undefined' )? responseData.data.code : responseData.code ;
          console.log('error_code = ', error_code)
          let message = ''
          switch( error_code ){
            case 'rest_missing_callback_param':
              let paramList = ''
              const missingParams = ( typeof responseData.data.params !== 'undefined' )? responseData.data.params : ['params not found']
              missingParams.forEach( (el) => {
                paramList += '<li>' + el + '</li>'
              })
              message = '<p><strong>MISSING REQUIRED FIELDS</strong><br/>Please fill out the following required fields:</p><ul style="margin-bottom: 0">' + paramList + '</ul>'
              break

            default:
              message = responseData.message
          }

          Alert.closeAll()
          Alert.error(message,{
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
          console.log('Error: ', error);
        }
        if( typeof error.config !== 'undefined' )
          console.log(error.config)
      });
    })
  }

  handleChange(e){
    const { new_user } = this.state
    new_user[e.target.name] = e.target.value

    new_user.name = ( '' !== new_user.first_name && '' !== new_user.last_name )? new_user.first_name + ' ' + new_user.last_name : '';
    new_user.username = ( '' !== new_user.email )? new_user.email : '';

    this.setState({new_user: new_user});
  }

  handleChangeCompanyType(e){
    const { new_user } = this.state
    new_user.company_type = e.value
    this.setState({new_user: new_user})
  }

  handleChangeCompanyState(e){
    const { new_user } = this.state
    new_user.company_state = e.value
    this.setState({new_user: new_user})
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

    let companyTypeValue = new_user.company_type
    if( '' !== companyTypeValue ){
      for( let i = 0; i < companyTypeOptions.length; i++ ){
        let option = companyTypeOptions[i]
        if( companyTypeValue === option.value )
          companyTypeValue = option
      }
    }

    let stateValue = new_user.company_state
    if( '' !== stateValue ){
      for( let i = 0; i < stateOptions.length; i++ ){
        let option = stateOptions[i]
        if( stateValue === option.value )
          stateValue = option
      }
    }

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
      <LoginForm hydrateStateWithLocalStorage={this.props.hydrateStateWithLocalStorage} />
    );

    const stateSelectStyles = {
      option: (styles, {data, isDisabled, isFocused, isSelected }) => {
        return{
          ...styles,
          fontSize: data.value === '' ? '13px' : '16px'
        }
      }
    }

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
                  <Select
                    name="company_type"
                    onChange={this.handleChangeCompanyType}
                    placeholder="Type..."
                    options={companyTypeOptions}
                    value={companyTypeValue}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  {/*<input type="text" className="form-control" placeholder="Address" name="company_street" value={new_user.company_street} onChange={this.handleChange} />*/}
                  <textarea className="form-control" name="company_street" rows="2" placeholder="Address"  onChange={this.handleChange} value={new_user.company_street} />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <input type="text" className="form-control" placeholder="City" name="company_city" value={new_user.company_city} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <Creatable
                    onChange={this.handleChangeCompanyState}
                    multi={false}
                    placeholder="State/Prov/Region..."
                    name="company_state"
                    options={stateOptions}
                    styles={stateSelectStyles}
                  />
                </div>
                <div className="col-md-2">
                  <input type="text" className="form-control" placeholder="Zip" name="company_zip" value={new_user.company_zip} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <input type="text" className="form-control" placeholder="Country" name="company_country" value={new_user.company_country} onChange={this.handleChange} />
                </div>
              </div>
              <hr/>
              <div className="form-row">
                <div className="col text-right">
                <p><small>All fields are required unless noted.</small></p>
                { ! this.state.isRegistering &&
                  <button type="button" className="btn btn-primary" name="register-user" onClick={this.handleRegister}>Register</button> }
                { this.state.isRegistering &&
                  <button type="button" className="btn btn-secondary" name="register-user" disabled="disabled">Register</button> }
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
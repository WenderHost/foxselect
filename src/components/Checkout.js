import React, { Component } from 'react';
import LoginForm from './LoginForm';
import WP from './WordPressAPI';
import SelectState from './selects/SelectState';
import SelectCompanyType from './selects/SelectCompanyType';
import ReactPasswordStrength from 'react-password-strength';

class Checkout extends Component{

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    return this.props.createUser();
  }

  render(){
    const { user } = this.props;
    console.log('[CHECKOUT] user', user);

    const account = user ? (
      <div>
        <h3>Your Account Details</h3>
        <p>Welcome back <em>{user.user_display_name}</em>.</p>
        <p>Your email: <em>{user.user_email}</em>.</p>
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
                  <input type="text" className="form-control" placeholder="First name"/>
                </div>
                <div className="col">
                  <input type="text" className="form-control" placeholder="Last name"/>
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <input type="email" className="form-control" placeholder="Your company email"/>
                </div>
              </div>
              <div className="form-row">
                  <div className="col">
                    <ReactPasswordStrength
                      style={{ border: "none" }}
                      inputProps={{ className: "form-control", placeholder: "Password" }}
                      minLength={5}
                      minScore={2}
                    />
                  </div>
              </div>
              <hr />
              <div className="form-row">
                <div className="col-md-9">
                  <input type="text" className="form-control" placeholder="Company/Account Name"/>
                </div>
                <div className="col-md-3">
                  <SelectCompanyType />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <input type="text" className="form-control" placeholder="Address"/>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-8">
                  <input type="text" className="form-control" placeholder="City"/>
                </div>
                <div className="col-md-4">
                  <SelectState />
                </div>
              </div>
              <hr/>
              <div className="form-row">
                <div className="col text-right">
                  <button type="button" className="btn btn-primary" name="checkout-guest" onClick={this.handleClick}>Register</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Checkout;
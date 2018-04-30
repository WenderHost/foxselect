import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SelectState from './selects/SelectState';
import SelectCompanyType from './selects/SelectCompanyType';

class Checkout extends Component{

  render(){
    let userData = JSON.parse( localStorage.getItem('userData') );
    //console.log('userData = ');
    //console.log(userData);

    const account = userData ? (
      <div>
        <h3>Your Account Details</h3>
        <p>Welcome back <em>{userData.user_display_name}</em>.</p>
        <p>Your email: <em>{userData.user_email}</em>.</p>
        <div className="text-right">
          <hr/>
          <button className="btn btn-primary" type="button" onClick={this.props.logoutUser}>Logout</button>
        </div>
      </div>

    ) : (
      <LoginForm validateUser={this.props.validateUser} />
    );

    return(
      <div className="checkout">
        <div className="row">
          <div className="col-md">
            {account}
          </div>
          <div className="col-md">
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
                  <input type="email" className="form-control" placeholder="Email"/>
                </div>
              </div>
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
                  <button type="button" className="btn btn-primary" name="checkout-guest" onClick={this.handleClick}>Continue</button>
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
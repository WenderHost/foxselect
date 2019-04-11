import React, { Component } from 'react';
import CartItem from './CartItem';
import Select from 'react-select';
import WP from './WordPressAPI';
import { API_REST, API_TOKEN } from '../api-config';
import { stateOptions } from './data/data';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


class Checkout extends Component{

  constructor(props){
    super(props)

    let differentShippingAddress = false
    const { rfq, user } = this.props
    const shippingAddressString = rfq.shipping_address.company + rfq.shipping_address.contact + rfq.shipping_address.street + rfq.shipping_address.city + rfq.shipping_address.state + rfq.shipping_address.zip
    const userAddressString = user.company_name + user.first_name + ' ' + user.last_name + user.company_street + user.company_city + user.company_state + user.company_zip
    if( '' !== shippingAddressString && shippingAddressString !== userAddressString )
      differentShippingAddress = true

    this.state = {
      different_shipping_address: differentShippingAddress
    }

    this.handleChange = this.handleChange.bind(this);
    this.handlePrototypeDate = this.handlePrototypeDate.bind(this);
    this.handleProductionDate = this.handleProductionDate.bind(this);
    this.handleShippingAddressState = this.handleShippingAddressState.bind(this);
    this.handleClickDifferentShippingAddress = this.handleClickDifferentShippingAddress.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  handleChange(e){
    //const { shipping_address } = this.props
    const { rfq } = this.props

    const address_fields = ['company','contact','street','city','state','zip']
    if( typeof e.target.name !== undefined && address_fields.includes( e.target.name ) ){
      rfq.shipping_address[e.target.name] = e.target.value
    } else if( typeof e.target.name !== undefined && 'distys' === e.target.name ){
      console.log('[handleChange] rfq.distys.includes(e.target.value)', rfq.distys.includes(e.target.value))
      if( ! rfq.distys.includes(e.target.value) ){
        rfq.distys.push(e.target.value)
      } else {
        var index = rfq.distys.indexOf(e.target.value)
        var spliced = rfq.distys.splice(index,1)
        console.log('[handleChange] after splice distys = ', rfq.distys, 'spliced = ', spliced)
      }
    } else if( typeof e.target.name !== undefined ) {
      rfq[e.target.name] = e.target.value
    }

    //if( typeof e.target.name !== undefined )
    //  shipping_address[e.target.name] = e.target.value

    //this.props.updateShippingAddress(shipping_address)
    this.props.updateRFQ( rfq )
  }

  handlePrototypeDate( date ){
    const { rfq } = this.props
    rfq.prototype_date = date
    this.props.updateRFQ( rfq )
  }

  handleProductionDate( date ){
    const { rfq } = this.props
    rfq.production_date = date
    this.props.updateRFQ( rfq )
  }

  /**
   * onChange handler for our Address:State selector
   */
  handleShippingAddressState(e){
    /*
    const { shipping_address } = this.props
    shipping_address['state'] = e.value
    this.props.updateShippingAddress(shipping_address)
    */
    const { rfq } = this.props
    rfq.shipping_address.state = e.value
    this.props.updateRFQ( rfq )
  }

  /**
   * Sets `different_shipping_address` which controls appearance
   * of "Different Shipping Address" form
   */
  handleClickDifferentShippingAddress(e){
    const { rfq } = this.props
    if( ! e.target.checked ){
      rfq.shipping_address = {
        company: '',
        contact: '',
        street: '',
        city: '',
        state: '',
        zip: ''
      }
      this.props.updateRFQ( rfq )
      this.setState({different_shipping_address: false})
    } else {
      this.setState({different_shipping_address: true})
    }

    //this.setState({different_shipping_address: e.target.checked})
  }

  /**
   * Sends the RFQ to our API which in turn submits it to the
   * FOX SalesForce API.
   */
  handleSubmission(){
    const { rfq, cart, user } = this.props
    WP.submitRFQ(API_REST + 'foxelectronics/v1/postRFQ', rfq, cart, user, API_TOKEN )
  }

  render(){
    const { different_shipping_address } = this.state
    const { user, rfq } = this.props
    const prototype_date = new Date( rfq.prototype_date )
    const production_date = new Date( rfq.production_date )

    let defaultValue = user.company_state
    if( null !== rfq.shipping_address.state ){
      for( var i = 0; i < stateOptions.length; i++ ){
        var option = stateOptions[i]
        //console.log('defaultValue = ', defaultValue, 'option.value = ', option.value)
        if( defaultValue === option.value )
          defaultValue = option
      }
    }

    const shippingAddressFields = different_shipping_address ? (
        <div className="shipping-form">
          <div className="form-row">
            <div className="col-md-12">
              <input type="text" className="form-control" placeholder="Company Name" autoComplete="off" name="company" value={rfq.shipping_address.company} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-1" style={{lineHeight: '2.4'}}>c/o</div>
            <div className="col-md-11">
              <input type="text" className="form-control" placeholder="Contact" name="contact" value={rfq.shipping_address.contact} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="col">
              <input type="text" className="form-control" placeholder="Address" name="street" value={rfq.shipping_address.street} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-5">
              <input type="text" className="form-control" placeholder="City" name="city" value={rfq.shipping_address.city} onChange={this.handleChange} />
            </div>
            <div className="col-md-4">
              <Select
                onChange={this.handleShippingAddressState}
                placeholder="State..."
                options={stateOptions}
                defaultValue={defaultValue}
              />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Zip" name="zip" value={rfq.shipping_address.zip} onChange={this.handleChange} />
            </div>
          </div>
        </div>
      ) : (
        <p>{user.company_name}<br />c/o {user.user_display_name}<br />{user.company_street}<br />{user.company_city}, {user.company_state} {user.company_zip}</p>
      )

    return(

      <div className="checkout container">
        <h1 className="section-title">Checkout</h1>

        <h3 className="section-title">Your Parts</h3>
        <div className="row d-none d-md-flex">
          <div className="col-md-2"><small>Part No.</small></div>
          <div className="col-md-10"><small>Desc</small></div>
        </div>
        <div style={{marginBottom: '3rem'}}>
        { 0 < this.props.partsInCart ? (
          Object.keys(this.props.cart).map(key => <CartItem key={key} id={key} part={this.props.cart[key]} loadPart={this.props.loadPart} updateCart={this.props.updateCart} />)
        ) : (
          <div>
            <hr/>
            <p className="text-center">Your RFQ is empty.</p>
            <p className="text-center"><button type="button" className="btn btn-primary btn-sm" name="checkout" onClick={() => this.props.setCurrentView('PartSelector')}>Continue Configuring Your Parts</button></p>
            <hr/>
          </div>
        ) }
        </div>

        <h3 className="section-title">Your Order Details</h3>
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6">
                <h4>Customer</h4>
                <p>{user.user_display_name} (<a href="mailto:{user.user_email}">{user.user_email}</a>)</p>
                {/* PROJECT DETAILS */}
                <h4>Project Details</h4>
                <div className="form-group">
                  <label htmlFor="project_name">Name</label>
                  <input type="text" className="form-control" placeholder="Project Name" name="project_name" value={rfq.project_name} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="project_description">Description (optional)</label>
                  <textarea className="form-control" name="project_description" rows="3" value={rfq.project_description} onChange={this.handleChange}></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="project_prototype_date">Prototype Date</label><br />
                      <DatePicker
                        selected={prototype_date}
                        onChange={this.handlePrototypeDate}
                        className="form-control"
                        placeholderText="Click to select a date"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="project_production_date">Production Date</label><br />
                      <DatePicker
                        selected={production_date}
                        onChange={this.handleProductionDate}
                        className="form-control"
                        placeholderText="Click to select a date"
                      />
                    </div>
                  </div>
                </div>
                <h4>Distributors</h4>
                <div className="row" style={{ margin: '0 0 20px 6px'}}>
                  <div className="col">
                    <input type="checkbox" className="form-check-input" id="distributor_avnet" name="distys" value="avnet" checked={rfq.distys.includes('avnet')} onChange={this.handleChange} />
                    <label htmlFor="distributor_avnet" className="form-check-label">Avnet</label>
                  </div>
                  <div className="col">
                    <input type="checkbox" className="form-check-input" id="distributor_mouser" name="distys" value="mouser" checked={rfq.distys.includes('mouser')} onChange={this.handleChange} />
                    <label htmlFor="distributor_mouser" className="form-check-label">Mouser</label>
                  </div>
                  <div className="col">
                    <input type="checkbox" className="form-check-input" id="distributor_digikey" name="distys" value="digikey" checked={rfq.distys.includes('digikey')} onChange={this.handleChange} />
                    <label htmlFor="distributor_digikey" className="form-check-label">Digikey</label>
                  </div>
                  <div className="col">
                    <input type="checkbox" className="form-check-input" id="distributor_future" name="distys" value="future" checked={rfq.distys.includes('future')} onChange={this.handleChange} />
                    <label htmlFor="distributor_future" className="form-check-label">Future</label>
                  </div>
                  <div className="col">
                    <input type="checkbox" className="form-check-input" id="distributor_arrow" name="distys" value="arrow" checked={rfq.distys.includes('arrow')} onChange={this.handleChange} />
                    <label htmlFor="distributor_arrow" className="form-check-label">Arrow</label>
                  </div>
                  <div className="col">
                    <input type="checkbox" className="form-check-input" id="distributor_newark" name="distys" value="newark" checked={rfq.distys.includes('newark')} onChange={this.handleChange} />
                    <label htmlFor="distributor_newark" className="form-check-label">Newark</label>
                  </div>
                </div>
                {/* /PROJECT DETAILS*/}
              </div>
              <div className="col-md-6">
                <h4>Account Address</h4>
                <p>{user.company_name}<br />c/o {user.user_display_name}<br />{user.company_street}<br />{user.company_city}, {user.company_state} {user.company_zip}</p>
                <h4>Shipping Address</h4>
                {shippingAddressFields}
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" id="differentShippingAddress" value="true" checked={!!different_shipping_address} onChange={this.handleClickDifferentShippingAddress} />
                  <label className="form-check-label" htmlFor="differentShippingAddress">Use a different shipping address.</label>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="alert alert-secondary text-center">
          <button type="button" className="btn btn-primary" name="submit-rfq" onClick={this.handleSubmission}>Submit to FOX</button>
        </div>
        <br />

      </div>
    )
  }
}

export default Checkout;
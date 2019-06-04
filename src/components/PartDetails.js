import React, { Component } from 'react'

// Server Comms
import axios from 'axios'
import { FOXPART_API_ROOT } from '../api-config'

class PartDetails extends Component{

  state = {
    additionalPartDetails: null,
    foundAdditionalDetails: null,
    partDetailRows: {}
  }

  constructor(props){
    super(props)
    const { configuredPart } = this.props
    Object.keys(configuredPart).map( key => this.setPartDetailRow(key,configuredPart[key]) )
  }

  /**
   * Called after this component is rendered for the
   * first time. This is where we load external data.
   */
  componentDidMount(){
    const { configuredPart } = this.props
    const axiosUrl = `${FOXPART_API_ROOT}?partnum=${configuredPart.number.label}`
    // FO7HSCBE60.0
    console.log(`🔔 [PartDetails.js]->componentDidMount is calling: `, axiosUrl )

    axios
      .get(axiosUrl)
      .then( response => {
        const additionalDetails = response.data.data
        console.log(`⏰ [PartDetails.js]->componentDidMount() Axios request returned data. additionalDetails = `, additionalDetails )

        if( null !== additionalDetails ){
          Object.keys(additionalDetails).map( key => this.setPartDetailRow(key,additionalDetails[key]) )
          this.setState({additionalPartDetails: additionalDetails, foundAdditionalDetails: true})
        } else {
          this.setPartDetailRow('nodetails',{label: 'Check Availability', value: 'Please check with FOX regarding the availability of this part.'})
          this.setState({foundAdditionalDetails: false})
        }
      })
      .catch( error => console.log(error) )
  }

  setPartDetailRow = (key,partDetail) => {
    const { configuredPart } = this.props
    const { partDetailRows } = this.state
    let returnValue = null
    let label = partDetail.label
    let displayOrder = ( typeof partDetail.displayorder !== 'undefined' )? parseFloat( partDetail.displayorder ) + Object.keys(configuredPart).length : 0
    switch(key){
      case 'product_photo_part_image_url':
        returnValue = <img src={partDetail.value} style={{maxWidth: '80px'}} alt="Part" />
        break

      case 'data_sheet_url':
        returnValue = <a href={partDetail.value}>Download Data Sheet (PDF)</a>
        break

      case 'description':
      case 'number':
      case 'package_type':
      case 'frequency_unit':
      case 'frequency':
        // nothing
        break

      case 'optemp':
        displayOrder = 7
        label = 'Op Temp'
        returnValue = partDetail.label
        break

      case 'product_type':
        displayOrder = 1
        label = 'Product Type'
        returnValue = configuredPart.product_type.label + ' ' + configuredPart.frequency.value + configuredPart.frequency_unit.label + ' - ' + configuredPart.package_type.label
        break

      case 'output':
      case 'size':
      case 'stability':
      case 'tolerance':
      case 'voltage':
      case 'load':
        if( 'tolerance' === key ) displayOrder = 3
        if( 'size' === key ) displayOrder = 2
        if( 'output' === key ) displayOrder = 3
        if( 'voltage' === key ) displayOrder = 4
        if( 'stability' === key ) displayOrder = 5
        if( 'load' === key ) displayOrder = 6
        label = key.charAt(0).toUpperCase() + key.slice(1)
        returnValue = partDetail.label
        break

      case 'nodetails':
        partDetailRows[9999] = <tr key={9999}><th scope="row">Availability</th><td><code style={{color: '#333', fontSize: '14px'}}>Please check with FOX regarding this part's availability.</code></td></tr>
        return

      default:
        returnValue = partDetail.value
    }

    if( null !== returnValue )
      partDetailRows[displayOrder] = <tr key={key}><th scope="row" style={{whiteSpace: 'nowrap'}}>{label}</th><td>{returnValue}</td></tr>
  }

  handleClick = (e) => {
    const { cart, configuredPart, editing, setCurrentView } = this.props;
    if( editing ){
      if( typeof configuredPart.cart_id !== 'undefined' && configuredPart.number.value !== cart[configuredPart.cart_id].number.value ){
        setCurrentView('UpdateCartPart');
      } else {
        setCurrentView('ShoppingCart');
      }
    } else {
      this.props.updateCart('add','');
    }
  }

  render(){
    const { cart, configuredPart, editing } = this.props
    let buttonText = 'Add to Quote'
    if( typeof configuredPart.cart_id !== 'undefined' && configuredPart.number.value !== cart[configuredPart.cart_id].number.value ){
      buttonText = 'Update Part'
    } else if(editing) {
      buttonText = 'Return to Cart'
    }

    return(
      <div className="part-details">
        <hr />
        <div className="row">
          <div className="col-6">
            <h4>Configured Part</h4>
          </div>
          <div className="col-6 text-right">
            <button type="button" className="btn btn-primary" onClick={this.handleClick}>{buttonText}</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="">Model</label><br/>
            {configuredPart.number.label}
          </div>
          <div className="col-md-9">
            <label htmlFor="">Details</label>
            <table className="table table-sm table-striped">
              <colgroup>
                <col />
                <col style={{width: '100%'}}/>
              </colgroup>
              <tbody>
                { this.state.partDetailRows.length !== 0 &&
                  Object.keys(this.state.partDetailRows).map( key => this.state.partDetailRows[key] ) }
              </tbody>
            </table>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-12 text-right">
            <button type="button" className="btn btn-primary" onClick={this.handleClick}>{buttonText}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PartDetails;
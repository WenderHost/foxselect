import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'

class CartItemOptions extends Component {
  constructor(){
    super()

    this.handleChange = this.handleChange.bind(this)
    this.handleEvalDate = this.handleEvalDate.bind(this)
  }

  handleChange(e){
    let value = ('checkbox' === e.target.type)? e.target.checked : e.target.value;
    //console.log('CartItemOptions::handleChange value = ' + value );
    this.props.updateCart( 'update', this.props.id, e.target.name, value );
  }

  handleEvalDate( date ){
    this.props.updateCart( 'update', this.props.id, 'evalDate', date )
  }

  render(){
    const { id, part } = this.props;
    let sampleChecked = (typeof part.options === 'undefined')? false : part.options.sample;
    let sampleNoDisabled = (sampleChecked)? '' : 'disabled';

    let sampleNoValue = ''
    let internalPartNoValue = ''
    if(typeof part.options !== 'undefined'){
      if(sampleChecked)
        sampleNoValue = (typeof part.options.sampleNo !== 'undefined')? part.options.sampleNo : ''

      internalPartNoValue = (typeof part.options.internalPartNo !== 'undefined')? part.options.internalPartNo : ''
    }

    let evalDate = new Date()
    if(typeof part.options !== 'undefined'){
      if(typeof part.options.evalDate !== 'undefined')
        evalDate = new Date(part.options.evalDate)
    }

    let quoteChecked = (typeof part.options === 'undefined')? false : part.options.quote;
    let datasheetChecked = (typeof part.options === 'undefined')? false : part.options.datasheet;

    let options = (
      <div className="row">
        <div className="col-md-2 form-inline">
          <input className="form-check-input" type="checkbox" name="sample" value="true" id={'sample-' + id} checked={!!sampleChecked} onChange={this.handleChange} />
          <label className="form-check-label" htmlFor={'sample-' + id}>Sample</label>
          <input className="form-control form-control-sm text-right" style={{marginLeft: '8px', padding: '0 .5rem 0 .2rem', maxWidth: '38px'}} disabled={sampleNoDisabled} name="sampleNo" value={sampleNoValue} type="text" placeholder="No." onChange={this.handleChange} />
        </div>
        <div className="col-md-2">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="quote" value="true" id={'quote-' + id} checked={!!quoteChecked} onChange={this.handleChange} />
            <label className="form-check-label" htmlFor={'quote-' + id}>Quote</label>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="datasheet" value="true" id={'datasheet-' + id} checked={!!datasheetChecked} onChange={this.handleChange} />
            <label className="form-check-label" htmlFor={'datasheet-' + id}>Datasheet</label>
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group row" style={{marginBottom: '0', marginTop: '1rem'}}>
            <label htmlFor="" className="col-md-2 col-form-label col-form-label-sm" style={{fontSize: '13px'}}>Evaluation Date*</label>
            <div className="col-md-10">
              <label style={{width: '116px'}}>
                <DatePicker
                  selected={evalDate}
                  onChange={this.handleEvalDate}
                  className="form-control form-control-sm datepicker-sm"
                  placeholderText="Evaluation date"
                /><FontAwesomeIcon icon={faCalendar} style={{color: '#666'}} />
              </label>
            </div>
          </div>
          <div className="form-group row" style={{marginBottom: '0'}}>
            <label className="col-md-2 col-form-label col-form-label-sm" style={{fontSize: '13px'}}>Internal Part No.</label>
            <div className="col-md-10">
              <input className="form-control form-control-sm form-control-inline text-right" style={{padding: '0 .5rem 0 .2rem', maxWidth: '244px'}} name="internalPartNo" value={internalPartNoValue} type="text" placeholder="Internal Part No." onChange={this.handleChange} />
            </div>
          </div>
        </div>
      </div>
    )

    return(
      <div className="cart-item-options" style={{marginTop: '1rem'}}>
        {options}
      </div>
    )
  }
}

export default CartItemOptions
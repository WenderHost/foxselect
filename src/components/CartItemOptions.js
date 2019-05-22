import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'

class CartItemOptions extends Component {

  handleChange = (e) => {
    let value = ('checkbox' === e.target.type)? e.target.checked : e.target.value
    this.props.updateCart( 'update', this.props.id, e.target.name, value );
  }

  handleEvalDate = ( date ) => {
    this.props.updateCart( 'update', this.props.id, 'evalDate', date )
  }

  render(){
    const { id, part } = this.props;
    const sampleChecked = (typeof part.options === 'undefined')? false : part.options.sample;
    const quoteChecked = (typeof part.options === 'undefined')? false : part.options.quote;

    let sampleNoValue = ''
    //let quoteNoValue = ''
    let internalPartNoValue = ''
    let eauValue = ''
    if(typeof part.options !== 'undefined'){
      if(sampleChecked)
        sampleNoValue = (typeof part.options.sampleNo !== 'undefined')? part.options.sampleNo : ''
      //if(quoteChecked)
      //  quoteNoValue = (typeof part.options.quoteNo !== 'undefined')? part.options.quoteNo : ''

      internalPartNoValue = (typeof part.options.internalPartNo !== 'undefined')? part.options.internalPartNo : ''
      eauValue = (typeof part.options.eau !== 'undefined')? part.options.eau : ''
    }

    let evalDate = new Date()
    if(typeof part.options !== 'undefined'){
      if(typeof part.options.evalDate !== 'undefined')
        evalDate = new Date(part.options.evalDate)
    }

    let datasheetChecked = (typeof part.options === 'undefined')? false : part.options.datasheet;

    let options = (
      <div className="options">
        <div className="form-row align-items-center" style={{ height: '28px'}}>
          <div className="col-3 form-inline">
            <input className="form-check-input" type="checkbox" name="sample" value="true" id={'sample-' + id} checked={!!sampleChecked} onChange={this.handleChange} />
            <label className="form-check-label" htmlFor={'sample-' + id}>Sample</label>
            { sampleChecked &&
              <input className="form-control form-control-sm" style={{marginLeft: '8px', maxWidth: '50px', padding: '.15rem .25rem'}} name="sampleNo" value={sampleNoValue} type="number" onChange={this.handleChange} />}
          </div>
          <div className="col-3 form-inline">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="quote" value="true" id={'quote-' + id} checked={!!quoteChecked} onChange={this.handleChange} />
              <label className="form-check-label" htmlFor={'quote-' + id}>Quote</label>
              {/* quoteChecked &&
                <input className="form-control form-control-sm" style={{marginLeft: '8px', maxWidth: '50px', padding: '.15rem .25rem'}} name="quoteNo" value={quoteNoValue} type="number" onChange={this.handleChange} />*/}
            </div>
          </div>
          <div className="col-3 form-inline">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="datasheet" value="true" id={'datasheet-' + id} checked={!!datasheetChecked} onChange={this.handleChange} />
              <label className="form-check-label" htmlFor={'datasheet-' + id}>Datasheet</label>
            </div>
          </div>
        </div>{/**/}
        <div className="row">
          <div className="col">
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
              <div className="col-md-2">
                <input className="form-control form-control-sm form-control-inline text-right" style={{padding: '0 .5rem 0 .2rem', maxWidth: '244px'}} name="internalPartNo" value={internalPartNoValue} type="text" placeholder="" onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group row" style={{marginBottom: '0'}}>
              <label className="col-md-2 col-form-label col-form-label-sm" style={{fontSize: '13px'}}>EAU</label>
              <div className="col-md-2">
                <input className="form-control form-control-sm form-control-inline text-right" style={{padding: '0 .5rem 0 .2rem', maxWidth: '244px'}} name="eau" value={eauValue} type="text" placeholder="EAU" onChange={this.handleChange} />
              </div>
            </div>
          </div>
        </div>{/* .row */}
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
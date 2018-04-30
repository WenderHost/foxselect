import React, { Component } from 'react';

class CartItemOptions extends Component {
  constructor(){
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e){
    let value = ('checkbox' === e.target.type)? e.target.checked : e.target.value;
    //console.log('CartItemOptions::handleChange value = ' + value );
    this.props.updateCart( 'update', this.props.id, e.target.name, value );
  }

  handleClick(e){
    switch(e.target.name){
      case 'delete':
        this.props.updateCart('delete',this.props.id);
        break;
      case 'edit':
        this.props.loadPart(this.props.id);
        break;
      default:
        // nothing
        console.log('CartItemOptions: No action defined for `' + e.target.name + '`. CartItemID: ' + this.props.id);
    }

  }

  render(){
    const { id, part } = this.props;
    let sampleChecked = (typeof part.options === 'undefined')? false : part.options.sample;
    let sampleNoDisabled = (sampleChecked)? '' : 'disabled';
    let sampleNoValue = '';
    if(typeof part.options !== 'undefined'){
      if(sampleChecked){
        sampleNoValue = (typeof part.options.sampleNo !== 'undefined')? part.options.sampleNo : '';
      }
    }

    let quoteChecked = (typeof part.options === 'undefined')? false : part.options.quote;
    let datasheetChecked = (typeof part.options === 'undefined')? false : part.options.datasheet;

    let options = (
      <div className="row">
        <div className="col-sm-9">
          <div className="row">
            <div className="col-sm-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="sample" value="true" id={'sample-' + id} checked={!!sampleChecked} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor={'sample-' + id}>Sample</label>
              </div>
            </div>
            <div className="col-sm-4">
              <input className="form-control form-control-sm text-right" style={{padding: '0 .5rem 0 .2rem', maxWidth: '38px'}} disabled={sampleNoDisabled} name="sampleNo" value={sampleNoValue} type="text" placeholder="No." onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="quote" value="true" id={'quote-' + id} checked={!!quoteChecked} onChange={this.handleChange} />
            <label className="form-check-label" htmlFor={'quote-' + id}>Quote</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="datasheet" value="true" id={'datasheet-' + id} checked={!!datasheetChecked} onChange={this.handleChange} />
            <label className="form-check-label" htmlFor={'datasheet-' + id}>Datasheet</label>
          </div>
        </div>
        <div className="col-sm-3">
          <button type="button" name="edit" className="btn btn-primary btn-sm btn-block" onClick={this.handleClick}>Edit</button>
          <button type="button" name="delete" className="btn btn-danger btn-sm btn-block" onClick={this.handleClick}>Delete</button>
        </div>
      </div>
    )

    return(
      <div className="cart-item-options container">
        {options}
      </div>
    )
  }
}

export default CartItemOptions
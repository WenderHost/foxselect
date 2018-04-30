import React, { Component } from 'react';
import CartItemOptions from './CartItemOptions';

class CartItem extends Component{
  render(){
    const { id, part } = this.props;

    let cartItemDetail = '';
    switch( part.product_type.value ){
      case 'C':
        cartItemDetail = 'Model: ' + part.product_type.value + part.size.value + part.package_option.value + ', ' + part.tolerance.label + ' tolerance, ' + part.stability.label + ' stability, ' + part.load.label + ' load, ' + part.optemp.label + ' optemp, ' + part.frequency.value + ' ' + part.frequency_unit.value + ' ' + part.package_type.value
        break;

      default:
        cartItemDetail = Object.keys(part).map(key => part[key].label + ': ' + part[key].value + ', ');
    }

    return(
      <div>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <small className="d-none d-sm-block d-md-none">Part No.</small>
            {part.number.value}
          </div>
          <div className="col-md-5">
            <small className="d-none d-sm-block d-md-none" style={{marginTop: '8px'}}>Desc</small>
            {cartItemDetail}
          </div>
          <div className="col-md-4">
            <small className="d-none d-sm-block d-md-none" style={{marginTop: '8px'}}>Options</small>
            <CartItemOptions id={id} part={part} loadPart={this.props.loadPart} updateCart={this.props.updateCart} />
          </div>
        </div>
      </div>
    )
  }
}

export default CartItem;
import React, { Component } from 'react';

class CartItem extends Component{
  render(){
    const { part } = this.props;

    return(
      <div>
        <hr/>
        <div className="row">
          <div className="col-md-3">{part.number.value}</div>
          <div className="col-md-6">Model: {part.product_type.value}{part.size.value}{part.package_option.value}, {part.tolerance.label} tolerance, {part.stability.label} stability, {part.load.label} load, {part.optemp.label} optemp, {part.frequency.value} {part.frequency_unit.value} {part.package_type.value}</div>
          <div className="col-md-3">[CART OPTIONS GO HERE]</div>
        </div>
      </div>
    )
  }
}

export default CartItem;
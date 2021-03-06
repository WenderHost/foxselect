import React, { Component } from 'react';
import CartItemOptions from './CartItemOptions';

class CartItem extends Component{
  constructor(){
    super()
    this.handleClick = this.handleClick.bind(this)
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

    let cartItemDetail = '';
    switch( part.product_type.value ){
      case 'C':
        cartItemDetail = 'Model: ' + part.product_type.value + part.size.value + part.package_option.value + ', ' + part.tolerance.label + ' tolerance, ' + part.stability.label + ' stability, ' + part.load.label + ' load, ' + part.optemp.label + ' optemp, ' + part.frequency.value + ' ' + part.frequency_unit.label + ' ' + part.package_type.label
        break;

      default:
        cartItemDetail = Object.keys(part).map(key => part[key].label + ': ' + part[key].value + ', ')
        /*
        cartItemDetail = 'Model: ' + part.product_type.value + part.size.value + ', '
        cartItemDetail+= Object.keys(part).map( (key,index) => {
           return ('' !== part[key].label && typeof part[key].label !== 'undefined')? part[key].label + ', ' : ' '
        })
        /**/
    }

    return(
      <div className="cart-part">
        <div className="row">
          <div className="col-10">
            <div className="row">
              <div className="col-lg-4" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
                <small className="d-none d-md-block d-lg-none">Part No.</small>
                <strong>{part.number.label}</strong>
              </div>
              <div className="col">
                <small className="d-none d-md-block d-lg-none" style={{marginTop: '8px'}}>Desc</small>
                {cartItemDetail}
                <CartItemOptions id={id} part={part} loadPart={this.props.loadPart} updateCart={this.props.updateCart} />
              </div>
            </div>

          </div>{/* .col-10 */}
          <div className="col" style={{textAlign: 'right'}}>
            <div className="btn-group">
              <button type="button" name="edit" className="btn btn-primary btn-sm" style={{fontSize: '.75rem'}} onClick={this.handleClick}>Edit</button>
              <button type="button" name="delete" className="btn btn-danger btn-sm" style={{fontSize: '.75rem'}} onClick={this.handleClick}>Delete</button>
            </div>
          </div>{/* .col-2 */}
        </div>
      </div>
    )
  }
}

export default CartItem;
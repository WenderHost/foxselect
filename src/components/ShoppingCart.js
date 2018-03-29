import React, { Component } from 'react';
import CartItem from './CartItem';

class ShoppingCart extends Component{
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    switch(e.target.name){
      case 'continue-shopping':
          this.props.setCurrentView('PartSelector');
        break;

      case 'checkout':
          this.props.setCurrentView('Checkout');
        break;

      default:
        console.log('No logic defined for `' + e.target.name + '` inside ShoppingCart::handleClick().');
    }
  }


  render(){
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-3"><small>Model</small></div>
          <div className="col-md-6"><small>Details</small></div>
          <div className="col-md-3"><small>Options</small></div>
        </div>
        { 0 < this.props.partsInCart ? (
          Object.keys(this.props.cart).map(key => <CartItem key={key} part={this.props.cart[key]} />)
        ) : (
          <div>
            <hr/>
            <p className="text-center">Your cart is empty.</p>
            <p className="text-center"><button type="button" className="btn btn-primary btn-sm" name="checkout" onClick={() => this.props.setCurrentView('PartSelector')}>Continue Shopping</button></p>
            <hr/>
          </div>
        ) }
        { 0 < this.props.partsInCart &&
          <div className="text-right">
            <hr/>
            <button type="button" className="btn btn-primary" name="continue-shopping" onClick={this.handleClick}>Continue Shopping</button>
            <button type="button" className="btn btn-success" name="checkout" onClick={this.handleClick}>Checkout</button>
          </div> }
      </div>
    );
  }
}

export default ShoppingCart;
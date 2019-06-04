import React, { Component } from 'react';
import CartItem from './CartItem';

class ShoppingCart extends Component{
  constructor(props){
    super(props);
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
      <div className="containerX">
        <h1>Your Cart</h1>
        <div className="row d-none d-lg-flex">
          <div className="col-10">
            <div className="row">
              <div className="col-md-4"><small>Part No.</small></div>
              <div className="col-md-8"><small>Desc</small></div>
            </div>
          </div>
        </div>
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
        { 0 < this.props.partsInCart &&
          <div className="text-right" style={{paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)'}}>
            <button type="button" className="btn btn-primary" name="continue-shopping" onClick={this.handleClick}>Select a New Part</button>
            <button type="button" className="btn btn-success" name="checkout" onClick={this.handleClick}>Checkout</button>
          </div> }
      </div>
    );
  }
}
//export { ShoppingCart };
export default ShoppingCart;
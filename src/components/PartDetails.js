import React, { Component } from 'react';

class PartDetails extends Component{

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
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
    const { cart, configuredPart, editing } = this.props;
    let buttonText = 'Add to Quote';
    if( typeof configuredPart.cart_id !== 'undefined' && configuredPart.number.value !== cart[configuredPart.cart_id].number.value ){
      buttonText = 'Update Part'
    } else if(editing) {
      buttonText = 'Return to Quote'
    }

    return(
      <div className="part-details">
        <hr />
        <h4>Configured Part</h4>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="">Model</label><br/>
            {configuredPart.number.value}
          </div>
          <div className="col-md-5">
            <label htmlFor="">Details</label>
            {/*<div>
              {configuredPart.product_type.label}, {configuredPart.size.label}, {configuredPart.frequency.label}{configuredPart.frequency_unit.label}
            </div>*/}

            <table className="table table-sm table-striped">
              <colgroup>
                <col style={{width: '35%'}}/>
                <col style={{width: '65%'}}/>
              </colgroup>
              <tbody>
                {/* Object.keys(configuredPart).map(key => <tr key={key}><th scope="row">{key}</th><td>{configuredPart[key].label}</td></tr>) */}
                <tr>
                  <th scope="row">Product Type</th>
                  <td>{configuredPart.product_type.label} {configuredPart.frequency.value}{configuredPart.frequency_unit.value} - {configuredPart.package_type.value}</td>
                </tr>
                <tr>
                  <th scope="row">Size</th>
                  <td>{configuredPart.size.label}</td>
                </tr>
                { configuredPart.output &&
                <tr>
                  <th scope="row">Output</th>
                  <td>{configuredPart.output.label}</td>
                </tr>
                }
                { configuredPart.voltage &&
                <tr>
                  <th scope="row">Voltage</th>
                  <td>{configuredPart.voltage.label}</td>
                </tr>
                }
                { configuredPart.tolerance &&
                <tr>
                  <th scope="row">Tolerance</th>
                  <td>{configuredPart.tolerance.label}</td>
                </tr>
                }
                { configuredPart.stability &&
                <tr>
                  <th scope="row">Stability</th>
                  <td>{configuredPart.stability.label}</td>
                </tr>
                }
                { configuredPart.load &&
                <tr>
                  <th scope="row">Load</th>
                  <td>{configuredPart.load.label}</td>
                </tr>
                }
                { configuredPart.optemp &&
                <tr>
                  <th scope="row">Op Temp</th>
                  <td>{configuredPart.optemp.label}</td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <label htmlFor="">Documents</label><br/>
            <div><a href="/get-datasheet/#">Data Sheet</a> &middot; <a href="/get-support-docs/#">Support Docs</a></div>
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
import React, { Component } from 'react';
import { API_ROOT } from '../api-config';

class PartDetails extends Component{

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    //const { configuredPart } = this.props;
    this.props.addPart();
  }

  render(){
    const { configuredPart } = this.props;
    const testLink = API_ROOT + configuredPart.number.value + '/' + configuredPart.package_type.value;

    return(
      <div className="part-details">
        <hr />
        <h4>Configured Part</h4>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="">Model</label><br/>
            {configuredPart.number.value}
          </div>
          <div className="col-md-6">
            <label htmlFor="">Details</label>
            <table className="table table-sm table-striped">
              <colgroup>
                <col style={{width: '35%'}}/>
                <col style={{width: '65%'}}/>
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">Frequency</th>
                  <td>{configuredPart.frequency.value} {configuredPart.frequency_unit.value}</td>
                </tr>
                <tr>
                  <th scope="row">Package Type</th>
                  <td>{configuredPart.package_type.label}</td>
                </tr>
                <tr>
                  <th scope="row">Package Option</th>
                  <td>{configuredPart.package_option.value}</td>
                </tr>
                <tr>
                  <th scope="row">Size</th>
                  <td>{configuredPart.size.label}</td>
                </tr>
                <tr>
                  <th scope="row">Tolerance</th>
                  <td>{configuredPart.tolerance.label}</td>
                </tr>
                <tr>
                  <th scope="row">Stability</th>
                  <td>{configuredPart.stability.label}</td>
                </tr>
                <tr>
                  <th scope="row">Load</th>
                  <td>{configuredPart.load.label}</td>
                </tr>
                <tr>
                  <th scope="row">Op Temp</th>
                  <td>{configuredPart.optemp.label}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-3">
            <label htmlFor="">Documents</label><br/>
            <ul>
              <li><a href="/get-datasheet/#">Data Sheet</a></li>
              <li><a href="/get-support-docs/#">Support Docs</a></li>
            </ul>
            <p><a href={testLink} target="_blank">See JSON &rarr;</a></p>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-12 text-right">
            <button type="button" className="btn btn-primary" onClick={this.handleClick}>Add to Cart</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PartDetails;
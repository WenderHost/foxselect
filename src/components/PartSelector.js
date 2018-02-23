import React from 'react';

import SelectProductType from './SelectProductType';
import SelectFrequency from './SelectFrequency';
import AdditionalOptionsForm from './AdditionalOptionsForm';
import PartDetails from './PartDetails';

class PartSelector extends React.Component{

  constructor(){
    super();

    this.handleChange = this.handleChange.bind(this);
    this.isPartConfigured = this.isPartConfigured.bind(this);
    this.updateConfiguredPart = this.updateConfiguredPart.bind(this);

    this.state = {
      configuredPart: {
        product_type: '',
        frequency: '',
        frequency_unit: 'MHz',
        package_type: 'SMD',
        package_option: 'BS',
        size: '',
        tolerance: '',
        stability: '',
        load: '',
        optemp: ''
      }
    };
  }

  /**
   * Updates the state of the `configuredPart`
   *
   * @param      {str}    attribute  The configuredPart attribute
   * @param      {mixed}  value      The new value of the attribute
   */
  updateConfiguredPart( attribute, value ){
    // Account for value = `null` and value = [Object]
    if( ! value ){
      value = '';
    } else if ( typeof value === 'object' && value.value ){
      value = value.value;
    }

    // Set frequency to a number
    if( 'frequency' === attribute && 0 < value.length ){
      if( 0 <= value.indexOf('.') ){
        console.log('We found a decimal found in value!');
      } else {
        value = parseInt(value,10).toFixed(1);
      }
    }

    const { configuredPart } = this.state;

    // Update the value of our part attribute
    configuredPart[attribute] = value;

    this.setState({configuredPart: configuredPart});
  }

  /**
   * Determines if a part is configured.
   *
   * @param      {object}   configuredPart  The part to check
   * @return     {boolean}  True if part configured, False otherwise.
   */
  isPartConfigured(configuredPart){
    var isConfigured = true;

    if( typeof configuredPart.product_type === 'undefined' ||  0 === configuredPart.product_type.length )
      isConfigured = false;

    if( typeof configuredPart.frequency === 'undefined' || 0 === configuredPart.frequency.length )
      isConfigured = false;

    if( typeof configuredPart.size === 'undefined' || 0 === configuredPart.size.length )
      isConfigured = false;

    if( typeof configuredPart.tolerance === 'undefined' || 0 === configuredPart.tolerance.length )
      isConfigured = false;

    if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.length )
      isConfigured = false;

    if( typeof configuredPart.load === 'undefined' || 0 === configuredPart.load.length )
      isConfigured = false;

    if( typeof configuredPart.optemp === 'undefined' || 0 === configuredPart.optemp.length )
      isConfigured = false;

    return isConfigured;
  }

  /**
   * Handles a change in state for an input element
   *
   * @param      {object}  e       A changeEvent object
   */
  handleChange(e){
    this.updateConfiguredPart(e.target.name,e.target.value);
  }

  render(){
    const { configuredPart } = this.state;

    return (
      <div className="PartSelector">
        <form ref={form => this.form = form}>
          <div className="form-row">
            <div className="col-md-2">
              <SelectProductType updateConfiguredPart={this.updateConfiguredPart} />
            </div>
            <div className="col-md-2">
              <label className="sr-only" htmlFor="frequency">Frequency</label>
              <SelectFrequency updateConfiguredPart={this.updateConfiguredPart} />
            </div>
            <div className="col-md-1">
              <label>&nbsp;</label>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="frequency_unit" value="MHz" id="MHz" checked={configuredPart.frequency_unit === 'MHz'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="MHz">
                  MHz
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="frequency_unit" value="kHz" id="kHz" checked={configuredPart.frequency_unit === 'kHz'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="kHz">
                  kHz
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <label>&nbsp;</label>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="package_type" id="package_smd" value="SMD" checked={configuredPart.package_type === 'SMD'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="package_smd">
                  SMD
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="package_type" id="package_pinthru" value="Pin-Thru" checked={configuredPart.package_type === 'Pin-Thru'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="package_pinthru">
                  Pin-Thru
                </label>
              </div>
            </div>
          </div>
          { ( typeof configuredPart.product_type !== 'undefined' && 0 !== configuredPart.product_type.length ) ? <AdditionalOptionsForm configuredPart={configuredPart} updateConfiguredPart={this.updateConfiguredPart} /> : null }
          { this.isPartConfigured(configuredPart) ? <PartDetails configuredPart={configuredPart} /> : null }
        </form>
      </div>
    );
  }
};

export default PartSelector;
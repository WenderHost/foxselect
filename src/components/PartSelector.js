import React from 'react';

import SelectProductType from './SelectProductType';
import SelectFrequency from './SelectFrequency';
import AdditionalOptionsForm from './AdditionalOptionsForm';
import PartDetails from './PartDetails';
import axios from 'axios';
import { API_ROOT } from '../api-config';

class PartSelector extends React.Component{

  constructor(){
    super();

    this.handleChange = this.handleChange.bind(this);
    this.isPartConfigured = this.isPartConfigured.bind(this);
    this.updateConfiguredPart = this.updateConfiguredPart.bind(this);
    this.updateOptions = this.updateOptions.bind(this);

    this.state = {
      configuredPart: {
        product_type: '_',
        frequency: '0.0',
        frequency_unit: 'MHz',
        package_type: 'SMD',
        package_option: 'BS',
        size: '_',
        tolerance: '_',
        stability: '_',
        load: '_',
        optemp: '_',
        number: '_________'
      },
      partOptions: {
        frequency: [
          { value: '3.2', label: '3.2' },
          { value: '3.579', label: '3.579' },
          { value: '3.579545', label: '3.579545' },
          { value: '3.6', label: '3.6' },
          { value: '3.6864', label: '3.6864' },
          { value: '4', label: '4' },
          { value: '6', label: '6' },
          { value: '8', label: '8' },
          { value: '9', label: '9' },
          { value: '9.6', label: '9.6' },
          { value: '9.8', label: '9.8' },
          { value: '10', label: '10'},
          { value: '12', label: '12'},
          { value: '14', label: '14'},
          { value: '14.7456', label: '14.7456'},
          { value: '16', label: '16'},
          { value: '20', label: '20'},
          { value: '23.9', label: '23.9'},
          { value: '26', label: '26'},
          { value: '30', label: '30'},
          { value: '98.304', label: '98.304'}
        ],
        size: [],
        tolerance: [],
        stability: [],
        load: [],
        optemp: []
      },
      aecq200Sizes: ['1','2','3','4','5','6','7'],
      availableParts: 'n/a'
    };
  }

  /**
   * Updates the state of the `configuredPart`
   *
   * @param      {str}    attribute  The configuredPart attribute
   * @param      {mixed}  value      The new value of the attribute
   */
  updateConfiguredPart( attribute, value ){
    const { configuredPart, aecq200Sizes } = this.state;
    const originalConfiguredPart = configuredPart;

    // Account for value = `null` and value = [Object]
    if( ! value ){
      value = '';
    } else if ( typeof value === 'object' && value.value ){
      value = value.value;
    }

    if( '' === value )
      value = '_';

    // Set frequency to a number
    if( 'frequency' === attribute && 0 < value.length ){
      if( 0 <= value.indexOf('.') ){
        console.log('We found a decimal in value. Value is fixed already.');
      } else if( '_' === value ){
        // No frequency, reset configurePart
        value = '0.0';
        //configuredPart.size = '_';
        //configuredPart.tolerance = '_';
        //configuredPart.stability = '_';
        //configuredPart.load = '_';
        //configuredPart.optemp = '_';
        configuredPart.package_option = 'BS';
      } else {
        value = parseInt(value,10).toFixed(1);
      }
    }

    // Don't update if value hasn't changed
    const currentValue = configuredPart[attribute];
    if( value === currentValue )
      return;

    // Update the value of our part attribute
    configuredPart[attribute] = value;

    // When we are changing the `size`, reset the package_option to the default: `BS`
    if( 'size' === attribute ){
      if( 3 === value.length ){ // no package_option when size is 3 chars
        configuredPart['package_option'] = '';
      } else if( 0 < value.length && aecq200Sizes.includes(value) && configuredPart.package_option === 'BA' ){
        // do nothing
      } else if( 0 < value.length && ! aecq200Sizes.includes(value) ){
        configuredPart.package_option = 'BS';
      } else {
        configuredPart['package_option'] = 'BS';
      }
    }

    configuredPart['number'] = 'F' + configuredPart['product_type'] + configuredPart['size'] + configuredPart['package_option'] + configuredPart['tolerance'] + configuredPart['stability'] + configuredPart['load'] + configuredPart['optemp'] + '-' + configuredPart['frequency'];

    this.setState({configuredPart: configuredPart});
    this.updateOptions( originalConfiguredPart, configuredPart );
  }


  updateOptions( originalConfiguredPart, configuredPart ){
    axios
      .get(`${API_ROOT}${configuredPart.number}`)
      .then(response => {
        console.log('Axios request returned...');
        console.log(response.data);

        const { partOptions } = this.state;
        const { availableParts } = response.data;

        var forceUpdate = false;
        if( originalConfiguredPart.frequency !== configuredPart.frequency || '0.0' === configuredPart.frequency )
          forceUpdate = true;

        if( originalConfiguredPart.size !== configuredPart.size )
          forceUpdate = true;

        if( typeof response.data.partOptions.size !== 'undefined' || true === forceUpdate )
          partOptions.size = response.data.partOptions.size;

        if( typeof response.data.partOptions.tolerance !== 'undefined' || true === forceUpdate )
          partOptions.tolerance = response.data.partOptions.tolerance;

        if( typeof response.data.partOptions.stability !== 'undefined' || true === forceUpdate )
          partOptions.stability = response.data.partOptions.stability;

        if( typeof response.data.partOptions.load !== 'undefined' )
          partOptions.load = response.data.partOptions.load;

        if( typeof response.data.partOptions.optemp !== 'undefined' )
          partOptions.optemp = response.data.partOptions.optemp;

        this.setState({partOptions: partOptions, availableParts: availableParts});
      })
      .catch(error => console.log(error))
  }

  /**
   * Determines if a part is configured.
   *
   * @param      {object}   configuredPart  The part to check
   * @return     {boolean}  True if part configured, False otherwise.
   */
  isPartConfigured(configuredPart){
    var isConfigured = true;

    if( typeof configuredPart.product_type === 'undefined' ||  0 === configuredPart.product_type.length || '_' === configuredPart.product_type )
      isConfigured = false;

    if( typeof configuredPart.frequency === 'undefined' || 0 === configuredPart.frequency.length || '_' === configuredPart.frequency )
      isConfigured = false;

    if( typeof configuredPart.size === 'undefined' || 0 === configuredPart.size.length || '_' === configuredPart.size )
      isConfigured = false;

    if( typeof configuredPart.tolerance === 'undefined' || 0 === configuredPart.tolerance.length || '_' === configuredPart.tolerance )
      isConfigured = false;

    if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.length || '_' === configuredPart.stability )
      isConfigured = false;

    if( typeof configuredPart.load === 'undefined' || 0 === configuredPart.load.length || '_' === configuredPart.load )
      isConfigured = false;

    if( typeof configuredPart.optemp === 'undefined' || 0 === configuredPart.optemp.length || '_' === configuredPart.optemp )
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
    const { configuredPart, partOptions, availableParts } = this.state;

    return (
      <div className="PartSelector">
        <div className="row no-gutters">
          <div className="col-md-3"><h1 className="title">FoxSelect&trade;</h1></div>
          <div className="col-md-2" style={{textAlign: 'right'}}><p>Configured Part:&nbsp;<br />Available Parts:&nbsp;</p></div>
          <div className="col-md-4"><p>{ ( configuredPart.number )? <code>{configuredPart.number}</code> : null }<br/><code>{availableParts}</code></p></div>
        </div>
        <form ref={form => this.form = form}>
          <div className="form-row">
            <div className="col-md-2">
              <SelectProductType updateConfiguredPart={this.updateConfiguredPart} />
            </div>
            <div className="col-md-2">
              <label className="sr-only" htmlFor="frequency">Frequency</label>
              <SelectFrequency updateConfiguredPart={this.updateConfiguredPart} frequencyOptions={partOptions.frequency} />
            </div>
            <div className="col-md-1">
              <div className="form-check" style={{marginTop: '24px'}}>
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
              <div className="form-check" style={{marginTop: '24px'}}>
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
          { ( typeof configuredPart.product_type !== 'undefined'
              && 0 !== configuredPart.product_type.length
              && '_' !== configuredPart.product_type
            ) ? <AdditionalOptionsForm configuredPart={configuredPart} updateConfiguredPart={this.updateConfiguredPart} partOptions={partOptions} aecq200Sizes={this.state.aecq200Sizes} /> : null }
          {/* this.isPartConfigured(configuredPart) ? <PartDetails configuredPart={configuredPart} /> : null */}
          <PartDetails configuredPart={configuredPart} />
        </form>
      </div>
    );
  }
};

export default PartSelector;
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
    this.generatePartNumber = this.generatePartNumber.bind(this);
    this.updateConfiguredPart = this.updateConfiguredPart.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.resetConfiguredPart = this.resetConfiguredPart.bind(this);

    this.state = {
      configuredPart: {
        product_type: '_',
        frequency: '0.0',
        frequency_unit: 'MHz',
        package_type: 'SMD',
        package_option: 'BS',
        size: '_',
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
        stability: [],
        load: [],
        optemp: []
      },
      crystalAECQ200Sizes: ['1','2','3','4','5','6','7'],
      oscillatorAECQ200Sizes: ['1','2','3','5','7'],
      availableParts: 'n/a'
    };
  }

  /**
   * Generates a Fox Part number from configuredPart
   *
   * @param      {object}  configuredPart  The configured part
   */
  generatePartNumber(configuredPart){
    if('_' === configuredPart.product_type){
      configuredPart.number = '_________';
      return;
    }


    configuredPart.number = 'F' + configuredPart.product_type + configuredPart.size;
    var partNumberProperties = [];
    switch(configuredPart.product_type){
      case 'C':
        partNumberProperties = ['package_option','tolerance','stability','load','optemp'];
      break;
      case 'O':
        partNumberProperties = ['output','voltage','stability','optemp'];
      break;
      default:
        console.log('No Part Number pattern specified for product_type `' + configuredPart.product_type + '`');
    }
    for (var i = 0; i < partNumberProperties.length; i++) {
      var property = partNumberProperties[i];
      if(configuredPart.hasOwnProperty(property) && '' !== configuredPart[property]){
        configuredPart.number += configuredPart[property];
      } else {
        var value = '';
        switch(property){
          case 'package_option':
          case 'output':
            value = '__';
            break;
          default:
            value = '_';
        }
        configuredPart.number += value;
      }
    }
    configuredPart.number += '-' + configuredPart.frequency;
  }

  /**
   * Updates the state of the `configuredPart`
   *
   * @param      {str}    attribute  The configuredPart attribute
   * @param      {mixed}  value      The new value of the attribute
   */
  updateConfiguredPart( attribute, value ){
    const { configuredPart, crystalAECQ200Sizes } = this.state;
    const originalConfiguredPart = configuredPart;
    const currentValue = configuredPart[attribute];

    // Account for value = `null` and value = [Object]
    if( ! value ){
      value = '';
    } else if ( typeof value === 'object' && value.value ){
      value = value.value;
    }

    if( '' === value )
      value = '_';

    // `product_type` has changed, reset the configuredPart
    if( 'product_type' === attribute && value !== currentValue )
      this.resetConfiguredPart(configuredPart,value);

    // Set frequency to a number
    if( 'frequency' === attribute && 0 < value.length ){
      if( 0 === value.indexOf('.') ){
        value = '0' + value;
      } else if( 0 < value.indexOf('.') ){
        // nothing; We found a decimal in value. Value is fixed already.
      } else if( '_' === value ){
        // No frequency, (We may one to RESET the part here:)
        value = '0.0';
      } else {
        value = parseInt(value,10).toFixed(1);
      }
    }

    // Don't update if value hasn't changed
    if( value === currentValue )
      return;

    // Update the value of our part attribute
    configuredPart[attribute] = value;

    // When we are changing the `size`, reset the package_option to the default: `BS`
    if( 'size' === attribute ){
      switch(configuredPart.product_type){
        case 'C':
          if( 3 === value.length ){ // no package_option when size is 3 chars
            configuredPart['package_option'] = '';
          } else if( 0 < value.length && crystalAECQ200Sizes.includes(value) && configuredPart.package_option === 'BA' ){
            // do nothing
          } else if( 0 < value.length && ! crystalAECQ200Sizes.includes(value) ){
            configuredPart.package_option = 'BS';
          } else {
            configuredPart['package_option'] = 'BS';
          }
          break;
        default:
          console.log('No size rules for product_type = `' + configuredPart.product_type + '`');
      }
    }

    this.generatePartNumber(configuredPart);
    this.setState({configuredPart: configuredPart});
    this.updateOptions( originalConfiguredPart, configuredPart );
  }

  /**
   * Updates this.state.partOptions with data returned from the REST API
   *
   * @param      {object}  originalConfiguredPart  The original configured part
   * @param      {object}  configuredPart          The configured part
   */
  updateOptions( originalConfiguredPart, configuredPart ){
    if( '_________' === configuredPart.number )
      return;

    axios
      .get(`${API_ROOT}${configuredPart.number}`)
      .then(response => {
        //console.log('Axios request returned...');
        //console.log(response.data);

        const { partOptions } = this.state;
        const { availableParts } = response.data;

        var forceUpdate = false;
        if( originalConfiguredPart.frequency !== configuredPart.frequency || '0.0' === configuredPart.frequency )
          forceUpdate = true;

        if( originalConfiguredPart.size !== configuredPart.size )
          forceUpdate = true;

        const allowedOptions = ['size','tolerance','stability','voltage','output','load','optemp'];
        for (var i = allowedOptions.length - 1; i >= 0; i--) {
          var option = allowedOptions[i];
          if( typeof response.data.partOptions[option] !== 'undefined' || true === forceUpdate )
            partOptions[option] = response.data.partOptions[option];
        }

        this.setState({partOptions: partOptions, availableParts: availableParts});
      })
      .catch(error => console.log(error))
  }

  /**
   * Resets ${configuredPart} with `_` for all properties
   *
   * @param      {object}  configuredPart   The configured part
   * @param      {string}  new_product_type The `product_type` code we're switching to
   */
  resetConfiguredPart(configuredPart, new_product_type){
    console.log('resetting configuredPart:');
    console.log(configuredPart);
    console.log('new_product_type = ' + new_product_type);
    for(var property in configuredPart){
      if(configuredPart.hasOwnProperty(property)){
        var propertyValue = '_';
        switch(property){
          case 'frequency':
            propertyValue = '0.0';
            break;

          case 'frequency_unit':
            propertyValue = 'MHz';
            break;

          case 'output':
          case 'package_option':
            propertyValue = '__'
            break;

          case 'package_type':
            propertyValue = 'SMD';
            break;

          default:
            // nothing
        }
        configuredPart[property] = propertyValue;
      }
    }

    switch(new_product_type){
      case 'C':
        delete configuredPart.voltage;
        delete configuredPart.output;
        configuredPart.tolerance = '_';
        configuredPart.package_option = '__';
      break;

      case 'O':
        delete configuredPart.tolerance;
        delete configuredPart.package_option;
        configuredPart.voltage = '_';
        configuredPart.output = '__';
      break;

      default:
    }
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
          { typeof configuredPart.product_type !== 'undefined'
            && 0 !== configuredPart.product_type.length
            && '_' !== configuredPart.product_type &&
            <AdditionalOptionsForm
              configuredPart={configuredPart}
              updateConfiguredPart={this.updateConfiguredPart}
              partOptions={partOptions}
              crystalAECQ200Sizes={this.state.crystalAECQ200Sizes}
              oscillatorAECQ200Sizes={this.state.oscillatorAECQ200Sizes}
            /> }
          {/* this.isPartConfigured(configuredPart) && <PartDetails configuredPart={configuredPart} /> */}
          <PartDetails configuredPart={configuredPart} />
        </form>
      </div>
    );
  }
};

export default PartSelector;
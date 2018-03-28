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
        product_type: {value: '_', label: ''},
        frequency: {value: '0.0', label: ''},
        frequency_unit: {value: 'MHz', label: 'MHz'},
        package_type: {value: 'SMD', label: 'SMD'},
        package_option: {value: 'BS', label: ''},
        size: {value: '_', label: ''},
        stability: {value: '_', label: ''},
        load: {value: '_', label: ''},
        optemp: {value: '_', label: ''},
        number: {value: '_________', label: '_________'}
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
    if('_' === configuredPart.product_type.value){
      configuredPart.number.value = '_________';
      return;
    }


    configuredPart.number.value = 'F' + configuredPart.product_type.value + configuredPart.size.value;
    var partNumberProperties = [];
    switch(configuredPart.product_type.value){
      case 'C':
        partNumberProperties = ['package_option','tolerance','stability','load','optemp'];
      break;
      case 'O':
        partNumberProperties = ['output','voltage','stability','optemp'];
      break;
      default:
        console.log('No Part Number pattern specified for product_type `' + configuredPart.product_type.value + '`');
    }
    for (var i = 0; i < partNumberProperties.length; i++) {
      var property = partNumberProperties[i];
      if(configuredPart.hasOwnProperty(property) && '' !== configuredPart[property]){
        configuredPart.number.value += configuredPart[property].value;
      } else {
        var value = '';
        switch(property){
          case 'package_option':
            value = ( 'Pin-Thru' === configuredPart.package_type.value )? '' : '__';
            break;
          case 'output':
            value = '__';
            break;
          default:
            value = '_';
        }
        configuredPart.number.value += value;
      }
    }
    configuredPart.number.value += '-' + configuredPart.frequency.value;
  }

  /**
   * Updates the state of the `configuredPart`
   *
   * @param      {str}    attribute  The configuredPart attribute
   * @param      {obj}    option     The attribute object: {value: '', label: ''}
   */
  updateConfiguredPart( attribute, option ){

    const { configuredPart, crystalAECQ200Sizes } = this.state;
    const originalConfiguredPart = configuredPart;
    const currentValue = (typeof configuredPart[attribute] !== 'undefined')? configuredPart[attribute].value : '';

    // Account for option = `null`
    if( ! option ){
      option = {value: '', label: ''};
    }
    // Ensure `option` is [object]
    if ( typeof option !== 'object' ){
      option = {value: option, label: option};
    }

    if( '' === option.value )
      option.value = '_';

    // `product_type` has changed, reset the configuredPart
    if( 'product_type' === attribute && option.value !== currentValue )
      this.resetConfiguredPart(configuredPart,option.value);

    // Set frequency to a number
    if( 'frequency' === attribute && 0 < option.value.length ){
      if( 0 === option.value.indexOf('.') ){
        option.value = '0' + option.value;
      } else if( 0 < option.value.indexOf('.') ){
        // nothing; We found a decimal in value. Value is fixed already.
      } else if( '_' === option.value ){
        // No frequency, (We may one to RESET the part here:)
        option.value = '0.0';
      } else {
        option.value = parseInt(option.value,10).toFixed(1);
      }
    }

    // Don't update if value hasn't changed
    if( option.value === currentValue )
      return;

    // Update the value of our part attribute
    configuredPart[attribute] = option;

    // When we are changing the `size`, reset the package_option to the default: `BS`
    if( 'size' === attribute ){
      switch(configuredPart.product_type.value){
        case 'C':
          if( 3 === option.value.length ){ // no package_option when size is 3 chars
            configuredPart['package_option'].value = '';
          } else if( 0 < option.value.length && crystalAECQ200Sizes.includes(option.value) && configuredPart.package_option.value === 'BA' ){
            // do nothing
          } else if( 0 < option.value.length && ! crystalAECQ200Sizes.includes(option.value) ){
            configuredPart.package_option.value = 'BS';
          } else {
            configuredPart['package_option'].value = 'BS';
          }
          break;
        default:
          console.log('No size rules for product_type = `' + configuredPart.product_type.value + '`');
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
    if( typeof configuredPart.number.value === 'undefined' || '_________' === configuredPart.number.value )
      return;

    axios
      .get(`${API_ROOT}${configuredPart.number.value}/${configuredPart.package_type.value}`)
      .then(response => {
        //console.log('Axios request returned...');
        //console.log(response.data);

        const { partOptions } = this.state;
        const { availableParts } = response.data;

        var forceUpdate = false;
        if( originalConfiguredPart.frequency.value !== configuredPart.frequency.value || '0.0' === configuredPart.frequency.value )
          forceUpdate = true;

        if( originalConfiguredPart.size.value !== configuredPart.size.value )
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
        configuredPart[property].value = propertyValue;
      }
    }

    switch(new_product_type){
      case 'C':
        delete configuredPart.voltage;
        delete configuredPart.output;
        configuredPart.tolerance = {value: '_', label: ''};
        configuredPart.package_option = {value: '__', label: ''};
      break;

      case 'O':
        delete configuredPart.tolerance;
        delete configuredPart.package_option;
        configuredPart.voltage = {value: '_', label: ''};
        configuredPart.output = {value: '__', label: ''};
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

    if( typeof configuredPart.product_type === 'undefined' ||  0 === configuredPart.product_type.value.length || '_' === configuredPart.product_type.value )
      isConfigured = false;

    if( typeof configuredPart.frequency === 'undefined' || 0 === configuredPart.frequency.value.length || '_' === configuredPart.frequency.value )
      isConfigured = false;

    if( typeof configuredPart.size === 'undefined' || 0 === configuredPart.size.value.length || '_' === configuredPart.size.value )
      isConfigured = false;

    if( typeof configuredPart.tolerance === 'undefined' || 0 === configuredPart.tolerance.value.length || '_' === configuredPart.tolerance.value )
      isConfigured = false;

    if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.value.length || '_' === configuredPart.stability.value )
      isConfigured = false;

    if( typeof configuredPart.load === 'undefined' || 0 === configuredPart.load.value.length || '_' === configuredPart.load.value )
      isConfigured = false;

    if( typeof configuredPart.optemp === 'undefined' || 0 === configuredPart.optemp.value.length || '_' === configuredPart.optemp.value )
      isConfigured = false;

    return isConfigured;
  }

  /**
   * Handles a change in state for an input element
   *
   * @param      {object}  e       A changeEvent object
   */
  handleChange(e){
    this.updateConfiguredPart(e.target.name,e.target);
  }

  render(){
    const { configuredPart, partOptions, availableParts } = this.state;
    const { addPart } = this.props;

    return (
      <div className="PartSelector">
        <div className="row no-gutters">
          <div className="col-md-3"><h1 className="title">FoxSelect&trade;</h1></div>
          <div className="col-md-2" style={{textAlign: 'right'}}><p>Configured Part:&nbsp;<br />Available Parts:&nbsp;</p></div>
          <div className="col-md-4"><p>{ ( configuredPart.number.value )? <code>{configuredPart.number.value}</code> : null }<br/><code>{availableParts}</code></p></div>
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
                <input className="form-check-input" type="radio" name="frequency_unit" value="MHz" id="MHz" checked={configuredPart.frequency_unit.value === 'MHz'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="MHz">
                  MHz
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="frequency_unit" value="kHz" id="kHz" checked={configuredPart.frequency_unit.value === 'kHz'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="kHz">
                  kHz
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check" style={{marginTop: '24px'}}>
                <input className="form-check-input" type="radio" name="package_type" id="package_smd" value="SMD" checked={configuredPart.package_type.value === 'SMD'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="package_smd">
                  SMD
                </label>
              </div>
              { 'C' === configuredPart.product_type &&
              <div className="form-check">
                <input className="form-check-input" type="radio" name="package_type" id="package_pinthru" value="Pin-Thru" checked={configuredPart.package_type.value === 'Pin-Thru'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="package_pinthru">
                  Pin-Thru
                </label>
              </div> }
            </div>
          </div>
          { typeof configuredPart.product_type !== 'undefined'
            && 0 !== configuredPart.product_type.value.length
            && '_' !== configuredPart.product_type.value &&
            <AdditionalOptionsForm
              configuredPart={configuredPart}
              updateConfiguredPart={this.updateConfiguredPart}
              partOptions={partOptions}
              crystalAECQ200Sizes={this.state.crystalAECQ200Sizes}
              oscillatorAECQ200Sizes={this.state.oscillatorAECQ200Sizes}
            /> }
          { this.isPartConfigured(configuredPart) &&
            <PartDetails configuredPart={configuredPart} addPart={addPart} /> }
          {/*<PartDetails configuredPart={configuredPart} />*/}
        </form>
      </div>
    );
  }
};

export default PartSelector;
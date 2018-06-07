import React from 'react';

import SelectProductType from './selects/SelectProductType';
import SelectFrequency from './selects/SelectFrequency';
import AdditionalOptionsForm from './AdditionalOptionsForm';
import PartDetails from './PartDetails';

class PartSelector extends React.Component{

  constructor(){
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handles a change in state for an input element
   *
   * @param      {object}  e       A changeEvent object
   */
  handleChange(e){
    if( window.confirm('Updating this setting will reset your additional options. Continue?') )
      this.props.updateConfiguredPart(e.target.name,{value: e.target.value, label: e.target.name});
  }

  render(){
    const { aecq200, cart, configuredPart, editing, partOptions, updateConfiguredPart } = this.props;

    return (
      <div className="PartSelector">
        <form ref={form => this.form = form}>
          <div className="form-row">
            <div className="col-md-2">
              <SelectProductType
                product_type={configuredPart.product_type}
                updateConfiguredPart={this.props.updateConfiguredPart}
              />
            </div>
            <div className="col-md-2">
              <label className="sr-only" htmlFor="frequency">Frequency</label>
              <SelectFrequency
                frequency={configuredPart.frequency}
                updateConfiguredPart={this.props.updateConfiguredPart}
                frequencyOptions={partOptions.frequency}
                configuredPart={configuredPart}
              />
            </div>
            <div className="col-md-1">
              <div className="form-check" style={{marginTop: '24px'}}>
                <input className="form-check-input" type="radio" name="frequency_unit" value="MHz" id="MHz" checked={configuredPart.frequency_unit.value === 'MHz'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="MHz">
                  MHz
                </label>
              </div>
              { typeof configuredPart.product_type !== 'undefined' &&
                ('T' !== configuredPart.product_type.value && 'Y' !== configuredPart.product_type.value && 'S' !== configuredPart.product_type.value) &&
              <div className="form-check">
                <input className="form-check-input" type="radio" name="frequency_unit" value="kHz" id="kHz" checked={configuredPart.frequency_unit.value === 'kHz'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="kHz">
                  kHz
                </label>
              </div> }
            </div>
            <div className="col-md-2">
              <div className="form-check" style={{marginTop: '24px'}}>
                <input className="form-check-input" type="radio" name="package_type" id="package_smd" value="SMD" checked={configuredPart.package_type.value === 'SMD'} onChange={this.handleChange} />
                <label className="form-check-label" htmlFor="package_smd">
                  SMD
                </label>
              </div>
              { ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value) &&
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
              updateConfiguredPart={updateConfiguredPart}
              partOptions={partOptions}
              aecq200={aecq200}
            /> }
          { this.props.isPartConfigured(configuredPart) &&
            <PartDetails cart={cart} configuredPart={configuredPart} updateCart={this.props.updateCart} setCurrentView={this.props.setCurrentView} editing={editing} /> }
        </form>
      </div>
    );
  }
};

export default PartSelector;
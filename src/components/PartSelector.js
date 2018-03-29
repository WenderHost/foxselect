import React from 'react';

import SelectProductType from './SelectProductType';
import SelectFrequency from './SelectFrequency';
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
    this.updateConfiguredPart(e.target.name,e.target);
  }

  render(){
    const { addPart, configuredPart, partOptions, crystalAECQ200Sizes, oscillatorAECQ200Sizes, updateConfiguredPart } = this.props;

    return (
      <div className="PartSelector">
        <form ref={form => this.form = form}>
          <div className="form-row">
            <div className="col-md-2">
              <SelectProductType updateConfiguredPart={this.props.updateConfiguredPart} />
            </div>
            <div className="col-md-2">
              <label className="sr-only" htmlFor="frequency">Frequency</label>
              <SelectFrequency updateConfiguredPart={this.props.updateConfiguredPart} frequencyOptions={partOptions.frequency} />
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
              { 'C' === configuredPart.product_type.value &&
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
              crystalAECQ200Sizes={crystalAECQ200Sizes}
              oscillatorAECQ200Sizes={oscillatorAECQ200Sizes}
            /> }
          { this.props.isPartConfigured(configuredPart) &&
            <PartDetails configuredPart={configuredPart} addPart={addPart} /> }
        </form>
      </div>
    );
  }
};

export default PartSelector;
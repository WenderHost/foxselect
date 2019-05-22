import React from 'react';

import SelectProductType from './selects/SelectProductType';
import InputFrequency from './InputFrequency'
import FrequencyUnit from './FrequencyUnit'
import AdditionalOptionsForm from './AdditionalOptionsForm';
import PartDetails from './PartDetails';
import { API_ENV } from '../api-config';

class PartSelector extends React.Component{

  /**
   * Handles a change in state for an input element
   *
   * @param      {object}  e       A changeEvent object
   */
  handleChange = (e) => {
    if( window.confirm('Updating this setting will reset your additional options. Continue?') )
      this.props.updateConfiguredPart(e.target.name,{value: e.target.value, label: e.target.value});
  }

  render(){
    const { aecq200, cart, configuredPart, editing, partOptions, updateConfiguredPart } = this.props;

    return (
      <div className="PartSelector">
        <form ref={form => this.form = form}>
          <div className="form-row">
            <div className="col-xl-4">
              <SelectProductType
                product_type={configuredPart.product_type}
                updateConfiguredPart={this.props.updateConfiguredPart}
              />
            </div>
            <div className="col-xl-8">
              <div className="row">
                <div className="col-md-6 col-frequency">
                  <InputFrequency
                    updateConfiguredPart={this.props.updateConfiguredPart}
                    configuredPart={configuredPart}
                  />
                </div>
                <div className="col-sm-2">
                  <FrequencyUnit
                    updateConfiguredPart={this.props.updateConfiguredPart}
                    configuredPart={configuredPart}
                  />
                </div>
                <div className="col-sm-3">
                  <label className="" htmlFor="package_type">Package Type</label>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="package_type" id="package_smd" value="smd" checked={configuredPart.package_type.value.toLowerCase() === 'smd'} onChange={this.handleChange} />
                    <label className="form-check-label" htmlFor="package_smd">
                      SMD
                    </label>
                  </div>
                  { ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value) &&
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="package_type" id="package_pinthru" value="pin-thru" checked={configuredPart.package_type.value.toLowerCase() === 'pin-thru'} onChange={this.handleChange} />
                    <label className="form-check-label" htmlFor="package_pinthru">
                      Pin-Thru
                    </label>
                  </div> }
                </div>
              </div>
            </div>
            {/* Formerly MHz/kHz and SMD/Pin-Thru went here. */}
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
          { this.props.isPartConfigured(configuredPart)
            && 'web' === API_ENV &&
            <PartDetails cart={cart} configuredPart={configuredPart} updateCart={this.props.updateCart} setCurrentView={this.props.setCurrentView} editing={editing} /> }
        </form>
      </div>
    );
  }
};

export default PartSelector;
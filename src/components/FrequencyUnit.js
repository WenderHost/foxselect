import React, { Component } from 'react';

class FrequencyUnit extends Component{

  /**
   * Handles a change in state for an input element
   *
   * @param      {object}  e       A changeEvent object
   */
  handleChange = (e) => {
    const { configuredPart } = this.props
    const frequencyUnitLabels = {'mhz': 'MHz', 'khz': 'kHz'}
    if( ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value) && window.confirm('Updating this setting will reset your additional options. Continue?') ){
      this.props.updateConfiguredPart(e.target.name,{ value: e.target.value, label: frequencyUnitLabels[e.target.value] } );
    } else {
      this.props.updateConfiguredPart(e.target.name,{ value: e.target.value, label: frequencyUnitLabels[e.target.value] } );
    }
  }

  render(){
    const { configuredPart } = this.props
    const khzParts = ['C','K','O']

    return(
      <div>
        <label className="" htmlFor="frequency_unit">Unit</label>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="frequency_unit" value="mhz" id="MHz" checked={configuredPart.frequency_unit.value === 'mhz'} onChange={this.handleChange} />
          <label className="form-check-label" htmlFor="MHz">
            MHz
          </label>
        </div>
        { typeof configuredPart.product_type !== 'undefined' &&
          -1 < khzParts.indexOf( configuredPart.product_type.value ) &&
        <div className="form-check">
          <input className="form-check-input" type="radio" name="frequency_unit" value="khz" id="kHz" checked={configuredPart.frequency_unit.value === 'khz'} onChange={this.handleChange} />
          <label className="form-check-label" htmlFor="kHz">
            kHz
          </label>
        </div> }
      </div>
    )
  }
}

export default FrequencyUnit

/*
( 'T' !== configuredPart.product_type.value
            && 'Y' !== configuredPart.product_type.value
            && 'S' !== configuredPart.product_type.value
            && ( 'C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value || 'O' === configuredPart.product_type.value ) )
 */
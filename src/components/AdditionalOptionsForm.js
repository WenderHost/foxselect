import React, { Component } from 'react';
import SelectSize from './SelectSize';
import CheckboxCrystalAECQ200 from './CheckboxCrystalAECQ200';
import CheckboxOscillatorAECQ200 from './CheckboxOscillatorAECQ200';
import SelectTolerance from './SelectTolerance';
import SelectOutput from './SelectOutput';
import SelectVoltage from './SelectVoltage';
import SelectStability from './SelectStability';
import SelectLoad from './SelectLoad';
import SelectOpTemp from './SelectOpTemp';
import SizeOptions from './SizeOptions';

class AdditionalOptionsForm extends Component{
  render(){
    const { configuredPart, updateConfiguredPart, partOptions, crystalAECQ200Sizes, oscillatorAECQ200Sizes } = this.props;

    return(
      <div>
        <div className="form-row" style={{marginTop: '20px'}}>
          { typeof partOptions.size !== 'undefined' &&
          <div className="col-md-2">
            <SelectSize configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} sizeOptions={partOptions.size} />
          </div> }

          { typeof configuredPart.size !== 'undefined' && crystalAECQ200Sizes.includes(configuredPart.size.value) && 'C' === configuredPart.product_type.value &&
            <CheckboxCrystalAECQ200 configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} /> }

          { typeof configuredPart.size !== 'undefined' && oscillatorAECQ200Sizes.includes(configuredPart.size.value) && 'O' === configuredPart.product_type.value &&
            <CheckboxOscillatorAECQ200 configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} /> }

          { typeof partOptions.tolerance !== 'undefined' &&
          <div className="col-md-2">
            <SelectTolerance configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} toleranceOptions={partOptions.tolerance} />
          </div> }

          { typeof partOptions.output !== 'undefined' &&
          <div className="col-md-2">
            <SelectOutput  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} outputOptions={partOptions.output} />
          </div> }

          { typeof partOptions.voltage !== 'undefined' &&
          <div className="col-md-2">
            <SelectVoltage configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} voltageOptions={partOptions.voltage} />
          </div> }

          { typeof partOptions.stability !== 'undefined' &&
          <div className="col-md-2">
            <SelectStability  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} stabilityOptions={partOptions.stability} />
          </div> }

          { typeof partOptions.load !== 'undefined' &&
          <div className="col-md-2">
            <SelectLoad  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} loadOptions={partOptions.load} />
          </div> }

          { typeof partOptions.optemp !== 'undefined' &&
          <div className="col-md-2">
            <SelectOpTemp  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} optempOptions={partOptions.optemp} />
          </div> }
        </div>
        { typeof configuredPart.size !== 'undefined' && 0 !== configuredPart.size.value.length && 'C' === configuredPart.product_type.value &&
        <div className="form-row">
          <div className="col-md-6">
            <SizeOptions configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} />
          </div>
        </div> }
      </div>
    );
  }
}

export default AdditionalOptionsForm;
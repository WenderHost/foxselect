import React, { Component } from 'react';
import SelectSize from './selects/SelectSize';
import CompensationOptions from './CompensationOptions';
import CheckboxAECQ200 from './CheckboxAECQ200';
import SelectTolerance from './selects/SelectTolerance';
import SelectOutput from './selects/SelectOutput';
import SelectVoltage from './selects/SelectVoltage';
import SelectStability from './selects/SelectStability';
import SelectLoad from './selects/SelectLoad';
import SelectOpTemp from './selects/SelectOpTemp';
import SizeOptions from './SizeOptions';
import VoltageOptions from './VoltageOptions';
import SelectPin1 from './selects/SelectPin1';

class AdditionalOptionsForm extends Component{
  render(){
    const { aecq200, configuredPart, updateConfiguredPart, partOptions } = this.props;

    /**
     * Show AEC-Q200 option if size:
     *
     * - Crystal-MHz  [1,2,3,4,5,6,7]
     * - Crystal-kHz  [122,12A,13A,135,13L]
     * - Oscillator   [1,2,3,5,7]
     */

    return(
      <div>
        <div className="form-row" style={{marginTop: '20px'}}>
          { typeof partOptions.size !== 'undefined' &&
          <div className="col-md-2">
            <SelectSize configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} sizeOptions={partOptions.size} />
          </div> }

          { typeof configuredPart.size !== 'undefined'
            && aecq200.parts.includes(configuredPart.product_type.value)
            && aecq200.sizes.includes(configuredPart.size.value)
            && ! ( 'O' === configuredPart.product_type.value && 'kHz' === configuredPart.frequency_unit.value )
            && <CheckboxAECQ200 configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} />
          }

          { typeof partOptions.tolerance !== 'undefined' && ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value) &&
          <div className="col-md-2">
            <SelectTolerance configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} toleranceOptions={partOptions.tolerance} />
          </div> }

          { typeof partOptions.output !== 'undefined' &&
            ( 'O' === configuredPart.product_type.value || 'T' === configuredPart.product_type.value || 'Y' === configuredPart.product_type.value ) &&
          <div className="col-md-2">
            <SelectOutput configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} outputOptions={partOptions.output} />
          </div> }

          { typeof partOptions.voltage !== 'undefined' &&
            ( 'O' === configuredPart.product_type.value || 'T' === configuredPart.product_type.value || 'Y' === configuredPart.product_type.value ) &&
          <div className="col-md-2">
            <SelectVoltage configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} voltageOptions={partOptions.voltage} />
          </div> }

          { typeof partOptions.stability !== 'undefined' &&
          <div className="col-md-2">
            <SelectStability  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} stabilityOptions={partOptions.stability} />
          </div> }

          { typeof partOptions.load !== 'undefined' && 'C' === configuredPart.product_type.value &&
          <div className="col-md-2">
            <SelectLoad  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} loadOptions={partOptions.load} />
          </div> }

          { typeof partOptions.optemp !== 'undefined' &&
          <div className="col-md-2">
            <SelectOpTemp  configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} optempOptions={partOptions.optemp} />
          </div> }

          { typeof partOptions.pin_1 !== 'undefined' &&
            'T' === configuredPart.product_type.value &&
          <div className="col-md-2">
            <SelectPin1 configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} pin_1Options={partOptions.pin_1} />
          </div> }
        </div>
        { typeof configuredPart.size !== 'undefined'
          && 0 !== configuredPart.size.value.length
          && ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value)
          && <SizeOptions configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} /> }
        { typeof configuredPart.voltage !== 'undefined'
        && 0 !== configuredPart.voltage.value.length
        && '_' !== configuredPart.voltage.value
        && 'O' === configuredPart.product_type.value
        && 3 <= configuredPart.size.value
        && <VoltageOptions configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} />
        }
        { 'T' === configuredPart.product_type.value
          && 'Clipped Sine' === configuredPart.output.label
          && '' !== configuredPart.stability.value
          && '_' !== configuredPart.stability.value
          && 'U' !== configuredPart.stability.value
          && '3' === configuredPart.size.value
          && <CompensationOptions configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} />
        }
      </div>
    );
  }
}

export default AdditionalOptionsForm;
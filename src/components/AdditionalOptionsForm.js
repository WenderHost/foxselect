import React, { Component } from 'react';
import SelectSize from './selects/SelectSize';
import CompensationOptions from './CompensationOptions';
import CheckboxAECQ200 from './CheckboxAECQ200';
import SelectEnableType from './selects/SelectEnableType'
import SelectTolerance from './selects/SelectTolerance';
import SelectSpread from './selects/SelectSpread';
import SelectOutput from './selects/SelectOutput';
import SelectVoltage from './selects/SelectVoltage';
import SelectStability from './selects/SelectStability';
import SelectLoad from './selects/SelectLoad';
import SelectOpTemp from './selects/SelectOpTemp';
import SizeOptions from './SizeOptions';
import SelectPin1 from './selects/SelectPin1';

class AdditionalOptionsForm extends Component{
  render(){
    const { aecq200, configuredPart, updateConfiguredPart, partOptions, loadingPartOptions } = this.props;

    /**
     * Show AEC-Q200 option if size:
     *
     * - Crystal-MHz  [1,2,3,4,5,6,7]
     * - Crystal-kHz  [122,12A,13A,135,13L]
     * - Oscillator   [1,2,3,5,7]
     */

    return(
      <div className="additional-options-form">
        <div className="form-row" style={{marginTop: '20px'}}>
          { typeof partOptions.size !== 'undefined' &&
          <div className="col-lg-auto" style={{minWidth: '200px'}}>
            <div className="row">
              <div className="col">
                <SelectSize
                  configuredPart={configuredPart}
                  updateConfiguredPart={updateConfiguredPart}
                  sizeOptions={partOptions.size}
                  loadingPartOptions={loadingPartOptions}
                />
              </div>
              { typeof configuredPart.size !== 'undefined'
              && aecq200.parts.includes(configuredPart.product_type.value)
              && aecq200.sizes.includes(configuredPart.size.value)
              && ! ( 'O' === configuredPart.product_type.value && 'kHz' === configuredPart.frequency_unit.value )
              && <div className="col-auto" style={{paddingLeft: '0'}}>
                <CheckboxAECQ200 configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} />
              </div> }
            </div>

            { typeof configuredPart.size !== 'undefined'
              && 0 !== configuredPart.size.value.length
              && ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value)
              && <div className="row" style={{marginTop: '10px'}}><div className="col"><SizeOptions configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} /></div></div> }
          </div> }

          { typeof partOptions.enable_type !== 'undefined' && 'S' === configuredPart.product_type.value &&
          <div className="col-lg">
            <SelectEnableType
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              enableTypeOptions={partOptions.enable_type}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.tolerance !== 'undefined' && ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value) &&
          <div className="col-lg">
            <SelectTolerance
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              toleranceOptions={partOptions.tolerance}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.output !== 'undefined' &&
            ( 'O' === configuredPart.product_type.value || 'T' === configuredPart.product_type.value || 'Y' === configuredPart.product_type.value ) &&
          <div className="col-lg">
            <SelectOutput
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              outputOptions={partOptions.output}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.voltage !== 'undefined'
            && ( 'O' === configuredPart.product_type.value
              || 'T' === configuredPart.product_type.value
              || 'Y' === configuredPart.product_type.value
              || 'S' === configuredPart.product_type.value ) &&
          <div className="col-lg-auto" style={{minWidth: '300px'}}>
            <SelectVoltage
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              voltageOptions={partOptions.voltage}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.spread !== 'undefined' && 'S' === configuredPart.product_type.value &&
          <div className="col-lg">
            <SelectSpread
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              spreadOptions={partOptions.spread}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.stability !== 'undefined' &&
          <div className="col-lg">
            <SelectStability
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              stabilityOptions={partOptions.stability}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.load !== 'undefined' && ('C' === configuredPart.product_type.value || 'K' === configuredPart.product_type.value) &&
          <div className="col-lg">
            <SelectLoad
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              loadOptions={partOptions.load}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.optemp !== 'undefined' &&
          <div className="col-lg">
            <SelectOpTemp
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              optempOptions={partOptions.optemp}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }

          { typeof partOptions.pin_1 !== 'undefined' &&
            'T' === configuredPart.product_type.value &&
          <div className="col-lg">
            <SelectPin1
              configuredPart={configuredPart}
              updateConfiguredPart={updateConfiguredPart}
              pin_1Options={partOptions.pin_1}
              loadingPartOptions={loadingPartOptions}
            />
          </div> }
        </div>

        { typeof configuredPart.product_type !== 'undefined'
          && 'T' === configuredPart.product_type.value
          && typeof configuredPart.output !== 'undefined'
          && 'Clipped Sine' === configuredPart.output.label
          && typeof configuredPart.stability !== 'undefined'
          && '' !== configuredPart.stability.value
          && '_' !== configuredPart.stability.value
          && 'U' !== configuredPart.stability.value
          && typeof configuredPart.size !== 'undefined'
          && '3' === configuredPart.size.value
          && <CompensationOptions configuredPart={configuredPart} updateConfiguredPart={updateConfiguredPart} />
        }
      </div>
    );
  }
}

export default AdditionalOptionsForm;
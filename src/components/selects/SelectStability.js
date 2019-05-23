import React, { Component } from 'react';
import Select from 'react-select';

class SelectStability extends Component{

  handleChange = (selectedStability) => {
    const { configuredPart, updateConfiguredPart } = this.props

    // Update related options
    console.log('selectedStability = ', selectedStability)
    let outputValue = ''
    if( 'T' === configuredPart.product_type.value ){
      switch( configuredPart.size.value ){
        case '1':
        case '2':
        case '3':
          if( 'Clipped Sine' === configuredPart.output.label ){
            if( null !== selectedStability ){
              outputValue = ( 'U' === selectedStability.value )? 'G' : 'C';
            } else {
              // When we've reset the Stability option, reset Output to default:
              outputValue = ( '3' === configuredPart.size.value )? 'A,C,G' : 'C,G';
            }
            updateConfiguredPart( 'output', { value: outputValue, 'label': 'Clipped Sine' }, true );
          }
          break;

        case '5':
        case '7':
          switch( configuredPart.output.label ){
            case 'Clipped Sine':
              updateConfiguredPart( 'output', { value: 'C', 'label': 'Clipped Sine' }, true );
              if( '7' === configuredPart.size.value )
                updateConfiguredPart( 'pin_1', { value: 'V', 'label': 'Voltage Control' }, true );
              break;

            case 'HCMOS':
              /**
               * Compare the float val of our selected stability option.
               */
              if( null !== selectedStability && -1 < selectedStability.label.indexOf('ppm') ){
                const stabilityLabelArray = selectedStability.label.split(' ');
                const stabilityFloat = parseFloat( stabilityLabelArray[0] );
                /**
                 * 5.0x3.2 mm HCMOS:
                 * - Stability >  0.5 ppm then Output = H
                 * - Stability <= 0.5 ppm then Output = S
                 *
                 * 7.0x5.0 mm HCMOS:
                 * - Stability >= 0.5 ppm then Output = H
                 * - Stability <  0.5 ppm then Output = S
                 */
                const compareValue = ( '7' === configuredPart.size.value )? 0.49 : 0.5;

                outputValue = ( compareValue >= parseFloat( stabilityFloat ) )? 'S' : 'H';
                updateConfiguredPart( 'output', { value: outputValue, 'label': 'HCMOS' }, true );
              } else if( null === selectedStability ){
                updateConfiguredPart( 'output', { value: 'H,S', 'label': 'HCMOS' }, true );
              }
              break;

            default:
              // nothing
          }
          break;

        case '9':
          switch( configuredPart.output.label ){
            case 'Clipped Sine':
              updateConfiguredPart( 'output', { value: 'C', 'label': 'Clipped Sine' }, true );
              break;

            case 'HCMOS':
              updateConfiguredPart( 'pin_1', { value: 'V', 'label': 'Voltage Control' }, true );
              break;

            default:
              // nothing
          }
          break;

        default:
          // nothing
      }
    }
    updateConfiguredPart( 'stability', selectedStability )
  }

  render(){
    const { configuredPart, stabilityOptions } = this.props
    let stabilityValue = (typeof configuredPart.stability !== 'undefined')? configuredPart.stability.value : ''

    let optionValue = null
    let backgroundColor = null
    if( 0 === stabilityOptions.length && '_' === stabilityValue ){
      backgroundColor = '#eee'
    } else if( 0 === stabilityOptions.length && 0 < stabilityValue.length ){
      backgroundColor = 'salmon'
      optionValue = configuredPart.stability
    } else if( 0 < stabilityOptions.length && '_' === stabilityValue ){
      // nothing...
    } else if( 0 < stabilityOptions.length && '_' !== stabilityValue && 0 < stabilityValue.length ){
      optionValue = configuredPart.stability
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="stability">Stability</label>
        <Select
          name="stability"
          value={optionValue}
          isClearable
          onChange={this.handleChange}
          placeholder="Stability..."
          matchPos="start"
          options={stabilityOptions}
          styles={customStyles}
        />
      </div>
    );
  };
}

export default SelectStability;
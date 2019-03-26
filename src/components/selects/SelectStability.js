import React, { Component } from 'react';
import Select from 'react-select';

class SelectStability extends Component{

  /*
  constructor(){
    super();

    this.state = {
      savedStabilityOption: {}
    }
  }
  /**/

  handleChange = (selectedStability) => {
    /*
    this.setState(
      {savedStabilityOption: selectedStability},
      () => this.props.updateConfiguredPart('stability',selectedStability)
    );
    */
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
    const { configuredPart, stabilityOptions } = this.props;
    //const { savedStabilityOption } = this.state;
    let { stability } = configuredPart;
    //var optionValue = stability;

    // When we have no stability options, set `value` == the option
    // value that matches our `configuredPart.size`.
    /*
    if( 0 === stabilityOptions.length )
      optionValue = savedStabilityOption;
    /**/

    var className = null;
    if( 0 === stabilityOptions.length && '_' === stability.value ){
      className = 'empty';
    } else if( 0 === stabilityOptions.length && 0 < stability.value.length ){
      className = 'error';
    }

    if( typeof stability !== 'undefined' && '_' === stability.value )
      stability = null;

    return(
      <div>
        <label htmlFor="stability">Stability</label>
        <Select
          name="stability"
          value={stability}
          onChange={this.handleChange}
          placeholder="Stability..."
          matchPos="start"
          options={stabilityOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectStability;
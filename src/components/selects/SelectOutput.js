import React, { Component } from 'react';
import Select from 'react-select';

class SelectOutput extends Component{

  constructor(){
    super();
    this.state = {
      savedOutputOption: null
    }
  }

  componentWillReceiveProps(){
    const { configuredPart, updateConfiguredPart } = this.props;
    const { savedOutputOption } = this.state;

    /**
     * Whenever we reset Voltage to "_" with a multi-option Output
     * selected, we need to reset the Output to the multi-option
     * value in order to provide all the possible Voltage options.
     */
    if( configuredPart.voltage !== null && savedOutputOption !== null ){
      if(
        configuredPart.voltage.value === '_' // Voltage is empty
        && -1 < savedOutputOption.value.indexOf(',') // We have a multi-option Output
        && -1 < savedOutputOption.value.indexOf(configuredPart.output.value) // Our current Output is in the saved multi-option Output
        ){
        updateConfiguredPart('output',savedOutputOption)
      }
    }
  }

  handleChange = (selectedOption) => {
    const { configuredPart, updateConfiguredPart } = this.props;

    // Update related options
    switch(configuredPart.product_type.value){
      case 'T':
        if( '2' === configuredPart.size.value && null !== selectedOption && 'H' === selectedOption.value )
          updateConfiguredPart( 'pin_1', { value: 'D', label: 'E/D' }, true );

        if( '7' === configuredPart.size.value && null !== selectedOption && 'C' === selectedOption.value )
          updateConfiguredPart( 'pin_1', { value: 'V', label: 'Voltage Control' }, true );

        if( '9' === configuredPart.size.value && null !== selectedOption && 'H' === selectedOption.value )
          updateConfiguredPart( 'pin_1', { value: 'V', label: 'Voltage Control' }, true );
        break;

      default:
        // nothing
    }

    updateConfiguredPart( 'output', selectedOption )
  }

  render(){
    const { configuredPart } = this.props;
    let { outputOptions } = this.props;
    const { savedOutputOption } = this.state;
    let output = configuredPart.output;
    let optionValue = output;

    if( 3 <= configuredPart.size.value && null !== this.state.savedOutputOption )
      optionValue = this.state.savedOutputOption

    if( typeof outputOptions === 'undefined' || 0 === outputOptions.length )
      optionValue = savedOutputOption;

    var className = null;
    if( typeof outputOptions !== 'undefined' ){
      if( 0 === outputOptions.length && '_' === output.value ){
        className = 'empty';
      } else if( 0 === outputOptions.length && 0 < output.value.length ){
        className = 'error';
      }
    }

    if( 'HA' === configuredPart.output.value ){
      optionValue = {value: 'HA', label: 'AEC-Q200'};
      outputOptions = [optionValue];
    }

    // If option isn't set, set our drop down to show the placeholder
    if( null !== optionValue && typeof optionValue.value !== 'undefined' && -1 < optionValue.value.indexOf('_') )
      optionValue = ''

    return(
      <div>
        <label htmlFor="output">Output</label>
        <Select
          name="output"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Output..."
          matchPos="start"
          options={outputOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectOutput;

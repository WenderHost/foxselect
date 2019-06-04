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
    const { configuredPart, loadingPartOptions } = this.props;
    let { outputOptions } = this.props;
    //const { savedOutputOption } = this.state;
    //let output = configuredPart.output;
    //let optionValue = output;
    const outputValue = (typeof configuredPart.output !== 'undefined')? configuredPart.output.value : ''

    /*
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
    */

    let optionValue = null
    let backgroundColor = null

    /**
     * Has output been reset by Voltage?
     *
     * When output = { value: "__", label: "Example Label" }, in other
     * words when the value has been set to "blank" and the label
     * matches one of this.state.storedOptions, it has been reset.
     */
    /*
    const outputLabel = configuredPart.output.label
    if( '' !== outputLabel && '__' === outputValue ){
      const { storedOptions } = this.state
      console.log('storedOptions = ', storedOptions)
      storedOptions.forEach(function(el){
        if( outputLabel === el.label )
          optionValue = el
      })
    }
    /**/

    if( 0 === outputOptions.length && '__' === outputValue ){
      // No options available, and output isn't set
      backgroundColor = '#eee'
    } else if( 0 === outputOptions.length && 0 < outputValue.length ){
      // No options available, and output is set
      backgroundColor = 'salmon'
      optionValue = configuredPart.output
    } else if( 0 < outputOptions.length && '__' === outputValue ){
      // Options available, and output is not set
      // Do nothing so placeholder text will show
    } else if( 0 < outputOptions.length && '__' !== outputValue && 0 < outputValue.length ){
      // Options available, and output is set
      optionValue = configuredPart.output
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }


    if( typeof configuredPart.output !== 'undefined' && 'HA' === configuredPart.output.value ){
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
          styles={customStyles}
          isClearable
          isLoading={loadingPartOptions}
        />
      </div>
    );
  };
}

export default SelectOutput;

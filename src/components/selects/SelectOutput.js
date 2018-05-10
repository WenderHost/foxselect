import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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
    const optionValue = ( selectedOption )? selectedOption : {value: '__', label: ''};
    const { configuredPart } = this.props;

    this.setState(
      {savedOutputOption: selectedOption},
      function(){

        // 05/08/2018 (13:40) - The following switch may be unnecessary. Consider deleting...
        const size = configuredPart.size.value;
        switch(size){
          case '3':
          case '5':
            if( 'HS' === optionValue.value ){
              console.log('Size is `3` and Output = `HS`; setting Output.display = false')
              optionValue.display = false
            }
            break;

          case '7':
            if( 'HS' === optionValue.value || 'PS' === optionValue.value || 'LS' === optionValue.value )
              //updatePart = false;
              optionValue.display = false
            break;

          default:
            // nothing
        }

        this.props.updateConfiguredPart('output',optionValue)
      }
    );
  }

  render(){
    const { configuredPart } = this.props;
    let { outputOptions } = this.props;
    const { savedOutputOption } = this.state;
    let output = configuredPart.output.value;
    let optionValue = output;

    if( 3 <= configuredPart.size.value && null !== this.state.savedOutputOption )
      optionValue = this.state.savedOutputOption

    if( typeof outputOptions === 'undefined' || 0 === outputOptions.length )
      optionValue = savedOutputOption;

    var className = null;
    if( typeof outputOptions !== 'undefined' ){
      if( 0 === outputOptions.length && '_' === output ){
        className = 'empty';
      } else if( 0 === outputOptions.length && 0 < output.length ){
        className = 'error';
      }
    }

    if( 'HA' === configuredPart.output.value ){
      optionValue = {value: 'HA', label: 'AEC-Q200'};
      outputOptions = [optionValue];
    }

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

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

  handleChange = (selectedOption) => {
    const optionValue = ( selectedOption )? selectedOption : {value: '__', label: ''};
    const { configuredPart } = this.props;

    this.setState(
      {savedOutputOption: selectedOption},
      function(){
        const size = configuredPart.size.value;
        //let updatePart = true;
        switch(size){
          case '3':
          case '5':
            if( 'HS' === optionValue.value )
              //updatePart = false;
              optionValue.display = false
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
        /*
        if(updatePart){
          this.props.updateConfiguredPart('output',optionValue)
        } else {
          console.log('Not updating configuredPart.output b/c size is `' + size + '`.')
        }
        */
      }
    );
  }

  render(){
    const { configuredPart } = this.props;
    let { outputOptions } = this.props;
    const{ savedOutputOption } = this.state;
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

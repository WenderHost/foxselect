import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectOutput extends Component{

  constructor(){
    super();
    this.state = {
      savedOutputOption: {}
    }
  }

  handleChange = (selectedOption) => {
    const optionValue = ( selectedOption )? selectedOption : {value: '__', label: ''};
    this.setState(
      {savedOutputOption: selectedOption},
      () => this.props.updateConfiguredPart('output',optionValue)
    );
  }

  render(){
    const { configuredPart, outputOptions } = this.props;
    const{ savedOutputOption } = this.state;
    var output = ( typeof configuredPart.output !== 'undefined' )? configuredPart.output.value : '';
    var optionValue = output;

    // When we have no output options, set `value` ===
    // the option value that matches our `configuredPart.size`
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

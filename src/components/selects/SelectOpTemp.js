import React, { Component } from 'react';
import Select from 'react-select';

class SelectOpTemp extends Component{

  constructor(){
    super();
    this.state = {
      savedOpTempOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedOpTempOption: selectedOption},
      () => this.props.updateConfiguredPart('optemp',selectedOption)
    );
  }

  render(){
    const { configuredPart, optempOptions } = this.props
    let optempValue = (typeof configuredPart.optemp !== 'undefined')? configuredPart.optemp.value : ''

    let optionValue = null
    let backgroundColor = null
    if( 0 === optempOptions.length && '_' === optempValue ){
      backgroundColor = '#eee'
    } else if ( 0 === optempOptions.length && 0 < optempValue.length ){
      backgroundColor = 'salmon'
      optionValue = configuredPart.optemp
    } else if ( 0 < optempOptions.length && '_' === optempValue ){
      // nothing...
    } else if( 0 < optempOptions.length && '_' !== optempValue && 0 < optempValue.length ){
      optionValue = configuredPart.optemp
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="optemp">Op Temp</label>
        <Select
          name="optemp"
          value={optionValue}
          isClearable
          onChange={this.handleChange}
          placeholder="Op Temp..."
          options={optempOptions}
          styles={customStyles}
        />
      </div>
    );
  };
}

export default SelectOpTemp;
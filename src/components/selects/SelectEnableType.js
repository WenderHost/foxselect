import React, { Component } from 'react';
import Select from 'react-select';

class SelectEnableType extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('enable_type',selectedOption)
  }

  render(){
    const { configuredPart, enableTypeOptions } = this.props
    const enableTypeValue = (typeof configuredPart.enable_type !== 'undefined')? configuredPart.enable_type.value : ''

    let optionValue = null
    let backgroundColor = null
    if( 0 === enableTypeOptions.length && '_' === enableTypeValue ){
      // No options available, and enableType isn't set
      backgroundColor = '#eee'
    } else if( 0 === enableTypeOptions.length && 0 < enableTypeValue.length ){
      // No options available, and enableType is set
      backgroundColor = 'salmon'
      optionValue = configuredPart.enableType
    } else if( 0 < enableTypeOptions.length && '_' === enableTypeValue ){
      // Options available, and enableType is not set
      // Do nothing so placeholder text will show
    } else if( 0 < enableTypeOptions.length && '_' !== enableTypeValue && 0 < enableTypeValue.length ){
      // Options available, and enableType is set
      optionValue = configuredPart.enableType
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="enable_type">Enable/Disable Type</label>
        <Select
          name="enable_type"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="E/D Type..."
          options={enableTypeOptions}
          styles={customStyles}
          isClearable
        />
      </div>
    );
  }
}

export default SelectEnableType;
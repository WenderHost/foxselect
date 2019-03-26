import React, { Component } from 'react';
import Select from 'react-select';

class SelectEnableType extends Component{

  constructor(){
    super();
    this.state = {
      savedEnableTypeOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedEnableTypeOption: selectedOption},
      () => this.props.updateConfiguredPart('enable_type',selectedOption)
    );
  }

  render(){
    const { configuredPart, enableTypeOptions } = this.props;
    const { savedEnableTypeOption } = this.state;
    var enable_type = configuredPart.enable_type.value;
    var optionValue = enable_type;


    if( 0 === enableTypeOptions.length )
      optionValue = savedEnableTypeOption;

    var className = null;
    if( 0 === enableTypeOptions.length && '_' === enable_type ){
      className = 'empty';
    } else if ( 0 === enableTypeOptions.length && 0 < enable_type.length ){
      className = 'error';
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
          className={className}
        />
      </div>
    );
  }
}

export default SelectEnableType;
import React, { Component } from 'react';
import Select from 'react-select';

class SelectVoltage extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('voltage',selectedOption)
  }

  render(){
    const { configuredPart, voltageOptions } = this.props
    const voltageValue = configuredPart.voltage.value

    let optionValue = null
    let backgroundColor = null
    if( 0 === voltageOptions.length && '_' === voltageValue ){
      // No options available, and voltage isn't set
      backgroundColor = '#eee'
    } else if( 0 === voltageOptions.length && 0 < voltageValue.length ){
      // No options available, and voltage is set
      backgroundColor = 'salmon'
      optionValue = configuredPart.voltage
    } else if( 0 < voltageOptions.length && '_' === voltageValue ){
      // Options available, and voltage is not set
      // Do nothing so placeholder text will show
    } else if( 0 < voltageOptions.length && '_' !== voltageValue && 0 < voltageValue.length ){
      // Options available, and voltage is set
      optionValue = configuredPart.voltage
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="voltage">Voltage</label>
        <Select
          name="voltage"
          value={optionValue}
          isClearable
          onChange={this.handleChange}
          placeholder="Voltage..."
          matchPos="start"
          options={voltageOptions}
          styles={customStyles}
        />
      </div>
    );
  };
}

export default SelectVoltage;
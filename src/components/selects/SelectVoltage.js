import React, { Component } from 'react';
import Select from 'react-select';
import VoltageOptions from '../VoltageOptions';

class SelectVoltage extends Component{

  handleChange = (selectedOption) => {
    console.log("[SelectVoltage.js]->handleChange()\n• selectedOption: ", selectedOption)
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
        {/*
          * 05/03/2019 (15:01) - New idea: It seems we need to show
          * VoltageOptions whenever we have a comma in configuredPart.voltage.value.
          * Perhaps this should be in addition to the checks we have below?
          */}
        { typeof configuredPart.voltage !== 'undefined'
        && 0 !== configuredPart.voltage.value.length
        && '_' !== configuredPart.voltage.value
        && 'O' === configuredPart.product_type.value
        && ( "3" === configuredPart.size.value || "5" === configuredPart.size.value || "7" === configuredPart.size.value )
        && <VoltageOptions configuredPart={configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} /> }
      </div>
    );
  };
}

export default SelectVoltage;
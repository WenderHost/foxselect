import React, { Component } from 'react';
import Select from 'react-select';

class SelectVoltage extends Component{

  constructor(){
    super()
    this.state = {
      savedVoltageOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedVoltageOption: selectedOption},
      () => this.props.updateConfiguredPart('voltage',selectedOption)
    );
  }

  render(){
    const { configuredPart, voltageOptions } = this.props;
    const{ savedVoltageOption } = this.state;
    let voltage = configuredPart.voltage.value;
    let optionValue = voltage;

    // When we have no voltage options, set `value` === the option value that matches our `configuredPart.size`
    if( typeof voltageOptions === 'undefined' || 0 === voltageOptions.length )
      optionValue = savedVoltageOption;

    let className = null;
    if( 0 === voltageOptions.length && '_' === voltage ){
      className = 'empty';
    } else if( 0 === voltageOptions.length && 0 < voltage.length ){
      className = 'error';
    }

    return(
      <div>
        <label htmlFor="voltage">Voltage</label>
        <Select
          name="voltage"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Voltage..."
          matchPos="start"
          options={voltageOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectVoltage;
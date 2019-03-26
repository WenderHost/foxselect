import React, { Component } from 'react';
import Select from 'react-select';

class SelectPin1 extends Component{

  handleChange = (selectedOption) => {
    const { updateConfiguredPart } = this.props
    updateConfiguredPart( 'pin_1', selectedOption )
  }

  render(){
    const { configuredPart, pin_1Options } = this.props;
    let pin_1 = configuredPart.pin_1.value;
    let optionValue = pin_1;

    let className = null;
    if( 0 === pin_1Options.length && '_' === pin_1 ){
      className = 'empty';
    } else if( 0 === pin_1Options.length && 0 < pin_1.length ){
      className = 'error';
    }

    return(
      <div>
        <label htmlFor="pin_1">Pin 1 Connection</label>
        <Select
          name="pin_1"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Pin 1 Connection..."
          matchPos="start"
          options={pin_1Options}
          className={className}
        />
      </div>
    );
  };
}

export default SelectPin1;
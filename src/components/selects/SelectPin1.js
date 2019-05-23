import React, { Component } from 'react';
import Select from 'react-select';

class SelectPin1 extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart( 'pin_1', selectedOption )
  }

  render(){
    const { configuredPart, pin_1Options } = this.props
    const pin_1Value = (typeof configuredPart.pin_1 !== 'undefined')? configuredPart.pin_1.value : ''

    let optionValue = null
    let backgroundColor = null
    if( 0 === pin_1Options.length && '_' === pin_1Value ){
      // No options available, and pin_1 isn't set
      backgroundColor = '#eee'
    } else if( 0 === pin_1Options.length && 0 < pin_1Value.length ){
      // No options available, and pin_1 is set
      backgroundColor = 'salmon'
      optionValue = configuredPart.pin_1
    } else if( 0 < pin_1Options.length && '_' === pin_1Value ){
      // Options available, and pin_1 is not set
      // Do nothing so placeholder text will show
    } else if( 0 < pin_1Options.length && '_' !== pin_1Value && 0 < pin_1Value.length ){
      // Options available, and pin_1 is set
      optionValue = configuredPart.pin_1
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="pin_1">Pin 1 Connection</label>
        <Select
          name="pin_1"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Connection..."
          matchPos="start"
          options={pin_1Options}
          styles={customStyles}
          isClearable
        />
      </div>
    );
  };
}

export default SelectPin1;
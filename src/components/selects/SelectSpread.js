import React, { Component } from 'react';
import Select from 'react-select';

class SelectSpread extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('spread',selectedOption)
  }

  render(){
    const { configuredPart, spreadOptions } = this.props
    const spreadValue = (typeof configuredPart.spread !== 'undefined')? configuredPart.spread.value : ''

    let optionValue = null
    let backgroundColor = null
    if( 0 === spreadOptions.length && '_' === spreadValue ){
      // No options available, and spread isn't set
      backgroundColor = '#eee'
    } else if( 0 === spreadOptions.length && 0 < spreadValue.length ){
      // No options available, and spread is set
      backgroundColor = 'salmon'
      optionValue = configuredPart.spread
    } else if( 0 < spreadOptions.length && '_' === spreadValue ){
      // Options available, and spread is not set
      // Do nothing so placeholder text will show
    } else if( 0 < spreadOptions.length && '_' !== spreadValue && 0 < spreadValue.length ){
      // Options available, and spread is set
      optionValue = configuredPart.spread
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="spread">Spread Range</label>
        <Select
          name="spread"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Spread Range..."
          options={spreadOptions}
          styles={customStyles}
          isClearable
        />
      </div>
    );
  }

}

export default SelectSpread;
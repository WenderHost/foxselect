import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectSize extends Component{

  constructor(){
    super();
    this.state = {
      savedSizeOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedSizeOption: selectedOption},
      () => this.props.updateConfiguredPart('size',selectedOption)
    );
  }

  render(){
    const { configuredPart, sizeOptions } = this.props;
    const { savedSizeOption } = this.state;
    const size = configuredPart.size.value;
    let optionValue = size;

    // When we have no size options, set `value` ===
    // the option value that matches our `configuredPart.size`
    if( 0 === sizeOptions.length )
      optionValue = savedSizeOption;

    let className = null;
    if( 0 === sizeOptions.length && '_' === size ){
      className = 'empty';
    } else if ( 0 === sizeOptions.length && 0 < size.length ){
      className = 'error';
    }

    /**
     * Set size for multi-variat sizes.
     *
     * Consider the following example:
     *
     * - kHz-Crysal-SMD
     * - Size options: 135,13L,13A
     *
     * Whenever we have our API return sizeOptions[0].value = '135,13L,13A'
     * and our configuredPart.size.value === one of those three options,
     * we must set this SizeSelect to match the returned sizeOptions[0].label
     * while updating this SizeSelect's value to be the selected option of
     * the three possible options.
     */
    if( 1 === sizeOptions.length && sizeOptions[0].value.indexOf(',') && -1 === optionValue.indexOf(',') && null !== this.state.savedSizeOption )
      optionValue = {value: optionValue, label: this.state.savedSizeOption.label}

    return(
      <div>
        <label htmlFor="size">Size</label>
        <Select
          name="size"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Size..."
          autoBlur={true}
          matchPos="start"
          options={sizeOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectSize;
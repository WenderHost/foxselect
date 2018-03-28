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
    var size = configuredPart.size.value;
    var optionValue = size;

    // When we have no size options, set `value` ===
    // the option value that matches our `configuredPart.size`
    if( 0 === sizeOptions.length )
      optionValue = savedSizeOption;

    var className = null;
    if( 0 === sizeOptions.length && '_' === size ){
      className = 'empty';
    } else if ( 0 === sizeOptions.length && 0 < size.length ){
      className = 'error';
    }

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
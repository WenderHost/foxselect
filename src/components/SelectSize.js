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
    var size = configuredPart.size;
    var optionValue = size;

    // When we have no size options, set `value` ===
    // the option value that matches our `configuredPart.size`
    if( 0 === sizeOptions.length )
      optionValue = savedSizeOption;

    var className = null;
    if( 0 === sizeOptions.length && 0 < size.length ){
      className = 'error';
    } else if ( 0 === sizeOptions.length && '_' === size ){
      className = 'empty';
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

/*
[
            { value: 'A', label: '1.2x1.0 mm' },
            { value: '0', label: '1.6x1.2 mm' },
            { value: '1', label: '2.0x1.6 mm' },
            { value: '2', label: '2.5x2.0 mm' },
            { value: '3', label: '3.2x2.5 mm' },
            { value: '4', label: '4.0x2.5 mm' },
            { value: '5', label: '5.0x3.2 mm' },
            { value: '6', label: '6.0x3.5 mm' },
            { value: '7', label: '7.0x5.0 mm' },
            { value: '8', label: '10.0x4.5 mm' },
            { value: '8', label: '11.0x5.0 mm' },
            { value: '4SD', label: 'HC49 SMD (4.5mm)'},
            { value: '9SD', label: 'HC49 SMD (3.2mm)'},
          ]
 */
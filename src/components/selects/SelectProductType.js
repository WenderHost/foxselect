import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectProductType extends Component{
  constructor(){
    super();

    this.state = {
      savedProductTypeOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedProductTypeOption: selectedOption},
      () => this.props.updateConfiguredPart('product_type',selectedOption)
    );
  }

  render(){
    const { product_type } = this.props;
    let value = ( '_' !== product_type.value )? product_type : '';

    return(
      <div>
        <label htmlFor="product_type">Product Type</label>
        <Select
          name="product_type"
          value={value}
          onChange={this.handleChange}
          placeholder="Product type..."
          options={[
            { value: 'C', label: 'Crystal' },
            { value: 'O', label: 'Oscillator' },
            { value: 'T', label: 'TCXO' },
            { value: 'Y', label: 'VC-TCXO/VCXO' }
          ]}
        />
      </div>
    );
  };
}

export default SelectProductType;
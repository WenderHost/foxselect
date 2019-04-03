import React, { Component } from 'react';
import Select from 'react-select';
import { productTypeOptions } from '../data/data';

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
          options={productTypeOptions}
        />
      </div>
    );
  };
}

export default SelectProductType;
import React, { Component } from 'react';
import Select from 'react-select';
import { productTypeOptions } from '../data/data';

class SelectProductType extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('product_type',selectedOption)
  }

  render(){
    const { product_type } = this.props;
    let selectedValue = ( '_' !== product_type.value )? product_type : '';

    return(
      <div>
        <label htmlFor="product_type">Product Type</label>
        <Select
          name="product_type"
          isClearable
          value={selectedValue}
          onChange={this.handleChange}
          placeholder="Product type..."
          options={productTypeOptions}
        />
      </div>
    );
  };
}

export default SelectProductType;
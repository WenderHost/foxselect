import React, { Component } from 'react';
import Select from 'react-select';
import { productTypeOptions } from '../data/data';

class SelectProductType extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('product_type',selectedOption)
  }

  render(){
    /**
     * When we switch to kHz Crystals, the first option changes to
     * {value: 'K', label: 'Crystal'}, and it stays there when we
     * reset back to MHz Crystals. The following adjusts the first
     * option so we can once again select a MHz Crystal:
     */
    if( '' === this.props.product_type.label && 'K' === productTypeOptions[0].value ){
      console.log('🔔 [SelectProductType.js]->render() Resetting productTypeOptions:')
      productTypeOptions[0] = {value: 'C', label: 'Crystal'}
      console.log(`• productTypeOptions = `, productTypeOptions)
    }
    const selectedValue = ( '' === this.props.product_type.label )? null : this.props.product_type

    return(
      <div>
        <label htmlFor="product_type">Product Type</label>
        <Select
          name="product_type"
          value={selectedValue}
          isClearable
          onChange={this.handleChange}
          placeholder="Product type..."
          options={productTypeOptions}
        />
      </div>
    );
  };
}

export default SelectProductType;
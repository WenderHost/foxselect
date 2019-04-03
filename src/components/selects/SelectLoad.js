import React, { Component } from 'react';
import Select from 'react-select';
import { loadOptions } from '../data/data';

class SelectLoad extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('load',selectedOption);
  }

  render(){
    const { configuredPart } = this.props
    const optionValue = configuredPart.load.value

    return(
      <div>
        <label htmlFor="load">Load</label>
        <Select
          name="load"
          value={optionValue}
          isClearable
          onChange={this.handleChange}
          placeholder="Load..."
          matchPos="start"
          options={loadOptions}
        />
      </div>
    );
  };
}

export default SelectLoad;
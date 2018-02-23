import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectLoad extends Component{
  state = {
    selectedOption: ''
  }

  handleChange = (selectedOption) => {
    this.setState(
      {selectedOption},
      () => this.props.updateConfiguredPart('load',selectedOption)
    );
  }

  render(){
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    return(
      <div>
        <label htmlFor="load">Load</label>
        <Select
          name="load"
          value={value}
          onChange={this.handleChange}
          placeholder="Load..."
          matchPos="start"
          options={[
            { value: 'A', label: 'SERIES' },
            { value: 'B', label: '6 pF' },
            { value: 'C', label: '4 pF' },
            { value: 'D', label: '8 pF' },
            { value: 'E', label: '10 pF' },
            { value: 'G', label: '12 pF' },
            { value: 'H', label: '12.5 pF' },
            { value: 'J', label: '15 pF' },
            { value: 'K', label: '16 pF' },
            { value: 'L', label: '18 pF' },
            { value: 'M', label: '20 pF' },
            { value: 'N', label: '22 pF' },
            { value: 'P', label: '27 pF' },
            { value: 'Q', label: '30 pF' },
            { value: 'R', label: '32 pF' },
            { value: 'S', label: '33 pF' },
            { value: 'T', label: '50 pF' },
            { value: 'U', label: '13 pF' },
            { value: 'V', label: '7 pF' },
            { value: 'W', label: '9 pF' },
            { value: 'X', label: '14 pF' },
            { value: 'Y', label: '19 pF' }
            ]}
        />
      </div>
    );
  };
}

export default SelectLoad;
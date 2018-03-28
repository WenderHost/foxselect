import React, { Component } from 'react';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

class SelectFrequency extends Component{
  state = {
    selectedOption: undefined
  }

  handleChange = (selectedOption) => {
    this.setState(
      {selectedOption: selectedOption},
      () => this.props.updateConfiguredPart('frequency',selectedOption)
    )
  }

  render(){
    const { frequencyOptions } = this.props;
    const { selectedOption } = this.state;

    return(
      <div>
        <label htmlFor="frequency">Frequency</label>
        <Creatable
          name="frequency"
          multi={false}
          value={selectedOption}
          onChange={this.handleChange}
          placeholder="Frequency..."
          autoBlur={true}
          matchPos="start"
          options={frequencyOptions}
          resetValue={undefined}
        />
      </div>
    );
  };
}

export default SelectFrequency;
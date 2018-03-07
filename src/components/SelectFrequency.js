import React, { Component } from 'react';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

class SelectFrequency extends Component{
  state = {
    value: undefined
  }

  handleChange = (value) => {
    this.setState(
      value,
      () => this.props.updateConfiguredPart('frequency',value)
    )
  }

  render(){
    const { frequencyOptions } = this.props;
    const value = this.state.value;

    return(
      <div>
        <label htmlFor="frequency">Frequency</label>
        <Creatable
          name="frequency"
          multi={false}
          value={value}
          onChange={this.handleChange}
          placeholder="Frequency..."
          autoBlur={true}
          matchPos="start"
          options={frequencyOptions}
        />
      </div>
    );
  };
}

export default SelectFrequency;
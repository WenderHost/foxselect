import React, { Component } from 'react';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

class SelectFrequency extends Component{
  constructor(props){
    super(props);

    this.state = {
      savedFrequencyOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedFrequencyOption: selectedOption},
      () => this.props.updateConfiguredPart('frequency',selectedOption)
    )
  }

  render(){
    const { frequency, frequencyOptions, configuredPart } = this.props;
    let value = ( '_' !== frequency.value && '0.0' !== frequency.value )? frequency : '';

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
          resetValue={undefined}
          disabled={'0.032768' === configuredPart.frequency.value}
        />
      </div>
    );
  };
}

export default SelectFrequency;
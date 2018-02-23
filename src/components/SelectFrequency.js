import React, { Component } from 'react';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

class SelectFrequency extends Component{
  state = {
    options: [
      { value: '3.2', label: '3.2' },
      { value: '3.579', label: '3.579' },
      { value: '3.579545', label: '3.579545' },
      { value: '3.6', label: '3.6' },
      { value: '3.6864', label: '3.6864' },
      { value: '4', label: '4' },
      { value: '6', label: '6' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '9.6', label: '9.6' },
      { value: '9.8', label: '9.8' },
      { value: '10', label: '10'},
      { value: '12', label: '12'},
      { value: '14', label: '14'},
      { value: '14.7456', label: '14.7456'},
      { value: '16', label: '16'},
      { value: '20', label: '20'},
      { value: '23.9', label: '23.9'},
      { value: '26', label: '26'},
      { value: '30', label: '30'},
      { value: '98.304', label: '98.304'}
    ],
    value: undefined
  }

  handleChange = (value) => {
    console.log(value);
    this.setState(
      {value},
      () => this.props.updateConfiguredPart('frequency',value)
    );
  }

  render(){
    const { options, value } = this.state;

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
          options={options}
        />
      </div>
    );
  };
}

export default SelectFrequency;
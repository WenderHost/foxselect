import React, { Component } from 'react';
import { Creatable } from 'react-select';

class SelectFrequency extends Component{
  constructor(){
    super()

    this.getOptions = this.getOptions.bind(this)

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

  getOptions(){
    const { configuredPart } = this.props
    let options = [
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
        ]

    if( 'khz' === configuredPart.frequency_unit.value.toLowerCase() ){
      switch(configuredPart.product_type.value){
        case 'K':
          options = [
            {value: '32.768', label: '32.768'}
          ]
          break

        case 'O':
          options = [
            {value: '12', label: '12'},
            {value: '32.768', label: '32.768'},
            {value: '500', label: '500'},
            {value: '625', label: '625'},
            {value: '750', label: '750'},
            {value: '50000', label: '50000'},
            {value: '60000', label: '60000'},
            {value: '67000', label: '67000'},
            {value: '75000', label: '75000'},
            {value: '80000', label: '80000'},
            {value: '100000', label: '100000'},
            {value: '156250', label: '156250'},
            {value: '160000', label: '160000'},
            {value: '162000', label: '162000'},
            {value: '170000', label: '170000'},
            {value: '200000', label: '200000'}
          ]
          break

        default:
          // nothing
      }
    }

    return options
  }

  render(){
    const { frequency, configuredPart } = this.props
    const frequencyOptions = this.getOptions()
    let value = ( '_' !== frequency.value && '0.0' !== frequency.value )? frequency : '';

    let disabled = false
    disabled = ('32.768' === configuredPart.frequency.value && 'K' === configuredPart.product_type.value )

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
          disabled={disabled}
          isClearable
        />
      </div>
    );
  };
}

export default SelectFrequency;
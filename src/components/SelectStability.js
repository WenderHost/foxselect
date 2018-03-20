import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectStability extends Component{

  constructor(){
    super();
    this.state = {
      savedStabilityOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedStabilityOption: selectedOption},
      () => this.props.updateConfiguredPart('stability',selectedOption)
    );
  }

  render(){
    const { configuredPart, stabilityOptions } = this.props;
    const { savedStabilityOption } = this.state;
    var stability = configuredPart.stability;
    var optionValue = stability;

    // When we have no stablity options, set `value` == the option
    // value that matches our `configuredPart.size`.
    if( 0 === stabilityOptions.length )
      optionValue = savedStabilityOption;

    var className = null;
    if( 0 === stabilityOptions.length && 0 < stability.length ){
      className = 'error';
    } else if( 0 === stabilityOptions.length && '_' === stability ){
      className = 'empty';
    }

    return(
      <div>
        <label htmlFor="stability">Stability</label>
        <Select
          name="stability"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Stability..."
          matchPos="start"
          options={stabilityOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectStability;

/*
[
            { value: 'M', label: '-0.036+-1 ppm (Delta temp)E^2' },
            { value: 'I', label: '-0.04 ppm (Delta Temp)E^2 max' },
            { value: 'O', label: '-140 ~ +10 ppm' },
            { value: 'K', label: '0.28 ppm' },
            { value: 'Q', label: '0.37 ppm' },
            { value: 'U', label: '0.5 ppm' },
            { value: 'T', label: '1.0 ppm' },
            { value: 'S', label: '1.5 ppm' },
            { value: 'H', label: '10.0 ppm' },
            { value: 'G', label: '100 ppb' },
            { value: 'A', label: '100.0 ppm' },
            { value: 'Y', label: '1000.0 ppm' },
            { value: 'F', label: '15.0 ppm' },
            { value: 'R', label: '2.0 ppm' },
            { value: 'P', label: '2.5 ppm' },
            { value: 'E', label: '20.0 ppm' },
            { value: 'V', label: '200.0 ppm' },
            { value: 'D', label: '25.0 ppm' },
            { value: 'N', label: '3.0 ppm' },
            { value: 'C', label: '30.0 ppm' },
            { value: 'L', label: '5.0 ppm' },
            { value: 'B', label: '50.0 ppm' },
            { value: 'W', label: '70.0 ppm' },
            { value: 'J', label: '8 ppm' },
            { value: 'Z', label: 'Other' },
            { value: 'X', label: 'Overall' }
            ]
 */
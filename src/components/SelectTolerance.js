import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectTolerance extends Component{

  constructor(){
    super();
    this.state = {
      savedToleranceOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedToleranceOption: selectedOption},
      () => this.props.updateConfiguredPart('tolerance',selectedOption)
    );
  }

  render(){
    const { configuredPart, toleranceOptions } = this.props;
    const{ savedToleranceOption } = this.state;
    var tolerance = configuredPart.tolerance;
    var optionValue = tolerance;

    // When we have no tolerance options, set `value` ===
    // the option value that matches our `configuredPart.size`
    if( 0 === toleranceOptions.length )
      optionValue = savedToleranceOption;

    var className = null;
    if( 0 === toleranceOptions.length && '_' === tolerance ){
      className = 'empty';
    } else if( 0 === toleranceOptions.length && 0 < tolerance.length ){
      className = 'error';
    }

    return(
      <div>
        <label htmlFor="tolerance">Tolerance</label>
        <Select
          name="tolerance"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Tolerance..."
          matchPos="start"
          options={toleranceOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectTolerance;

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
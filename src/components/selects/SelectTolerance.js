import React, { Component } from 'react';
import Select from 'react-select';

class SelectTolerance extends Component{

  handleChange = (selectedOption) => {
    this.props.updateConfiguredPart('tolerance',selectedOption)
  }

  render(){
    const { configuredPart, toleranceOptions } = this.props;
    let toleranceValue = configuredPart.tolerance.value;

    // When we have no tolerance options, set `value` ===
    // the option value that matches our `configuredPart.size`
    //if( 0 === toleranceOptions.length )
    //  optionValue = savedToleranceOption;

    let optionValue = null
    let backgroundColor = null
    if( 0 === toleranceOptions.length && '_' === toleranceValue ){
      // Configuration doesn't have any `tolerance` options,
      // AND no tolerance value is stored in our configuredPart.
      // This means our toleranceSelect is "empty" with no options
      // to select.
      //
      // Do the following:
      // - Set the option's background color to `gray`.
      // - `optionValue` should be `null` to allow placeholder text to show.
      backgroundColor = '#eee'
    } else if( 0 === toleranceOptions.length && 0 < toleranceValue.length ){
      // Configuration doesn't have any `tolerance` options,
      // AND we have a tolerance value stored in our configuredPart.
      // This means our configuredPart.tolerance.value is not available.
      //
      // Do the following:
      // - Set the options' background color to `red` to show an `error` state.
      // - Set `optionValue` = our stored configuredPart.tolerance.
      backgroundColor = 'salmon'
      optionValue = configuredPart.tolerance
    } else if( 0 < toleranceOptions.length && '_' === toleranceValue ){
      // We have available options BUT no tolerance value is stored in
      // our configuredPart.
      //
      // Do the following:
      // - `optionValue` should be `null` to allow placeholder text to show.
      //
      // nothing to do here...
    } else if( 0 < toleranceOptions.length && '_' !== toleranceValue && 0 < toleranceValue.length ){
      // We have available options AND a tolerance value stored in our
      // configuredPart.
      //
      // Do the following:
      // - Set `optionValue` = our stored configuredPart.tolerance
      optionValue = configuredPart.tolerance
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    return(
      <div>
        <label htmlFor="tolerance">Tolerance</label>
        <Select
          name="tolerance"
          value={optionValue}
          isClearable
          onChange={this.handleChange}
          placeholder="Tolerance..."
          matchPos="start"
          options={toleranceOptions}
          styles={customStyles}
        />
      </div>
    );
  };
}

export default SelectTolerance;
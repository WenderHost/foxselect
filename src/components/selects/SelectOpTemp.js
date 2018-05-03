import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectOpTemp extends Component{

  constructor(){
    super();
    this.state = {
      savedOpTempOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedOpTempOption: selectedOption},
      () => this.props.updateConfiguredPart('optemp',selectedOption)
    );
  }

  render(){
    const { configuredPart, optempOptions } = this.props;
    const { savedOpTempOption } = this.state;
    var optemp = configuredPart.optemp.value;
    var optionValue = optemp;

    // When we have no optemp options, set `value` ===
    // the option value that matches our `configuredPage.optemp`
    if( 0 === optempOptions.length )
      optionValue = savedOpTempOption;

    var className = null;
    if( 0 === optempOptions.length && '_' === optemp ){
      className = 'empty';
    } else if ( 0 === optempOptions.length && 0 < optemp.length ){
      className = 'error';
    }

    return(
      <div>
        <label htmlFor="optemp">Op Temp</label>
        <Select
          name="optemp"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Op Temp..."
          options={optempOptions}
          className={className}
        />
      </div>
    );
  };
}

export default SelectOpTemp;

/*
[
            { value: 'B', label: '-10 To +50 C' },
            { value: 'D', label: '-10 To +60 C' },
            { value: 'E', label: '-10 To +70 C' },
            { value: 'Q', label: '-20 To +60 C' },
            { value: 'F', label: '-20 To +70 C' },
            { value: 'Z', label: '-20 To +75 C' },
            { value: 'N', label: '-20 To +85 C' },
            { value: 'G', label: '-30 To +70 C' },
            { value: 'H', label: '-30 To +75 C' },
            { value: 'J', label: '-30 To +80 C' },
            { value: 'K', label: '-30 To +85 C' },
            { value: 'L', label: '-35 To +80 C' },
            { value: 'V', label: '-35 To +85 C' },
            { value: 'P', label: '-40 To +105 C' },
            { value: 'I', label: '-40 To +125 C' },
            { value: 'Y', label: '-40 To +75 C' },
            { value: 'M', label: '-40 To +85 C' },
            { value: 'R', label: '-55 To +100 C' },
            { value: 'S', label: '-55 To +105 C' },
            { value: 'T', label: '-55 To +125 C' },
            { value: 'U', label: '-55 To +85 C' },
            { value: 'A', label: '0 To +50 C' },
            { value: 'C', label: '0 To +70 C' },
            { value: 'W', label: 'Other' }
            ]
 */
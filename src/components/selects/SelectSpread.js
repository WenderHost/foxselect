import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectSpread extends Component{

  constructor(){
    super();
    this.state = {
      savedSpreadOption: {}
    }
  }

  handleChange = (selectedOption) => {
    this.setState(
      {savedSpreadOption: selectedOption},
      () => this.props.updateConfiguredPart('spread',selectedOption)
    );
  }

  render(){
    const { configuredPart, spreadOptions } = this.props;
    const { savedSpreadOption } = this.state;
    let spread = configuredPart.spread.value;
    let optionValue = spread;

    if( 0 === spreadOptions.length )
      optionValue = savedSpreadOption;

    var className = null;
    if( 0 === spreadOptions.length && '_' === spread ){
      className = 'empty';
    } else if ( 0 === spreadOptions.length && 0 < spread.length ){
      className = 'error';
    }

    return(
      <div>
        <label htmlFor="spread">Spread Range</label>
        <Select
          name="spread"
          value={optionValue}
          onChange={this.handleChange}
          placeholder="Spread Range..."
          options={spreadOptions}
          className={className}
        />
      </div>
    );
  }

}

export default SelectSpread;
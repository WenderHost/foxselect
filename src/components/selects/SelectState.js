import React, { Component } from 'react';
import Select from 'react-select';

import { stateOptions } from '../data/data';

class StateSelect extends Component{
  constructor(){
    super();

    this.state = {
      selectedOption: null
    }

    this.handleChange = this.handleChange.bind(this);
  }

  /*
  handleChange(selectedOption){
    const target = {};
    target.name = this.props.name;
    target.value = ( null !== selectedOption )? selectedOption.value : '';
    const e = {};
    e.target = target;
    this.props.handleChange(e);
    this.setState({selectedOption});
  }
  */

  handleChange(e){
    console.log('[SelectState] e', e)
    this.setState({selectedOption: e})
  }

  render(){
    //const { selectedOption } = this.state
    let { defaultValue } = this.props
    if( null !== defaultValue ){
      for( var i = 0; i < stateOptions.length; i++ ){
        var option = stateOptions[i]
        if( defaultValue === option.value )
          defaultValue = option
      }
    }
    console.log('[SelectState.js] defaultValue', defaultValue)

    return(
      <Select
        /*name={name}*/
        /*value={selectedOption}*/
        onChange={this.handleChange}
        placeholder="State..."
        options={stateOptions}
        defaultValue={defaultValue}
      />
    )
  }
}

export default StateSelect;
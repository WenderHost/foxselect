import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectCompanyType extends Component{
  constructor(){
    super();

    this.state = {
      selectedOption: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption){
    const target = {};
    target.name = this.props.name;
    target.value = ( null !== selectedOption )? selectedOption.value : '';
    const e = {};
    e.target = target;
    this.props.handleChange(e);
    this.setState({selectedOption});
  }

  render(){
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    const { name } = this.props

    return(
      <Select
        name={name}
        value={value}
        onChange={this.handleChange}
        placeholder="Type..."
        options={[
          { value: 'Oem', label: 'Oem' },
          { value: 'Cem', label: 'Cem' },
          { value: 'Distributor', label: 'Distributor' },
          { value: 'Rep', label: 'Rep' }
        ]}
      />
    )
  }
}

export default SelectCompanyType;





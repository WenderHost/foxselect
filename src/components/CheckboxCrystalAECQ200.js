import React, { Component } from 'react';

class CheckboxCrystalAECQ200 extends Component {

  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    const value = ( e.target.checked )? 'BA' : 'BS';
    this.props.updateConfiguredPart('package_option',value)
  }

  render(){
    const { configuredPart } = this.props;

    return(
      <div className="col-md-2">
        <div className="form-check" style={{marginTop: '36px'}}>
          <input type="checkbox" className="form-check-input" id="aec-q200" value="BA" checked={configuredPart.package_option.value === 'BA'} onChange={this.handleChange}/>
          <label htmlFor="aec-q200" className="form-check-label">AEC-Q200</label>
        </div>
      </div>
    );
  }
}

export default CheckboxCrystalAECQ200;
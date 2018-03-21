import React, { Component } from 'react';

class CheckboxOscillatorAECQ200 extends Component {

  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    const value = ( e.target.checked )? 'HA' : '__';
    this.props.updateConfiguredPart('output',value)
  }

  render(){
    const { configuredPart } = this.props;

    return(
      <div className="col-md-2">
        <div className="form-check" style={{marginTop: '36px'}}>
          <input type="checkbox" className="form-check-input" id="aec-q200" value="HA" checked={configuredPart.output === 'HA'} onChange={this.handleChange}/>
          <label htmlFor="aec-q200" className="form-check-label">AEC-Q200</label>
        </div>
      </div>
    );
  }
}

export default CheckboxOscillatorAECQ200;
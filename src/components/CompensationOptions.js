import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

class CompensationOptions extends Component{

  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption){
    const { updateConfiguredPart } = this.props;
    updateConfiguredPart( 'output', {value: selectedOption, label: 'Clipped Sine' } )
  }

  render(){
    const { configuredPart } = this.props;

    const selectedCompensation = (
      1 === configuredPart.output.value.length
      && ( 'A' === configuredPart.output.value || 'C' === configuredPart.output.value )
    )? configuredPart.output.value : '';

    return(
      <div className="form-row">
        <div className="col-md-4 offset-md-6">
          <div className="alert alert-secondary">
            <RadioGroup name="compensation_option" selectedValue={selectedCompensation} onChange={this.handleChange}>

              <div className="row">
                <div className="col-8" style={{whiteSpace: 'nowrap'}}>
                  <label htmlFor="std-compensation">Standard Digital Compensation</label>
                </div>
                <div className="col-4" style={{whiteSpace: 'nowrap'}}>
                  <Radio value="C" id="std-compensation" />
                </div>
              </div>
              <div className="row">
                <div className="col-8" style={{whiteSpace: 'nowrap'}}>
                  <label htmlFor="opt-compensation">Optional Analog Compensation</label>
                </div>
                <div className="col-4" style={{whiteSpace: 'nowrap'}}>
                    <Radio value="A" id="opt-compensation" />
                </div>
              </div>

            </RadioGroup>
          </div>
        </div>
      </div>
    )
  }
}

export default CompensationOptions;
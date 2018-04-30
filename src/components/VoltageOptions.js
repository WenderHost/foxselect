import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

class VoltageOptions extends Component{

  constructor(){
    super()
    this.showOptions = this.showOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(){
    const { configuredPart, updateConfiguredPart } = this.props
    const voltage = configuredPart.voltage.value
    switch(voltage){
      case 'A':
        if( '_' === configuredPart.output.value.substring(0,1) ){
          switch(configuredPart.size.value){
            case '5':
              updateConfiguredPart('output',{value: 'HD', label: 'HD'})
              break

            default:
              updateConfiguredPart('output',{value: 'HH', label: 'HH'})
          }
        }
        break

      case 'B':
      case 'C':
      case 'H':
      case 'J':
        if( '_' === configuredPart.output.value.substring(0,1) )
          updateConfiguredPart('output',{value: 'HS', label: 'HS'})
        break

      default:
        if( '_' === configuredPart.output.value.substring(0,1) )
          updateConfiguredPart('output',{value: 'HS', label: 'HS'})
    }
    return
  }

  handleChange(value){
    console.log('VoltageOptions::handleChange() updating `output` to ' + value)
    this.props.updateConfiguredPart('output',{value: value, label: value})
  }

  showOptions(voltage){
    const { configuredPart } = this.props
    const output = configuredPart.output.value

    let excludedOutputs = []
    switch(configuredPart.size.value){
      case '7':
        excludedOutputs = ['SL','HA']
        break;

      default:
        excludedOutputs = ['PS','LS','SL']
    }
    if( excludedOutputs.includes(output) )
      return

    if( 'P' === output.substring(0,1) ){
      return(
          <div className="alert alert-secondary">
            <p>Input Current:</p>
            <RadioGroup name="voltage_option" selectedValue={output} onChange={this.handleChange}>
              <div className="row">
                <div className="col-9">
                  <label htmlFor="standard">Standard 0.3 pS typ. Jitter, E/D Pin 1</label>
                </div>
                <div className="col-2"><Radio value="PS" id="standard" /></div>
              </div>
              <div className="row">
                <div className="col-9">
                  <label htmlFor="opt-jitter">Optional 0.3pS typ. Jitter, E/D Pin 2</label>
                </div>
                <div className="col-2"><Radio value="PD" id="opt-jitter" /></div>
              </div>
              <div className="row">
                <div className="col-9">
                  <label htmlFor="opt-max-jitter">Optional 0.1pS MAX Jitter, E/D Pin 1</label>
                </div>
                <div className="col-2"><Radio value="PU" id="opt-max-jitter" /></div>
              </div>
            </RadioGroup>
          </div>
      )
    }

    if( 'LS' === output || 'LD' === output ){
      return(
          <div className="alert alert-secondary">
            <p>Input Current:</p>
            <RadioGroup name="voltage_option" selectedValue={output} onChange={this.handleChange}>
              <div className="row">
                <div className="col-9">
                  <label htmlFor="standard">Standard 0.3 pS typ. Jitter, E/D Pin 1</label>
                </div>
                <div className="col-2"><Radio value="LS" id="standard" /></div>
              </div>
              <div className="row">
                <div className="col-9">
                  <label htmlFor="opt-jitter">Optional 0.3pS typ. Jitter, E/D Pin 2</label>
                </div>
                <div className="col-2"><Radio value="LD" id="opt-jitter" /></div>
              </div>
            </RadioGroup>
          </div>
      )
    }

    switch(voltage){
      case 'A':
        let inputOptions = '';

        switch(configuredPart.size.value){
          case '5':
            inputOptions = (
              <div className="alert alert-secondary">
                <p>Input Current:</p>
                <RadioGroup name="voltage_option" selectedValue={output} onChange={this.handleChange}>
                  <div className="row">
                    <div className="col-8">
                      <label htmlFor="std-input">Standard 50pF Load</label>
                    </div>
                    <div className="col-2"><Radio value="HD" id="std-input" /></div>
                  </div>
                  <div className="row">
                    <div className="col-8">
                      <label htmlFor="opt-load-ed">Optional 15pF Load</label>
                    </div>
                    <div className="col-2"><Radio value="HS" id="opt-load-ed" /></div>
                  </div>
                </RadioGroup>
              </div>
            )
            break

          case '7':
            inputOptions = (
              <div className="alert alert-secondary">
                <p>Input Current:</p>
                <RadioGroup name="voltage_option" selectedValue={output} onChange={this.handleChange}>
                  <div className="row">
                    <div className="col-8">
                      <label htmlFor="std-input">Standard 50pF Load</label>
                    </div>
                    <div className="col-2"><Radio value="HH" id="std-input" /></div>
                  </div>
                  <div className="row">
                    <div className="col-8">
                      <label htmlFor="opt-load-ed">Optional 15pF Load with E/D</label>
                    </div>
                    <div className="col-2"><Radio value="HD" id="opt-load-ed" /></div>
                  </div>
                  <div className="row">
                    <div className="col-8">
                      <label htmlFor="opt-load-standby">Optional 15pF Load with Standby</label>
                    </div>
                    <div className="col-2"><Radio value="HB" id="opt-load-standby" /></div>
                  </div>
                </RadioGroup>
              </div>
            )
            break

            default:
        }
        return inputOptions

      case 'B':
      case 'C':
      case 'H':
      case 'J':
        return(
          <div className="alert alert-secondary">
            <p>Input Current:</p>
            <RadioGroup name="voltage_option" selectedValue={output} onChange={this.handleChange}>
              <div className="row">
                <div className="col-8">
                  <label htmlFor="std-input">Standard Input Current</label>
                </div>
                <div className="col-2"><Radio value="HS" id="std-input" /></div>
              </div>
              <div className="row">
                <div className="col-8">
                  <label htmlFor="opt-input">Optional XX Input Current</label>
                </div>
                <div className="col-2"><Radio value="HL" id="opt-input" /></div>
              </div>
            </RadioGroup>
          </div>
        )

      default:
        // console.log('No Voltage options defined for `' + voltage + '`. We need to set Output to whatever the value of the Output drop down is.');
    }
  }

  render(){
    const { configuredPart } = this.props
    const voltage = configuredPart.voltage.value

    return(
      <div className="form-row">
        <div className="col-md-4 offset-md-6">
          { this.showOptions(voltage) }
        </div>
      </div>
    )
  }
}

export default VoltageOptions;
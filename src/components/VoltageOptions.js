import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

class VoltageOptions extends Component{

  constructor(){
    super()

    this.getOptionalInputCurrent = this.getOptionalInputCurrent.bind(this)
    this.getStandardInputCurrent = this.getStandardInputCurrent.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.showOptions = this.showOptions.bind(this)
  }

  /*
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
        if( '_' === configuredPart.output.value.substring(0,1) ){
          console.log('VoltageOptions->componentDidUpdate() setting Output = `HS`')
          updateConfiguredPart('output',{value: 'HS', label: 'HS'})
        }
        break

      default:
        if( '_' === configuredPart.output.value.substring(0,1) )
          updateConfiguredPart('output',{value: 'HS', label: 'HS'})
    }
    return
  }
  /**/

  getOptionalInputCurrent(){
    const { configuredPart } = this.props
    const frequency = parseFloat( configuredPart.frequency.value )

    const optionalInputCurrent = {available: true, message: ''}

    switch(configuredPart.voltage.value){
      case 'B':
      case 'C':
      case 'B,C':
        if( 1.8 <= frequency && 32 >= frequency ){
          optionalInputCurrent.message = '2.5mA'
        } else if( 50 >= frequency ){
          optionalInputCurrent.message = '3.5mA'
        } else {
          optionalInputCurrent.available = false
          optionalInputCurrent.range = '1.8 - 50MHz'
          optionalInputCurrent.message = 'O/R'
        }
        break

      case 'H':
        if( 1.8 <= frequency && 32 >= frequency ){
          optionalInputCurrent.message = '1.5mA'
        } else if( 50 >= frequency ){
          optionalInputCurrent.message = '2.5mA'
        } else {
          optionalInputCurrent.available = false
          optionalInputCurrent.range = '1.8 - 50MHz'
          optionalInputCurrent.message = 'O/R'
        }
        break

      default:
        // nothing
    }

    return optionalInputCurrent
  }

  getStandardInputCurrent(){
    const { configuredPart } = this.props
    const frequency = parseFloat( configuredPart.frequency.value )

    const standardInputCurrent = {available: true, message: ''}

    if( '3' === configuredPart.size.value ){
      switch(configuredPart.voltage.value){
        case 'B':
        case 'C':
        case 'B,C':
          if( 0.5 <= frequency && 20 >= frequency ){
            standardInputCurrent.message = '7mA'
          } else if ( 40 >= frequency ){
            standardInputCurrent.message = '13mA'
          } else if ( 60 >= frequency ){
            standardInputCurrent.message = '19mA'
          } else if (75 >= frequency ){
            standardInputCurrent.message = '24mA'
          } else if (80 >= frequency ){
            standardInputCurrent.message = '30mA'
          } else if ( 125 >= frequency ){
            standardInputCurrent.message = '40mA'
          } else if ( 170 >= frequency ){
            standardInputCurrent.message = '50mA'
          } else {
            standardInputCurrent.available = false
            standardInputCurrent.range = '0.5 - 170MHz'
            standardInputCurrent.message = 'O/R'
          }
          break

        case 'H':
          if( 0.625 <= frequency && 20 >= frequency){
            standardInputCurrent.message = '5mA'
          } else if ( 40 >= frequency ){
            standardInputCurrent.message = '9mA'
          } else if ( 60 >= frequency ){
            standardInputCurrent.message = '11mA'
          } else if ( 75 >= frequency ){
            standardInputCurrent.message = '14mA'
          } else{
            standardInputCurrent.available = false
            standardInputCurrent.range = '0.625 - 75MHz'
            standardInputCurrent.message = 'O/R'
          }
          break

        default:
          // nothing
      }
    } else if( '5' === configuredPart.size.value ){
      switch(configuredPart.voltage.value){
        case 'B':
        case 'C':
        case 'B,C':
          if( 1 <= frequency && 32 >= frequency ){
            standardInputCurrent.message = '15mA'
          } else if ( 50 >= frequency ){
            standardInputCurrent.message = '20mA'
          } else if ( 80 >= frequency ){
            standardInputCurrent.message = '25mA'
          } else if ( 125 >= frequency ){
            standardInputCurrent.message = '40mA'
          } else if ( 170 >= frequency ){
            standardInputCurrent.message = '50mA'
          } else {
            standardInputCurrent.available = false
            standardInputCurrent.range = '1 - 170MHz'
            standardInputCurrent.message = 'O/R'
          }
          break

        case 'H':
          if( 1 <= frequency && 32 >= frequency ){
            standardInputCurrent.message = '10mA'
          } else if ( 80 >= frequency ){
            standardInputCurrent.message = '18mA'
          } else if( 125 >= frequency ){
            standardInputCurrent.message = '28mA'
          } else {
            standardInputCurrent.available = false
            standardInputCurrent.range = '1 - 125MHz'
            standardInputCurrent.message = 'O/R'
          }
          break

        default:
          // nothing
      }
    }

    return standardInputCurrent
  }

  handleChange(value){
    const { configuredPart, updateConfiguredPart } = this.props
    console.log('VoltageOptions::handleChange() updating `output` to ' + value)

    // If `comma` in saved value, delay the update. Otherwise update immediately
    const delay = ( -1 < configuredPart.voltage.value.indexOf(',') )? true : false ;
    updateConfiguredPart( 'output', {value: value, label: value}, delay );

    switch(value){
      case 'HL':
        switch(configuredPart.voltage.label){
          case '3.3 Volts':
            updateConfiguredPart('voltage',{value: 'B', label: '3.3 Volts'});
            break;

          case '2.5 Volts':
            updateConfiguredPart('voltage',{value: 'H', label: '2.5 Volts'});
            break;

          default:
        }

        break

      case 'HS':
        switch(configuredPart.voltage.label){
          case '3.3 Volts':
            updateConfiguredPart('voltage',{value: 'C', label: '3.3 Volts'});
            break;

          case '2.5 Volts':
            updateConfiguredPart('voltage',{value: 'H', label: '2.5 Volts'}); // Why is this `H`? According to 2.5V options, we would expect this to be `J`.
            break;

          default:
        }
        break

      default:
    }
  }

  showOptions(voltage){
    const { configuredPart } = this.props
    const output = configuredPart.output.value
    console.log('inside showOptions(), output = ' + output )

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
      case 'B,C':
      case 'H':
        const optionalInputCurrent = this.getOptionalInputCurrent()
        const standardInputCurrent = this.getStandardInputCurrent()

        return(
          <div className="alert alert-secondary">
            <p>Input Current:</p>
            <RadioGroup name="voltage_option" selectedValue={output} onChange={this.handleChange}>

              <div className="row">
                <div className="col-8" style={{whiteSpace: 'nowrap'}}>
                  <label htmlFor="std-input">Standard Input Current ({standardInputCurrent.message})</label>
                </div>
                <div className="col-4" style={{whiteSpace: 'nowrap'}}>
                  { standardInputCurrent.available ? (
                    <Radio value="HS" id="std-input" />
                  ) : (
                    <code style={{fontSize: '.8rem'}}>{standardInputCurrent.range}</code>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-8" style={{whiteSpace: 'nowrap'}}>
                  <label htmlFor="opt-input">Optional Input Current ({optionalInputCurrent.message})</label>
                </div>
                <div className="col-4" style={{whiteSpace: 'nowrap'}}>
                  { optionalInputCurrent.available ? (
                    <Radio value="HL" id="opt-input" />
                  ) : (
                    <code style={{fontSize: '.8rem'}}>{optionalInputCurrent.range}</code>
                  )}
                </div>
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
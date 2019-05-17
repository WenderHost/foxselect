import React, { Component } from 'react'
import { formatFrequency } from '../lib/utilities'

class InputFrequency extends Component{

  constructor(){
    super()

    this.state = {
      frequency: '',
      hasFocus: false
    }
  }

  formatFrequency = (e) => {
    const formattedFrequency = formatFrequency( e.target.value )
    this.setState({hasFocus: false, frequency: formattedFrequency},() => {
      this.props.updateConfiguredPart('frequency',{label: formattedFrequency, value: formattedFrequency })
    })
  }

  handleChange = (e) => {
    console.log('Not updating configuredPart.frequency until this input loses focus.')
    this.setState({frequency: e.target.value})
  }

  handleFocus = () => {
    this.setState({hasFocus: true})
  }

  render(){
    const { configuredPart } = this.props
    let value = ( '_' !== configuredPart.frequency.value && '0.0' !== configuredPart.frequency.value )? configuredPart.frequency.value : ''
    if( this.state.hasFocus )
      value = this.state.frequency

    let disabled = false
    if('32.768' === configuredPart.frequency.value && 'K' === configuredPart.product_type.value ){
      disabled = true
    } else if (-1 < configuredPart.product_type.value.indexOf('_')){
      disabled = true
    }

    const styles = ( disabled && '32.768' === configuredPart.frequency.value )? {backgroundColor: 'aliceblue'} : {}


    return(
      <div>
        <label htmlFor="frequency">Frequency</label>
        <input className="form-control" style={styles} type="text" name="frequency" step="any" min="0" disabled={disabled} value={value} onFocus={this.handleFocus} onChange={this.handleChange} onBlur={this.formatFrequency} />
      </div>
    )
  }
}

export default InputFrequency
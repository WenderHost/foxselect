import React, { Component } from 'react'

class VibrationResistant extends Component {

  handleChange = (e) => {
    const { updateConfiguredPart } = this.props

    console.log(`🔔 e.target.checked = `, e.target.checked )
    if( e.target.checked ){
      updateConfiguredPart( 'package_option', 'VR' )
    } else {
      updateConfiguredPart( 'package_option', 'BS' )
    }
  }

  render(){
    const { configuredPart } = this.props

    return(
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="vibration-resistant" value="VR" checked={('VR' === configuredPart.package_option.value)} onChange={this.handleChange}/>
        <label htmlFor="vibration-resistant" className="form-check-label">Vibration Resistant</label>
      </div>
    );
  }
}

export default VibrationResistant
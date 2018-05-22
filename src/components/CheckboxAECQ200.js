import React, { Component } from 'react';

class CheckboxAECQ200 extends Component {

  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  /*
  componentDidMount(){
    const { configuredPart, updateConfiguredPart } = this.props
    switch(configuredPart.product_type.value){
      case 'K':
        if( -1 < configuredPart.size.value.indexOf(',') ){
          console.log('Size value has a comma. CheckboxAECQ200 setting Size to default')
          let defaultSize = {value: '', label: ''}
          const currentSize = configuredPart.size.value.substring(0,2)
          switch(currentSize){
            case '12':
              defaultSize = {value: '122', label: '2.0x1.2 mm'}
              break

            case '13':
              defaultSize = {value: '135', label: '3.2x1.5 mm'}
              break

            default:
              console.log('No default size set for ' + currentSize)
          }
          updateConfiguredPart('size',defaultSize)
        }
        break

      default:
    }
  }
  /**/

  handleChange(e){
    const { configuredPart, updateConfiguredPart } = this.props

    let value = ''
    let label = ''
    switch(configuredPart.product_type.value){
      case 'C':
        value = ( e.target.checked )? 'BA' : 'BS'
        updateConfiguredPart('package_option',value)
        break;

      case 'K':
        switch(configuredPart.size.value){
          case '122':
          case '12A':
          case '122,12A':
          case '12A,122':
            value = ( e.target.checked )? '12A' : '122'
            label = '2.0x1.2 mm'
            break

          case '13A':
          case '135':
          case '13L':
          case '13A,135,13L':
          case '135,13A,13L':
          case '13A,13L,135':
          case '13L,13A,135':
          case '135,13L,13A':
          case '13L,135,13A':
            value = ( e.target.checked )? '13A' : '135'
            label = '3.2x1.5 mm'
            break

          default:
            const defaultValue = ( '12' ===  e.target.value.substring(0,2) )? '122' : '135'
            value = ( e.target.checked )? e.target.value : defaultValue
        }
        updateConfiguredPart('size',{value: value, label: label})
        break;

      case 'O':
        value = ( e.target.checked )? 'HA' : '__'
        updateConfiguredPart('output',value)
        break

      default:
        // nothing
    }

  }

  render(){
    const { configuredPart } = this.props

    let value = ''
    let checked = false
    switch(configuredPart.product_type.value){
      case 'C':
        value = 'BA'
        if('BA' === configuredPart.package_option.value)
          checked = true
        break

      case 'K':
        value = configuredPart.size.value.substring(0,2) + 'A'
        if(value === configuredPart.size.value)
          checked = true
        break

      case 'O':
        value = 'HA'
        if('HA' === configuredPart.output.value)
          checked = true
        break

      default:
    }

    return(
      <div className="col-md-2">
        <div className="form-check" style={{marginTop: '36px'}}>
          <input type="checkbox" className="form-check-input" id="aec-q200" value={value} checked={checked} onChange={this.handleChange}/>
          <label htmlFor="aec-q200" className="form-check-label">AEC-Q200</label>
        </div>
      </div>
    );
  }
}

export default CheckboxAECQ200;
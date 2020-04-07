import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

class SizeOptions extends Component{

  constructor(){
    super();
    this.showOptions = this.showOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value){
    switch(this.props.configuredPart.product_type.value){
      case 'K':
        const sizeValue = ( 0 <= value.indexOf('13') )? { value: value, label: '3.2x1.5 mm' } : { value: value, label: '2.0x1.2 mm'}
        this.props.updateConfiguredPart('size',sizeValue)
        break;

      default:
        this.props.updateConfiguredPart('package_option',value)
    }
  }

  showOptions(size,package_option){

    switch(size){

      case '13A':
      case '135':
      case '13L':
      case '13A,135,13L':
      case '135,13A,13L':
      case '13A,13L,135':
      case '13L,13A,135':
      case '135,13L,13A':
      case '13L,135,13A':
        //let value = this.props.configuredPart.size
        return(
          <div className="alert alert-secondary">
            <p>ESR:</p>
            <RadioGroup name="size" selectedValue={size} onChange={this.handleChange}>
              <div className="row">
                <div className="col-7">
                  <label htmlFor="70KOhm">70 K Ohm  (Standard)</label>
                </div>
                <div className="col-2"><Radio value="135" id="70KOhm" /></div>
              </div>
              <div className="row">
                <div className="col-7">
                  <label htmlFor="50KOhm">50 K Ohm (Optional)</label>
                </div>
                <div className="col-2"><Radio value="13L" id="50KOhm" /></div>
              </div>
            </RadioGroup>
          </div>
        )

      case 'A':
      case '0':
      case '2':
      case '4':
      case '8':
        return(
          <input type="hidden" name="package_option" value={package_option} />
        );
      case '4SD':
      case '9SD':
        return false;
      case '1':
        return(
          <div className="alert alert-secondary">
            <p>2.0 x 1.6 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="row">
                <div className="col-10">
                  <label htmlFor="20x16bs">0.45 mm height, metal lid, seam seal</label>
                </div>
                <div className="col-1"><Radio value="BS" id="20x16bs" /></div>
              </div>
              <div className="row">
                <div className="col-10">
                  <label htmlFor="20x16bq">0.7mm height, metal lid, resin seal</label>
                </div>
                <div className="col-1"><Radio value="BQ" id="20x16bq" /></div>
              </div>
            </RadioGroup>
          </div>
        )

      case '3':
        return(
          <div className="alert alert-secondary">
            <p>3.2 x 2.5 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="row">
                <div className="col-10"><label htmlFor="32x25bs">0.7mm height, metal lid, seam seal</label></div>
                <div className="col-1"><Radio value="BS" id="32x25bs" /></div>
              </div>
              <div className="row">
                <div className="col-10"><label htmlFor="32x25bq">1.1 mm height, ceramic lid, resin seal</label></div>
                <div className="col-1"><Radio value="BQ" id="32x25bq" /></div>
              </div>
            </RadioGroup>
          </div>
        );
      case '5':
        return(
          <div className="alert alert-secondary">
            <p>5.0 x 3.2 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="row">
                <div className="col-7"><label>1.0mm height, metal lid, seam seal</label></div>
                <div className="col-sm-auto"><label><Radio value="BS" /> 4 pad</label></div>
                <div className="col-sm-auto"><label><Radio value="AS" /> 2 pad</label></div>
              </div>
              <div className="row">
                <div className="col-7"><label>1.2mm height, ceramic lid, resin seal</label></div>
                <div className="col-sm-auto"><label><Radio value="BQ" /> 4 pad</label></div>
                <div className="col-sm-auto"><label><Radio value="AQ" /> 2 pad</label></div>
              </div>
            </RadioGroup>
          </div>
        );
      case '6':
        return(
          <div className="alert alert-secondary">
            <p>6.0 x 3.5 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="row">
                <div className="col"><label htmlFor="6x3-bs">Metal lid, seam seal</label></div>
                <div className="col-auto"><label><Radio value="BS" id="6x3-bs" /> 4 pad</label></div>
              </div>
              <div className="row">
                <div className="col"><label htmlFor="6x3-as">Ceramic lid, resin seal:</label></div>

                <div className="col-auto"><label><Radio value="AS" id="6x3-as" /> 2 pad</label></div>
              </div>
            </RadioGroup>
          </div>
        );
      case '7':
        return(
          <div className="alert alert-secondary">
            <p>7.0 x 5.0 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="row">
                <div className="col"><label htmlFor="7x5-bs">Metal lid, seam seal</label></div>
                <div className="col-auto"><label><Radio value="BS" id="7x5-bs" /> 4 pad</label></div>
              </div>
              <div className="row">
                <div className="col"><label htmlFor="7x5-as">Ceramic lid, resin seal:</label></div>
                <div className="col-auto"><label><Radio value="AS" id="7x5-as" /> 2 pad</label></div>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        // nothing
    }
  }

  render(){
    const { configuredPart } = this.props;
    const size = configuredPart.size.value;
    const package_option = configuredPart.package_option.value;

    return(
      <div>{ this.showOptions(size, package_option) }</div>
    );
  }
}

export default SizeOptions;
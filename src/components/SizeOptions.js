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
                  <label htmlFor="20x16bs">4.5 mm height, metal lid, seam seal (Std)</label>
                </div>
                <div className="col-1"><Radio value="BS" id="20x16bs" /></div>
              </div>
              <div className="row">
                <div className="col-10">
                  <label htmlFor="20x16bq">Ceramic Lid, resin seal (Opt)</label>
                </div>
                <div className="col-1"><Radio value="BQ" id="20x16bq" /></div>
              </div>
              <div className="row">
                <div className="col-10">
                  <label htmlFor="20x16bc">4.0 mm height, metal lid seam seal (Opt)</label>
                </div>
                <div className="col-1"><Radio value="BC" id="20x16bc" /></div>
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
                <div className="col-8"><label htmlFor="32x25bs">Metal lid, seam seal</label></div>
                <div className="col-4"><Radio value="BS" id="32x25bs" /></div>
              </div>
              <div className="row">
                <div className="col-8"><label htmlFor="32x25bq">Ceramic lid, resin seal</label></div>
                <div className="col-4"><Radio value="BQ" id="32x25bq" /></div>
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
                <div className="col-6"><label>Metal lid, seam seal</label></div>
                <div className="col-3"><label><Radio value="BS" /> 4 pad</label></div>
                <div className="col-3"><label><Radio value="AS" /> 2 pad</label></div>
              </div>
              <div className="row">
                <div className="col-6"><label>Ceramic lid, resin seal:</label></div>
                <div className="col-3"><label><Radio value="BQ" /> 4 pad</label></div>
                <div className="col-3"><label><Radio value="AQ" /> 2 pad</label></div>
              </div>
              <div className="row">
                <div className="col-6"><label>Ceramic lid, glass seal:</label></div>
                <div className="col-3"><label><Radio value="CG" /> 4 pad</label></div>
                <div className="col-3"><label><Radio value="AG" /> 2 pad</label></div>
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
                <div className="col-6"><label>Metal lid, seam seal</label></div>
                <div className="col-3"><label><Radio value="BS" /> 4 pad</label></div>
              </div>
              <div className="row">
                <div className="col-6"><label>Ceramic lid, resin seal:</label></div>
                <div className="col-3"><label><Radio value="BQ" /> 4 pad</label></div>
                <div className="col-3"><label><Radio value="AQ" /> 2 pad</label></div>
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
                <div className="col-6"><label>Metal lid, seam seal</label></div>
                <div className="col-3"><label><Radio value="BS" /> 4 pad</label></div>
              </div>
              <div className="row">
                <div className="col-6"><label>Ceramic lid, resin seal:</label></div>
                <div className="col-3"><label><Radio value="BQ" /> 4 pad</label></div>
                <div className="col-3"><label><Radio value="AQ" /> 2 pad</label></div>
              </div>
              <div style={{fontSize: '11px', backgroundColor: '#fff', padding: '10px'}}>
                MWENDER NOTE: Check with Roger on the 2 pad option. His Visio says a 2 pad Ceramic lid, resin seal package can be called an <code>AQ</code> or an <code>AS</code>. Which is it? Currently, if you select <code>Ceramic lid, resin seal, 2 pad</code> above, the returned code is <code>AQ</code>.
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
      <div className="form-row">
        <div className="col-md-4">
          { this.showOptions(size, package_option) }
        </div>
      </div>
    );
  }
}

export default SizeOptions;
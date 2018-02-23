import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

class SizeOptions extends Component{

  constructor(){
    super();
    this.showOptions = this.showOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value){
    this.props.updateConfiguredPart('package_option',value)
  }

  showOptions(size,package_option){

    switch(size){
      case 'A':
      case '0':
      case '2':
      case '4':
      case '8':
      case '4SD':
      case '9SD':
        return(
          <input type="hidden" name="package_option" value={package_option} />
        );
      case '1':
        return(
          <div className="alert alert-secondary">
            <p>2.0 x 1.6 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="form-check">
                <label>
                  <Radio value="BS" /> Standard 4.5 mm height, metal lid, seam seal
                </label>
              </div>
              <div className="form-check">
                <label>
                  <Radio value="BQ" /> Optional Ceramic Lid, resin seal
                </label>
              </div>
              <div className="form-check">
                <label>
                  <Radio value="BC" /> Optional 4.0 mm height, metal lid seam seal
                </label>
              </div>
            </RadioGroup>
          </div>
        );
      case '3':
        return(
          <div className="alert alert-secondary">
            <p>3.2 x 2.5 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="form-check">
                <label>
                  <Radio value="BS" /> Metal lid, seam seal
                </label>
              </div>
              <div className="form-check">
                <label>
                  <Radio value="BQ" /> Ceramic lid, resin seal
                </label>
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
                <div className="col-6">Metal lid, seam seal</div>
                <div className="col-2"><label><Radio value="BS" /> 4 pad</label></div>
                <div className="col-2"><label><Radio value="AS" /> 2 pad</label></div>
              </div>
              <div className="row">
                <div className="col-6">Ceramic lid, resin seal:</div>
                <div className="col-2"><label><Radio value="BQ" /> 4 pad</label></div>
                <div className="col-2"><label><Radio value="AQ" /> 2 pad</label></div>
              </div>
              <div className="row">
                <div className="col-6">Ceramic lid, glass seal:</div>
                <div className="col-2"><label><Radio value="CG" /> 4 pad</label></div>
                <div className="col-2"><label><Radio value="AG" /> 2 pad</label></div>
              </div>
            </RadioGroup>
          </div>
        );
      case '6':
        return(
          <div className="alert alert-secondary">
            <p>6.0 x 3.5 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="form-check">
                Metal lid, seam seal
                <label>
                  <Radio value="BS" /> 4 pad
                </label>
              </div>
              <div className="form-check">
                Ceramic lid, resin seal
                <label>
                  <Radio value="BQ" /> 4 pad <Radio value="AQ" /> 2 pad
                </label>
              </div>
            </RadioGroup>
          </div>
        );
      case '7':
        return(
          <div className="alert alert-secondary">
            <p>7.0 x 5.0 mm package options:</p>
            <RadioGroup name="package_option" selectedValue={package_option} onChange={this.handleChange}>
              <div className="form-check">
                Metal lid, seam seal
                <label>
                  <Radio value="BS" /> 4 pad
                </label>
              </div>
              <div className="form-check">
                Ceramic lid, resin seal
                <label>
                  <Radio value="BQ" /> 4 pad <Radio value="AQ" /> 2 pad
                </label>
              </div>
              <div className="alert alert-error">
                MWENDER NOTE: Check with Roger on the 2 pad option. His Visio says a 2 pad Ceramic lid, resin seal package can be called an <code>AQ</code> or an <code>AS</code>. Which is it? Currently, if you select <code>Ceramic lid, resin seal, 2 pad</code> above, the returned code is <code>AQ</code>.
              </div>
            </RadioGroup>
          </div>
        );
      default:
        console.log('this is the default option. Part size: ' + size);
        return(
          <p>MWENDER NOTE: Choose <code>2.0 x 1.6 mm</code> to see options here. I haven't coded out the options for the other sizes yet.</p>
        );
    }
  }

  render(){
    const { configuredPart } = this.props;
    const size = configuredPart.size;
    const package_option = configuredPart.package_option;

    return(
      <div>
        { this.showOptions(size, package_option) }
      </div>
    );
  }
}

export default SizeOptions;
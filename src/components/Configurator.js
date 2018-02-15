import React from 'react';
import Button from './Button';
import { Redirect } from 'react-router-dom';

class Configurator extends React.Component{

  constructor(){
    super();
    //this.goToStep2 = this.goToStep2.bind(this);
    this.createPart = this.createPart.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {selectedUnitOption: 'MHz', selectedPackageType: 'SMD', fireRedirect: false};
  }

  /*
  goToStep2(e){
    e.preventDefault();
    console.log('Part: ' + this.state.selectedCategory + ' ' + this.frequency.value + this.state.selectedUnitOption + ', ' + this.state.selectedPackageType);
    this.setState({fireRedirect: true});
  }
  */

  createPart(e){
    e.preventDefault();
    console.log('Creating a part...');

    const { frequency_unit } = this.form;
    //console.log(frequency_unit, frequency_unit.value);

    const { package_type } = this.form;
    //console.log(package_type, package_type.value);

    const part = {
      //category: this.category.value,
      frequency: this.frequency.value,
      frequency_unit: frequency_unit.value,
      package_type: package_type.value,
      //size: this.size.value,
      //stability: this.stability.value,
      //load: this.load.value,
      //optemp: this.optemp.value,
      //output: this.output.value,
      //voltage: this.voltage.value
    }
    console.log(part);
    this.props.addPart(part);
    this.form.reset(); // clear the form
  }

  // Part Category: Crystal, Oscillator, etc.
  handleClick(e){
    this.setState({ selectedCategory: e.target.innerHTML });
  }

  // Package Type
  handleTypeChange(changeEvent){
    this.setState({ selectedPackageType: changeEvent.target.value });
  }

  // MHz or kHz
  handleUnitChange(changeEvent){
    this.setState({ selectedUnitOption: changeEvent.target.value });
  }

  render(){
    if(this.state.fireRedirect){
      return(
        <Redirect to={this.state.selectedUnitOption + '-' + this.state.selectedCategory + '-' + this.state.selectedPackageType}/>
      );
    }

    return (
      <div className="Configurator">
        <form id="step-1" onSubmit={this.createPart} ref={form => this.form = form}>
          { /* This is a JSX comment. */ }
          <div className="form-row">
            <div className="col-md-2">
              <label className="sr-only" htmlFor="frequency">Frequency</label>
              <input type="text" className="form-control mb-2 mr-sm-2" id="frequency" required placeholder="Frequency" ref={(input) => this.frequency = input} />
            </div>
            <div className="col-md-4">
              <div className="form-check form-check-inline">
                <label className="form-check-label" htmlFor="MHz">
                  <input className="form-check-input" type="radio" name="frequency_unit" value="MHz" id="MHz" ref={(input) => this.frequency_unit = input} checked={this.state.selectedUnitOption === 'MHz'} onChange={this.handleUnitChange} />
                  MHz
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label" htmlFor="kHz">
                  <input className="form-check-input" type="radio" name="frequency_unit" value="kHz" id="kHz" ref={(input) => this.frequency_unit = input} checked={this.state.selectedUnitOption === 'kHz'} onChange={this.handleUnitChange} />
                  kHz
                </label>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-2"><label htmlFor="packagetype">Package Type</label></div>
            <div className="col-md-4">
              <div className="form-check form-check-inline">
                <label className="form-check-label" htmlFor="package_smd">
                  <input className="form-check-input" type="radio" name="package_type" id="package_smd" value="SMD" ref={(input) => this.package_type = input} checked={this.state.selectedPackageType === 'SMD'} onChange={this.handleTypeChange} />
                  SMD
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label" htmlFor="package_pinthru">
                  <input className="form-check-input" type="radio" name="package_type" id="package_pinthru" value="Pin-Thru" ref={(input) => this.package_type = input} checked={this.state.selectedPackageType === 'Pin-Thru'} onChange={this.handleTypeChange} />
                  Pin-Thru
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Button text="Crystal" handleClick={this.handleClick} />
              <Button text="Oscillator" handleClick={this.handleClick} />
              <Button text="TCXO" handleClick={this.handleClick} />
              <Button text="VC-TCXO" handleClick={this.handleClick} />
              <Button text="VCXO" handleClick={this.handleClick} />
              <Button text="OCXO" handleClick={this.handleClick} />
              <Button text="Spread Spectrum Oscillator" handleClick={this.handleClick} />
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default Configurator;
import React, { Component } from 'react';
import SelectSize from './SelectSize';
import SelectTolerance from './SelectTolerance';
import SelectStability from './SelectStability';
import SelectLoad from './SelectLoad';
import SelectOpTemp from './SelectOpTemp';
import SizeOptions from './SizeOptions';

class AdditionalOptionsForm extends Component{
  render(){
    var divStyle = {marginTop: '20px'};

    return(
      <div>
        <div className="form-row" style={divStyle}>
          <div className="col-md-2">
            <SelectSize configuredPart={this.props.configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectTolerance  configuredPart={this.props.configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectStability  configuredPart={this.props.configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectLoad  configuredPart={this.props.configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectOpTemp  configuredPart={this.props.configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
        </div>
        <div className="form-row">
          <div className="col-md-6">
            { ( typeof this.props.configuredPart.size !== 'undefined' && 0 !== this.props.configuredPart.size.length ) ? <SizeOptions configuredPart={this.props.configuredPart} updateConfiguredPart={this.props.updateConfiguredPart} /> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalOptionsForm;
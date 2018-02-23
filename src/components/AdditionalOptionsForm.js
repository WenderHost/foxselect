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
            <SelectSize updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectTolerance updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectStability updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectLoad updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
          <div className="col-md-2">
            <SelectOpTemp updateConfiguredPart={this.props.updateConfiguredPart} />
          </div>
        </div>
        <div className="form-row">
          <div className="col-md-6">
            { this.props.showSizeOptions ? <SizeOptions configuredPartSize={this.props.configuredPartSize} updateConfiguredPart={this.props.updateConfiguredPart} /> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalOptionsForm;
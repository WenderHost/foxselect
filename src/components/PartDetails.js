import React, { Component } from 'react';

class PartDetails extends Component{

  render(){
    return(
      <div className="part-details">
        <h4>Part Details</h4>
        <p>F{this.props.configuredPart.product_type}{this.props.configuredPart.size}{this.props.configuredPart.package_option}{this.props.configuredPart.tolerance}{this.props.configuredPart.stability}{this.props.configuredPart.load}{this.props.configuredPart.optemp}-{this.props.configuredPart.frequency}</p>
      </div>
    );
  }
}

export default PartDetails;
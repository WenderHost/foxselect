import React, { Component } from 'react';
import { API_ROOT } from '../api-config';

class PartDetails extends Component{

  render(){
    const { configuredPart } = this.props;
    const testLink = API_ROOT + configuredPart.number;
    return(
      <div className="part-details">
        <h4>Part Details</h4>
        <p>{configuredPart.number} &ndash; <a href={testLink} target="_blank">Test (See JSON) &rarr;</a></p>
      </div>
    );
  }
}

export default PartDetails;
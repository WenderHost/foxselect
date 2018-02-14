import React from 'react';

class Configurator extends React.Component{
  render(){
    return (
      <div className="Configurator">
        <label htmlFor="frequency"></label>
        <input type="text" name="frequency" id="frequency"/>
      </div>
    );
  }
}

export default Configurator;
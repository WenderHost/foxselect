import React, { Component } from 'react';
import PartSelector from './components/PartSelector';

class App extends Component {
  constructor(){
    super();

    this.addPart = this.addPart.bind(this);

    // initial state
    this.state = {
      parts: {},
      order: {}
    };
  }

  addPart(part){
    // update state
    const parts = {...this.state.parts};
    const timestamp = Date.now();
    parts[`part-${timestamp}`] = part;

    // set state
    this.setState({parts})
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <PartSelector addPart={this.addPart} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
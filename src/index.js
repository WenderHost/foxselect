import React, { Component } from 'react'
import { render } from 'react-dom'
import { unregister } from './registerServiceWorker'
import 'core-js/es7/array'

import './css/style.css'
import App from './App'

class Root extends Component{
  constructor(){
    super()

    this.state = {
      dataService: {}
    }
  }

  passDataService( dataService ){
    this.setState({dataService: dataService})
  }

  render(){
    const { dataService } = this.state;

    return(
      <div>
        <App dataService={dataService} />
      </div>
    )
  }
}
render(<Root ref={(FoxSelect) => {window.FoxSelect = FoxSelect}} />,document.querySelector('#root'))

//registerServiceWorker()
unregister()
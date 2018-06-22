import React, { Component } from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import StopForm from './components/Stop_Form';
import RouteForm from './components/RouteForm';


class App extends Component {

  render() {
    return (

      <div>
      <Map />
      <RouteForm />
      <StopForm />
        <div></div>
    
        
      
      </div>

    );
  }
}

export default App;

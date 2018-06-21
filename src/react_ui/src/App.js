import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import StopForm from './components/Stop_Form';

class App extends Component {

  render() {
    return (

      <div>
      <Map />
      <StopForm />
      </div>

    );
  }
}

export default App;

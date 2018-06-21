import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import StopForm from './components/Stop_Form';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

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

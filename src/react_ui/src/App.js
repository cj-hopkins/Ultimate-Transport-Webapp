import React, { Component } from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './App.css';
// import Map from './components/Map';
import MapContainer from './components/MapContainer';

import StopForm from './components/Stop_Form';
import LoadingSpinner from './components/Loading';
// import RouteForm from './components/RouteForm';


class App extends Component {

  render() {
    return (
      <div>
    
        
        <StopForm />
        <MapContainer />
      </div>

    );
  }
}

export default App;

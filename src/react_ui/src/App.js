import React, { Component } from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import { Grid, Row, Col, Container } from 'react-bootstrap';
import './App.css';
import MapContainer from './components/MapContainer';

import StopForm from './components/Stop_Form';
import LoadingSpinner from './components/LoadingSpinner';
import RouteForm from './components/RouteForm';
import Example from './components/Example';
import Sidebar from './components/sidebar';
import ContentBlock from './components/ContentBlock';
import CustomNavbar from './components/CustomNavbar';


class App extends Component {


  render() {
    // var StatesField = require('./components/StatesField').StatesField;
    return (
      <div>
        <header> Ultimate Transport </header>
        <StopForm />
        <ContentBlock />
        <MapContainer />
    
        {
        // <Grid fluid='true'>
        //   <Row>
        //   <header> Ultimate Transport </header>
        //   </Row>
        //   <Col>
        //   <MapContainer />
        //   </Col>
      // </Grid>
        // <ContentBlock />
        // <RouteForm />
        // <StopForm />
        // <LoadingSpinner />
        // <Example />
        }
      </div>

    );
  }
}

export default App;

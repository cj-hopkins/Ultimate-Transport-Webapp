import React, { Component } from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import { Grid, Row, Col, Container } from 'react-bootstrap';
import './App.css';
import MapContainer from './components/MapContainer';

import StopForm from './components/Stop_Form';
// import LoadingSpinner from './components/LoadingSpinner';
// import RouteForm from './components/RouteForm';
// import Example from './components/Example';
// import Sidebar from './components/sidebar';
// import CustomNavbar from './components/CustomNavbar';
import ContentBlock from './components/ContentBlock';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      testState: 'Sup children!',
      selectedStops: [],
    }
  }

  onRouteUpdate(data) {
    this.setState({
      selectedStops: data
    })
    console.log("recieved stops!")
    console.log(data)
  }

  render() {
    // var StatesField = require('./components/StatesField').StatesField;
    const myMarker = [{'stop_id': 1089, 'stop_lat': 53.3518, 'stop_lon': -6.2814}]
    return (
      <div>
        <header> Ultimate Transport </header>
        <StopForm />
        <ContentBlock data={this.state.testState} onUpdate={this.onRouteUpdate.bind(this)}/>
        <MapContainer selectedStops={ this.state.selectedStops }/>
    
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

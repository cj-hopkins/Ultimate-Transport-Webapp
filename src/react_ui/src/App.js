import React, { Component } from "react";
import { Grid, Row, Col, Container } from 'react-bootstrap';
import "./App.css";
import MapContainer from "./components/MapContainer";
// import DropdownInput from 'react-dropdown-input';
// import Select from 'react-select';

import StopForm from "./components/Stop_Form";
// import MySelect from './components/examples/MySelect';
// import LoadingSpinner from './components/LoadingSpinner';
// import RouteForm from './components/RouteForm';
// import Example from './components/Example';
// import Sidebar from './components/sidebar';
// import CustomNavbar from './components/CustomNavbar';
import ContentBlock from "./components/ContentBlock";
//import {PageHeader} from 'react-bootstrap';
// import RouteForm from './components/RouteForm';

require("bootstrap/dist/css/bootstrap.css")
require("react-select/dist/react-select.css")

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      testState: "Sup children!",
      selectedStops: [],
    }
  }

  onRouteUpdate(data) {
    this.setState({
      selectedStops: data
    })
    // console.log("recieved stops!")
    // console.log(data)
  }

  render() {
    // var StatesField = require('./components/StatesField').StatesField;
    // const myMarker = [{'stop_id': 1089, 'stop_lat': 53.3518, 'stop_lon': -6.2814}]
    // const searchNames = ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Hobart'];
    return (
      <div>
	
       {/* <PageHeader><small> Ultimate Transport</small> </PageHeader> */}
	<header>Ultimate Transport </header>
        <Grid>
	<Row>
	<Col xs={6} md={4} >
	<ContentBlock data={this.state.testState} onRouteUpdate={this.onRouteUpdate.bind(this)}/>
        </Col><Col>
	<MapContainer selectedStops={ this.state.selectedStops }/>
	</Col>
	</Row>
	</Grid>

        {
        // <StopForm />
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

    )
  }
}

export default App

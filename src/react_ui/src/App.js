import React, { Component } from "react";
import { Grid, Row, Col, Clearfix } from "react-bootstrap";
import "./App.css";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import CustomGeolocation from "./components/examples/GeoLocation";
import MainController from "./components/MainController";

require("bootstrap/dist/css/bootstrap.css");
require("react-select/dist/react-select.css");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stopsInRoute: [],
      selectedJourney: [],
    };
  }

  // this is only to be used when a new route is chosen (ie. by RouteSelect)
  // Changes to the selected journey and markers within a given route should be
  // handled with onSelectedJourneyUpdate
  onRouteUpdate(data) {
    this.setState({
      stopsInRoute: data,
      selectedJourney: data
    });
  }

  onSelectedJourneyUpdate(data) {
    this.setState({
      selectedJourney: data
    });
  }

  locationUpdate(position) {
    this.setState({
      currentPosition: position
    });
  }

  render() {
    return (
      <Grid fluid={true} className="Grid">
        <Row><Col md={4}>
              <ContentBlock data={this.state.testState} 
                            onRouteUpdate={this.onRouteUpdate.bind(this)}
                            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}   />
            </Col>
            <Col xsHidden md={8}>
              <MapContainer selectedStops={ this.state.selectedJourney}/></Col></Row>
                <Row>
           <Col smHidden mdHidden lgHidden>
              <MapContainer selectedStops={ this.state.selectedJourney}/>
            </Col>
           
        </Row>
      </Grid>
    );
  }
}

export default App;

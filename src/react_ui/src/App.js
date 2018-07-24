import React, { Component } from "react";
import { Grid, Row, Col, Clearfix } from "react-bootstrap";
import "./App.css";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import CustomGeolocation from "./components/examples/GeoLocation";
import MainController from "./components/MainController";
import CustomNavbar from './components/CustomNavBar';
import { Button, ButtonGroup, Media } from "react-bootstrap";
import { PageHeader } from "react-bootstrap";
import dublin_bus_icon from "./components/dublin_bus_icon.png";
import WeatherWidget from "./components/Weather";
import Example from './components/examples/Example';


require("bootstrap/dist/css/bootstrap.css");
require("react-select/dist/react-select.css");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stopsInRoute: [],
      selectedJourney: [],
      activatedUI: 0
    };
  }
swapUI(key) {
    //   console.log(key)
    this.setState({
      activatedUI: key
    });
  }
  
  renderSwitch = () => {
      console.log("render switch")
    switch (this.state.activatedUI) {
        case 0:
          return <ContentBlock key={0} 
          onRouteUpdate={this.onRouteUpdate.bind(this)}
          onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
          />;
        case 1:
          return <Example key={1} />;
        case 2:
          return <ContentBlock key={2} />;
        default:
          return <div key={3} />;
      }
    // return <div>{chosenElement}</div>;
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
        <Row>
          <Col xsHidden md={4}>
            <Media>
          <Media.Left>
            <img
              src={dublin_bus_icon}
              style={{ width: "100px", height: "100px" }}
              alt="dublin_bus_icon"
            />
          </Media.Left>
          <PageHeader className="fontForTitle">
            {" "}
            Ultimate Transport Dublin
          </PageHeader>
          <WeatherWidget />
        </Media>
        {/* <CustomNavbar swapUI={this.swapUI.bind(this)} /> */}
        {/* Render chosen UI component - default to ContentBlock */}
        {/* {this.renderSwitch()} */}
            <ContentBlock
              data={this.state.testState}
              onRouteUpdate={this.onRouteUpdate.bind(this)}
              onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            />
          </Col>
          <Col xsHidden md={8}>
            <MapContainer
              selectedStops={this.state.selectedJourney}
              currentPosition={this.state.currentPosition}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col mdHidden lgHidden>
            <ContentBlock
              data={this.state.testState}
              onRouteUpdate={this.onRouteUpdate.bind(this)}
              onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            />
            <MapContainer selectedStops={this.state.selectedJourney} />
          </Col>
        </Row> */}
      </Grid>
    );
  }
}

export default App;

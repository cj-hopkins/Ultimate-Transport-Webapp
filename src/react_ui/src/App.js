import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import "./App.css";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import Example from "./components/examples/Example";
import CustomNavbar from './components/CustomNavbar';
import ContentHeader from './components/ContentHeader';
import LocationSearchInput from './components/LocationSearchInput';
import JourneyPlanner from './components/JourneyPlanner';

require("bootstrap/dist/css/bootstrap.css");
require("react-select/dist/react-select.css");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stopsInRoute: [],
      selectedJourney: [],
      polylineCoordinates: null,
      activatedUI: 0,
      polylineCoordinates: [
        { lat: 53.378, lng: -6.057 },
        { lat: 53.378, lng: -6.056 },
        { lat: 53.378, lng: -6.056 }
      ]
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

  swapUI(key) {
    //   console.log(key)
    this.setState({
      activatedUI: key
    });
  }

  // parseCood = object => (String(object[object]()) > 6) ? object : parseFloat(String(object[object]()).substring(0,6))
  // parseCoords = array => array.map(object => ({
  //   let newLat = String(object.lat())
  //   let newLng = String(object.lng())
  //   newLat = (newLat.length > 6) ? = parseFloat(newLat.substring(0,6)) : parseFloat(newLat);
  //   newLng = (newLng.length > 6) ? = parseFloat(newLng.substring(0,6)) : parseFloat(newLng);
  //   return (({
  //   lat: newLat,
  //   lng: newLng
  //   })
  // )
  // })

  // Each JS object in the array has 2 functions, lat & lng. Run them to return the actual coords
  parseCoords = array => array.map(object => ({
    lat: parseFloat(object.lat().toFixed(3)),
    lng: parseFloat(object.lng().toFixed(3))
    })
  )


  getPolyCoordinates(data) {
    const coords = this.parseCoords(data);
    // console.log(coords[0].lat.toFixed(3))
    // const test = this.parseCood(coords[0])
    // console.log("TEST", test)
    this.setState({
      polylineCoordinates: coords
    });
    console.log("coords in App", coords)
  }
  
  renderSwitch = () => {
      // console.log("render switch")
    switch (this.state.activatedUI) {
        case 0:
          return <ContentBlock key={0} 
            onRouteUpdate={this.onRouteUpdate.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
          />;
        case 1:
          return <JourneyPlanner key={1} 
            getPolyCoordinates={this.getPolyCoordinates.bind(this)}
          />;
        case 2:
          return <Example key={2} />;
        default:
          return <div key={3} />;
      }
    }
    // return <div>{chosenElement}</div>;
  

  render() {
    return (
      <Grid fluid={true} className="Grid">
        <Row>
          <Col md={4}>
            <ContentHeader />
            <CustomNavbar swapUI={this.swapUI.bind(this)}/>
            {this.renderSwitch()}
          </Col>
          <Col xsHidden md={8}>
            <MapContainer selectedStops={this.state.selectedJourney}
              polylineCoordinates={this.state.polylineCoordinates} />
          </Col>
        </Row>
             <Row>
           <Col smHidden mdHidden lgHidden >
              <MapContainer selectedStops={ this.state.selectedJourney}
                polylineCoordinates={this.state.polylineCoordinates}
              />
            </Col>
           
        </Row>
      </Grid>
    );
  }
}

export default App;

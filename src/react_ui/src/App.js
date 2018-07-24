import React, { Component } from "react";
import { Grid, Row, Col, Clearfix } from "react-bootstrap";
import "./App.css";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import Example from "./components/examples/Example";
import CustomNavbar from './components/CustomNavbar';
import ContentHeader from './components/ContentHeader';

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
          return <Example key={2} />;
        default:
          return <div key={3} />;
      }
    // return <div>{chosenElement}</div>;
  }


  // componentDidUpdate(prevState) {
  //   if (prevState.selectedJourney === []) {
  //     const stops = this.state.stopsInRoute
  //     this.setState({
  //       selectedJourney: stops
  //     })
  //   }
  // }
  render() {
    // var StatesField = require('./components/StatesField').StatesField;
    // const myMarker = [{'stop_id': 1089, 'stop_lat': 53.3518, 'stop_lon': -6.2814}]
    // const searchNames = ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Hobart'];
    return (
      <Grid fluid={true} className="Grid">
        <Row>
          <Col xsHidden md={4}>
            <ContentHeader />
            <CustomNavbar swapUI={this.swapUI.bind(this)}/>
            {this.renderSwitch()}
            {/* <ContentBlock
              data={this.state.testState}
              onRouteUpdate={this.onRouteUpdate.bind(this)}
              onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            /> */}
          </Col>
          <Col xsHidden md={8}>
            <MapContainer selectedStops={this.state.selectedJourney} />
          </Col>
        </Row>
        {/*      <Row>
           <Col mdHidden lgHidden ><ContentBlock data={this.state.testState} 
                            onRouteUpdate={this.onRouteUpdate.bind(this)}
                            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}   />
              <MapContainer selectedStops={ this.state.selectedJourney}/>
            </Col>
           
        </Row> */}
      </Grid>
    );
  }
}

export default App;

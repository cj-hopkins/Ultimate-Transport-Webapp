import React, { Component } from "react"
import { Grid, Row, Col, Container } from "react-bootstrap";
import  OpenWeatherMap  from "react-weather";
import  ReactWeather  from "react-open-weather";
import TimePicker from "react-bootstrap-time-picker";
import "./App.css"
import MapContainer from "./components/MapContainer"
// import DropdownInput from 'react-dropdown-input';
// import Select from 'react-select';
import ContentBlock from "./components/ContentBlock"

require("bootstrap/dist/css/bootstrap.css")
require("react-select/dist/react-select.css")

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedStops: [],
      selectedJourney: {}
    }
  }

  onRouteUpdate(data) {
    this.setState({
      selectedStops: data
    })
  }

  onSelectedJourneyUpdate(data) {
    this.setState({
      selectedJourney: data
    })
    console.log(data)
  }

  render() {
    // var StatesField = require('./components/StatesField').StatesField;
    // const myMarker = [{'stop_id': 1089, 'stop_lat': 53.3518, 'stop_lon': -6.2814}]
    // const searchNames = ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Hobart'];
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={5} md={4} mdPull={0}>
              <ContentBlock data={this.state.testState} onRouteUpdate={this.onRouteUpdate.bind(this)}
                onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}/>
            </Col><Col xs={20} md={20}  mdPush={4}>
              <MapContainer selectedStops={ this.state.selectedStops }/>
            </Col>
          </Row>
        </Grid>
	
        {/*<ReactWeather forecast="today" apikey="70ef396e3ce3949e0934b4428e41f453" type="city" city="Dublin"/>
 	<OpenWeatherMap city="Dublin" country="IRL" appid="70ef396e3ce3949e0934b4428e41f453"/> */}
      </div>

    )
  }
}

export default App

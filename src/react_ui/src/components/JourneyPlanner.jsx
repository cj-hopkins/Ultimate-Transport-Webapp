import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";

class JourneyPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin={}&destination={}&mode=transit&transit_mode=bus&key=AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q'
    return (
      <div>
        <h3> Start </h3>
        <LocationSearchInput value="test"/>
        <h3> Finish</h3>
        <LocationSearchInput />
      </div>
    );
  }
}

export default JourneyPlanner;

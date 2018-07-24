import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";

class JourneyPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
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

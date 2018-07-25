import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";

class JourneyPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: '',
      destination: ''
    };
  }

  onChangeAddress1(address1)
  {
    this.setState({ origin: address1 })
  };

  onChangeAddress2(address2)
  {
    this.setState({ destination: address2 })
  };

  render() {
    const apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + this.state.origin + '&destination=' + this.state.destination + '&mode=transit&transit_mode=bus&key=AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q'
    return (
      <div>
        <LocationSearchInput 
            value1={this.state.origin}
            value2={this.state.destination}
            onChangeAddress1={this.onChangeAddress1.bind(this)}
            onChangeAddress2={this.onChangeAddress2.bind(this)}
        />
      </div>
    );
  }
}

export default JourneyPlanner;

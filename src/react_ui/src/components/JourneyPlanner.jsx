import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";

class JourneyPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: "",
      destination: "",
      originLatLng: null,
      destinationLatLng: null
    };
  }

  onChangeAddress1(address1) {
    this.setState({ origin: address1 });
  }

  onChangeAddress2(address2) {
    this.setState({ destination: address2 });
  }

  getOriginGeolocation(latLng) {
    this.setState({
      originLatLng: latLng
    });
  }

  getDestinationGeolocation(latLng) {
    this.setState({
      destinationLatLng: latLng
    });
  }

  onClick = () => {
    const google = window.google
    const directionsService = new google.maps.DirectionsService();
    const start = new google.maps.LatLng(this.state.originLatLng.lat, this.state.originLatLng.lng)
    const end = new google.maps.LatLng(this.state.destinationLatLng.lat, this.state.destinationLatLng.lng)
    var request = {
      origin: start,
      destination: end,
      travelMode: 'TRANSIT',
      transitOptions: {
        // departureTime: new Date(1337675679473),
        modes: ['BUS'],
        routingPreference: 'FEWER_TRANSFERS'
      }
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        // directionsDisplay.setDirections(result);
        console.log(result)
      }
    });

  
      // const origin = `${this.state.originLatLng.lat},${this.state.originLatLng.lng}`
      // const destination = `${this.state.destinationLatLng.lat},${this.state.destinationLatLng.lng}`
      // const apiRequest =
      //   `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}
      //   &destination=${destination}
      //   &mode=transit&transit_mode=bus&key=AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q`;
      // fetch(apiRequest)
      // .then(resp => console.log(resp.json()))
  }

  // componentWillUpdate(nextState) {
  //   if (
  //     (nextState.originLatLng !== null &&
  //       nextState.originLatLng !== this.state.originLatLng) ||
  //     (nextState.destinationLatLng !== null &&
  //       nextState.destinationLatLng !== this.state.destinationLatLng)
  //   ) {
  //     const origin = `${this.state.originLatlng.lat},${this.state.originLatLng.lng}`
  //     const destination = `${this.state.destinationLatlng.lat},${this.state.destinationLatLng.lng}`
  //     const apiRequest =
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}
  //       &destination=${destination}
  //       &mode=transit&transit_mode=bus&key=AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q`;
  //     fetch(apiRequest)
  //     .then(resp => console.log(resp.json()))
  //   }
  // }

  render() {
    const apiRequest =
      "https://maps.googleapis.com/maps/api/directions/json?origin=" +
      this.state.origin +
      "&destination=" +
      this.state.destination +
      "&mode=transit&transit_mode=bus&key=AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q";
    return (
      <div>
        <LocationSearchInput
          value1={this.state.origin}
          value2={this.state.destination}
          onChangeAddress1={this.onChangeAddress1.bind(this)}
          onChangeAddress2={this.onChangeAddress2.bind(this)}
          getOriginGeolocation={this.getOriginGeolocation.bind(this)}
          getDestinationGeolocation={this.getDestinationGeolocation.bind(this)}
        />
        <button onClick={this.onClick}>TEST</button>
      </div>
    );
  }
}

export default JourneyPlanner;

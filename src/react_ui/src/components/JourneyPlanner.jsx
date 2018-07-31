import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";
import {Collapse} from 'react-collapse';
import { Button } from 'react-bootstrap';

class JourneyPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: "",
      destination: "",
      originLatLng: null,
      destinationLatLng: null,
      // directionsObject: null,
      possibleRoutes: []
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

  getDirectionsObject(obj) {
    this.setState({
      directionsObject: obj
    });
  }

  onClick() {
    const google = window.google;
    const directionsService = new google.maps.DirectionsService();
    const start = new google.maps.LatLng(
      this.state.originLatLng.lat,
      this.state.originLatLng.lng
    );
    const end = new google.maps.LatLng(
      this.state.destinationLatLng.lat,
      this.state.destinationLatLng.lng
    );
    const request = {
      origin: start,
      destination: end,
      travelMode: "TRANSIT",
      provideRouteAlternatives: true,
      transitOptions: {
        // departureTime: new Date(1337675679473),
        modes: ["BUS"],
        routingPreference: "FEWER_TRANSFERS"
      }
    };
    // Save the current context, as "this" will refer to the callback function
    // when we want to use setState
    const me = this;
    directionsService.route(request, (result, status) => {
      if (status == "OK") {
        // const routes = me.parseAllJournies(result, me.parseSingleJourney)
        // console.log("ROUTES", routes)
        me.setState({
          directionsObject: result,
          // possibleRoutes: routes
        });
        console.log(result);
        // me.parseJourneys(result);
      }
    });
  }

  selectRoute = (key) => {
    console.log(key)
    this.setState({
      selectedRoute: key
    })
    const google = window.google;
    const polyline = new google.maps.Polyline({
      path: [],
      strokeColor: '#0000FF',
      strokeWeight: 3
    });
    const route = this.state.directionsObject.routes[key].legs[0].steps;
    let coordinates = []
    for (let i = 0; i < route.length; i++) {
      let nextSegment = route[i].path;
      for (let j = 0; j < nextSegment.length; j++) {
        coordinates.push(nextSegment[j])
        // polyline.getPath().push(nextSegment[j])
      }
    }
    // const parser = array => array.reduce((item, acc) => acc.push({lat: item.lat(), lng: item.lng()}), []);
    // const coords = parser(data);

    // console.log(coords)
    console.log("POLY", polyline)
    console.log("PATH", polyline.latLngs.b[0].b)
    console.log(coordinates)
    this.props.getPolyCoordinates(coordinates)
    const journeyObject = this.state.directionsObject.routes[key].legs[0].steps
      .filter(item => item.travel_mode === 'TRANSIT')
      // .map(item => {name: item.transit.line.short_name})
      .map(item => ({
        route: item.transit.line.short_name,
        stops: item.transit.num_stops,
        start: item.transit.departure_stop,
        finish: item.transit.arrival_stop
        })
      );
    console.log(journeyObject)
  }

  parseSingleJourney = (journey, index) => {
    // console.log(journey)
    return (
      <div>
      <Button onClick={() => this.selectRoute(index)}>route</Button>
      {/* <Button onClick={this.setState({selectedRoute: index})}>route</Button> */}
      <Collapse isOpened={(this.state.selectedRoute === index) ? true : false} onClick={this.isOpened = !this.isOpened}>
      <div>
        {journey.legs[0].steps.map(item => {
          const routeName = (item.travel_mode === 'TRANSIT') ? item.transit.line.short_name : null
          return <p>{item.instructions} {routeName}</p>
        })}
        </div>
      </Collapse>
      </div>
    )}

  parseAllJournies = (object, fn) => {if (object !== undefined) return object.routes.map((item, index) => fn(item, index))}

  // parseJourneys(result) {
  //   if (result === undefined) return;
  //   console.log(result.routes[0].legs[0].steps[0].instructions);
  //   return;

  //   const routes = this.parseAllJournies(result, this.parseSingleJourney)
  //   console.log(routes);
  //   // return routes
  //   this.setState({ possibleRoutes: routes });
  //   console.log(result);
  // }

  // componentWillUpdate(nextState) {
  //   if (
  //     (nextState.originLatLng !== null &&
  //       nextState.originLatLng !== this.state.originLatLng) ||
  //     (nextState.destinationLatLng !== null &&
  //       nextState.destinationLatLng !== this.state.destinationLatLng)
  //   ) {

  render() {
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
        <button onClick={this.onClick.bind(this)}>TEST</button>
        {/* <p>{this.parseJourney}</p> */}
        {/* {this.state.possibleRoutes.map(route => {
          <h1>route</h1>
          {route}
        })} */}
        {this.parseAllJournies(this.state.directionsObject, this.parseSingleJourney)}
      </div>
    );
  }
}

export default JourneyPlanner;

import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";
import {Collapse} from 'react-collapse';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import ScrollArea from 'react-scrollbar';

class JourneyPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: null,
      destination: null,
      originLatLng: null,
      destinationLatLng: null,
      // directionsObject: null,
      possibleRoutes: [],
      selectedRoute: null,
      busStart: null,
      busFinish: null,
      prediction: "",
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

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.originLatLng !== null && this.state.destinationLatLng !== null) &&
      (this.state.originLatLng !== prevState.originLatLng || this.state.destinationLatLng !== prevState.destinationLatLng)
    ) {
        this.setState({directionsObject: undefined, selectedRoute: null})
        this.makeDirectionsRequest()
    } else if (this.state.originLatLng !== prevState.originLatLng || this.state.destinationLatLng !== prevState.destinationLatLng) {
        this.setState({directionsObject: undefined, selectedRoute: null})
        this.props.getPolyCoordinates([])
    }
  }

  makeDirectionsRequest = () => {
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
        modes: ["BUS"],
        routingPreference: "FEWER_TRANSFERS"
      }
    };
    // Save the current context, as "this" will refer to the callback function
    // when we want to use setState
    const me = this;
    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        me.setState({
          directionsObject: result,
        });
        console.log("DIRECTIONS OBJECT", result)
      }
    });
  }

  selectRoute = (key) => {
    this.setState({
      selectedRoute: key
    })
    const route = this.state.directionsObject.routes[key].legs[0].steps;
    console.log("hi",route)
    const busPoints =[]
    for (var i =0; i < route.length; i++){
      console.log(route[i])
      if (route[i].travel_mode==="TRANSIT"){
        busPoints.push({lat:route[i].transit.arrival_stop.location.lat(), lng: route[i].transit.arrival_stop.location.lng(), name: route[i].transit.arrival_stop.name})
        busPoints.push({lat:route[i].transit.departure_stop.location.lat(), lng: route[i].transit.departure_stop.location.lng(), name: route[i].transit.departure_stop.name})
      }
    }
    console.log(busPoints,"hi")
    let coordinates = []

    for (let i = 0; i < route.length; i++) {
      let nextSegment = route[i].path;
      for (let j = 0; j < nextSegment.length; j++) {
        coordinates.push(nextSegment[j])
      }
    }
    // const parser = array => array.reduce((item, acc) => acc.push({lat: item.lat(), lng: item.lng()}), []);
    // const coords = parser(data);
    this.props.getBusCoords(busPoints)
    this.props.getPolyCoordinates(coordinates)
    this.getMultiRoutePrediction(key)

    for (let i = 0; i < route.length; i++) {
      if (route[i].travel_mode === 'TRANSIT') {
        let startStop = {
          lat: route[i].transit.departure_stop.location.lat(),
          lng: route[i].transit.departure_stop.location.lng()
        }
        let finishStop = {
          lat: route[i].transit.arrival_stop.location.lat(),
          lng: route[i].transit.arrival_stop.location.lng()
        }
        console.log("ROUTE", route[i].transit.line.short_name)
        console.log("DEPART", startStop, route[i].transit.departure_stop.name);
        console.log("ARRIVE", finishStop);
      }
    }
  }

  getMultiRoutePrediction = chosenRouteKey => {
  //  let startStop = {
  //         lat: route[i].transit.departure_stop.location.lat(),
  //         lng: route[i].transit.departure_stop.location.lng()
  //       }
  //   let finishStop = {
  //     lat: route[i].transit.arrival_stop.location.lat(),
  //     lng: route[i].transit.arrival_stop.location.lng()
  //   } 
    const endpoint = '/api/getMultiRoutePrediction' 
    const journeyObject = this.state.directionsObject.routes[chosenRouteKey].legs[0].steps
      .filter(item => item.travel_mode === 'TRANSIT')
      .map(item => ({
        route: item.transit.line.short_name,
        stops: item.transit.num_stops,
        headsign: item.transit.headsign,
        start: {
          lat: item.transit.departure_stop.location.lat(),
          lng: item.transit.departure_stop.location.lng()
        },
        finish: {
          lat: item.transit.arrival_stop.location.lat(),
          lng: item.transit.arrival_stop.location.lng()
        }
        })
      );
      console.log(journeyObject)

    try {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          'busRoutes': journeyObject,
          'isDefaultTime': true,
          'direction': 'I'
        })
      })
        .then((response) => response.json())
        // .then((resp) => {
        //   const prediction = resp.prediction
        //   this.setState({
        //     predictionForJourney: prediction
        //   })
        // })
        .then((resp) => {
          const prediction = resp.prediction
          this.setState({
            prediction: prediction
          })
        })
    } catch(e) {
        console.log(e)
      }
    console.log(journeyObject)
  }
  escapeRegExp(str) {
    var regex = /<[^>]*>/g
    var reg2= "&nbsp;"
    return str.replace(regex, " ").replace(reg2, "");
  }


  parseSingleJourney = (journey, index) => {
    // console.log(journey)
    return (
    
     <div>
     <Button data-tip='Select a route to take' style={{padding: '5px', margin: '5px', marginLeft:'5%'}} bsStyle="primary" onClick={() => this.selectRoute(index)}>{'Journey ' + (index+1)}</Button>
<ReactTooltip />
      {/* <Button onClick={this.setState({selectedRoute: index})}>route</Button> */}
      <Collapse style={{ border: '1px solid rgba(192,192,192, .5)', borderRadius: '5px', fontSize: '16px', color: '#606060'}} isOpened={(this.state.selectedRoute === index) ? true : false} onClick={this.isOpened = !this.isOpened}>
       <ScrollArea style={{maxHeight:'100px'}}>
        {journey.legs[0].steps.map(item => {
          const routeName = (item.travel_mode === 'TRANSIT') ? item.transit.line.short_name : null
          const instructions = []
          if (item.travel_mode === 'TRANSIT'){
            var prediction = (this.state.prediction==="") ? this.state.prediction : " (" +  this.state.prediction + ")"
            instructions.push(<p style={{textAlign:'left'}}>{"Take route number " + routeName + ", towards " + item.transit.headsign + " for "+ item.transit.num_stops  + " stops" + prediction}</p>)
            instructions.push(<p style={{textAlign:'left'}}>{"Get off at "+item.transit.arrival_stop.name}</p>)
            } 
          else if (item.steps.length[0] !== undefined) {
            for(var i=0; i<item.steps.length;i++){
                instructions.push(<p style={{textAlign:'left'}}>{this.escapeRegExp(item.steps[i].instructions) + "(" + item.steps[i].distance.text + "/ "+ item.steps[i].duration.text + " walk)"}</p>)
            }} 
          return instructions
          
        })}
        </ScrollArea>
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

  componentWillMount() {
    this.props.onSelectedJourneyUpdate([])
  }
  render() {
    return (
      <div style={{minHeight:'50%', maxHeight:'90%'}} >
        <LocationSearchInput
          value1={this.state.origin}
          value2={this.state.destination}
          onChangeAddress1={this.onChangeAddress1.bind(this)}
          onChangeAddress2={this.onChangeAddress2.bind(this)}
          getOriginGeolocation={this.getOriginGeolocation.bind(this)}
          getDestinationGeolocation={this.getDestinationGeolocation.bind(this)}
          currentPosition={this.props.currentPosition}
        />
        {/* <button onClick={this.onClick.bind(this)}>TEST</button> */}
        {/* <p>{this.parseJourney}</p> */}
        {/* {this.state.possibleRoutes.map(route => {
          <h1>route</h1>
          {route}
        })} */}
        <div style={{marginTop: '2em'}}> </div>
        {this.parseAllJournies(this.state.directionsObject, this.parseSingleJourney)}
        <div style={{marginTop: '2em'}}> </div>
      </div>
    );
  }
}

export default JourneyPlanner;

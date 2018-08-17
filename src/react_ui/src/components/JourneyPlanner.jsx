import React, { Component } from "react";
import LocationSearchInput from "./LocationSearchInput";
import {Collapse} from 'react-collapse';
import { Button } from 'react-bootstrap';
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
      (this.state.originLatLng !== prevState.originLatLng || this.state.destinationLatLng !== 
       prevState.destinationLatLng)
    ) {
        this.setState({directionsObject: undefined, selectedRoute: null})
        this.makeDirectionsRequest()
    } else if (this.state.originLatLng !== prevState.originLatLng || this.state.destinationLatLng
               !== prevState.destinationLatLng) {
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
        busPoints.push({lat:route[i].transit.arrival_stop.location.lat(), 
                        lng: route[i].transit.arrival_stop.location.lng(), 
                        name: route[i].transit.arrival_stop.name})
          busPoints.push({lat:route[i].transit.departure_stop.location.lat(),
                        lng: route[i].transit.departure_stop.location.lng(), 
                        name: route[i].transit.departure_stop.name})
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
        .then((resp) => {
          const prediction = Math.round(resp.prediction)
          this.setState({
            prediction: prediction
          })
        })
      .catch(error => console.log(error))
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
    var walkingTime = 0
    const numberPattern = /\d+/g;
    return (
     <div>
     <Button data-tip='Select a route to take' style={{padding: '5px', margin: '5px', marginLeft:'5%'}}
         bsStyle="primary" onClick={() => this.selectRoute(index)}>{'Journey ' + (index+1)}</Button>
<ReactTooltip />
      <Collapse style={{ border: '1px solid rgba(192,192,192, .5)', borderRadius: '5px', fontSize: '16px',
                    color: '#606060'}} isOpened={(this.state.selectedRoute === index) ? true : false} 
                    onClick={this.isOpened = !this.isOpened}>
       <ScrollArea style={{maxHeight:'100px'}}>
        {journey.legs[0].steps.map(item => {
          const routeName = (item.travel_mode === 'TRANSIT') ? item.transit.line.short_name : null
          const instructions = []
          if (item.travel_mode === 'TRANSIT'){
            instructions.push(<p style={{textAlign:'left'}}>{"Take route number " + routeName + ", towards " 
                        + item.transit.headsign + " for "+ item.transit.num_stops  + " stops"}</p>)
            instructions.push(<p style={{textAlign:'left'}}>{"Get off at "+item.transit.arrival_stop.name}
                </p>)
            } 
          else if (item.steps !== undefined) {
            for(var i=0; i<item.steps.length;i++){
                var walking= item.steps[i].duration.text
                walkingTime+= parseInt(walking.match(numberPattern))
                instructions.push(<p style={{textAlign:'left'}}>{this.escapeRegExp(item.steps[i].instructions)
                            + "(" + item.steps[i].distance.text + ")"}</p>)
            }} 
          return instructions
          
        })}
        <p style={{textAlign:'left'}}>{"Total travel time: "+ (this.state.prediction +  walkingTime)
                +" minutes"}</p>
        </ScrollArea>
      </Collapse>
      </div>
    )}

  parseAllJournies = (object, fn) => {if (object !== undefined) return object.routes.map((item, index) => 
                                                                                         fn(item, index))}

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
        <div style={{marginTop: '2em'}}> </div>
        {this.parseAllJournies(this.state.directionsObject, this.parseSingleJourney)}
        <div style={{marginTop: '2em'}}> </div>
      </div>
    );
  }
}

export default JourneyPlanner;

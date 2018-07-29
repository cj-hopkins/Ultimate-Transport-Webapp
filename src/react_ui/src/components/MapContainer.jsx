import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from "google-maps-react";
import db2 from './db2.png'
import MapMarker from './MapMarker.png'


export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPlace: {},
      showingInfoWindow: false,
      activeMarker: {},
      currentPosition: { //dublin city centre co-ordinates 
        lat: 53.3498,
        lng: -6.2603
      },
      nextBus1:{
        route:0,
        dueTime:0, 
        destination:''
      }
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

async componentWillMount() {
    const apiKey = "AIzaSyAhsVJ4JtBv4r532Hns_zR7PeT_1jEX468";
    const endpoint = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
   
    try {
      fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          homeMobileCountryCode: 353
        })
      })
        .then(response => response.json())
        .then(resp => {
          // console.log(resp);
          this.setState({
            currentPosition: {
              lat: resp.location.lat,
              lng: resp.location.lng
            }
          });
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  fetchRealTime(stopid){
    const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
            console.log(parsedJSON.results)
            this.setState({
            nextBus1: {
              route: parsedJSON.results[0].route , 
              dueTime:parsedJSON.results[0].duetime ,
              destination:parsedJSON.results[0].destination ,
            }
          });
          console.log('BUS ROUTE:',this.state.nextBus1.route );  
    })
    
      .catch(error => console.log('parsing failed',error))
  }
  
  onMarkerClick(props, marker, e) {
//     console.log('PROPS: ',props)
    // console.log(marker)
    // console.log(e)
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    const realTime = this.fetchRealTime(this.state.activeMarker.title);
    
     console.log(realTime);
    console.log('STOP NUM', this.state.activeMarker.title);
  }

  render() {
    const google = window.google
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={12}
          gestureHandling={'cooperative'}
          initialCenter={{
            lat: 53.3151123,
            lng: -6.2480198
          }}
        >
          <Marker
            onClick={this.onMarkerClick}
            name={"Current location"}
            position={{
              lat: this.state.currentPosition.lat,
              lng: this.state.currentPosition.lng
            }}
            icon={{
              url: MapMarker,
              anchor: new google.maps.Point(32, 32),
              scaledSize: new google.maps.Size(64, 64)
            }}
          />

          {this.props.selectedStops.map(item => (
            <Marker
              icon={db2}
              key={item.identifier}
              onClick={this.onMarkerClick}
              title={item.stop_id.toString()}
              name={item.location_text.concat(" ", item.address)}
              position={{ lat: item.stop_lat, lng: item.stop_lon }}
            />
          ))}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h1>Stop {this.state.activeMarker.title}</h1>
              <p>{this.state.activeMarker.name}</p>
               <p>Real time Information:</p>
              <p>Route:{this.state.nextBus1.route}&nbsp;&nbsp;&nbsp;&nbsp;
                {this.state.nextBus1.destination}&nbsp;&nbsp;&nbsp;&nbsp;
                {this.state.nextBus1.dueTime} minutes</p>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q"
})(MapContainer);

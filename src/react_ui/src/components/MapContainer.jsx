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
      currentPosition: {
        lat: 53.3498,
        lng: -6.2603
      }
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  // componentWillMount() {
  //   // this.setState({
  //   //   selectedStops: this.props.selectedStops
  //   // })
  //   console.log(this.props.currentPosition)
  // }

async componentWillMount() {
    const apiKey = "AIzaSyAhsVJ4JtBv4r532Hns_zR7PeT_1jEX468";
    const endpoint = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
    try {
      // const result = fetch(endpoint, {
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
      // .then((resp) => console.log(resp.prediction))
    } catch (e) {
      console.log(e);
    }
  }

  onMarkerClick(props, marker, e) {
    // console.log(props)
    // console.log(marker)
    // console.log(e)
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    const im = "https://www.robotwoods.com/dev/misc/bluecircle.png";
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
          {/* <Marker onClick={this.onMarkerClick}
            name={"Current location"} /> */}
          <Marker
            onClick={this.onMarkerClick}
            name={"Current location"}
            // position={this.props.currentPosition} />
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

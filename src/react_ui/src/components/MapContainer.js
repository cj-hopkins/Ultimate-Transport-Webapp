import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


export class MapContainer extends Component {
  constructor(props){
    super(props);

    this.state = {
    selectedPlace: {},
    showingInfoWindow: false,
    activeMarker: {},
    }

    this.onMarkerClick = this.onMarkerClick.bind(this)
  }

  onMarkerClick(props, marker, e){
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    return (
      <div>
      <Map google={this.props.google} 
        zoom={14}
        initialCenter={{
                lat: 53.3498,
                lng: -6.2603
              }} >

        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>

      </Map>
    </div>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: "AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q"
})(MapContainer)

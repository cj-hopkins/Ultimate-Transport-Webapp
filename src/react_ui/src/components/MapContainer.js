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

  // componentWillMount() {
  //   this.setState({
  //     selectedStops: this.props.selectedStops
  //   })
  // }

  onMarkerClick(props, marker, e){
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
    // console.log(this.state.chosenRoute)
    // console.log(this.state.selectedStops)
    console.log("rendering map!")
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

          {this.props.selectedStops.map(item => (
            <Marker
              key={item.identifier}
              onClick={this.onMarkerClick}
              title={item.stop_id.stringify}
              name={item.stop_id}
              position={{lat: item.stop_lat, lng: item.stop_lon}} />
          ))}

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

import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from "google-maps-react";
import db2 from './db2.png'
import MapMarker from './MapMarker.png'


export class MapContainer extends Component {
  constructor(props){
    super(props)

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
    })
  }

  render() {
    // console.log(this.state.chosenRoute)
    // console.log(this.state.selectedStops)
    // console.log("rendering map!")
    return (
      <div>
        <Map google={this.props.google} 
          zoom={12}
          gestureHandling={'cooperative'}
          initialCenter={{
            lat: 53.3498,
            lng: -6.2603
          }} >

          <Marker onClick={this.onMarkerClick}
            name={"Current location"} icon={MapMarker}/>

          {this.props.selectedStops.map(item => (
            <Marker
              icon={db2}
              key={item.identifier}
              onClick={this.onMarkerClick}
              title={item.stop_id.toString()}
              name={item.location_text.concat(" ", item.address)}
              position={{lat: item.stop_lat, lng: item.stop_lon}} />
          ))}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            <div>
              <h1>Stop {this.state.activeMarker.title}</h1>
              <p>{this.state.activeMarker.name}</p>
            </div>
          </InfoWindow>

        </Map>
      </div>
    )
  }
}
 
export default GoogleApiWrapper({
  apiKey: "AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q"
})(MapContainer)

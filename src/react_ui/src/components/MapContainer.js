import React, { Component } from "react";
import {Map, Polyline, InfoWindow, Marker, GoogleApiWrapper} from "google-maps-react";
import db2 from './db2.png';


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
    const polyPath = [
      {lat: 53.3498, lng: -6.2603},
      {lat: 53.3492, lng: -6.2609},
      {lat: 53.3486, lng: -6.2619},
      {lat: 53.3272, lng: -6.2629}
    ];

    return (
      <div>
        <Map google={this.props.google} 
          zoom={12}
          initialCenter={{
            lat: 53.3498,
            lng: -6.2603
          }}
          styles={[
                 {
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#f5f5f5"
                  },
                  {
                    "saturation": 100
                  }
                ]
              },
              {
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#616161"
                  }
                ]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#f5f5f5"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#bdbdbd"
                  }
                ]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#bababa"
                  }
                ]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#72f894"
                  },
                  {
                    "saturation": -80
                  }
                ]
              },
              {
                "featureType": "poi",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#757575"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#e5e5e5"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#72f894"
                  },
                  {
                    "saturation": -65
                  },
                  {
                    "lightness": -15
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9e9e9e"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#ffffff"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#757575"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#dadada"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#616161"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9e9e9e"
                  }
                ]
              },
              {
                "featureType": "transit",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#e5e5e5"
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#eeeeee"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#c9c9c9"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#aec4f9"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9e9e9e"
                  }
                ]
              }
            ]} >

          <Marker onClick={this.onMarkerClick}
            name={"Current location"} />

          {this.props.selectedStops.map(item => (
            <Marker

              key={item.identifier}
              onClick={this.onMarkerClick}
              title={item.stop_id.toString()}
              name={item.location_text.concat(" ", item.address)}
              position={{lat: item.stop_lat, lng: item.stop_lon}}
              icon={{url: db2}} />

          ))}
              
          <Polyline 
            path = {polyPath}
            options={{
                strokeColor: '#0000ff',
                strokeOpacity: 1,
                strokeWeight: 6,
                icons: [{
                    offset: '0',
                    repeat: '10px'
                }],
            }}
          />

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

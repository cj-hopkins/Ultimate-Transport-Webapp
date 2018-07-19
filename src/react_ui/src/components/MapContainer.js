import React, { Component } from "react";
import {Map, Polyline, InfoWindow, Marker, GoogleApiWrapper} from "google-maps-react";
import db2 from './db2.png';
import MapMarker from './MapMarker.png'

export class MapContainer extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedPlace: {},
      showingInfoWindow: false,
      activeMarker: {},
      currentLocation: {lat: 53.3498,
      lng: -6.2603}
    }

    this.onRecenter = this.onRecenter.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
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

  onRecenter(mapProps, map) {
    this.setState({
      currentLocation: {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng()
      }
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
          centerAroundCurrentLocation= {true}
          onRecenter={this.onRecenter}
          zoom={12}
          styles={[
  {
    "stylers": [
      {
        "saturation": 0
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "stylers": [
      {
        "color": "#f7f7f7"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#5bb631"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#b7b7b7"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#99d743"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#9dde47"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#96beb5"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#96beb5"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f7cd3a"
      }
    ]
  },
  {
    "featureType": "transit.station.rail",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#6c99f7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4a99ff"
      }
    ]
  }
]} >        

          <Marker onClick={this.onMarkerClick}
            name={"Current location"} 
            icon={MapMarker}
            position={this.state.currentLocation}
            />

          {this.props.selectedStops.map(item => (
            <Marker
              animation={this.props.google.maps.Animation.DROP}
              key={item.identifier}
              onClick={this.onMarkerClick}
              title={item.stop_id.toString()}
              name={item.location_text.concat(" ", item.address)}
              position={{lat: item.stop_lat, lng: item.stop_lon}}
              icon={{url: db2}} />

          ))}

           <Polyline 
            //path= {polyPath}
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

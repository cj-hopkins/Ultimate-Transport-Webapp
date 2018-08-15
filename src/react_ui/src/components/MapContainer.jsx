import React, { Component } from "react";
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Polyline
} from "google-maps-react";
import db2 from "./db2.png";
import MapMarker from "./MapMarker.png";
import ReactTooltip from 'react-tooltip'
import CustomGeolocation from './Geolocation';
import A from './green_MarkerA.png';
import B from './red_MarkerB.png';
import red from './redStop.png';
import green from './greenStop.png';


export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlace: {},
      showingInfoWindow: false,
      activeMarker: {},
      currentPosition: {
        //dublin city centre co-ordinates
        lat: 53.3498,
        lng: -6.2603
      },
      nextBuses: [],
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }
  

  // async componentWillMount() {
  //   const apiKey = "AIzaSyAhsVJ4JtBv4r532Hns_zR7PeT_1jEX468";
  //   const endpoint = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
  //   try {
  //     fetch(endpoint, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         homeMobileCountryCode: 353
  //       })
  //     })
  //       .then(response => response.json())
  //       .then(resp => {
  //         this.setState({
  //           currentPosition: {
  //             lat: resp.location.lat,
  //             lng: resp.location.lng
  //           }
  //         });
  //       });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  fetchRealTime(stopid) {
    const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
    fetch(endpoint)
      .then(response => response.json())
      .then(parsedJSON => {
        //            console.log(parsedJSON.results)
        this.setState({
          //slice(0,4) to limit to top 4 results
          nextBuses: parsedJSON.results.slice(0, 4).map((post, i) => (
            <tr key={i}>
              <td>{post.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{post.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>{post.duetime} minute(s)</td>
            </tr>
          ))
        });
        console.log(this.state.nextBuses)
      })
      .catch(error => console.log("parsing failed", error));
  }

  onMarkerClick (props, marker, e){
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      nextBuses: this.fetchRealTime(marker.title)
    });

    //    console.log('selectedPlace',this.state.selectedPlace.title);
    //    console.log('activeMarker', this.state.activeMarker.title);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.polylineCoordinates !== this.state.polylineCoordinates) {
  //     this.setState({ polylineCoordinates: this.props.polylineCoordinates });
  //   }
  // }

  render() {
    if (!this.props.loaded) return <div>Loading...</div>;

    const endPoint = (this.props.polylineCoordinates.length < 1)? null: this.props.polylineCoordinates.length-1
    //console.log('endPoint')
    //console.log(endPoint)
    const google = window.google;
    return (
      <Map data-tip='Dublin'
        google={this.props.google}
        className="map"
        zoom={12}
        gestureHandling={"cooperative"}
        initialCenter={{
          lat: 53.3498,
          lng: -6.2603
        }}
      ><ReactTooltip />

        <CustomGeolocation onLocationUpdate={this.props.onLocationUpdate}/>

        <Polyline
          fillColor="#2979ff"
          fillOpacity={0.35}
          path={this.props.polylineCoordinates}
          strokeColor="#2979ff"
          // strokeOpacity={0.8}
          strokeWeight={3}
        />
        
        <Marker data-tip='You are here'
          name={"Current location"}
          // position={this.props.currentPosition} />
          position={{
            lat: this.props.currentPosition.lat,
            lng: this.props.currentPosition.lng
          }}
          icon={{
            url: MapMarker,
            anchor: new google.maps.Point(32, 32),
            scaledSize: new google.maps.Size(64, 64)
          }}
        /><ReactTooltip />
        {this.props.polylineCoordinates.length < 1? null:
        <Marker
          onClick={this.onMarkerClick}
          name={""}
          title="Start"
          position={{
            lat: this.props.polylineCoordinates[0].lat,
            lng: this.props.polylineCoordinates[0].lng
          }}
          icon={{
            url: A,
          }}
        />}
        {this.props.polylineCoordinates.length < 1? null:
        <Marker
          onClick={this.onMarkerClick}
          name=""
          title="End"
          position={{
            lat: this.props.polylineCoordinates[endPoint].lat,
            lng: this.props.polylineCoordinates[endPoint].lng
          }}
          icon={{
            url: B,
          }}
        />}
        {(this.props.polylineCoordinates.length < 1) ? null: 
        this.props.busCoords.map((item,i) => (
        (i<2)? 
        <Marker
            onClick={this.onMarkerClick}
            title="Bus Journey 1"
            name={item.name}
            icon={db2}
            position={{ lat: item.lat, lng: item.lng }}
          /> : (i<4) ? 
          <Marker
            onClick={this.onMarkerClick}
            title="Bus Journey 2"
            name={item.name}
            icon={green}
            position={{ lat: item.lat, lng: item.lng }}
          /> :<Marker
            onClick={this.onMarkerClick}
            title="Bus Journey 3"
            name={item.name}
            icon={red}
            position={{ lat: item.lat, lng: item.lng }}
          />  
        ))
        }



        {this.props.selectedStops.map((item,i) => (
          <Marker
            icon={i===0 ? A : i===(this.props.selectedStops.length-1)? B : db2} 
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
          {this.state.nextBuses===undefined ? null : (this.state.nextBuses.length===0) ? 
          <div><h1>{this.state.activeMarker.title}</h1>
            <p>Stop {this.state.activeMarker.name}</p>
            <p>No Real Time Information Currently Available</p></div> :
            <div><h1>Stop {this.state.activeMarker.title}</h1>
            <p>{this.state.activeMarker.name}</p>
            <p>Real Time Information:</p>
            <ul>
              <table>{this.state.nextBuses}</table>
            </ul></div>}
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBRUrdJ4Tz9rLrHrOkwJWpA9QSYNJbWQ0Q",
  libraries: ["places", "visualisation"]
})(MapContainer);

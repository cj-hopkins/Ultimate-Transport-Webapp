import React, { Component } from "react";
import { geolocated } from "react-geolocated";
import Geolocation from "react-geolocation";
import { Marker } from "google-maps-react";

class CustomGeolocation extends Component {
    constructor(props){
        super(props);
        this.state = {position: null}
    }

    // componentDidUpdate = () => {
    //     this.props.locationUpdate({currentPosition: this.state.position});
    // }

  render() {
    return !this.props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
    ) : !this.props.isGeolocationEnabled ? (
      <div>Geolocation is not enabled</div>
    ) : this.props.coords ? (
        // console.log(this.props.coords.longitude)


        this.setState({
            lat: this.props.coords.latitude,
            lon: this.props.coords.longitude
        })
    //   <Marker
    //     title={"Current location"}
    //     name={"CUrrent location"}
    //     position={{ lat: this.props.coords.latitude, lng: this.props.coords.longitude }}
    //   />
    ) : (
        <div></div>
      //   <table>
      //     <tbody>
      //       <tr>
      //         <td>latitude</td>
      //         <td>{this.props.coords.latitude}</td>
      //       </tr>
      //       <tr>
      //         <td>longitude</td>
      //         <td>{this.props.coords.longitude}</td>
      //       </tr>
      //       <tr>
      //         <td>altitude</td>
      //         <td>{this.props.coords.altitude}</td>
      //       </tr>
      //       <tr>
      //         <td>heading</td>
      //         <td>{this.props.coords.heading}</td>
      //       </tr>
      //       <tr>
      //         <td>speed</td>
      //         <td>{this.props.coords.speed}</td>
      //       </tr>
      //     </tbody>
      //   </table>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(CustomGeolocation);

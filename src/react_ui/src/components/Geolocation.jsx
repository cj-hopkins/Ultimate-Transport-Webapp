import React, { Component } from "react";
import { geolocated, geoPropTypes } from "react-geolocated";

class CustomGeolocation extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.coords !== this.props.coords && nextProps.coords !== undefined)
      this.props.onLocationUpdate(nextProps.coords);
  }

  render() {
    return <div />;
  }
}

CustomGeolocation.propTypes = {
  ...CustomGeolocation.propTypes,
  ...geoPropTypes
};

const config = {
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity
  },
  watchPosition: true,
  userDecisionTimeout: null,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation
};

export default geolocated(config)(CustomGeolocation);

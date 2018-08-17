import React, { Component } from "react";
import { Marker } from "google-maps-react";
import db2 from "./db2.png";

{/* Dispplays bus stops as map markers */}

export default class CustomMarker extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.route !== nextProps.route) return true;
    if (this.props.direction !== nextProps.direction) return true;
    return false;
  }
  render() {
    return (
      <Marker
        google={this.props.google}
        map={this.props.map}
        mapCenter={this.props.mapCenter}
        icon={db2}
        key={this.props.key}
        onClick={this.props.onClick}
        title={this.props.title}
        name={this.props.name}
        position={this.props.position}
      />
    );
  }
}

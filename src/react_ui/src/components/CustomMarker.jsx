import React, { Component } from "react";
import { Marker } from "google-maps-react";
import db2 from "./db2.png";

export default class CustomMarker extends Component {
  shouldComponentUpdate(nextProps) {
    console.log(this.props.renderKey, nextProps.renderKey);
    if (this.props.route !== nextProps.route) return true;
    if (this.props.direction !== nextProps.direction) return true;
    return false;
  }
  render() {
    console.log("rendering marker");
    console.log(this.props.title);
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

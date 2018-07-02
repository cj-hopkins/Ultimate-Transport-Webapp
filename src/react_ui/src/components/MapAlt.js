import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class Map extends React.Component {
  constructor(props){
    super(props);

    this.loadMap = this.loadMap.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevProps.google !== this.props.google) {
        console.log("map loading");
        this.loadMap();
      }
    }

  loadMap() {
   if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef); 

      let zoom = 14;
      let lat = 53.3498;
      let lng = -6.2603;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })

      this.map = new maps.Map(node, mapConfig);
    } 
  }

  render() {
    return (
      <div ref='map'>
      </div>
    )
  }
}
export default Map

import React, { Component } from 'react';
// import { Panel, Button, DropdownButton, MenuItem } from 'react-bootstrap';
// import { DropdownButton, MenuItem } from 'react-bootstrap';
// import MapContainer from './MapContainer';
import Select from 'react-select';

class RouteSelect extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      routes: [],
      chosenRoute: this.props.chosenRoute,
    }

  // this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect = (event) => {

    if (event === this.state.chosenRoute) {
      return;
    }
    else if (event === null) {
      this.props.onChosenRouteUpdate("Select Route")
      this.props.onRouteUpdate([])
      this.props.onSelectedJourneyUpdate([])
      return;
    }
    // console.log(event)
    // this.setState({
    //   chosenRoute: event.value
    // });
    // this.props.onRouteUpdate(event.value)
    this.props.onChosenRouteUpdate(event.value)
    this.getStopsForRoute(event.value, 'I')
  }


  getStopsForRoute = (routeName, direction) => {
    const endpoint = '/api/getStopsForRoute' 
    try {
      // const result = fetch(endpoint, {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          route: routeName,
          direction: direction,
        })
      })
        .then((response) => response.json())
        // .then(response => console.log(response))
        // onUpdate is a setState function in App.js
        // the state is updated with an array of stops
        // and then passed as a prop to MapContainer
        .then((resp) => this.props.onRouteUpdate(resp))
    } catch(e) {
        console.log(e)
      }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.chosenRoute !== this.props.chosenRoute) {
      this.getStopsForRoute(nextProps.chosenRoute)
    }
  }
  // async componentWillMount(){

  //   const endpoint = '/api/getAllRoutes';
  //   try {
  //     fetch(endpoint)
  //       .then(response => response.json())
  //         .then(routeNames => {
  //           this.setState({
  //             routes: routeNames
  //           });
  //           const routeItems = []
  //           {routeNames.forEach(item => (
  //             routeItems.push({value: item.route, label: item.route})
  //           ))}
  //           this.setState({routesAsOptions: routeItems})
  //           })
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

  async componentWillMount(){

    let routeNames
    const endpoint = '/api/getAllRoutes';
    try {
      const result = await fetch(endpoint)
      routeNames = await result.json();
      this.setState({
        routes: routeNames
      });
      // console.log(this.state.routes)
    } catch(e) {
      console.log(e);
    }

    const routeItems = []
    {routeNames.forEach(item => (
      routeItems.push({value: item.route, label: item.route})
    ))}
    this.setState({routesAsOptions: routeItems})
  }


  render() {
    return (
          <div>
            <Select
              id="routeSelect"
              name="form-field-name"
              options={this.state.routesAsOptions}
              value={this.state.chosenRoute}
              onChange={this.handleSelect}  
              placeholder={"Select route"}
        />
          </div>
            )}
    }

export default RouteSelect;

import React, { Component } from 'react';
// import { Panel, Button, DropdownButton, MenuItem } from 'react-bootstrap';
// import { DropdownButton, MenuItem } from 'react-bootstrap';
// import MapContainer from './MapContainer';
import Select from 'react-select';

class RouteSelect extends Component {
  constructor(props){
    super(props);

    // Use props instead of state - the only thing that RouteSelect
    // needs that isn't controlled by ContentBlock is the array of route names
    this.state = {
      // open: true,
      routes: [],
      // chosenRoute: this.props.chosenRoute,
      // direction: this.props.direction,
    }

  // this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect = (event) => {

    if (event === this.state.chosenRoute) {
      return;
    }
    else if (event === null) {
      console.log(event, "event null")
      // this.props.onChosenRouteUpdate("Select Route")
      this.props.onRouteUpdate([], true)
      // this.props.onSelectedJourneyUpdate([])
      // this.props.onDirectionUpdate('I')
      return;
    }
    // console.log(event)
    // this.setState({
    //   chosenRoute: event.value
    // });
    // this.props.onRouteUpdate(event.value)
    this.props.onChosenRouteUpdate(event.value)
    //default to 'I' direction when new route is chosen
    this.getStopsForRoute(event.value, 'I')
  }


  getStopsForRoute = (routeName, direction, isNewRoute = true) => {
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
        .then((resp) => this.props.onRouteUpdate(resp, isNewRoute))
    } catch(e) {
        console.log(e)
      }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   if (nextProps.chosenRoute !== this.props.chosenRoute) {
  //     this.getStopsForRoute(nextProps.chosenRoute)
  //   }
  // }
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

  async componentWillReceiveProps(nextProps) {
    if (nextProps.direction !== this.props.direction) {
      this.getStopsForRoute(this.props.chosenRoute, nextProps.direction, false)
    }
  }

  render() {
    return (
          <div>
            <Select
              id="routeSelect"
              name="form-field-name"
              options={this.state.routesAsOptions}
              value={this.props.chosenRoute}
              onChange={this.handleSelect}  
              placeholder={"Select route"}
        />
          </div>
            )}
    }

export default RouteSelect;

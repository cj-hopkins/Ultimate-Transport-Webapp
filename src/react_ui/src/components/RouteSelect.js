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
      chosenRoute: "Select Route",
    }

  // this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect = (event) => {

    if (event === this.state.chosenRoute) {
      return;
    }
    else if (event === null) {
      this.setState({
        chosenRoute: "Select Route"
      });
      this.props.onRouteUpdate([])
      this.props.selectRoute(event.value)
      return;
    }
    console.log(event)
    this.setState({
      chosenRoute: event.value
    });

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
          route: event.value,
          direction: 'I',
        })
      })
        .then((response) => response.json())
        // onUpdate is a setState function in App.js
        // the state is updated with an array of stops
        // and then passed as a prop to MapContainer
        .then((resp) => this.props.onRouteUpdate(resp))
    } catch(e) {
        console.log(e)
      }
  }

  async componentWillMount(){

    const endpoint = '/api/getAllRoutes';
    try {
      const result = await fetch(endpoint)
      const routeNames = await result.json();
      this.setState({
        routes: routeNames
      });
      // console.log(this.state.routes)
    } catch(e) {
      console.log(e);
    }

  }


  render() {
              const routeItems = []
              {this.state.routes.forEach(item => (
                routeItems.push({value: item.route, label: item.route})
              ))}
    return (
          <div>
            <Select
              id="routeSelect"
              name="form-field-name"
              options={routeItems}
              value={this.state.chosenRoute}
              onChange={this.handleSelect}  
              placeholder={"Select route"}
        />
          </div>
            )}
    }

export default RouteSelect;

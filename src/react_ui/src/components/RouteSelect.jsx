import React, { Component } from 'react';
import { Button , Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

class RouteSelect extends Component {
  constructor(props){
    super(props);
    // Use props instead of state - the only thing that RouteSelect
    // needs that isn't controlled by ContentBlock is the array of route names
    this.state = {
      routes: [],
      chosenDirection: this.props.route_destination
    }
  }
  handleSelect = (event) => {
    if (event === this.state.chosenRoute) {
      return;
    }
    else if (event === null) {
      this.props.routeReset()
      return;
    }
    this.props.onChosenRouteUpdate(event.value)
    //default to 'I' direction when new route is chosen
    this.getStopsForRoute(event.value, 'I');
    this.setState ({
      chosenDirection:this.props.route_origin,
    });
  }
  getStopsForRoute = (routeName, direction) => {
    const endpoint = '/api/getStopsForRoute' 
    try {
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
        // onUpdate is a setState function in App.js the state is updated with an array of stops
        // and then passed as a prop to MapContainer
        .then((resp) => this.props.onRouteUpdate(resp))
    } catch(e) {
        console.log(e)
      }
  }
  async componentWillMount(){
    let routeNames
    const endpoint = '/api/getAllRoutes';
    try {
      const result = await fetch(endpoint)
      routeNames = await result.json();
      this.setState({
        routes: routeNames
      });
      const routeItems = []    // Format routes to use with dropdown
      routeNames.forEach(item => (
      routeItems.push({value: item.route, 
                       label: item.route
          })
    ))
    this.setState({routesAsOptions: routeItems})
    } catch(e) {
      console.log(e);
      
      
    }
//    const routeItems = []    // Format routes to use with dropdown
//    routeNames.forEach(item => (
//      routeItems.push({value: item.route, 
//                       label: item.route
//                      })
//    ))
//    this.setState({routesAsOptions: routeItems})
  }
  componentWillReceiveProps(nextProps) {
    // Get new stops if direction changes, but only if a route reset has not been done
    if (nextProps.direction !== this.props.direction && nextProps.chosenRoute !== "Select Route") {
      this.getStopsForRoute(this.props.chosenRoute, nextProps.direction)
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
              placeholder={"Select route"}/>
          {/* Only show the change direction buttons when a route has already been selected */}
            <div className={ `${this.props.route_destination === null ? "d-none" : "d-block"}` }>
              <Grid>
                <Row>
                  <Col xs={2}></Col>
                  <Col xs={8}><p> Towards: {this.props.route_destination}</p></Col>
                  <Col xs={2}></Col>
                </Row>
                <Row>
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <Button onClick={this.props.onDirectionUpdate} bsStyle="primary"  bsSize="large" block>
                       Change Direction
                      </Button></Col>
                  <Col xs={2}></Col>
                </Row>  
              </Grid>
            </div>
          </div>
          )}
  }
export default RouteSelect;

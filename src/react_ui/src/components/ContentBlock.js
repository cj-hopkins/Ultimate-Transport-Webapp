import { Grid, Row, Col, Container } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import CalendarFunctionality from "./CalendarFunctionality"
import TimeDropdown from "./TimeDropdown"
import { Button } from "react-bootstrap"
import {PageHeader} from 'react-bootstrap';
import dublin_bus_icon from './dublin_bus_icon.png';
import WeatherWidget from "./Weather";

class ContentBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stops: [],
    }

    // this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  //Save the list of stops to contentBlock's state before
  //Calling App.js setState function
  routeUpdate (route) {
    this.setState({
      stops: route
    })
    this.props.onRouteUpdate(route)
    // console.log(this.state.route)
  }

  render(){

    return (
      <div>
		<PageHeader className='fontForTitle'> Ultimate Transport </PageHeader>
		{/*<img src={dublin_bus_icon} alt="dublin_bus_icon" />;*/}
	<RouteSelect className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}/>
	<div style={{marginTop: '2em'}}> </div>
	<StopSelect stops={this.state.stops}/>
	 <div style={{marginTop: '2em'}}> </div>
	<TimeDropdown />
	 <div style={{marginTop: '1em'}}> </div>
	<CalendarFunctionality />
	<div style={{marginTop: '2em'}}> </div>
       <Button bsStyle='primary' bsSize='large' block>Go</Button>
  <WeatherWidget />
	</div>
    )
  }
}

export default ContentBlock

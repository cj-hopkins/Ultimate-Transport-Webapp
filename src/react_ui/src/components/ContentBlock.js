import { Grid, Row, Col, Container } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import CalendarFunctionality from "./CalendarFunctionality"
import TimeDropdown from "./TimeDropdown"
import { Button } from "react-bootstrap"
import {PageHeader} from 'react-bootstrap';
import dublin_bus_icon from './dublin_bus_icon.png';

class ContentBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stops: [],
      startStop: "",
      finishStop: "",
      route: "",
    }

    // this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  //Save the list of stops to contentBlock's state before
  //Calling App.js setState function
  routeUpdate (route) {
    this.setState({
      stops: route,
    })
    this.props.onRouteUpdate(route)
    // console.log(this.state.route)
  }

  handleClick = () => {
    this.setState({
        selectedJourney: {
            route: this.state.selectedRoute,
            start: this.state.startStop,
            finish: this.state.finishStop,
        }
    })
    console.log(this.state.selectedJourney)
    console.log(this.state.selectedRoute)
    console.log(this.state.startStop)
    console.log(this.state.finishStop)
  }

  onStartSelect(start) {
    console.log("start" + start)
    this.setState({
        startStop: start
    })
    console.log("contentblock start")
    console.log(this.state.startStop)
  }

  onFinishSelect(finish){
    this.setState({
        finishStop: finish
    })
  }

  onSelectRoute(route) {
    console.log("route in content block")
    console.log(route)
    this.setState({
        selectedRoute: route
    })
  }

  render(){

    return (
      <div>
		<PageHeader className='fontForTitle'> Ultimate Transport </PageHeader>
		{/*<img src={dublin_bus_icon} alt="dublin_bus_icon" />;*/}
	<RouteSelect className="mb-3" 
        onRouteUpdate={this.routeUpdate.bind(this)}
        selectRoute={this.onSelectRoute.bind(this)}/>
	<div style={{marginTop: '2em'}}> </div>
	<StopSelect stops={this.state.stops}
        onStartSelect={this.onStartSelect.bind(this)}
        onFinishSelect={this.onFinishSelect.bind(this)}/>
	 <div style={{marginTop: '2em'}}> </div>
	<TimeDropdown />
	 <div style={{marginTop: '1em'}}> </div>
	<CalendarFunctionality />
	<div style={{marginTop: '2em'}}> </div>
       <Button bsStyle='primary' bsSize='large' block onClick={this.handleClick}>Go</Button>
	</div>
    )
  }
}

export default ContentBlock

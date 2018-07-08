//import { Grid, Row, Col, Container } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import { Button } from "react-bootstrap"

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
        <RouteSelect className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}/>
	<StopSelect stops={this.state.stops}/>
       <Button bsStyle='primary' bsSize='large' block>Go</Button>
	</div>
    )
  }
}

export default ContentBlock

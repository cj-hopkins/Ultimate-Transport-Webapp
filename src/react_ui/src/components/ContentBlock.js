import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import { Button } from "react-bootstrap"

class ContentBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stops: [],
      chosenRoute: "",
      startStop: "",
      finishStop: "",
    }

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

  async onChosenRouteUpdate(route) {
    this.setState({
      chosenRoute: route
    })
  }

  async onStartStopUpdate(stop) {
    this.setState({
      startStop: stop
    })
  }

  async onFinishStopUpdate(stop) {
    this.setState({
      finishStop: stop
    })
  }

  // onSelectedJourneyUpdate(journey){
  //   this.setState({
  //     selectedJourney: {
  //       route: this.state.chosenRoute,
  //       start: this.state.startStop,
  //       finish: this.state.finishStop,
  //     }
  //   })
  // }

  handleClick = () => {

    // const numOfStops = this.calculateNumberOfStops()
    const prediction = this.getPrediction()
    // console.log(prediction.json())
  }

  getPrediction = () => {
    const endpoint = '/api/getPredictionForJourney' 
    try {
      // const result = fetch(endpoint, {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          route: this.state.chosenRoute,
          start: this.state.startStop,
          start: this.state.startStop,
        })
      })
        .then((response) => response.json())
        .then((resp) => {return resp.prediction})
    } catch(e) {
        console.log(e)
      }
  }

  render(){

    return (
      <div>
        <RouteSelect onRouteUpdate={this.routeUpdate.bind(this)}
                      onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)}/>
        <StopSelect stops={this.state.stops}
                    onStartStopUpdate={this.onStartStopUpdate.bind(this)}
                    onFinishStopUpdate={this.onFinishStopUpdate.bind(this)}
                    />
        <Button onClick={this.handleClick}>Go!</Button>
      </div>
    )
  }
}

export default ContentBlock

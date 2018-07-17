import { Grid, Row, Col, Container } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import CalendarButton from "./CalendarButton"
import TimeDropdown from "./TimeDropdown"
import { Button, ButtonGroup, Media } from "react-bootstrap"
import {PageHeader} from 'react-bootstrap';
import dublin_bus_icon from './dublin_bus_icon.png';
import WeatherWidget from "./Weather";
import PredictionContainer from './PredictionContainer';
import NowButton from './NowButton';
import TimeButton from './TimeButton';
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';


class ContentBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stops: [],
      chosenStops: null,
      chosenRoute: "Select Route",
      startStop: "",
      finishStop: "",
      predictionForJourney: null,
      direction: 'I',
    }

  }

  //Save the list of stops to contentBlock's state before
  //Calling App.js setState function - pass stops to map
  routeUpdate (route, isNewRoute) {
    this.setState({
      stops: route,

    })
    if (isNewRoute === true) {
      this.setState({
        startStop: "start",
        finishStop: "finish",
        chosenStops: null,
        direction: 'I',
    })
  }
    this.props.onRouteUpdate(route)
    // console.log(this.state.route)
  }

  async onChosenRouteUpdate(route) {
    this.setState({
      chosenRoute: route,
      direction: 'I',
      predictionForJourney: null,
    })
  }

  onDirectionUpdate(dir){
    this.setState({
      direction: dir
    })
  }

  onStopDeselect(stop) {
    if (stop === 'start') {
      this.setState({startStop: "start"})
      const newRoute = this.state.stops.slice(0, this.findStopIndex(this.state.finishStop))
      this.routeUpdate(newRoute, false)
    } else {
      this.setState({finishStop: "finish"})
      const newRoute = this.state.stops.slice(this.findStopIndex(this.state.startStop, this.state.stops.length))
      this.routeUpdate(newRoute, false)
    }
  }

  async onStopUpdate(start = null, finish = null) {
    if (start === null || finish === null) {

      const isStart = (finish === null) ? true : false;
      const stop = isStart ? start : finish;
      const finishIndex = (this.state.finishStop === "") ? this.state.stops.length : this.findStopIndex(this.state.finishStop)
      const startIndex = (this.state.startStop === "") ? 0 : this.findStopIndex(this.state.startStop)

      // TODO handle deselect of start/finish stop properly - "Start" currently returned on deselect of start etc
      // if (stop === "Start" || stop === "Finish") {
      //   this.setState({
      //     startStop: "Start",
      //     finishStop: "Finish"
      //   })
      // }
      // this.setState({
      //   stopState: stop,
      //   predictionForJourney: null,
      // })

      const index = this.findStopIndex(stop);
      console.log(index)
      let newStops;

      if (isStart) {
        newStops = this.state.stops.slice(index, finishIndex)
        this.setState({startStop: stop})
      } else {
        newStops = this.state.stops.slice(startIndex, index);
        this.setState({finishStop: stop})
      }
      
      this.setState({chosenStops: newStops});
      this.props.onSelectedJourneyUpdate(newStops);
      // if neither values are null then we are doing a direction switch
    } else {
        this.setState({
          startStop: start,
          finishStop: finish,
          predictionForJourney: null
        });

        const startIndex = this.findStopIndex(start);
        console.log("start" + startIndex)
        const finishIndex = this.findStopIndex(finish);
        console.log("finish" + finishIndex)
        let newStops = this.state.stops.slice(startIndex, finishIndex);
        console.log(newStops);

        this.setState({chosenStops: newStops});
        this.props.onSelectedJourneyUpdate(newStops);
    }

  }

  findStopIndex = (stop) => {
    // const allStops = this.state.chosenStops === null ? this.state.stops : this.state.chosenStops;
    if (stop === "start") { 
      return 0 
    } else if (stop === "finish") {
      return this.state.stops.length
    }
    const allStops = this.state.stops;
    for (let i = 0; i < allStops.length; i++) {
      if (allStops[i].stop_id === stop) return i;
    }
    return -1;
  }
  // componentWillUpdate(prevState, prevProps) {
  //   if (this.state.chosenRoute === "" || this.state.startStop === "" || this.state.finishStop === "") {
  //     // this.setState({predictionForJourney: null});
  //     return;
  //   }
  //   if (prevState.startStop === this.state.startStop || prevState.finishStop === this.state.finishStop) return;
  //   this.getPrediction();
  // }

  handleClick = () => {

    this.setState({ chosenRoute: "31"})
    // const numOfStops = this.calculateNumberOfStops()
    // this.getPrediction()
    // this.setState({
    //   predictionForJourney: prediction
    // })
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
          finish: this.state.finishStop,
        })
      })
        .then((response) => response.json())
        .then((resp) => {
          const prediction = resp.prediction
          this.setState({
            predictionForJourney: prediction
          })
        })
        // .then((resp) => console.log(resp.prediction))
    } catch(e) {
        console.log(e)
      }
  }

  render(){

    return (
      <div>
       <Media>
		<PageHeader className='fontForTitle'> Ultimate Transport </PageHeader>
		<Media.Right>
        
        <img src={dublin_bus_icon} style={{width: '100px', height:'100px'}} alt="dublin_bus_icon" />
          </Media.Right>
        </Media>
	     <RouteSelect className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}
                      chosenRoute={this.state.chosenRoute}
                      direction={this.state.direction}
                      onDirectionUpdate={this.onDirectionUpdate.bind(this)}
                      onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)} 
                      onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}/>
	     <div style={{marginTop: '2em'}}> </div>
       <StopSelect stops={this.state.stops}
                    startStop={this.state.startStop}
                    finishStop={this.state.finishStop}
                    direction={this.state.direction}
                    onDirectionUpdate={this.onDirectionUpdate.bind(this)}
                    onStopUpdate={this.onStopUpdate.bind(this)}
                    onStopDeselect={this.onStopDeselect.bind(this)}
                    chosenRoute={this.state.chosenRoute}
                    />
              <div style={{marginTop: '2em'}}> </div>

	            <Row><Col xs={2}></Col>
              <Col xs={8}><NowButton /></Col>
              <Col xs={2}></Col></Row>

              <div style={{marginTop: '2em'}}> </div>
              
              <Row><Col xs={2}></Col>
              <Col xs={8}><TimeButton /></Col>
              <Col xs={2}></Col></Row>

              <div style={{marginTop: '2em'}}> </div>
              <Row><Col xs={2}></Col>
              <Col xs={8}><CalendarButton /></Col>
              <Col xs={2}></Col></Row>

              <div style={{marginTop: '2em'}}> </div>
        <Row><Col xs={2}></Col>
        <Col xs={8}><Button onClick={this.handleClick} bsStyle='warning' bsSize='large' block>Go!</Button></Col>
        <Col xs={2}></Col></Row>
        <PredictionContainer prediction={this.state.predictionForJourney} />
        <WeatherWidget />
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{height: 400}} />
	</div>
    )
  }
}

export default ContentBlock

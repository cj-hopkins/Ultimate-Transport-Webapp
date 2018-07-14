import { Grid, Row, Col, Container } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import CalendarButton from "./CalendarButton"
import TimeDropdown from "./TimeDropdown"
import { Button, Media } from "react-bootstrap"
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
      chosenRoute: "",
      startStop: "",
      finishStop: "",
      predictionForJourney: null,
    }

  }

  //Save the list of stops to contentBlock's state before
  //Calling App.js setState function
  routeUpdate (route) {
    this.setState({
      stops: route,
      chosenStops: null

    })
    this.props.onRouteUpdate(route)
    // console.log(this.state.route)
  }

  async onChosenRouteUpdate(route) {
    this.setState({
      chosenRoute: route,
      predictionForJourney: null,
    })
  }

  async onStopUpdate(isStartStop = true, stop) {
    // TODO handle deselect of start/finish stop properly - "Start" currently returned on deselect of start etc
    if (stop === "Start" || stop === "Finish") return;
    const startOrFinish = isStartStop ? "startStop" : "finishStop";
    this.setState({
      startOrFinish: stop,
      predictionForJourney: null,
    })

    const index = this.findStopIndex(stop);
    let newStops;

    if (startOrFinish === "startStop") {
      newStops = this.state.stops.slice(index, this.state.stops.length);
    } else {
      newStops = this.state.stops.slice(0, index);
    }
    
    this.props.onRouteUpdate(newStops);

  }
  async onStartStopUpdate(stop) {
    this.setState({
      startStop: stop,
      predictionForJourney: null,
    })
    const index = this.findStopIndex(stop);
    let newStops = this.state.stops.slice(index, this.state.stops.length);
    this.props.onRouteUpdate(newStops);
  }

  async onFinishStopUpdate(stop) {
    this.setState({
      finishStop: stop,
      predictionForJourney: null,
    })
    const index = this.findStopIndex(stop);
    let newStops = this.state.stops.slice(0, index);
    this.props.onRouteUpdate(newStops);
  }

  findStopIndex = (stop) => {
    const allStops = this.state.chosenStops === null ? this.state.stops : this.state.chosenStops;
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

    // const numOfStops = this.calculateNumberOfStops()
    this.getPrediction()
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
        
        <img src={dublin_bus_icon} style={{width: '100px', height:'100px'}} alt="dublin_bus_icon" />;
          </Media.Right>
        </Media>
	     <RouteSelect className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}
                      onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)}/>
	     <div style={{marginTop: '2em'}}> </div>
	     <StopSelect stops={this.state.stops}
                    onStartStopUpdate={this.onStartStopUpdate.bind(this)}
                    onFinishStopUpdate={this.onFinishStopUpdate.bind(this)}
                    onStopUpdate={this.onStopUpdate.bind(this)}/>
	     <div style={{marginTop: '2em'}}> </div>
        
        <Grid>
          <Row>
            <Col xsOffset={0}>
              <NowButton />
            </Col>
         
        <Col  xsOffset={1}>
           <TimeButton />
              </Col>  
          
              
            <Col >
           <CalendarButton />
            </Col>
              </Row>
          </Grid>
        <div style={{marginTop: '1em'}}></div>
        
        <Button onClick={this.handleClick} bsStyle='primary' bsSize='large' block>Go!</Button>
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

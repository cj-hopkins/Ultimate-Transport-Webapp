import { Grid, Row, Col, Container } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"

import { Button, ButtonGroup, Media } from "react-bootstrap"
import TimeButton from './TimeSelect';
import {PageHeader} from 'react-bootstrap';
import dublin_bus_icon from './dublin_bus_icon.png';
import WeatherWidget from "./Weather";
import PredictionContainer from './PredictionContainer';
//import NowButton from './NowButton';
//import TimeButton, {CalendarChooseDate, TimeDropdown} from './TimeButton';
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import CustomNavbar from './CustomNavBar';
import CustomGeolocation from './examples/GeoLocation';

import moment from "moment";

class ContentBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stops: [],
      chosenStops: null,
      route_destination: null,
      route_origin: null,
      chosenRoute: "Select Route",
      startStop: "start",
      finishStop: "finish",
      predictionForJourney: null,
      direction: 'I',
      plannedDate:moment(),
      plannedTime:moment(),
      isDefaultTime:true,
    }
  }

  routeReset () {
    console.log("reset")
    this.setState({
        stops: [],
        chosenStops: null,
        route_destination: null,
        route_origin: null,
        chosenRoute: "Select Route",
        startStop: "start",
        finishStop: "finish",
        predictionForJourney: null,
        direction: 'I',
    })
    this.props.onRouteUpdate([])
  }

  //Save the list of stops to contentBlock's state before
  //Calling App.js setState function - pass stops to map
  routeUpdate (route) {
    console.log("route update")
    console.log(route)
    // TODO get rtpi dest and origin factoring in the time - currently
    // they are often incorrect
    const route_orig = route[0].rtpi_origin
    const route_dest = route[route.length - 1].rtpi_destination
    this.setState({
      stops: route,
      route_destination: route_dest,
      route_origin: route_orig,
    })
    this.props.onRouteUpdate(route)
  }
  // chosen route NAME: '31', '11' etc. - TODO make this clearer
  async onChosenRouteUpdate(route) {
    this.setState({
      chosenRoute: route,
      direction: 'I',
      predictionForJourney: null,
    })
  }

  // Flip the current direction
  onDirectionUpdate(){
    const newDirection = (this.state.direction === 'I') ? 'O' : 'I'
    this.setState({
      direction: newDirection,
      startStop: 'start',
      finishStop: 'finish'
    })
  }
  
  onResetTime(date, secsPastMidnight) {
    this.onSelectDate(date)
    this.onSelectTime(secsPastMidnight)
    this.setState({
      isDefaultTime: true
    })
  }

    onSelectTime(time){
     this.setState({
      plannedTime:time,
      isDefaultTime: false
     
   })
      }
  
   onSelectDate(date){
     console.log(date)
   this.setState({
       plannedDate:date,
      isDefaultTime: false
     })
   }
  
  // onSelectNow(time){
  //  this.setState({
  //        plannedTimeNotNow:time
  //    })
  // }
  
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
      const finishIndex = (this.state.finishStop === "finish") ? this.state.stops.length : this.findStopIndex(this.state.finishStop)
      const startIndex = (this.state.startStop === "start") ? 0 : this.findStopIndex(this.state.startStop)

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

    // this.setState({ chosenRoute: "31"})
    
    console.log('IN CONTENT BLOCK \n Now button: '+     this.state.plannedTime+  
                                 '\n Time Dropdown: '+  this.state.plannedTime +
                                  '\n Calendar button: '+this.state.plannedDate 
               ) 
    
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
          direction: this.state.direction,
          selectedTime: this.state.plannedTime,
          selectedDate: this.state.plannedDate.unix(),
          isDefaultTime: this.state.isDefaultTime
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
		
		<Media.Left>
        
        <img src={dublin_bus_icon} style={{width: '100px', height:'100px'}} alt="dublin_bus_icon" />
          </Media.Left><PageHeader className='fontForTitle'> Ultimate Transport Dublin</PageHeader><WeatherWidget/>
        </Media>
        {/* <NavigationTabs /> */}

	     <RouteSelect className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}
                      chosenRoute={this.state.chosenRoute}
                      direction={this.state.direction}
                      route_destination={this.state.route_destination}
                      route_origin={this.state.route_origin}
                      onDirectionUpdate={this.onDirectionUpdate.bind(this)}
                      onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)} 
                      onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}
                      routeReset={this.routeReset.bind(this)}/>
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
        <CustomNavbar />
        {/* <CustomGeolocation /> */}

              <div style={{marginTop: '2em'}}> </div>

	            <Row><Col xs={2}></Col>
            {/* <Col xs={8}><NowButton  plannedTimeNotNow= {this.state.plannedTimeNotNow}
                                      onSelectTime= {this.onSelectTime.bind(this)} 
                                      onSelectDate= {this.onSelectDate.bind(this)} 
                            />
                  </Col> */} 
              <Col xs={2}></Col></Row>

              <div style={{marginTop: '2em'}}> </div>
              
              <Row><Col xs={2}></Col>
              <Col xs={8}><TimeButton   onResetTime={this.onResetTime.bind(this)}
                                        plannedTime = {this.state.plannedTime}
                                        plannedDate = {this.state.plannedDate}
                                        onSelectTime= {this.onSelectTime.bind(this)} 
                                        onSelectDate= {this.onSelectDate.bind(this)} 
                                          onResetTime={this.onResetTime.bind(this)}
                                        /></Col>
              <Col xs={2}></Col></Row>

             

              <div style={{marginTop: '2em'}}> </div>
        <Row><Col xs={2}></Col>
        <Col xs={8}><Button onClick={this.handleClick} bsStyle='warning' bsSize='large' block>Go!</Button></Col>
        <Col xs={2}></Col></Row>
        <PredictionContainer prediction={this.state.predictionForJourney} />
       <div style={{marginTop: '2em'}}> </div>
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{height:'20%', width: '100%', theme:'dark'}} />
	</div>
    )
  }
}

export default ContentBlock

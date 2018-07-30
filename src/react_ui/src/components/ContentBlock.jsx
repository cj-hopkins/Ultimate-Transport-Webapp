import { Grid, Row, Col } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import { Button} from "react-bootstrap"
import TimeButton from './TimeSelect';
import RealTimeInfo from './RealTimeInfo';
import PredictionContainer from './PredictionContainer';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
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
      isDefaultTime:true, // needed for when page loads and leave_now button
      nextBuses:[]
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
  onResetTime(date, secsPastMidnight) {  //on-click of leave-now
    this.onSelectDate(date)
    this.onSelectTime(secsPastMidnight)
    this.setState({
      isDefaultTime: true
    })
  }
  onResetNowContentBlock(){
    this.setState({
      isHidden: !this.state.isHidden,
      isDefaultTime: true
    })
  }               
  onSelectTime(time){  //on change of time (time dropdown) 
    this.setState({
      plannedTime:time,
      isDefaultTime: false
    })
  }
   onSelectDate(date){  //on change of date (calendar) 
    this.setState({
      plannedDate:date,
      isDefaultTime: false
     })
   }
  onPageLoadSetTime(time){  //on load of page set time = now
    this.setState({
      plannedTime:time,
      isDefaultTime: true
    })
  }
  onPageLoadSetDate(date){  //on load of page set date = now
    this.setState({
      plannedDate:date,
      isDefaultTime: true
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
    // Here be dragons - leave this code for now
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

  handleClick = () => { 
     
    this.setState({
      nextBuses: this.fetchRealTime(this.state.startStop)
    })
    this.getPrediction()
    const start = (this.state.startStop).toString();
    console.log('this.state.startStop,', typeof(start ));
  }
  getPrediction = () => {
    const endpoint = '/api/getPredictionForJourney' 
    try {
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
          selectedDate: (this.state.plannedDate.unix()).toString(),
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
  fetchRealTime(stopid){
    const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
//            console.log(parsedJSON.results)
            this.setState({   //slice(0,4) to limit to top 4 results 
                nextBuses: parsedJSON.results.slice(0, 4).map((post, i) => (
                  <tr key={i} >
                    <td>{post.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <td>{post.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <td>{post.duetime} minutes </td>
                  </tr>
                ))
            });
     })
      .catch(error => console.log('parsing failed',error))
  }
  
  render(){
    return (
      <Grid fluid={true}>
	     <RouteSelect 
            className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}
            chosenRoute={this.state.chosenRoute}
            direction={this.state.direction}
            route_destination={this.state.route_destination}
            route_origin={this.state.route_origin}
            onDirectionUpdate={this.onDirectionUpdate.bind(this)}
            onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)} 
            onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}
            routeReset={this.routeReset.bind(this)}/>
	     <div style={{marginTop: '2em'}}> </div>
       <StopSelect 
          stops={this.state.stops}
          startStop={this.state.startStop}
          finishStop={this.state.finishStop}
          direction={this.state.direction}
          onDirectionUpdate={this.onDirectionUpdate.bind(this)}
          onStopUpdate={this.onStopUpdate.bind(this)}
          onStopDeselect={this.onStopDeselect.bind(this)}
          chosenRoute={this.state.chosenRoute}
                    />
              <div style={{marginTop: '2em'}}> </div>
              <div style={{marginTop: '2em'}}> </div>
              <Row><Col xs={2}></Col>
              <Col xs={8}><TimeButton  
                            onResetNowContentBlock= {this.onResetNowContentBlock.bind(this)} 
                            plannedTime = {this.state.plannedTime}
                            plannedDate = {this.state.plannedDate} 
                            isDefaultTime = {this.state.isDefaultTime} 
                            onSelectTime= {this.onSelectTime.bind(this)} 
                            onSelectDate= {this.onSelectDate.bind(this)} 
                            onPageLoadSetDate = {this.onPageLoadSetDate.bind(this)} 
                            onPageLoadSetTime= {this.onPageLoadSetTime.bind(this)} 
                                        /></Col>
              <Col xs={2}></Col></Row>  
              <div style={{marginTop: '2em'}}> </div>
        <Row><Col xs={2}></Col>
        <Col xs={8}><Button onClick={this.handleClick} bsStyle='warning' bsSize='large' block>Go!</Button></Col>
        <Col xs={2}></Col></Row>
        <PredictionContainer prediction={this.state.predictionForJourney} />
       <div style={{marginTop: '2em'}}> </div>

        <RealTimeInfo  
          nextBuses={this.state.nextBuses}
          startStop={this.state.startStop}
          /> 

        <div>
          {this.state.nextBuses}
        </div>
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{height:'20%', width: '100%', theme:'dark'}} />
	</Grid>
    )
  }
}

export default ContentBlock
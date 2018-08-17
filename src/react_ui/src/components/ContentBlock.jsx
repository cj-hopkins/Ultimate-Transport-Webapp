import { Grid, Row, Col, Table } from 'react-bootstrap';
import React, { Component } from "react"
import RouteSelect from "./RouteSelect"
import StopSelect from "./StopSelect"
import { Button} from "react-bootstrap"
import TimeButton from './TimeSelect';
import PredictionContainer from './PredictionContainer';
import moment from "moment";
import ErrorBoundary from './ErrorBoundary';
import ReactTooltip from 'react-tooltip'
import "./../App.css";
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
      nextBuses:[], 
      isRealTimeButtonHidden:true, 
      isRealTimeHidden:true, 
      dateOfMonthToTravel: ((moment().month()).toString().concat(moment().date()).toString())
    }
  }
  routeReset () {
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
 
  async onChosenRouteUpdate(route) {   // chosen route NAME: '31', '11' etc.
    this.setState({
      chosenRoute: route,
      direction: 'I',
      predictionForJourney: null,
    })
  }
  onDirectionUpdate(){   // Flip current direction
    const newDirection = (this.state.direction === 'I') ? 'O' : 'I'
    this.setState({
      direction: newDirection,
      startStop: 'start',
      finishStop: 'finish'
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
      isDefaultTime: false, 
    })
  }
   onSelectDate(date){  //on change of date (calendar) 
    this.setState({
      plannedDate:date,
      isDefaultTime: false,
      dateOfMonthToTravel: ((date.month()).toString().concat(date.date()).toString())
     })
   }
  onPageLoadSetTime(time){  //on load of page set time = now
    this.setState({
      plannedTime:time,
      isDefaultTime: true,
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
  onSelectStartDisplayRealTimeButton(stopid){ //get Real time info when user picks start stop 
     this.setState({
       isRealTimeButtonHidden:false,
       isRealTimeHidden: true
    })   
  }
  onPressRealTimeButtonSidebar(stopid){
    this.setState({
      isRealTimeHidden:false,
       isRealTimeHidden: !this.state.isRealTimeHidden
    })
     const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
            this.setState({   //slice(0,4) to limit to top 4 results 
               nextBuses: [...this.state.nextBuses, ...parsedJSON.results.slice(0, 4)]
            }); 
     })
      .then( console.log('this.state.nextBuses.route', this.state.nextBuses))
      .catch(error => console.log('parsing failed',error))
  }
  
  async onStopUpdate(start = null, finish = null) {
    // Here be dragons - leave this code for now
    if (start === null || finish === null) {
      const isStart = (finish === null) ? true : false;
      const stop = isStart ? start : finish;
      const finishIndex = (this.state.finishStop === "finish") ? this.state.stops.length : this.findStopIndex(this.state.finishStop)
      const startIndex = (this.state.startStop === "start") ? 0 : this.findStopIndex(this.state.startStop)
      const index = this.findStopIndex(stop);
      console.log("Stop index", index)
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
    } else {   // if neither values are null then switch direction 
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
    this.getPrediction()
    console.log('DAY OF TRAVEL STRING ______' + this.state.dayOfTravel)
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
        .then(
        (response) => response.json())
        .then((resp) => {
          const prediction = resp.prediction
          this.setState({
            predictionForJourney: prediction
          })
        })
    } catch(e) {
        console.log(e)
      }
  }

  componentWillMount() {
    this.props.getPolyCoordinates([])
  }
  
  render(){
    const rt_array =  this.state.nextBuses.map((post, i) => (
                       <tr key={i} className = 'real_time_box_sidebar'>
                          <td>{this.state.nextBuses.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>{this.state.nextBuses.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>{this.state.nextBuses.duetime} minutes </td>
                      </tr>
                    ));
    
    
    return (
        <div style={{minHeight: '50%', maxHeight:'600px', backgroundColor:'white'}}>
      <Grid fluid={true}>
      {/*         <ErrorBoundary> */}
        <RouteSelect 
            className="mb-3" 
            chosenRoute={this.state.chosenRoute}
            direction={this.state.direction}
            route_destination={this.state.route_destination}
            route_origin={this.state.route_origin}
            onRouteUpdate={this.routeUpdate.bind(this)}
            onDirectionUpdate={this.onDirectionUpdate.bind(this)}
            onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)} 
            onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}
            routeReset={this.routeReset.bind(this)}/>
	     <div style={{marginTop: '2em'}}> </div>
     {/*  </ErrorBoundary>
        <ErrorBoundary>    */} 
        <StopSelect 
          stops={this.state.stops}
          startStop={this.state.startStop}
          finishStop={this.state.finishStop}
          direction={this.state.direction}
          onDirectionUpdate={this.onDirectionUpdate.bind(this)}
          onStopUpdate={this.onStopUpdate.bind(this)}
          onStopDeselect={this.onStopDeselect.bind(this)}
          chosenRoute={this.state.chosenRoute}
          onSelectStartDisplayRealTimeButton={this.onSelectStartDisplayRealTimeButton.bind(this)}
                    />
       {/*    </ErrorBoundary>    */} 
        <div style={{marginTop: '2em'}}> </div>
        <div style={{marginTop: '2em'}}> </div>
        <Row>
          <Col xs={0}></Col>
          <Col xs={12}>
            <TimeButton  
              onResetNowContentBlock= {this.onResetNowContentBlock.bind(this)} 
              plannedTime = {this.state.plannedTime}
              plannedDate = {this.state.plannedDate} 
              isDefaultTime = {this.state.isDefaultTime}
              dateOfMonthToTravel = {this.state.dateOfMonthToTravel} 
              onSelectTime= {this.onSelectTime.bind(this)} 
              onSelectDate= {this.onSelectDate.bind(this)} 
              onPageLoadSetDate = {this.onPageLoadSetDate.bind(this)} 
              onPageLoadSetTime= {this.onPageLoadSetTime.bind(this)} 
          />
          </Col>
          <Col xs={0}></Col>
        </Row>  
        <div style={{marginTop: '2em'}}> </div>
        <Row>
         <Col xs={0}></Col>  
          <Col xs={12}> 
            <Button 
              onClick={this.handleClick} 
              bsStyle='warning' 
              bsSize='large' 
              block>Estimate journey time
            </Button>
          </Col>
          <Col xs={0}></Col>  
        </Row>
        <Row>
       <Col xs={0}></Col>
          <Col xs={12}>  
            <PredictionContainer prediction={this.state.predictionForJourney} />
         </Col>
          <Col xs={0}></Col> 
        </Row>	
        <div style={{marginTop: '2em'}}> </div>
        <Row>
      
          <Col xs={12}>
            <div>
            {(!this.state.isRealTimeButtonHidden && this.state.isDefaultTime ) &&            
            <div> 
                   {/* 
                    <p  >Real Time Information for Stop {this.state.startStop}</p>
                   <Table striped bordered condensed hover>{this.state.nextBuses}
                  </Table>
                  */}
              <Button 
                onClick={this.onPressRealTimeButtonSidebar.bind(this,this.state.startStop )} 
                style ={{backgroundColor:'LightGrey'}}
                bsSize='large' 
                block>Get Real Time Information for Stop {this.state.startStop}
              </Button>
               
            </div>
            }
              {!this.state.isRealTimeHidden && 
                <div> 
                <Table striped bordered condensed hover>
             { this.state.nextBuses.slice(0,4).map((post, i) => (
                 <tr key={i} className = 'real_time_box_sidebar'>
                   <td>{post.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                   <td>{post.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td>{post.duetime} minutes </td>
                 </tr>
                    ))}
                 </Table> 
                </div>} 
            </div>
          </Col>
        </Row>
      </Grid>
      </div>
    )
  }
}

export default ContentBlock

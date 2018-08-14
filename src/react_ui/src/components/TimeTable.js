import React, { Component } from 'react';
import RouteSelect from './RouteSelect';
import TimeTableStop from "./TimeTableStop";
import { Button, Grid, Row, Col} from "react-bootstrap";
import Table from 'rc-table';
import Select from 'react-select';

class TimeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stops: [],
      chosenStops: null,
      route_destination: null,
      route_origin: null,
      chosenRoute: "Select Route",
      startStop: "start",
      finishStop:'finish',
      direction: 'I',
      sqlDirection: 1,
      weekday: 0,
      saturday: 0,
      sunday: 0,
      chosenDay: null,
      times:null,
    }
  }
  handleSelect = (chosenDay) => {
      this.setState({ chosenDay });
      console.log(`Option selected:`, chosenDay);
      if (chosenDay===null) {
        this.setState({
          weekday: 0,
          saturday: 0,
          sunday: 0,
          times:null
        })
      }
      else if (chosenDay.value==='weekday'){
        this.setState({
          weekday: 1,
          saturday: 0,
          sunday: 0,
        })
      }
      else if (chosenDay.value==='saturday'){
        this.setState({
          weekday: 0,
          saturday: 1,
          sunday: 0,
        })
      }
      else if (chosenDay.value==='sunday'){
        this.setState({
          weekday: 0,
          saturday: 0,
          sunday: 1,
        })
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
        direction: 'I',
        times:null
    })
    this.props.onRouteUpdate([])
  }
  routeUpdate (route) {
    console.log("route update")
    console.log(route)
    const route_orig = route[0].rtpi_origin
    const route_dest = route[route.length - 1].rtpi_destination
    this.setState({
      stops: route,
      route_destination: route_dest,
      route_origin: route_orig,
    })
    this.props.onRouteUpdate(route)
  }
  async onChosenRouteUpdate(route) {
    this.setState({
      chosenRoute: route,
      direction: 'I',
      sqlDirection: 1,
    })
  }
  onDirectionUpdate(){   // Flip the current direction
    const newDirection = (this.state.direction === 'I') ? 'O' : 'I'
    const newSqlDirection = (this.state.sqlDirection === 1) ? 0 : 1;
    this.setState({
      direction: newDirection,
      sqlDirection: newSqlDirection,
      startStop: 'start',
      finishStop: 'finish'
    })
  }              
  onStopDeselect(stop) {
    if (stop === 'start') {
      this.setState({
        startStop: "start",
        times:null
        })
      const newRoute = this.state.stops.slice(0, this.findStopIndex(this.state.finishStop))
      this.routeUpdate(newRoute, false)
    }
  }
  onSelectStartGetRealTime(stopid){
     this.setState({
      isRealTimeHidden:false
    })
    const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
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

  async onStopUpdate(item) {
    console.log("STOP UPDAATE", item)
    this.setState({startStop: item})
    const marker = this.state.stops[this.findStopIndex(item)]
    console.log(marker)
    this.props.onSelectedJourneyUpdate([marker])
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


  getTable = () => {
    const endpoint = '/api/getTimeTable'
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          lineid: this.state.chosenRoute,
          direction: this.state.sqlDirection,
          stop_id: this.state.startStop,
          weekday: this.state.weekday,
          saturday: this.state.saturday,
          sunday: this.state.sunday,
        })
      })
      .then((response) => response.json())
        .then((resp) => {
          console.log(resp)
          const timetable = resp
          this.setState({
            times: timetable.sort()
          })
        })
    } catch(e) {
        console.log(e)
      }
  }
  render(){
    const options = [
      { value: 'weekday', label: 'Monday-Friday' },
      { value: 'saturday', label: 'Saturday' },
      { value: 'sunday', label: 'Sunday' }
    ];
    const rows = (this.state.times===null)? null : this.state.times.length
    console.log(rows)
    console.log(this.state.times)
    const table = []
    const columns = [{
      title: 'Time', dataIndex: 'value', key:'value', width: 100,
      }, ];


    if (this.state.times !== null){
      for(var i=0; i < rows; i++){
        table.push({value: this.state.times[i]})
      } 
    }
    //     table.push(<tr></tr>)
    //     for(var i=0; i < rows; i++){
    //       if (i % 3===0){
    //         table.push(<tr></tr>)
    //       }
    //       table.push(<th>{this.state.times[i]}</th>)
    //     }
    //     table.push(<tr></tr>)
    // }




          // { this.state.times.map(function(time, index){
          //     return <tr style={{width:'30px'}}><th>{time}</th></tr>;
          //     })}</tbody></Table></div>)}
    return (
      <div style={{height:'100%'}}>
      <Grid fluid={true}>
      <RouteSelect 
            className="mb-3" onRouteUpdate={this.routeUpdate.bind(this)}
            chosenRoute={this.state.chosenRoute}
            direction={this.state.direction}
            route_destination={this.state.route_origin}
            route_origin={this.state.route_origin}
            onDirectionUpdate={this.onDirectionUpdate.bind(this)}
            onChosenRouteUpdate={this.onChosenRouteUpdate.bind(this)} 
            onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}
            routeReset={this.routeReset.bind(this)}/>
       <div style={{marginTop: '2em'}}> </div>
        <TimeTableStop 
          stops={this.state.stops}
          startStop={this.state.startStop}
          direction={this.state.direction}
          onDirectionUpdate={this.onDirectionUpdate.bind(this)}
          onStopUpdate={this.onStopUpdate.bind(this)}
          onStopDeselect={this.onStopDeselect.bind(this)}
          chosenRoute={this.state.chosenRoute}/>
        <div style={{marginTop: '2em'}}> </div>
        <Select
          id="daySelect"
          name="form-field-name"
          options= {options}
          value={this.state.chosenDay}
          onChange={this.handleSelect}
          placeholder={"Select day of travel"}/>
        <div style={{marginTop: '2em'}}> </div>
        <Row><Col xs={2}></Col>
          <Col xs={8}>
        <Button onClick={this.getTable} bsStyle='warning' bsSize='large' block>Get Timetable
          </Button></Col></Row><div style={{marginTop: '2em'}}> </div><Row><Col xs={4}></Col>
          <Col xs={4}>{!(this.state.times===null) && <div className='timetable'>
    <Table 
    emptyText="Please ensure all options are selected to see a valid timetable"
    columns={columns} data={table} style={{fontSize: '12px', borderColor: '#000' }} /></div>
          }
          </Col><Col xs={4}></Col></Row>
        </Grid>
      </div>
    );
  }
};
export default TimeTable;
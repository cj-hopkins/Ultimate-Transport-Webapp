import React, { Component } from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import { Grid } from 'react-bootstrap';

class RealTimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        stops:[]
    }
  }

 async componentWillMount(){
    this.props.getPolyCoordinates([])
    let  stopIds
    const endpoint = '/api/getAllStopNumbers';
    try {
      const result = await fetch(endpoint)
      stopIds = await result.json();
      this.setState({
        stops: stopIds
      });
    } catch(e) {
      console.log(e);
    }
    const stopItems = []  // Format stops to use with dropdown
    stopIds.forEach(item => (
      stopItems.push({
        value: item.stop_id, 
        label: item.stop_id.toString()
            .concat(` ${item.address}, ${item.location_text}`)
        })
      ))
    this.setState({
      stopsAsOptions: stopItems
    })
   
   console.log('here')
   
  }
   handleSelect = (stopNum) => {
    this.props.onRealTimeStopUpdate(stopNum)
    this.props.onStopSelectGetRealTime(stopNum)
  } 
  render(){
    return (
      <Grid fluid={true}>        
      {/* <p style={{fontSize:'16px'}}>Search by stop number or address:</p>  */} 
      <VirtualizedSelect ref="citySelect"
					options={this.state.stopsAsOptions}
					simpleValue
					clearable
          placeholder="Search by Stop Number or Address"
					name="select-city"
					value={this.props.selectedRealTimeStop}
					onChange={this.handleSelect}
					searchable
				/>
      </Grid>
    );
  }
};
export default  RealTimePage ;

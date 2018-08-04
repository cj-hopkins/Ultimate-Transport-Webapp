import React, { Component } from 'react';
//import Select from "react-select";
import VirtualizedSelect from 'react-virtualized-select'

class RealTimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        stops:[]
    }
  }
 async componentWillMount(){
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
        label: item.stop_id
      })
    ))
    this.setState({
      stopsAsOptions: stopItems
    })
  }
   handleSelect = (stopNum) => {
    this.props.onRealTimeStopUpdate(stopNum)
     this.props.onStopSelectGetRealTime(stopNum)
  } 
  
  
  render(){
    return (
      <div>Search by stop number:
{/*       <Select
          id="startSelect"
          name="form-field-name"
          placeholder={"Select a stop"}
          options={this.state.stopsAsOptions}
          value={this.props.selectedRealTimeStop}
          onChange={this.handleSelect}  
        />    
        */}
        <VirtualizedSelect ref="citySelect"
					options={this.state.stopsAsOptions}
					simpleValue
					clearable
					name="select-city"
					value={this.props.selectedRealTimeStop}
					onChange={this.handleSelect}
					searchable
				/>
      </div>
    );
  }
};
export default  RealTimePage ;
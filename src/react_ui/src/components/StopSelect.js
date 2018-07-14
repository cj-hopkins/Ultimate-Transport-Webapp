import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import Select from "react-select";
// TODO: refactor to use a single handleSelect, pass the select name (start or finish)
// 

class StopSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOptionStart: "Start",
      selectedOptionFinish: "Finish",
    }
  }

  handleFinishSelect = (finish) => {
    const val = (finish !== null) ? finish.value : "Start"
    this.setState({
      selectedOptionFinish: val
    })
    this.props.onStopUpdate(false, val)
  }

  handleStartSelect = (start) => {
    const val = (start !== null) ? start.value : "Start"
    this.setState({
      selectedOptionStart: val
    })
    this.props.onStopUpdate(true, val)
  }
  
  handleToggle = (event) => {
    const currentStart = this.state.selectedOptionStart;
    const currentFinish = this.state.selectedOptionFinish;
    this.setState({
      selectedOptionStart: currentFinish,
      selectedOptionFinish: currentStart
    });
  }

  render() {
    // Format stops for the select elements
    let stopsAsOptions =[]
    {this.props.stops.forEach(item => (
      // TODO: find out why defining a const/let inside map doesn't work
      // let itemContent = {value: item.stop_id, label: item.stop_id.toString().concat
      // (" ", item.location_text, " ", item.address)};
      stopsAsOptions.push({value: item.stop_id, label: item.stop_id.toString()
        .concat(" ", item.location_text, " ", item.address)})
    ))}
    let finishStopsAsOptions = [...stopsAsOptions].reverse()

    return (
      <div>
        <Select
          id="startSelect"
          name="form-field-name"
          options={stopsAsOptions}
          value={this.state.selectedOptionStart}
          // onChange={this.handleChange}
          onChange={this.handleStartSelect}  
          placeholder={"Start stop"}
        />
        <Button onClick={this.handleToggle}> Swap start/finish</Button>
	 <div style={{marginTop: '1em'}}> </div>
        <Select
          id="finishSelect"
          name="form-field-name"
          options={[...stopsAsOptions].reverse()}
          value={this.state.selectedOptionFinish}
          // onChange={this.handleChange}
          // onChange={stop => this.setState({ selectedOptionFinish: stop.value })}  
          onChange={this.handleFinishSelect}  
          placeholder={"Finish stop"}
        />
      </div>
    )
  }
}

export default StopSelect

// class CustomSelect extends Component {
//   constructor(props){
//     super(props);
//   }

//   render () {
//     return (
//       <Select
//         id={this.props.id}
//         name={this.props.name}
//         options={this.props.options}
//         value={this.state.selectedOptionFinish}
//         // onChange={this.handleChange}
//         // onChange={stop => this.setState({ selectedOptionFinish: stop.value })}  
//         onChange={this.handleFinishSelect}  
//         placeholder={"Finish stop"}
//       />

//     )
//   }
// }
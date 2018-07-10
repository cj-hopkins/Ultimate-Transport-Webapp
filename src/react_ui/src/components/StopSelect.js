import React, { Component } from "react";
import Select from "react-select";

class StopSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOptionStart: "Start",
      selectedOptionFinish: "Finish",
    }
  }

  handleFinishSelect = (finish) => {
    this.setState({
      selectedOptionFinish: finish.value
    })
    this.props.onFinishStopUpdate(finish.value)
  }

  handleStartSelect = (start) => {
    this.setState({
      selectedOptionStart: start.value
    })
    this.props.onStartStopUpdate(start.value)
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

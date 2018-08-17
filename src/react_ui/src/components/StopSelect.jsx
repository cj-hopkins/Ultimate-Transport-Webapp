import React, { Component } from "react";
import Select from "react-select";

class StopSelect extends Component {
  handleFinishSelect = finish => {
    if (finish === null) {
      this.props.onStopDeselect("finish");
    } else {
      this.props.onStopUpdate(null, finish.value);
    }
  };

  handleStartSelect = start => {
    if (start === null) {
      this.props.onStopDeselect("start");
    } else {
      this.props.onStopUpdate(start.value, null);
      this.props.onSelectStartDisplayRealTimeButton(start.value)
    }
  };

  handleToggle = event => {
    this.props.onDirectionUpdate();
  };

  render() {
    let stopsAsOptions = [];
    
      this.props.stops.forEach(item =>
        stopsAsOptions.push({
          value: item.stop_id,
          label: item.stop_id.toString()
            .concat(` ${item.address}, ${item.location_text}`)
        })
      );
    
    return (
      <div>
        <Select
          id="startSelect"
          name="form-field-name"
          options={stopsAsOptions}
          value={this.props.startStop}
          // onChange={this.handleChange}
          onChange={this.handleStartSelect}
          placeholder={"Start stop"}
        />

        <div style={{ marginTop: "1em" }}> </div>
        <Select
          id="finishSelect"
          name="form-field-name"
          options={[...stopsAsOptions].reverse()}
          value={this.props.finishStop}
          onChange={this.handleFinishSelect}
          placeholder={"Finish stop"}
        />
      </div>
    );
  }
}

export default StopSelect;

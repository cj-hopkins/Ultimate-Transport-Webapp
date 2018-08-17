import React, { Component } from "react";
import Select from "react-select";

/* Page that will allow a user to choose a route, stop and day of travel. 
Returns timetable for that stop */

class TimeTableStop extends Component {
  handleStartSelect = start => {
    if (start === null) {
      this.props.onStopDeselect("start");
    } else {
      this.props.onStopUpdate(start.value, null);
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
          label: item.stop_id
            .toString()
            .concat(" ", item.location_text, " ", item.address)
        })
      );
    return (
      <div>
        <Select
          id="startSelect"
          name="form-field-name"
          options={stopsAsOptions}
          value={this.props.startStop}
          onChange={this.handleStartSelect}
          placeholder={"Select stop"}
        />
      </div>
    );
  }
}

export default TimeTableStop;

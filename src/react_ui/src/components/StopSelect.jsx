import React, { Component } from "react";
// import { Button } from 'react-bootstrap';
import Select from "react-select";
// TODO: refactor to use a single handleSelect, pass the select name (start or finish)

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
      this.props.fetchRealTime(start.value)
    }
  };

  handleToggle = event => {
    // const currentStart = this.props.startStop
    // const currentFinish = this.props.finishStop
    // const currentStart = this.state.selectedOptionStart;
    // const currentFinish = this.state.selectedOptionFinish;
    // this.setState({
    //   selectedOptionStart: currentFinish,
    //   selectedOptionFinish: currentStart
    // });
    // this.handleStartSelect(currentFinish);
    // this.handleFinishSelect(currentStart);
    // const newDirection = (this.props.direction === 'I') ? 'O' : 'I'
    this.props.onDirectionUpdate();
    // this.props.onStopUpdate(currentFinish, currentStart)
  };

  render() {
    // TODO put this in componentWillReceiveProps
    // Format stops for the select elements
    // console.log(this.props.stops);
    let stopsAsOptions = [];
    
      this.props.stops.forEach(item =>
        // TODO: find out why defining a const/let inside map doesn't work
        // let itemContent = {value: item.stop_id, label: item.stop_id.toString().concat
        // (" ", item.location_text, " ", item.address)};
        stopsAsOptions.push({
          value: item.stop_id,
          label: item.stop_id
            .toString()
            .concat(" ", item.location_text, " ", item.address)
        })
      );
    
    // let finishStopsAsOptions = [...stopsAsOptions].reverse();

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

        {/* <Button onClick={this.handleToggle}> Swap start/finish</Button> */}

        <div style={{ marginTop: "1em" }}> </div>
        <Select
          id="finishSelect"
          name="form-field-name"
          options={[...stopsAsOptions].reverse()}
          value={this.props.finishStop}
          // onChange={this.handleChange}
          // onChange={stop => this.setState({ selectedOptionFinish: stop.value })}
          onChange={this.handleFinishSelect}
          placeholder={"Finish stop"}
        />
      </div>
    );
  }
}

export default StopSelect;

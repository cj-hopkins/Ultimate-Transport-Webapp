import React, { Component } from 'react';
import Select from 'react-select';

class StopSelect extends Component {
  state = {
    selectedOption: '',
    selectedOptionStart: 'Start',
    selectedOptionFinish: 'Finish',
    opts1: "",
  }
  // handleChange = (event) => {
  //   console.log(event)
  //   this.setState({
  //     selectedOptionStart: event
  //   })
    // console.log(name)
    // this.setState({ selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    // if (selectedOption) {
    //   console.log(`Selected: ${selectedOption.label}`);
    // }
  // }
  render() {
    // Format stops for the select elements
    let stopsAsOptions =[]
    {this.props.stops.map(item => (
      // TODO: find out why defining a var inside map doesn't work
      // let itemContent = {value: item.stop_id, label: item.stop_id.toString().concat
      // (" ", item.location_text, " ", item.address)};
      stopsAsOptions.push({value: item.stop_id, label: item.stop_id.toString()
        .concat(" ", item.location_text, " ", item.address)})
    ))}
    let finishStopsAsOptions = [...stopsAsOptions].reverse();

    return (
      <div>
        <Select
          id="startSelect"
          name="form-field-name"
          options={stopsAsOptions}
          value={this.state.selectedOptionStart}
          // onChange={this.handleChange}
          onChange={value => this.setState({ selectedOptionStart: value })}  
          placeholder={"Start stop"}
        />

        <Select
          id="finishSelect"
          name="form-field-name"
          options={[...stopsAsOptions].reverse()}
          value={this.state.selectedOptionFinish}
          // onChange={this.handleChange}
          onChange={value => this.setState({ selectedOptionFinish: value })}  
          placeholder={"Finish stop"}
        />
      </div>
    );
  }
}

export default StopSelect;

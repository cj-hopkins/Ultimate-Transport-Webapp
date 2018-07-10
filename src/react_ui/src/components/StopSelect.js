import React, { Component } from 'react';
import Select from 'react-select';

class StopSelect extends Component {
    constructor(props){
        super(props);

    this.state = {
        selectedOption: '',
        selectedOptionStart: 'Start',
        selectedOptionFinish: 'Finish',
        opts1: "",
    }
}

    startSelect = (start) => {
        this.setState({
            selectedOptionStart: start.value
        })
        this.props.onStartSelect(start.value)
    }

    finishSelect = (finish) => {
        this.setState({
            selectedOptionFinish: finish.value
        })
        this.props.onFinishSelect(finish.value)
    }

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
          onChange={this.startSelect}  
          placeholder={"Start stop"}
        />
	 <div style={{marginTop: '1em'}}> </div>
        <Select
          id="finishSelect"
          name="form-field-name"
          options={[...stopsAsOptions].reverse()}
          value={this.state.selectedOptionFinish}
          // onChange={this.handleChange}
          onChange={this.finishSelect}  
          placeholder={"Finish stop"}
        />
      </div>
    );
  }
}

export default StopSelect;

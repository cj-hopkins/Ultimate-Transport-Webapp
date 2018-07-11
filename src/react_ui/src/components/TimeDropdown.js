import React, { Component } from 'react';
import TimePicker from 'react-bootstrap-time-picker';

class TimeDropdown extends Component {
  constructor() {
    super();

    this.handleTimeChange = this.handleTimeChange.bind(this);

    this.state = { time: 0 };
  }

  handleTimeChange(time) {
    // seconds passed midnight (prints "3600" if "01:00" is picked) 
    //console.log(time);  
    this.setState({ time });
  }

  render() {
    return (
      <div>
        <TimePicker start="06:30" end="23:30" step={30}  onChange={this.handleTimeChange} value={this.state.time} />
      </div>
    );
  }
}
export default TimeDropdown

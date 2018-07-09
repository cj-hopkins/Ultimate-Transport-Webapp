import React, { Component } from 'react';
import TimePicker from 'react-bootstrap-time-picker';

class TimeDropdown extends Component {


  render() {
    return (
      <div>
        <TimePicker start="10:00" end="23:30" step={30} />
      </div>
    );
  }
}
export default TimeDropdown

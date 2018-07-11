
import React, { Component } from 'react';
import Calendar from 'react-calendar';
 
class CalendarFunctionality extends Component {
  state = {
    date: new Date(),
  }
 
  onChange = date => {
    this.setState({ date })
    //console.log(date)
  };  
 
  render() {
    return (
      <div>
        <br/>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}
export default CalendarFunctionality

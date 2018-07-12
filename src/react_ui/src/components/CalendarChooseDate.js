import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
 
import 'react-datepicker/dist/react-datepicker.css';
 
// CSS Modules, react-datepicker-cssmodules.css
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';
 
{/* https://reactdatepicker.com/ */}

class CalendarChooseDate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
 
  render() {
    return <DatePicker
        selected={this.state.startDate}   //when day is clicked
        onChange={this.handleChange}   // when value has changed
        minDate = {moment()}
        highlightDates={[moment()]}    
             
    />; 
  }
}

export default CalendarChooseDate
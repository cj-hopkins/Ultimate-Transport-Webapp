import React, { Component } from "react"
import { Button } from "react-bootstrap"
import { Grid, Row, Col, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


class TimeButton extends Component {
  state = {
      isHidden: true
  }
  toggleHidden () {
    this.setState({
      isHidden: false
    })
  }
  render () {
    return (
      <div>
        <Button onClick={this.toggleHidden.bind(this)}  bsStyle='primary' >
                 Change time and date
            </Button>
  
        {!this.state.isHidden && <Grid><Row><Col><TimeDropdown /></Col><Col> <CalendarChooseDate/></Col></Row></Grid>}
      </div>
    )
  }
}

class CalendarChooseDate extends Component {
    state={  
      startDate: moment()
    };
    handleChange = this.handleChange.bind(this);
  
 
  handleChange(date) {
    this.setState({
      startDate: date
    });
    console.log('Chosen Date:'+this.state.startDate);
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


class TimeDropdown extends Component {
  constructor() {
    super();

    this.handleTimeChange = this.handleTimeChange.bind(this);

    this.state = { time: 0 };
  }

  handleTimeChange(time) {
    // seconds passed midnight (prints "3600" if "01:00" is picked) 
    this.setState({ time });
    console.log('Time chosen'+time)
  }

  render() {
    return (
      <div>
        <TimePicker start="06:30" end="23:30" step={30}  onChange={this.handleTimeChange} value={this.state.time} />
      </div>
    );
  }
}

export default TimeButton
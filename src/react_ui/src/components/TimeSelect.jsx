import React, { Component } from "react";
import { Button, Grid, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from "react-bootstrap-time-picker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class TimeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      plannedTime: "",
      isDefaultTime:  true
    };
  }
  
   //ensures time in format 'seconds past midnight' on load of page
    componentDidMount() {   
      const newTime = moment();
      const newTimeMidnight = newTime.clone().startOf("day");
      const diffInSeconds = newTime.diff(newTimeMidnight, "seconds");

      this.setState({
        plannedTime: diffInSeconds,
        isDefaultTime: true
      });
      this.props.onPageLoadSetTime(diffInSeconds);
      this.props.onPageLoadSetDate(newTime);
    }
  
  toggleHidden() {
    this.setState({
      isHidden: false
    });
  }
  
  onResetNow(){
    this.setState({
      isHidden: !this.state.isHidden
    });
  }
  
  dateUpdate(date) {
    this.setState({
      plannedTime: date
    });
    this.props.onSelectDate(date);
  }

  timeUpdate(time) {
    this.setState({
      plannedTime: time
    });
    this.props.onSelectTime(time);
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.toggleHidden.bind(this)}
          bsStyle="primary"
          bsSize="large"
          block
        >
          {" "}
          Change Time
        </Button>
        {!this.state.isHidden && (
          <Grid>
            <Row>
              <Col>
                <TimeDropdown
                  plannedTime= {this.props.plannedTime}
                  onSelectTime={this.timeUpdate.bind(this)} 
                  />
              </Col>
              <Col>
                {" "}
                <CalendarChooseDate
                  plannedDate={this.props.plannedDate}
                  onSelectDate={this.dateUpdate.bind(this)}
                />
              </Col>
              <Col>
                <NowButton
                  onResetTime={this.props.onResetTime.bind(this)}
                  onSelectTime={this.timeUpdate.bind(this)}
                  onSelectDate={this.dateUpdate.bind(this)}
                />
              </Col>
            </Row>
          </Grid>
        )}
      </div>
    );
  }
}

class CalendarChooseDate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plannedDate: moment()
    };
  }
  handleChange(date) {
    this.props.onSelectDate(date);
  }

  render() {
    return (
      <DatePicker
        selected={this.props.plannedDate} //when day clicked
        onChange={this.handleChange.bind(this)} // when value changed
        minDate={moment()}
        highlightDates={[moment()]}
        dateFormat="LL"
      />
    );
  }
}

class TimeDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plannedTimeNotNow: moment()
    };
  }

  handleTimeChange(time) { // seconds passed midnight
    const newTime = moment.utc(time*1000).format('HH:mm')
    this.setState({
      chosenTime: time
    });
    this.props.onSelectTime(time);
  }

  render() {
    return (
      <div>
        <TimePicker
          /* https://stackoverflow.com/questions/25323823/round-moment-js-object-time-to-nearest-30-minute-interval*/
          start= { (moment(moment()).add(30 - (moment().minute() % 30) , "minutes").format('HH:mm')).toString()}
          end="23:30"
        /*    format="24"  */
          step={30}
          onChange={this.handleTimeChange.bind(this)}
          value={this.state.chosenTime}
        />
      </div>
    );
  }
}

class NowButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plannedTime: moment()
    };
  }

  handleClick(date) {
    const newTime = moment();
    const newTimeMidnight = newTime.clone().startOf("day");
    const diffInSeconds = newTime.diff(newTimeMidnight, "seconds");

    this.setState({
      plannedTime: diffInSeconds
    });
    this.props.onResetTime(newTime, diffInSeconds);
    console.log("Time from now button:" + this.state.plannedTime);
  }
 

  render() {
    return (
      <div>
        <Button
          value={this.state.plannedTime}
          bsStyle="default"
          onClick={this.handleClick.bind(this)}
          block
        >
          {" "}
          Leave now
        </Button>
      </div>
    );
  }
}

export default TimeButton;

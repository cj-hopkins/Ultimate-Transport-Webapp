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
      plannedTime: ""
    };
  }
  toggleHidden() {
    this.setState({
      isHidden: false
    });
  }

  dateUpdate(date) {
    this.setState({
      plannedTime: date
    });
    this.props.onSelectDate(date);
  }

  timeUpdate(time) {
    this.props.onSelectTime(time);
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.toggleHidden.bind(this)}
          bsStyle="primary"
          bsSize="medium"
          block
        >
          {" "}
          Change Time
        </Button>
        {!this.state.isHidden && (
          <Grid>
            <Row>
              <Col>
                <TimeDropdown onSelectTime={this.timeUpdate.bind(this)} />
              </Col>
              <Col>
                {" "}
                <CalendarChooseDate onSelectDate={this.dateUpdate.bind(this)} />
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
    // console.log(date)
    this.setState({
      plannedDate: date
    });
    this.props.onSelectDate(date);
    // console.log('Date from Calendar:'+this.state.plannedDate);
  }

  render() {
    return (
      <DatePicker
        selected={this.state.plannedDate} //when day clicked
        onChange={this.handleChange.bind(this)} // when value changed
        minDate={moment()}
        highlightDates={[moment()]}
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

  handleTimeChange(time) {
    // seconds passed midnight (prints "3600" if "01:00" is picked)
    console.log(time);
    this.setState({
      plannedTimeNotNow: time
    });
    this.props.onSelectTime(time);
    console.log("Time from Dropdown" + this.state.plannedTimeNotNow);
  }

  render() {
    return (
      <div>
        <TimePicker
          start="06:30"
          end="23:30"
          step={30}
          onChange={this.handleTimeChange.bind(this)}
          value={this.state.plannedTimeNotNow}
        />
      </div>
    );
  }
}

export class NowButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plannedTime: moment()
    };
  }

  //   timeUpdate(time){
  //      this.props.onSelectTime(time)
  //  }

  componentDidMount() {
    this.handleClick();
  }

  handleClick(date) {
    const newTime = moment();
    const newTimeMidnight = newTime.clone().startOf("day");
    const diffInSeconds = newTime.diff(newTimeMidnight, "seconds");

    this.setState({
      plannedTime: diffInSeconds
    });
    this.props.onSelectTime(diffInSeconds);
    this.props.onSelectDate(newTime);
    console.log("Time from now button:" + this.state.plannedTime);
  }

  render() {
    return (
      <div>
        <Button
          value={this.state.plannedTime}
          bsStyle="primary"
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

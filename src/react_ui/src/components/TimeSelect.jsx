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
      isDefaultTime: true
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
  onResetNow() {
    this.setState({
      isHidden: !this.state.isHidden,
      isDefaultTime: true
    });
    this.props.onResetNowContentBlock();
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
          style={{ marginBottom: "5px" }}
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
              <Col md={4} xs={4}>
                <TimeDropdown
                  dateOfMonthToTravel={this.props.dateOfMonthToTravel}
                  plannedTime={this.props.plannedTime}
                  plannedDate={this.props.plannedDate}
                  onSelectTime={this.timeUpdate.bind(this)}
                  onSelectDate={this.dateUpdate.bind(this)}
                />
              </Col>
              <Col md={4} xs={12}>
                {" "}
                <CalendarChooseDate
                  dateOfMonthToTravel={this.props.dateOfMonthToTravel}
                  plannedDate={this.props.plannedDate}
                  onSelectDate={this.dateUpdate.bind(this)}
                />
              </Col>
              <Col md={4} xs={4}>
                <NowButton
                  dateOfMonthToTravel={this.props.dateOfMonthToTravel}
                  onResetNow={this.onResetNow.bind(this)}
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
        dateFormat="DD-MM-YYYY "
        style={{ width: "100%" }}
      />
    );
  }
}
class TimeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plannedTimeNotNow: moment(),
      todaysDate: moment()
        .month()
        .toString()
        .concat(moment().date())
        .toString()
    };
  }
  handleTimeChange(time) {
    // seconds passed midnight
    this.setState({
      chosenTime: time
    });
    this.props.onSelectTime(time);
  }
  render() {
    let startingTime;
    const todaysDate = moment()
      .month()
      .toString()
      .concat(moment().date())
      .toString();
    if (this.props.dateOfMonthToTravel === this.state.todaysDate) {
      /* https://stackoverflow.com/questions/25323823/round-moment-js-object-time-to-nearest-30-minute-interval*/
      startingTime = moment(moment())
        .add(30 - (moment().minute() % 30), "minutes")
        .format("HH:mm")
        .toString();
    } else {
      startingTime = "06:30";
    }
    return (
      <div>
        <TimePicker
          start={startingTime}
          end="23:30"
          step={30}
          onChange={this.handleTimeChange.bind(this)}
          value={this.state.chosenTime}
          style={{ fontSize: "14px" }}
        />
      </div>
    );
  }
}
class NowButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plannedTime: moment(),
      isDefaultTime: false
    };
  }
  handleClick(date) {
    const newTime = moment();
    const newTimeMidnight = newTime.clone().startOf("day");
    const diffInSeconds = newTime.diff(newTimeMidnight, "seconds");
    this.setState({
      plannedTime: diffInSeconds,
      isDefaultTime: true
    });
    this.props.onSelectTime(diffInSeconds);
    this.props.onSelectDate(newTime);
    this.props.onResetNow();
  }
  render() {
    return (
      <div>
        <Button
          className="float-right"
          value={this.state.plannedTime}
          style={{ fontSize: "14px", textAlign: "left" }}
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

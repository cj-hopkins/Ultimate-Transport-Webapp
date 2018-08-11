import React, {Component} from "react";
import {Badge} from "react-bootstrap";
import ReactTooltip from 'react-tooltip'

class WeatherWidget extends Component{
  state = {
    temperature: undefined,
    description: undefined,
    icon: undefined
  }
  componentWillMount() {
    const endPoint = '/api/getCurrentWeather'
    fetch(endPoint)
      .then(res => res.json())
        .then(
        (data) => {
          this.setState({
            temperature: data[0].temperature,
            description: data[0].description,
            icon: data[0].icon
          });
        },
      )
  }
  render() {
    return(
      <div>  
        <p></p> {/* empty paragraph for space at top*/}
      <img data-tip="Current weather" src={`https://openweathermap.org/img/w/${this.state.icon}.png`} alt={this.state.description}/><ReactTooltip />  
      <h3><Badge pullRight={true} bsStyle="warning">{this.state.temperature}°C</ Badge></h3>
      </div>
      );
  }
};
export default WeatherWidget;

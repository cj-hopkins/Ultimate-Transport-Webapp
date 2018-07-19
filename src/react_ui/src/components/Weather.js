import React, {Component} from "react";
import {Badge} from "react-bootstrap";


class WeatherWidget extends Component{
  state = {
    temperature: undefined,
    description: undefined,
    icon: undefined
  }

  componentDidMount() {
    // fetch(`http://api.openweathermap.org/data/2.5/weather?q=Dublin,ie&appid=${API_KEY}&units=metric`)
    const endPoint = '/api/getCurrentWeather'
    fetch(endPoint)
      .then(res => res.json())
      // .then(data => console.log(data)
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
      <h3><Badge pullRight='true' bsStyle="warning">{this.state.temperature} °C</ Badge></h3>
      <img src={`https://openweathermap.org/img/w/${this.state.icon}.png`} alt='Temperature'/>  
      </div>
      );
  }
};
export default WeatherWidget;
import React, {Component} from "react";
import {Badge} from "react-bootstrap";



const API_KEY = "2abe029b7b8d40e80d1ed447f4522f0d";
{/* Orla's key in case Conor's one stops woking
const API_KEY = "70ef396e3ce3949e0934b4428e41f453";*/}


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
      <img src={`https://openweathermap.org/img/w/${this.state.icon}.png`}/>  
      </div>
      );
  }
};
export default WeatherWidget;
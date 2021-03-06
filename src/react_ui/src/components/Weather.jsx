/* Weather icon and temperature at the top of every page */
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
    .catch((error) => <p> An error occurred </p> ) 
    }
  
  render() {
    return(
      <div style={{marginRight:'10px'}}>  
        <p></p> {/* empty paragraph for space at top*/}
      <img  src={`https://openweathermap.org/img/w/${this.state.icon}.png`} alt={this.state.description}/>
      <h3><Badge pullRight={true} bsStyle="warning">{this.state.temperature}°C</ Badge></h3>
      </div>
      );
  }
};
export default WeatherWidget;

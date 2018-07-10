import React from "react";


const API_KEY = "2abe029b7b8d40e80d1ed447f4522f0d";

class WeatherWidget extends React.Component{
  state = {
    temperature: undefined,
    description: undefined,
    icon: undefined
  }

  componentDidMount() {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=Dublin,ie&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(
        (data) => {
          this.setState({
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
          });
        },
      )
  }


  render() {
    return(
      <div>
      <p>Temperature: {this.state.temperature}</p>
      <p>Description: {this.state.description}</p> 
              
      </div>
      );
  }
};

export default WeatherWidget;
// import ReactDOM from 'react-dom';
import React from 'react';
import Calendar from 'react-calendar';
import TimePicker from 'react-bootstrap-time-picker';

class RouteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      value2: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
    
  handleChange2(event) {
    this.setState({value2: event.target.value});
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    console.log('Bus Route selected : ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form id="form" onSubmit={this.handleSubmit}>
        <label>
          Select a start point:
        <input type="text" name = "value" onChange={this.handleChange} />
        </label>
        
        <label>
          Select a destination:
        <input type="text" name="value2" onChange={this.handleChange2} />
        </label>
        <input type="submit" value="Submit" />
        
        <TimePicker
       theme= "classic"
       timeMode="12"
       onChange={this.onChange}
       />
       <Calendar
//         calendarType='US'
         onChange={this.onChange}
         value={this.state.date}
       />
    
      </form>
        


    /*<form id="form" onSubmit={this.handleSubmit}>
        <label>
          Pick route number:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="7">7</option>
            <option value="46A">46A</option>
            <option value="17">17</option>
            <option value="15">15</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>*/
    );  
  }
}

export default RouteForm;

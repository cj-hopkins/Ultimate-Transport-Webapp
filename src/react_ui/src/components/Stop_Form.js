import React, { Component } from 'react';
// import Http from './Http';

//class StopForm extends Component {
//  constructor () {
//    super() 
//
//    // this.handleClick = this.handleClick.bind(this);
//    handleClick = () => {
//      console.log(this)
//    }
//  }
//
//    // handleClick(){
//    //   console.log("clicked");
//      
//    // };
//  render() {
//
//    return (
//    <div className='button_container'>
//      <button className='button' onClick={this.handleClick}>Click me!</button>
//    </div>
//     // <form onSubmit={this.handleSubmit}>
//     //      <label>
//     //           Name:
//     //           <input type="text" value={this.state.value} onChange={this.handleChange} />
//     //      </label>
//     //      <input type="submit" value="Submit" />
//     //      </form>
//    );
//  }
//}

class RouteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    console.log('Bus Route selected : ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Select a start point:
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          Select a destination:
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


export default RouteForm;

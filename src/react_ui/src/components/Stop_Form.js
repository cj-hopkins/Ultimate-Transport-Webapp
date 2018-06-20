import React, { Component } from 'react';
// import Http from './Http';
import 'whatwg-fetch';

class StopForm extends Component {
  constructor () {
    super() 
    this.state = {
      // response: ''
    };
    // this.handleClick = this.handleClick.bind(this);
    }


    // handleClick = () => {
    //   console.log(this)
    // }

    componentDidMount(){
    const endpoint = '/api'
    let lookupOptions = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
      }

    fetch(endpoint, lookupOptions)
    .then(results => results.json())
    .then(reply => {
    console.log(reply)
    this.setState({
      response: reply
    })
    console.log(this.state.response)
    })
    };


  render() {

    if (!this.state.response) return (<p>Loading</p>);

    return (
    <div className='button_container'>
      <p>{this.state.response[0].fields.stop_name}</p>
    </div>
     // <form onSubmit={this.handleSubmit}>
     //      <label>
     //           Name:
     //           <input type="text" value={this.state.value} onChange={this.handleChange} />
     //      </label>
     //      <input type="submit" value="Submit" />
     //      </form>
    );
  }
}


export default StopForm;

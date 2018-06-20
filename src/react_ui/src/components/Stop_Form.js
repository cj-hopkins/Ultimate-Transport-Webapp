import React, { Component } from 'react';
// import Http from './Http';

class StopForm extends Component {
  constructor () {
    super() 

    // this.handleClick = this.handleClick.bind(this);
    handleClick = () => {
      console.log(this)
    }
  }

    // handleClick(){
    //   console.log("clicked");
      
    // };
  render() {

    return (
    <div className='button_container'>
      <button className='button' onClick={this.handleClick}>Click me!</button>
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

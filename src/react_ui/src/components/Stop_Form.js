import React, { Component } from 'react';
import LoadingSpinner from './Loading';

class StopForm extends Component {
  constructor () {
    super() 
    this.state = {
      showContent: false
      // stops: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleContent = this.toggleContent.bind(this);
  }

    async componentDidMount(){

      const endpoint = '/api';
      try {
        const res = await fetch(endpoint);
        const stops = await res.json();
        this.setState({
          stops: stops
        });
      } catch(e) {
        console.log(e);
      }
      console.log(this.state.stops)
  };

    handleChange(){
    }

    handleSubmit(){
      
    }

    toggleContent(event){
      event.preventDefault()
      this.setState({
        showContent: !this.state.showContent
      })
    }

  render() {

    if (!this.state.stops) return (<LoadingSpinner />);

    return (
    <div className='button_container'>
      {/*<form onSubmit={this.handleSubmit}>
       <label>
               Name:
               <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
          </form>
          */}
          <button onClick={this.toggleContent}>show bus-stops</button>
          <div className={` ${this.state.showContent === true ? 'd-block' : 'd-none'}` }>
            {this.state.stops.map(item => (
              <div>
                <h1>{item.stop_id}</h1>
                <span>{item.stop_name}</span>
              </div>
            ))}
          </div>
    </div>
    );
  }
}


export default StopForm;

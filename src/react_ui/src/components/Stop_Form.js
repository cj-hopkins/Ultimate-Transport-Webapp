import React, { Component } from 'react';

class StopForm extends Component {
  constructor () {
    super() 
    this.state = {
      showContent: false,
      stops: [],
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
      // console.log(this.state.stops)
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

    // if (!this.state.stops) return (<LoadingSpinner />);

    return (
    <div className='button_container'>
          <button onClick={this.toggleContent}>show bus-stops</button>
          <div className={` ${this.state.showContent === true ? 'd-block' : 'd-none'}` }>
            {this.state.stops.map(item => (
              <div key={item.identifier}>
                <h1>{item.identifier}</h1>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
    </div>
    );
  }
}


export default StopForm;

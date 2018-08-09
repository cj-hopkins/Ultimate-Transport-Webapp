import React, { Component } from "react";

class JourneyContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }


  render(){
    //only show if we have a prediction
    if (this.props.prediction === null) {
      return(<div></div>)
    }

    return (
      <p>{this.props.prediction}</p>
    )
  }
}

export default JourneyContainer
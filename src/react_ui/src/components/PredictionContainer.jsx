import React, { Component } from "react";

class PredictionContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render(){
    if (this.props.prediction === null) {  //only show if we have a prediction
      return(<div></div>)
    }
    return (
      <p>{this.props.prediction}</p>
    )
  }
}
export default PredictionContainer
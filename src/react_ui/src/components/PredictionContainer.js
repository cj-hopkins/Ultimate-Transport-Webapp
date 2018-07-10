import React, { Component } from "react";

class PredictionContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }

    // this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
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

export default PredictionContainer
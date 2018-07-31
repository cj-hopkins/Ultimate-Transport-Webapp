import React , {Component} from "react";
export default class RealTimeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      nextBuses: []
    };
  }
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }
  render(){
    return (
      <div>
          <p>Real Time Information for Stop {this.props.startStop}</p>
      </div>
      )
  }
}
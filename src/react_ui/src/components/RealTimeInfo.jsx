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
  fetchRealTime(stopid){
  const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
  fetch(endpoint)
    .then (response => response.json())
    .then(parsedJSON => {
//            console.log(parsedJSON.results)
          this.setState({   //slice(0,4) to limit to top 4 results 
              nextBuses: parsedJSON.results.slice(0, 4).map((post, i) => (
                <tr key={i} >
                  <td>{post.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td>{post.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td>{post.duetime} minutes </td>
                </tr>
              ))
          });
   })
    .catch(error => console.log('parsing failed',error))
  }
  render(){
    return (
      <div>
          <p>Real Time Information for Stop {this.props.startStop}</p>
      </div>
      )
  }
}
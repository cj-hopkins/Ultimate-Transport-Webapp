import React, { Component } from 'react';
import Select from "react-select";

class RealTimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isRealTimeHidden:true
    }
  }
   fetchRealTime(stopid){
     this.setState({
      isRealTimeHidden:false
    })
    const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stopid}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
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
      
      <div>Search by stop number:
      
       <Select
          id="startSelect"
          name="form-field-name"
          placeholder={"Start stop"}
        />
      
      
      
      </div>
    );
  }
};

export default  RealTimePage ;

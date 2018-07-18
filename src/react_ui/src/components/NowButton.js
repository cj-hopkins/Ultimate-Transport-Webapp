import moment from 'moment';
import React, { Component } from 'react';
import { Button } from "react-bootstrap";


class NowButton extends Component {
  state = {
    date:moment()
  }

  handleClick = this.handleClick.bind(this);

  handleClick(date) {
    this.setState({
      date: date
    });
    console.log('NOW BUTTON:'+this.state.date);
  }
 
render() {
    return (
      <div>
        <Button 
          value={this.state.date}
        bsStyle="primary" onClick ={this.handleClick}> Leave now </Button>  
      </div>
    );
  }
}
export default NowButton

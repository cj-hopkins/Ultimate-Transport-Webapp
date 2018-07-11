import React, { Component } from 'react';
import { Button } from "react-bootstrap"


class NowButton extends Component {
  state = {
    date: new Date(),
  }
 
 
  render() {
    return (
      <div>
        <Button 
          value={this.state.date}
        bsStyle="primary"> Leave now </Button>  
      </div>
    );
  }
}
export default NowButton

import React, { Component } from "react"
import TimeDropdown from './TimeDropdown'
import { Button } from "react-bootstrap"

class TimeButton extends Component {
  constructor () {
    super()
    this.state = {
      isHidden: true
    }
  }
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }
  render () {
    return (
      <div>
        <Button onClick={this.toggleHidden.bind(this)}  bsStyle='primary' bsSize='small' block>
                 Change Time
            </Button>
  
        {!this.state.isHidden && <TimeDropdown />}
      </div>
    )
  }
}

export default TimeButton
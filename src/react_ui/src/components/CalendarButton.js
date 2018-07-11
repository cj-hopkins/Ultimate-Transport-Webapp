import React, { Component } from "react"
import CalendarFunctionality from './CalendarFunctionality'
import { Button } from "react-bootstrap"

class CalendarButton extends Component {
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
        <Button onClick={this.toggleHidden.bind(this)}  bsStyle='primary' >
                 Change Date
            </Button>
  
        {!this.state.isHidden && <CalendarFunctionality />}
      </div>
    )
  }
}

export default CalendarButton
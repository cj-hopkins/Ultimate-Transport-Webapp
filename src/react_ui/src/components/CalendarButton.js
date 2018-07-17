import React, { Component } from "react"
import CalendarChooseDate from './CalendarChooseDate'
import { Button } from "react-bootstrap"

import DatePicker from './CalendarChooseDate'

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
        <Button onClick={this.toggleHidden.bind(this)}  bsStyle='primary' bsSize='small' block>
                 Change Date
            </Button>
  
  {/*      {!this.state.isHidden && <CalendarFunctionality />}   */}
        
        {!this.state.isHidden && < CalendarChooseDate />} 
      </div>
    )
  }
}

export default CalendarButton
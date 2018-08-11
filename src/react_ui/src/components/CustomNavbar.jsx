import React, { Component } from "react";
import { Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import ReactTooltip from 'react-tooltip'

class CustomNavbar extends Component {
  render() {
    return (
      <Nav style={{ display: "flex", flexDirection: "row" , fontSize:'16px'}}>
        <NavItem eventKey={0} onSelect={this.props.swapUI} data-tip='If you know the bus number'><ReactTooltip />
          By Route
        </NavItem>
        <NavItem eventKey={1} onSelect={this.props.swapUI} data-tip="If you don't know the bus number"><ReactTooltip />
          By Address
        </NavItem>
        <NavItem eventKey={2} onSelect={this.props.swapUI} data-tip='Timetables for all buses'><ReactTooltip />
          Timetables
        </NavItem>
        <NavItem eventKey={3} onSelect={this.props.swapUI} data-tip='Real time info for all stops'><ReactTooltip />
          Real Time Info
        </NavItem>
        <NavDropdown eventKey={4} title="More" id="basic-nav-dropdown">
          <MenuItem eventKey={4.1} href='http://www.dublinbus.ie' target='blank'>Dublin Bus</MenuItem>
          <MenuItem eventKey={4.2} href='https://www.facebook.com/DublinBusNews/' target='blank'>Facebook</MenuItem>
          <MenuItem eventKey={4.3} onSelect={this.props.swapUI} >Twitter Feed</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={4.4}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}
export default CustomNavbar;

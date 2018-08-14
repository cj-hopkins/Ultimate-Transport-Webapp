import React, { Component } from "react";
import { Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import ReactTooltip from 'react-tooltip'

class CustomNavbar extends Component {
  render() {
    return (
      <Nav style={{ display: "flex", flexDirection: "row" , fontSize:'16px'}}>
        <NavItem eventKey={0} onSelect={this.props.swapUI} data-tip='Plan using bus number'><ReactTooltip />
          By Route
        </NavItem>
        <NavItem eventKey={1} onSelect={this.props.swapUI} data-tip="Plan using locations"><ReactTooltip />
          By Address
        </NavItem>
        <NavItem eventKey={2} onSelect={this.props.swapUI} data-tip='For each stop'><ReactTooltip />
          Timetables
        </NavItem>
        <NavItem eventKey={3} onSelect={this.props.swapUI} data-tip='For each stop'><ReactTooltip />
          Real Time Info
        </NavItem>
        <NavDropdown eventKey={4} title="More" id="basic-nav-dropdown">
          <MenuItem eventKey={4.3} onSelect={this.props.swapUI} >Twitter Feed</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}
export default CustomNavbar;

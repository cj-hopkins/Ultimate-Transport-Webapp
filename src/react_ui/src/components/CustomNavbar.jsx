import React, { Component } from "react";
import { Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";

class CustomNavbar extends Component {
  render() {
    return (
      <Nav style={{ display: "flex", flexDirection: "row" }}>
        <NavItem eventKey={0} onSelect={this.props.swapUI}>
          Bus Routes
        </NavItem>
        <NavItem eventKey={1} onSelect={this.props.swapUI}>
          Journey Planner
        </NavItem>
        <NavItem eventKey={2} onSelect={this.props.swapUI}>
          Timetables
        </NavItem>
        <NavItem eventKey={3} onSelect={this.props.swapUI}>
          Real Time Info
        </NavItem>
        <NavDropdown eventKey={4} title="More" id="basic-nav-dropdown">
          <MenuItem eventKey={4.1} href='http://www.dublinbus.ie' target='blank'>Dublin Bus</MenuItem>
          <MenuItem eventKey={4.2} href='https://www.facebook.com/DublinBusNews/' target='blank'>Facebook</MenuItem>
          <MenuItem eventKey={4.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={4.4}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}
export default CustomNavbar;
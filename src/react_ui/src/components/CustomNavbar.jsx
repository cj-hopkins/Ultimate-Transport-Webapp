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
        <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>News</MenuItem>
          <MenuItem eventKey={3.2}>Timetables</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.4}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}

export default CustomNavbar;

import React, { Component } from "react";
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import ReactTooltip from 'react-tooltip'

class CustomNavbar extends Component {
  render() {
    return (
      <Navbar style={{padding:'0'}}>
      <Nav style={{ display: "inline-flex", flexDirection: "row" , padding:'0',fontSize:'14px'}}>
        <NavItem eventKey={0} onSelect={this.props.swapUI} data-tip='Plan using bus number'><ReactTooltip />
          By Route
        </NavItem>
        <NavItem eventKey={1} onSelect={this.props.swapUI} data-tip="Plan using locations"><ReactTooltip />
          By Address
        </NavItem>
        <NavItem eventKey={2} onSelect={this.props.swapUI} >
          Timetables
        </NavItem>
        <NavItem eventKey={3} onSelect={this.props.swapUI} >
          Real Time Info
        </NavItem>
        <NavDropdown eventKey={4} title="More" id="basic-nav-dropdown">
          <MenuItem style={{ padding:'0', width:'30px'}} eventKey={4.3} onSelect={this.props.swapUI} >Twitter Feed</MenuItem>
          <MenuItem style={{ padding:'0', width:'30px'}} eventKey={4.4} href="https://docs.google.com/forms/d/19MOVUQfcuwqBbxna6HVr4HycpMutYrlFwO3t_eJzG74/viewform?ts=5b61c3a8&edit_requested=true" target='blank'>Feedback Form</MenuItem>
        </NavDropdown>
      </Nav>
        </Navbar>
    );
  }
}
export default CustomNavbar;

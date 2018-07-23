import React, { Component } from "react";
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";

class CustomNavbar extends Component {
  constructor(props){
    super(props);
  }


  render() {
    return (
      <Navbar style={{display:"flex", flexDirection:"row"}}>
        {/* <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">React-Bootstrap</a>
          </Navbar.Brand>
        </Navbar.Header> */}
        <Nav style={{display:"flex", flexDirection:"row"}}>
          <NavItem eventKey={0} onSelect={this.props.swapUI}>
            Bus Routes
          </NavItem>
          <NavItem eventKey={1} onSelect={this.props.swapUI}>
            Journey Planner
          </NavItem>
          <NavItem eventKey={2} onSelect={this.props.swapUI}>
            Timetables
          </NavItem>
          {/* <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.4}>Separated link</MenuItem>
          </NavDropdown> */}
        </Nav>
      </Navbar>
    );
  }
}

export default CustomNavbar;

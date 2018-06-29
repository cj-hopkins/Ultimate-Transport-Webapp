import React, { Component } from 'react';
import { Panel, Button, DropdownButton, MenuItem } from 'react-bootstrap';

class ContentBlock extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      routes: ['1', '2', '3', '31'],
    }
  }

  async componentDidMount(){

    const endpoint = '/api/getAllRoutes';
    try {
      const result = await fetch(endpoint)
      const routeNames = await result.json();
      this.setState({
        routes: routeNames
      });
    } catch(e) {
      console.log(e);
    }

  }

  render() {
    return (
          <div>
            <p> select route </p>
            <DropdownButton
              bsStyle="primary"
              title="Select Route"
            >
              {this.state.routes.map(routeName => (
                <MenuItem eventKey="1">{ routeName }</MenuItem>
              ))}
            </DropdownButton>
          </div>
            )}
    }

export default ContentBlock;

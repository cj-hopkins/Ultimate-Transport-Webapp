import React, { Component } from 'react';
import { Panel, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import MapContainer from './MapContainer';

class ContentBlock extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      routes: [],
      chosenRoute: "Select Route",
    }

  // this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect = (event) => {

    // console.log(event)
    this.setState({
      chosenRoute: event
    });

    const endpoint = '/api/getStopsForRoute' 
    try {
      const result = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          route: event,
          direction: 'I',
        })
      })
        .then((response) => response.json())
        .then((resp) => console.log(resp))
    } catch(e) {
        console.log(e)
      }

    // const res = result.json()
  }

  async componentWillMount(){

    const endpoint = '/api/getAllRoutes';
    try {
      const result = await fetch(endpoint)
      const routeNames = await result.json();
      this.setState({
        routes: routeNames
      });
      // console.log(this.state.routes)
    } catch(e) {
      console.log(e);
    }

  }

  render() {
              // value: event.currentTarget.textContent
    return (
          <div>
            <DropdownButton
              id="routeSelect"
              bsStyle="primary"
              title={ this.state.chosenRoute }
              onSelect={ this.handleSelect }
            >
              
              {this.state.routes.map(item => (
                <MenuItem eventKey={ item.route }
                  key={ item.route }>{ item.route }</MenuItem>
              ))}
             }
            </DropdownButton>
          </div>
            )}
    }

export default ContentBlock;

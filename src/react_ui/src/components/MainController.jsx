import React, { Component } from "react";

import { Button, ButtonGroup, Media } from "react-bootstrap"
import {PageHeader} from 'react-bootstrap';
import dublin_bus_icon from './dublin_bus_icon.png';
import WeatherWidget from "./Weather";

import CustomNavbar from "./CustomNavBar";
import ContentBlock from "./ContentBlock";

class MainController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activatedUI: "ContentBlock"
    };
  }
  render() {
    return (
      <div>
        <Media>
          <Media.Left>
            <img
              src={dublin_bus_icon}
              style={{ width: "100px", height: "100px" }}
              alt="dublin_bus_icon"
            />
          </Media.Left>
          <PageHeader className="fontForTitle">
            {" "}
            Ultimate Transport Dublin
          </PageHeader>
          <WeatherWidget />
        </Media>

        <CustomNavbar />
        <ContentBlock
          data={this.state.testState}
          onRouteUpdate={this.props.onRouteUpdate.bind(this)}
          onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(
            this
          )}
        />
      </div>
    );
  }
}

export default MainController;

import React, { Component } from "react";

import { Button, ButtonGroup, Media } from "react-bootstrap";
import { PageHeader } from "react-bootstrap";
import dublin_bus_icon from "./dublin_bus_icon.png";
import WeatherWidget from "./Weather";

import CustomNavbar from "./CustomNavBar";
import ContentBlock from "./ContentBlock";
import Example from "./examples/Example";

class MainController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activatedUI: 0,
    //   UIkeys: {
    //     0: "ContentBlock",
    //     1: "JourneyPlanner",
    //     2: "Timetables"
    //   }
    };
  }

  swapUI(key) {
    //   console.log(key)
    this.setState({
      activatedUI: key
    });
  }
  
  renderSwitch = () => {
      console.log("render switch")
    switch (this.state.activatedUI) {
        case 0:
          return <ContentBlock key={0} 
          onRouteUpdate={this.props.onRouteUpdate.bind(this)}
          onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}
          />;
        case 1:
          return <Example key={1} />;
        case 2:
          return <ContentBlock key={2} />;
        default:
          return <div key={3} />;
      }
    // return <div>{chosenElement}</div>;
  }

  render() {
    // const key = this.state[this.state.activatedUI]
    // console.log(key)
    // const ChosenComponent = this.state.UIkeys[this.state.activatedUI];
    // console.log(ChosenComponent);
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
        <CustomNavbar swapUI={this.swapUI.bind(this)} />
        {/* Render chosen UI component - default to ContentBlock */}
        {this.renderSwitch()}
      </div>
    );
  }
}

// class ChosenComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   render() {
//     const { events } = this.props;
//     const eventElement = {
//       switch (this.props.choice) {
//         case 0:
//           return <ContentBlock key={shortid.generate()} 
//           onRouteUpdate={this.props.onRouteUpdate.bind(this)}
//           onSelectedJourneyUpdate={this.props.onSelectedJourneyUpdate.bind(this)}
//           />;
//         case 1:
//           return <ContentBlock key={shortid.generate()} />;
//         case 2:
//           return <ContentBlock key={shortid.generate()} />;
//         default:
//           return <div key={shortid.generate()} />;
//       }
//     // return <div>{chosenElement}</div>;
//   }
// }

export default MainController;

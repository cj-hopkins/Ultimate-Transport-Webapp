import React, { Component } from "react";
import { Grid, Row, Col } from 'react-bootstrap';
import "./App.css";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import ContentHeader from "./components/ContentHeader";
import Example from "./components/examples/Example";
import CustomNavbar from './components/CustomNavbar';
import Sidebar from 'react-sidebar';
import MaterialTitlePanel from './components/examples/MaterialTitlePanel';
import { PageHeader } from "react-bootstrap";
import dublin_bus_icon from "./components/dublin_bus_icon.png";
import WeatherWidget from "./components/Weather";

require("bootstrap/dist/css/bootstrap.css");
require("react-select/dist/react-select.css");

const styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'navy',
    padding: 8,
    fontSize:'50px',
  },
  content: {
    padding: '16px',
  },
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docked: false,
      open: false,
      transitions: true,
      touch: true,
      shadow: true,
      pullRight: false,
      touchHandleWidth: 20,
      dragToggleDistance: 30,
      stopsInRoute: [],
      selectedJourney: [],
      activatedUI: 0
    }
    this.renderPropCheckbox = this.renderPropCheckbox.bind(this);
    this.renderPropNumber = this.renderPropNumber.bind(this);
    this.onSetOpen = this.onSetOpen.bind(this);
    this.menuButtonClick = this.menuButtonClick.bind(this);
  }

  onRouteUpdate(data) {
    this.setState({
      stopsInRoute: data,
      selectedJourney: data
    });
  }

  onSelectedJourneyUpdate(data) {
    this.setState({
      selectedJourney: data
    });
  }

  swapUI(key) {
    //   console.log(key)
    this.setState({
      activatedUI: key
    });
  }
  
  renderSwitch = () => {
      // console.log("render switch")
    switch (this.state.activatedUI) {
        case 0:
          return <ContentBlock key={0} 
            onRouteUpdate={this.onRouteUpdate.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
          />;
        case 1:
          return <Example key={1} />;
        case 2:
          return <Example key={2} />;
        default:
          return <div key={3} />;
      }
    // return <div>{chosenElement}</div>;
  }

  onSetOpen(open) {
    this.setState({open: open});
  }

  menuButtonClick(ev) {
    ev.preventDefault();
    this.onSetOpen(!this.state.open);
  }

  renderPropCheckbox(prop) {
    const toggleMethod = (ev) => {
      const newState = {};
      newState[prop] = ev.target.checked;
      this.setState(newState);
    };

    return (
      <p key={prop}>
        <input type="checkbox" onChange={toggleMethod} checked={this.state[prop]} id={prop} />
        <label htmlFor={prop}> {prop}</label>
      </p>);
  }

  renderPropNumber(prop) {
    const setMethod = (ev) => {
      const newState = {};
      newState[prop] = parseInt(ev.target.value, 10);
      this.setState(newState);
    };

    return (
      <p key={prop}>
         {prop} <input type="number" onChange={setMethod} value={this.state[prop]} />
      </p>);
  }

  render() {
    const sidebar = <div style={{backgroundColor:"white", height:'100%'}}><a onClick={this.menuButtonClick} style={styles.contentHeaderMenuLink}>=</a><ContentHeader/><CustomNavbar swapUI={this.swapUI.bind(this)}/>
            {this.renderSwitch()})</div>;

    const contentHeader = (
      <Grid fluid={true}><Row>
      <Col xs={2}><a onClick={this.menuButtonClick} style={styles.contentHeaderMenuLink}>=</a></Col>
      <Col xs={4}>
        <PageHeader className="fontForTitle"> Ultimate Transport Dublin</PageHeader></Col><Col xs={2}>
        <img
        src={dublin_bus_icon}
        style={{ width: "100px", height: "100px" }}
        alt="dublin_bus_icon"
      /></Col>
        </Row>
      </Grid>);

    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      sidebarClassName: 'custom-sidebar-class',
      open: this.state.open,
      touch: this.state.touch,
      shadow: this.state.shadow,
      pullRight: this.state.pullRight,
      touchHandleWidth: this.state.touchHandleWidth,
      dragToggleDistance: this.state.dragToggleDistance,
      transitions: this.state.transitions,
      onSetOpen: this.onSetOpen,
    };

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
            <MapContainer selectedStops={this.state.selectedJourney}/>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
}


export default App;

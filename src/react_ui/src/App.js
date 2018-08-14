import React, { Component } from "react";
import { Grid, Row, Col } from 'react-bootstrap';
import "./App.css";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import ContentHeader from "./components/ContentHeader";
import RealTimePage from "./components/RealTimePage";
import CustomNavbar from './components/CustomNavbar';
import Sidebar from 'react-sidebar';
import MaterialTitlePanel from './components/examples/MaterialTitlePanel';
import WeatherWidget from "./components/Weather";
import JourneyPlanner from './components/JourneyPlanner';
import { Table } from 'react-bootstrap';
import TimeTable from "./components/TimeTable";
import { TwitterFeed } from "./components/TwitterFeed";
import {Badge} from "react-bootstrap";
import ReactTooltip from 'react-tooltip'
import FooterPage from './components/Footer';
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
const mql = window.matchMedia(`(min-width: 800px)`);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mql: mql,
      docked: true,
      open: false,
      transitions: true,
      touch: true,
      shadow: true,
      pullRight: false,
      touchHandleWidth: 20,
      dragToggleDistance: 30,
      stopsInRoute: [],
      selectedJourney: [],
      selectedRealTimeStop:0,
      activatedUI: 0,
      polylineCoordinates: [], 
      nextBuses:[], 
      isRealTimeHidden:true
    }
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.renderPropCheckbox = this.renderPropCheckbox.bind(this);
    this.renderPropNumber = this.renderPropNumber.bind(this);
    this.onSetOpen = this.onSetOpen.bind(this);
    this.menuButtonClick = this.menuButtonClick.bind(this);
  }
  mediaQueryChanged() {
    this.setState({
      mql: mql,
      docked: this.state.mql.matches,
    });
  }
  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
    this.setState({
      mql: mql,
      docked: mql.matches});
  }
  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
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
    this.setState({
      activatedUI: key
    });
  }
  onRealTimeStopUpdate(stop) {
    this.setState({
      selectedRealTimeStop: stop
    });
  }
  onStopSelectGetRealTime(stop){
     this.setState({
      isRealTimeHidden:false
    })
    const endpoint = `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stop}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
            this.setState({   
                nextBuses: parsedJSON.results.map((post, i) => (
                  <tr key={i} >
                    <td>{post.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <td>{post.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <td>{post.duetime} minutes </td>
                  </tr>
                ))
            });
     })
      .catch(error => console.log('parsing failed',error))
  }
  parseCoords = array => array.map(object => ({
    lat: parseFloat(object.lat()),
    lng: parseFloat(object.lng())
    })
  )
  getPolyCoordinates(data) {
    const coords = this.parseCoords(data);
    this.setState({
      polylineCoordinates: coords
    });
    console.log("coords in App", coords)
  }
  renderSwitch = () => {
    console.log(this.state.activatedUI)
    switch (this.state.activatedUI) {
        case 0:
        // this.setState({polylineCoordinates: []});
          return <ContentBlock key={0} 
            onRouteUpdate={this.onRouteUpdate.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            getPolyCoordinates={this.getPolyCoordinates.bind(this)}
          />;
        case 1:
        // this.setState({selectedJourney: []});
          return <JourneyPlanner key={1} 
            getPolyCoordinates={this.getPolyCoordinates.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
          />;
        case 2:
        return <TimeTable key={2} 
            onRouteUpdate={this.onRouteUpdate.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            />;
        case 3:
          return  <div style={{height:'100%'}}> 
              <RealTimePage key={3} 
                      onStopSelectGetRealTime= {this.onStopSelectGetRealTime.bind(this)}
                      selectedRealTimeStop= {this.state.selectedRealTimeStop}
                      onRealTimeStopUpdate= {this.onRealTimeStopUpdate.bind(this)}    
                          />

              {!this.state.isRealTimeHidden &&
              <div>
                <p>Real Time Information for Stop {this.state.selectedRealTimeStop}</p>

                <Table>  {this.state.nextBuses}  </Table>
              </div>
               }
          </div>  
        case 4.1:
          return  <a href={"http://www.dublinbus.ie"}>Dub</a>;
        case 4.3:
          return <div style={{height:'100%'}}>  <TwitterFeed />  </div>
        default:
          return <div key={4} />;
      }
    }
  onSetOpen(open) {
    this.setState({
      open: open
    });
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
      </p>
    );
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
      </p>
    );
  }
  render() {
    const siderbarWithButton = 
          <div style={{backgroundColor:"white", height:'100%'}}>
            <Grid fluid={true}>
              <Row>
                <Col xs={1}><a onClick={this.menuButtonClick} style={styles.contentHeaderMenuLink}>≡</a></Col>
                <Col xs={3}>
                  <img
                  src={'https://lh3.googleusercontent.com/MCtmcjOY4XwssTV-t8jH3___wE3xFlosfMtMBZd_deEKGG4gNv_V3z7-7KeRI7KAuSM=s180'}
                  style={{ width: "80px", height: "80px" }}
                  alt="dublin_bus_icon"
                /></Col>
                <Col xs={3}>
                  <h1 style={{fontFamily: 'Titillium Web, sans-serif'}}>Ultimate Transport Dublin</h1></Col><Col xs={3}>
                </Col>
              </Row>
              <Row>    <Col xs={1}></Col>
              <Col xs={9}>
                 <div style={{marginTop: '2em'}}> </div>
                  <h2>
                    <Badge bsStyle="warning"  style ={{fontSize:'17px'}} >Plan Your Journey With Dublin Bus
                    </Badge>
                  </h2>
                </Col>
                 <Col xs={2}></Col>
              </Row>
            </Grid>
            <CustomNavbar swapUI={this.swapUI.bind(this)}/> {this.renderSwitch()}
      {/*  <FooterPage/>  */}    
    </div>;
    
    const sidebarNoButton =
          <div style={{backgroundColor:"white", height:'100%'}}>
            <ContentHeader/>
            <Grid>
              <Row>
                <Col xs={2}></Col>
                  <Col xs={6}>
                 <h2>
                   <Badge bsStyle="warning"  style ={{fontSize:'17px'}} >Plan Your Journey With Dublin Bus</ Badge>
                </h2>
                </Col>
                <Col xs={4}></Col>
              </Row>
            </Grid>
         
            <CustomNavbar swapUI={this.swapUI.bind(this)}/>{this.renderSwitch()}
        <FooterPage/>   
          {/*   <FooterBootstrap />  */}  
          </div>;

    const sidebar = (!this.state.mql.matches) ? siderbarWithButton : sidebarNoButton;
    const contentHeader = (
      <Grid fluid={true}>
        <Row>
          <Col xs={1}><a onClick={this.menuButtonClick} style={styles.contentHeaderMenuLink}>≡</a></Col>
          <Col xs={3}>
            <img
            src={'https://lh3.googleusercontent.com/MCtmcjOY4XwssTV-t8jH3___wE3xFlosfMtMBZd_deEKGG4gNv_V3z7-7KeRI7KAuSM=s180'}
            style={{ width: "80px", height: "80px" }}
            alt="dublin_bus_icon"
            />
          </Col>
          <Col xs={3}>
            <h1 style={{fontFamily: 'Titillium Web, sans-serif'}}>Ultimate Transport Dublin</h1>
          </Col>
          <Col xs={3}></Col>
        </Row>
        <Row><Col xs={0}></Col>
          <Col xs={10}>
            <h2>
               <Badge bsStyle="warning"  style ={{fontSize:'17px'}} >Plan Your Journey With Dublin Bus</ Badge>
            </h2>
          </Col>
           <Col xs={2}></Col>
        </Row>
      </Grid>
    );
    const header = (!this.state.mql.matches) ? contentHeader : null 
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
        <MaterialTitlePanel title={header}>
            <MapContainer selectedStops={this.state.selectedJourney}
              polylineCoordinates={this.state.polylineCoordinates}
            />
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
}
export default App;

import React, { Component } from "react";
import { Grid, Row, Col } from 'react-bootstrap';
import "./App.css";
import moment from "moment";
import MapContainer from "./components/MapContainer";
import ContentBlock from "./components/ContentBlock";
import ContentHeader from "./components/ContentHeader";
import RealTimePage from "./components/RealTimePage";
import CustomNavbar from './components/CustomNavbar';
import Sidebar from 'react-sidebar';
import MaterialTitlePanel from './components/MaterialTitlePanel';
import WeatherWidget from "./components/Weather";
import JourneyPlanner from './components/JourneyPlanner';
import { Table } from 'react-bootstrap';
import TimeTable from "./components/TimeTable";
import { TwitterFeed } from "./components/TwitterFeed";
import FooterPage from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
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
      busCoords:[], 
      nextBuses:[], 
      isRealTimeHidden:true,
      currentPosition: {
        //dublin city centre co-ordinates
        lat: 53.3498,
        lng: -6.2603
      }
    }
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.renderPropCheckbox = this.renderPropCheckbox.bind(this);
    this.renderPropNumber = this.renderPropNumber.bind(this);
    this.onSetOpen = this.onSetOpen.bind(this);
    this.menuButtonClick = this.menuButtonClick.bind(this);
  }
  mediaQueryChanged() {
    //Updates the the state if screen size has changed
    this.setState({
      mql: mql,
      docked: this.state.mql.matches,
    });
  }
  componentWillMount() {
    //Checks the size of the screen and then listens for a change and updates if necessary
    mql.addListener(this.mediaQueryChanged);
    this.setState({
      mql: mql,
      docked: mql.matches});
  }
  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }
  onRouteUpdate(data) {
    //Update the stops and choice of route in the state when there is a changed
    this.setState({
      stopsInRoute: data,
      selectedJourney: data
    });
  }
  onSelectedJourneyUpdate(data) {
    //
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
    //Gets real time info for the start stop chosen for the specific bus route
     this.setState({
      isRealTimeHidden:false
    })
    const endpoint = 
          `https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${stop}&format=json`;
    fetch(endpoint)
      .then (response => response.json())
      .then(parsedJSON => {
           this.setState({   //slice(0,4) to limit to top 4 results 
               nextBuses: [...[], ...parsedJSON.results.slice(0, 4)]
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
    //Get/update the coordinates for the Google Directions journey to make a polyline on the map
    const coords = this.parseCoords(data);
    this.setState({
      polylineCoordinates: coords
    });
    // console.log("coords in App", coords)
  }
  getBusCoords(points){
    //Get/update the coordinates needed to set bus stop markers for bus sections of Google journey
    console.log("points",points)
    this.setState({
      busCoords: points,
    })
  }
  renderSwitch = () => {
    //Allow switching between the different views within the sidebar
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
            getBusCoords={this.getBusCoords.bind(this)}
            getPolyCoordinates={this.getPolyCoordinates.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            currentPosition={this.state.currentPosition}
          />;
        case 2:
        return <TimeTable key={2} 
            onRouteUpdate={this.onRouteUpdate.bind(this)}
            onSelectedJourneyUpdate={this.onSelectedJourneyUpdate.bind(this)}
            getPolyCoordinates={this.getPolyCoordinates.bind(this)}
            />;
        case 3:
          return <div style={{minHeight:'50%', maxHeight:'800px'}}> 
             <RealTimePage key={3} 
                      getPolyCoordinates={this.getPolyCoordinates.bind(this)}
                      onStopSelectGetRealTime= {this.onStopSelectGetRealTime.bind(this)}
                      selectedRealTimeStop= {this.state.selectedRealTimeStop}
                      onRealTimeStopUpdate= {this.onRealTimeStopUpdate.bind(this)}    
                          />

              {!this.state.isRealTimeHidden &&
              <div>
                <p style ={{fontSize:'16px'}}>Real Time Information for Stop {this.state.selectedRealTimeStop}  at  {(new moment()).format("HH:mm")}</p>

                <Table>  { this.state.nextBuses.slice(0,4).map((post, i) => (
                 <tr key={i} className = 'real_time_box_sidebar'>
                   <td>{post.route}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                   <td>{post.destination}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  {(post.duetime === 'Due') ? <td>{post.duetime}</td>:<td>{post.duetime} minutes </td> }
                 </tr>
                    ))} </Table>
              </div>
               }
            </div>
        case 4.1:
          return  <a href={"http://www.dublinbus.ie"}>Dub</a>;
     case 4.3:
          return  <TwitterFeed getPolyCoordinates={this.getPolyCoordinates.bind(this)} />
        default:
          return <div key={4} />;
      }
    }
  onSetOpen(open) {
    //Opens the side bar when on small screen
    this.setState({
      open: open
    });
  }
  menuButtonClick(ev) {
    //Reverts the state of the sidebar when on small screen
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

  onLocationUpdate(coords){
    //Update the user coordinates
    console.log("updating location", coords)
    this.setState({
      currentPosition: {
        lat: coords.latitude,
        lng: coords.longitude
      }
    })
  }

  render() {
    const siderbarMobile = 
          <div style={{backgroundColor:"white", height:'100%'}}>
            <Grid fluid={true} style={{backgroundColor:'#3399ff'}}>
              <Row>
                <Col xs={1}><a onClick={this.menuButtonClick} style={styles.contentHeaderMenuLink}>≡</a>
                    </Col>
                <Col xs={3}>
                  <img
                  src={'https://lh3.googleusercontent.com/MCtmcjOY4XwssTV-t8jH3___wE3xFlosfMtMBZd_deEKGG4gNv_V3z7-7KeRI7KAuSM=s180'}
                  style={{ margin: '10px', width: "80px", height: "80px" }}
                  alt="dublin_bus_icon"
                /></Col>
                <Col xs={3}>
                  <h1 style={{fontFamily: 'Titillium Web, sans-serif', color:"white", marginTop:'5px'}}>
                      ULTIMATE TRANSPORT DUBLIN</h1></Col><Col xs={3}>
                </Col>
                <Col xs={2}>
                <div style={{position:'absolute', right:'0px'}}>
                <WeatherWidget />
                </div>
               </Col>
              </Row>
              <Row style={{margin:'auto'}}>    <Col xs={3}></Col>
              <Col xs={12}>
                    <h2 style={{fontSize:'14px', color:"white"}}>Plan Your Journey with Dublin Bus</h2>
                </Col>
              </Row>
            </Grid>
            <ErrorBoundary>
            <CustomNavbar swapUI={this.swapUI.bind(this)}/> {this.renderSwitch()}
              </ErrorBoundary>
     <FooterPage/>
    </div>;
    
    const sidebarDesktop =
          <div style={{backgroundColor:"white", height:'100%'}}>
            <ContentHeader/>
            <Grid style={{backgroundColor:"#3399ff"}}>
              <Row style={{margin:'auto'}}>
                  <Col xs={12}>
                    <h2 style={{fontSize:'14px', color:"white", textAlign:'center'}}> 
                        Plan Your Journey with Dublin Bus </h2>
                </Col>
              </Row>
            </Grid>
           <ErrorBoundary>
            <CustomNavbar swapUI={this.swapUI.bind(this)}/>{this.renderSwitch()}
            </ErrorBoundary>
        <FooterPage/>   
          </div>;

    const sidebar = (!this.state.mql.matches) ? siderbarMobile : sidebarDesktop ;
    const contentHeader = (
      <Grid fluid={true} style={{backgroundColor:'#3399ff'}}>
        <Row>
          <Col xs={1}><a onClick={this.menuButtonClick} style={styles.contentHeaderMenuLink}>≡</a></Col>
          <Col xs={3}>
            <img
            src={'https://lh3.googleusercontent.com/MCtmcjOY4XwssTV-t8jH3___wE3xFlosfMtMBZd_deEKGG4gNv_V3z7-7KeRI7KAuSM=s180'}
            style={{ margin: '10px', width: "80px", height: "80px" }}
            alt="dublin_bus_icon"
            />
          </Col>
          <Col xs={3}>
            <h1 style={{fontFamily: 'Titillium Web, sans-serif', marginTop:'5px'}}>
        ULTIMATE TRANSPORT DUBLIN</h1>
          </Col>
          <Col xs={5}>
                <div style={{position:'absolute', right:'0px'}}>
                <WeatherWidget />
                </div>
          </Col>
        </Row>
        <Row style={{margin:'auto'}}>
          <Col xs={3}></Col>
          <Col xs={12}>
            <h2 style={{fontSize:'14px', color: "white", textAlign:'center'}} >
        Plan Your Journey with Dublin Bus
            </h2>
          </Col>
        </Row>
      </Grid>
    );
    const header = (!this.state.mql.matches && !this.state.open)  ? contentHeader : null 
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
      styles:defaultStyles
    };
    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={header}>
            <MapContainer selectedStops={this.state.selectedJourney}
              busCoords={this.state.busCoords}
              polylineCoordinates={this.state.polylineCoordinates}
              currentPosition={this.state.currentPosition}
              onLocationUpdate={this.onLocationUpdate.bind(this)}
            />
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
}
export default App;

var defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: "white",
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
    backgroundColor: "white",
    maxWidth:'550px'
  },
  content: {
    position: 'absolute',
    backgroundColor: "white",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-out, right .3s ease-out'
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out, visibility .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0
  }
};

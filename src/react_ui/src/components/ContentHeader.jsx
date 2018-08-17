import React from "react";

import { PageHeader } from "react-bootstrap";
import WeatherWidget from "./Weather";
import { Media } from "react-bootstrap";
// import dublin_bus_icon from "./dublin_bus_icon.png";
import ReactTooltip from 'react-tooltip'

{/* When page first loaded, this is the default view of the page of the route section */}

const ContentHeader = () => (
  <Media style={{backgroundColor:"#3399ff", textAlign:'center'}}>
        <Media.Left>
          <img data-tip='Ultimate Transport'
            src={'https://lh3.googleusercontent.com/MCtmcjOY4XwssTV-t8jH3___wE3xFlosfMtMBZd_deEKGG4gNv_V3z7-7KeRI7KAuSM=s180'}
            style={{ width: "90px", height: "90px", marginTop:'10px' }}
            alt="dublin_bus_icon"
          /><ReactTooltip />
        </Media.Left>
        
        <PageHeader className="fontForTitle" style={{color: "white", margin:'auto', padding:'20px'}}>
              ULTIMATE TRANSPORT DUBLIN</PageHeader>
        
        <Media.Right><WeatherWidget /></Media.Right>
  </Media>
);

export default ContentHeader;

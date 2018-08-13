import React from "react";

import { PageHeader } from "react-bootstrap";
import WeatherWidget from "./Weather";
import { Media } from "react-bootstrap";
// import dublin_bus_icon from "./dublin_bus_icon.png";
import ReactTooltip from 'react-tooltip'

const ContentHeader = () => (
  <Media><Media.Left>
      <img data-tip='Ultimate Transport'
        src={'https://lh3.googleusercontent.com/MCtmcjOY4XwssTV-t8jH3___wE3xFlosfMtMBZd_deEKGG4gNv_V3z7-7KeRI7KAuSM=s180'}
        style={{ width: "80px", height: "80px" }}
        alt="dublin_bus_icon"
      /><ReactTooltip />
      </Media.Left>
      <Media.Right>
    <PageHeader className="fontForTitle"> Ultimate Transport Dublin</PageHeader></Media.Right>
    <WeatherWidget />
  </Media>
);

export default ContentHeader;

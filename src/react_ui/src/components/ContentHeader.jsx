import React from "react";

import { PageHeader } from "react-bootstrap";
import dublin_bus_icon from "./dublin_bus_icon.png";
import WeatherWidget from "./Weather";
import { Media } from "react-bootstrap";

const ContentHeader = () => (
  <Media><Media.Left>
      <img
        src={dublin_bus_icon}
        style={{ width: "100px", height: "100px" }}
        alt="dublin_bus_icon"
      /></Media.Left>
      <Media.Right>
    <PageHeader className="fontForTitle"> Ultimate Transport Dublin</PageHeader></Media.Right>
    <WeatherWidget />
  </Media>
);

export default ContentHeader;

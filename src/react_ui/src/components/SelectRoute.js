import React, { Component } from 'react';
import 'react-bootstrap';
import 'react-bootstrap-select';

class RouteSelect extends Component {
  render(){
  return (
<React.Bootstrap.Select>
  <option>Mustard</option>
  <option>Ketchup</option>
  <option>Barbecue</option>
</React.Bootstrap.Select>
)
}
}

export default RouteSelect;

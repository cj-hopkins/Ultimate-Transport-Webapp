import React, { Component } from 'react';
import RouteSelect from './RouteSelect';
import StopSelect from './StopSelect';

class ContentBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }

    // this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }


  render(){

    return (
    <div>
      <RouteSelect onRouteUpdate={this.props.onRouteUpdate.bind(this)}/>
      <StopSelect />
    </div>
      );
  }
};

export default ContentBlock;

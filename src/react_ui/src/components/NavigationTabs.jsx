import React, { Component } from "react";
import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";

class NavigationTabs {

    handleChange = (event) => {
        console.log(event);
    }

  render() {
    return(
      <Tabs
        defaultActiveKey="2"
        onChange={this.handleChange.bind(this)}
        renderTabBar={()=><ScrollableInkTabBar />}
        renderTabContent={()=><TabContent />}
      >
        <TabPane tab='tab 1' key="1">first</TabPane>
        <TabPane tab='tab 2' key="2">second</TabPane>
        <TabPane tab='tab 3' key="3">third</TabPane>
      </Tabs>
    )}
}

export default NavigationTabs
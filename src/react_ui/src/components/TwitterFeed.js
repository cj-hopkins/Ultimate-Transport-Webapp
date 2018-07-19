import {Panel} from "react-bootstrap"
import React, { Component } from "react"
import { TwitterTimelineEmbed} from 'react-twitter-embed';

export default class TwitterFeed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: true
    };
  }
render() {
    return(

<Panel defaultExpanded>
    
         <Panel.Heading>
            <Panel.Title componentClass="h3" >
              Twitter Feed 
          </Panel.Title>
        </Panel.Heading>
      
    
        <Panel.Body>
      
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{height:'20%', width: '100%', theme:'dark'}} />
        </Panel.Body>

        </Panel>   
    
    
        );
  }
}

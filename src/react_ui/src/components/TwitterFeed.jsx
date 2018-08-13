import React, { Component } from "react"
import { TwitterTimelineEmbed} from 'react-twitter-embed';

export class TwitterFeed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: true
    };
  }
render() {
    return(
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{height:'20%', width: '100%', theme:'dark'}} 
        />
        );
      }
}
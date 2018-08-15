import React, { Component } from "react"
import { TwitterTimelineEmbed} from 'react-twitter-embed';

export class TwitterFeed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: true
    };
  }
  componentWillMount() {
    this.props.getPolyCoordinates([])
  }
render() {
    return(
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{theme:'light', height:'500px'}}
        />
        );
      }
}

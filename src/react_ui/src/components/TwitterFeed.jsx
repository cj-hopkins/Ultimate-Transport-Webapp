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
    return(<div style={{minHeight: '50%', maxHeight:'90%'}}>
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="dublinbusnews"
          options={{theme:'light', height:'350px'}}
        /><div style={{marginTop: '2em'}}> </div></div>
        );
      }
}

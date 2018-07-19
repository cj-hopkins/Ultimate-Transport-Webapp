import React, { Component } from "react"
import { TwitterTimelineEmbed} from 'react-twitter-embed';
import { Button , Grid, Row, Col } from 'react-bootstrap'


export default class TwitterButton extends Component {
 constructor(props) {
    super(props); 
    this.state = {
        isHidden: true
    }
 }
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }
  
  render () {
    return (
      <div>
        <Button onClick={this.toggleHidden.bind(this)}  
                bsSize='small' > Twitter Feed
        </Button>
        {!this.state.isHidden && 
          <Grid>
            <Row>
              <Col><TwitterFeed /></Col>
            </Row>
          </Grid>
        }
      </div>
    )
  }
}

class TwitterFeed extends Component {
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

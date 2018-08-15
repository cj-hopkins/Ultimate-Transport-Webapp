import React from 'react';
import StickyFooter from 'react-sticky-footer';
import { SocialIcon } from 'react-social-icons';
import { Grid, Row, Col, Table } from 'react-bootstrap';

class FooterPage extends React.Component {
    render(){
        return(
          /*position:"absolute",*/
        <div style={{
            left:0,
            right:0}}>
            <StickyFooter bottomThreshold={50}
    normalStyles={{
    backgroundColor: "#2196f3",
    padding: "2rem"
    }}
    stickyStyles={{
    backgroundColor: "#2196f3'",
    padding: "2rem"
    }} className="font-small pt-0">
              
              
              <Grid>
                <Row>
                  <Col xs={1} ></Col>
                  <Col xs={2} > <SocialIcon 
                                  url="http://twitter.com/dublinbusnews"
                                  color='white'
                                      /></Col>
                  <Col xs={2} >      <SocialIcon 
                                       url="http://www.facebook.com/DublinBusNews/" 
                                       color='white'
                                       /> </Col>
                  <Col xs={2}>
                  <div>
                     <a href='http://www.dublinbus.ie/' target='blank'>
                    <img
                      src={'https://media.glassdoor.com/sql/1043913/dublin-bus-squarelogo-1440748899751.png '}
                      style={{ width: "50px", height: "50px", borderRadius: '50%'}}
                      alt="dublin_bus_icon" /> </a>
                     </div>    
                  </Col> 
                    <Col xs={2}>      
                      <SocialIcon 
                          url="http://www.instagram.com/dublinbusnews/" 
                          color='white'
                          /> 
                  </Col>
                   <Col xs={2}>      
                      <SocialIcon 
                          url="https://www.youtube.com/user/dublinbusnews" 
                          color='white'
                          /> 
                  </Col>
                  <Col xs={1} ></Col>
                </Row>
                <Row>
                  <Col xs={2}>
                  </Col>
                  <Col xs={8}>
                    <div className="footer-copyright text-center py-3">
                           <p>   &copy; {(new Date().getFullYear())} Copyright: Ultimate Transport Dublin</p>
                      </div>
                  </Col>
                  
                   <Col xs={2}>
                  </Col>
                   </Row>
                </Grid>
            </StickyFooter></div>
            
        );
    }
}

export default FooterPage;

import React from 'react';
import StickyFooter from 'react-sticky-footer';


class FooterPage extends React.Component {
    render(){
        return(
        <div style={{position:"absolute",
            left:0,
            bottom:0,
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
                <div className="footer-copyright text-center py-3">
                        
                        &copy; {(new Date().getFullYear())} Copyright: Ultimate Transport
                </div>
            </StickyFooter></div>
        );
    }
}

export default FooterPage;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import Map from './components/Map';
import RouteForm from './components/Stop_Form';
import Calendar from 'react-calendar';
import TimePicker from 'react-times';
import 'react-times/css/classic/default.css';

// import registerServiceWorker from './registerServiceWorker';
//
//let myComponent =  document.getElementById('reactify-django-ui')
//if (myComponent !== null){
//    ReactDOM.render(<App />, <Map />,myComponent);
//}

//ReactDOM.render(
//    <div>
//    <RouteForm />
//    <Map />
//    </div>,
//  document.getElementById('reactify-django-ui')
//);


ReactDOM.render(
    <div>
    <RouteForm />
    <Map />
    </div>,
  document.getElementById('reactify-django-ui')
);


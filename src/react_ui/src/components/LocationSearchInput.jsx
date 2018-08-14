import React from 'react';
import Select from 'react-select';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import ReactTooltip from 'react-tooltip'
import {Button, Grid, Row, Col} from 'react-bootstrap';
import { WSAEINVALIDPROVIDER } from 'constants';


class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address1: '', address2: ''};
  }
  getAddress1() {
    return(this.state.address1)
  };
  getAddress2() {
    return(this.state.address2)
  };
  handleChange1 = address1 => {
    this.setState({ address1 })
    this.props.onChangeAddress1(address1)
  };
 
  handleSelect1 = address1 => {
    this.setState({ address1: address1 });
    geocodeByAddress(address1)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Origin', latLng, address1);
        this.props.getOriginGeolocation(latLng);
      })
      .catch(error => console.error('Error', error));
  };
  handleCloseClick1 = () => {
    this.setState({
      address1: '',
      latitude: null,
      longitude: null,
    });
    this.props.onChangeAddress1(null)
    this.props.getOriginGeolocation(null)
  };
  handleChange2 = address2 => {
    this.setState({ address2 })
    this.props.onChangeAddress2(address2)
  };
  handleSelect2 = address2 => {
    this.setState({ address2: address2 });
    geocodeByAddress(address2)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Destination', latLng, address2);
        this.props.getDestinationGeolocation(latLng);
      })
      .catch(error => console.error('Error', error));
  };
  handleCloseClick2 = () => {
    this.setState({
      address2: '',
      latitude: null,
      longitude: null,
    });
    this.props.onChangeAddress2(null)
    this.props.getDestinationGeolocation(null)
  };

  useCurrentLocation = () => {
    console.log(this.props.currentPosition)
    const google = window.google;
    const geocoder = new google.maps.Geocoder;
    const me = this;
    geocoder.geocode({'location': this.props.currentPosition}, res => {
        me.handleSelect1(res[0].formatted_address)
      }
    )
  }

  render() {
    const google = window.google
    const searchOptions = {
    location: new google.maps.LatLng(53.3498, -6.2603),
    radius: '100',
    componentRestrictions: {country: 'ie'},
    types: ['geocode']
    }
    return (
    <div>
      <PlacesAutocomplete
        value={this.state.address1}
        onChange={this.handleChange1}
        onSelect={this.handleSelect1}
        searchOptions={searchOptions}  >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input data-tip='Where are you going from?'  style={{border: '1px solid rgba(192,192,192, .5)', borderRadius: '5px', fontSize: '16px', color: '#606060'}}
              {...getInputProps({
                placeholder: 'Choose origin',
                className: 'location-search-input',
              })}
            /><ReactTooltip />
            {this.state.address1.length > 0 && (
                    <button
                      className="Demo__clear-button"
                      onClick={this.handleCloseClick1}  >
                      x
                    </button>
                  )}
            <div className="autocomplete-dropdown-container">
              {loading && <div style={{ textAlign: 'center'}}>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { textAlign: 'center',  backgroundColor: 'rgba(192,192,192, .5)', cursor: 'pointer' }
                  : { textAlign: 'center', backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}>
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <Grid fluid={true}><Row><Col xs={4}></Col>
      <Col xs={4}><Button  
        style={{alignSelf:'center'}}
        onClick={this.useCurrentLocation}>Use Current Location</Button></Col><Col xs={4}></Col></Row></Grid>
      <PlacesAutocomplete
        value={this.state.address2}
        onChange={this.handleChange2}
        onSelect={this.handleSelect2}
        searchOptions={searchOptions}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input data-tip='Where are you going to?' style={{border: '1px solid rgba(192,192,192, .5)', borderRadius: '5px', fontSize:'16px', color: '#606060'}}
              {...getInputProps({
                placeholder: 'Choose destination',
                className: 'location-search-input',
              })}
            /><ReactTooltip />
            {this.state.address2.length > 0 && (
                    <button
                      className="Demo__clear-button"
                      onClick={this.handleCloseClick2}>
                      x
                    </button>
                  )}
            <div className="autocomplete-dropdown-container">
              {loading && <div style={{ textAlign: 'center'}}>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { textAlign: 'center', backgroundColor: 'rgba(192,192,192, .5)', cursor: 'pointer' }
                  : { textAlign: 'center', backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      </div>
    );
  }
}
export default LocationSearchInput;


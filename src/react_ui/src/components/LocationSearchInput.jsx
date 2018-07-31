import React from 'react';
import Select from 'react-select';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
 
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
    this.props.getDestinationGeolocation(null)
  };
 
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
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Choose origin',
                className: 'location-search-input',
              })}
            />
            {this.state.address1.length > 0 && (
                    <button
                      className="Demo__clear-button"
                      onClick={this.handleCloseClick1}
                    >
                      x
                    </button>
                  )}
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
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
      <PlacesAutocomplete
        value={this.state.address2}
        onChange={this.handleChange2}
        onSelect={this.handleSelect2}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Choose destination',
                className: 'location-search-input',
              })}
            />
            {this.state.address2.length > 0 && (
                    <button
                      className="Demo__clear-button"
                      onClick={this.handleCloseClick2}
                    >
                      x
                    </button>
                  )}
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
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
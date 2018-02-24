import React, { Component } from 'react';
import { Label, Step, Icon, Divider } from 'semantic-ui-react';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
    this.handleResultClick = this.handleResultClick.bind(this);
  }

  handleKeyDown(e) {
    if (e.keyCode !== 13) {
      return;
    }

    e.preventDefault();
    const text = this.state.text.trim();
    if (text) {
      this.props.showArtistResults({
        text
      });
      this.setState({ text: '' })
    }
  }

  handleResultClick(e, data) {
    console.log('Result clicked:');
    console.log(data.id);
    const artist = this.props.results.items[data.id];
    this.props.addArtist(artist);
  }

  makeArtistResults(artists) {
    let artistResults = []
    for (let i = 0; i < artists.length; i++) {
      const artist = artists[i];
      let image = "http://fillmurray.com/g/100/100";
      console.log(artist.images);
      if (artist.images.length >= 1) {
        image = artist.images[artist.images.length - 1].url;
      }
      artistResults.push(
        <Label as='a' id={i} key={i} image color='teal' onClick={this.handleResultClick} className='resultLabel'>
          <img src={artist.images.length === 3 ? artist.images[2].url : '#'} />
          {artist.name}
        </Label>
      )
    }
    return artistResults;
  }

  render() {    
    if (this.props.results && this.props.results.items && this.props.results.items.length > 0) {
      return (
        <div className='app-overview'>
          <Divider horizontal inverted>Search Results</Divider>
          {this.makeArtistResults(this.props.results.items.slice(0, 10))}
        </div>
      )
    }
    if (this.props.selected.length > 0) {
      return (<div></div>);
    }
    return (
      <div className='app-overview'>
        <Divider horizontal inverted>App Overview</Divider>
        <Step.Group size='small' vertical>
          <Step>
            <Icon name='user plus' />
            <Step.Content>
              <Step.Title>Authenticate</Step.Title>
              <Step.Description>Login with Spotify and grant access.</Step.Description>
            </Step.Content>
          </Step>
          <Step>
            <Icon name='search' />
            <Step.Content>
              <Step.Title>Select Artists</Step.Title>
              <Step.Description>Search and select favorite artists.</Step.Description>
            </Step.Content>
          </Step>
          <Step>
            <Icon name='music' />
            <Step.Content>
              <Step.Title>Generate Playlist</Step.Title>
              <Step.Description>Generate and enjoy your new playlist.</Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
      </div>
    )
  }
}

export default SearchResults;
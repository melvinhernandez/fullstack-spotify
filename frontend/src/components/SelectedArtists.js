import React, { Component } from 'react';
import { Label, Card, Icon, Divider, Container } from 'semantic-ui-react';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(e, data) {
    this.props.removeArtist(data.id);
  }

  makeSelectedAriststs(artists) {
    let selectedArtists = []
    for (let i = 0; i < artists.length; i++) {
      const artist = artists[i];
      const extra = (
        <div>
        <a href={artist.external_urls.spotify}>
          <Icon name='spotify' />
          Listen on Spotify
        </a>
          <Label as='a' color='red' id={artist.id} floating onClick={this.handleRemove}>X</Label>
        </div>
      );
      selectedArtists.push(
        <Card
          key={artist.id}
          image={artist.images.length >= 1 ? artist.images[0].url : '#'}
          header={artist.name}
          color='teal'
          extra={extra}
        />
      )
    }
    return selectedArtists;
  }

  render() {    
    if (this.props.selected && this.props.selected.length > 0) {
      const artists = this.makeSelectedAriststs(this.props.selected);
      return (
        <div>
          <Divider horizontal inverted>Selected Artists</Divider>
          <Container className='selected-container'>
            <Card.Group itemsPerRow={4}>{artists}</Card.Group>
          </Container>
        </div>
      )
    }
    return (
      <h2>{this.props.message}</h2>
    )
  }
}

export default SearchResults;
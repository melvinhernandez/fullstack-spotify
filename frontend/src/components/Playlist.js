import React, { Component } from 'react';
import SpotifyPlayer from 'react-spotify-player';
import axios from 'axios';
import _ from 'lodash';
import { Container, Header, Button, Icon, List, Image, Item, Label, Divider } from 'semantic-ui-react';

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      generating: false,
      tracks: [],
      playlist: null,
      addingTracks: false
    }

    this.generatePlaylist = this.generatePlaylist.bind(this);
    this.addTracks = this.addTracks.bind(this);
    this.createTrackPreviews = this.createTrackPreviews.bind(this);
  }

  addTracks(playlistID, artists) {
    const artistIDs = this.props.selected.map(artist => artist.id);
    this.setState({ addingTracks: true });
    axios.get('spotify/addTracks', {
      params: {
        playlistID,
        artistIDs
      }
    }).then(
      trackRes => {
        console.log('playlist update', trackRes);
        if (trackRes.status === 200 || trackRes.status === 201) {
          this.props.updatePlaylist();
          this.setState({ addingTracks: false });
        }
      },
      error => {
        console.log('wtf');
        console.log(error);
      }
      )
  }

  generatePlaylist(e) {
    this.setState({ generating: true });
    const artists = this.props.selected.map(artist => artist.name)
    axios.get('spotify/createPlaylist', {
      params: {
        artists
      }
    }).then(
      playlistRes => {
        console.log('playlist results', playlistRes.data);
        let playlist = null;
        if (playlistRes.status === 200) {
          playlist = playlistRes.data;
          this.addTracks(playlist.id, this.props.selected);
        }
        this.setState({
          generating: false,
          playlist
        });
      },
      error => {
        console.log('wtf');
        console.log(error);
      }
    )
  }

  createTrackPreviews() {
    const tracks = this.state.tracks;
    const contentStyle = {
      textAlign: 'left !important'
    };
    let trackList = [];
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const album = track.album;
      trackList.push(
        <Item key={track.id}>
            <Item.Image size='tiny' src={album.images.length >= 2 ? album.images[1].url : album.images[0].url} />
            <Item.Content verticalAlign='middle' className='left-aligned' floated='left'>
              <Header textAlign='left' as='a' href={track.external_urls.spotify}>{track.name}</Header>
              <Item.Meta>{album.name}</Item.Meta>
              <Item.Extra>
                <Button.Group icon floated='right'>
                  <Button id={track.id}>
                    <Icon name='play' />
                  </Button>
                  <Button>
                    <Icon name='pause' />
                  </Button>
                  <Button>
                    <Icon name='shuffle' />
                  </Button>
                </Button.Group>
                <Label>{track.artists.length > 0 ? track.artists[0].name : 'Unknown'}</Label>
              </Item.Extra>
            </Item.Content>
        </Item>);
    }
    return trackList;
  }

  render() {
    if (this.state.generating || this.state.addingTracks) {
      let btnMessage = 'Adding tracks...';
      if (this.state.generating) {
        btnMessage = 'Creating Playlist...';
      }
      return (
        <Container className='generate-btn'>
          <Button basic loading color='teal'>{btnMessage}</Button>
          <h4>{btnMessage}</h4>
        </Container>
      )
    } else if (!this.state.generating && !this.state.addingTracks && this.state.playlist) {
      const size = {
      width: '100%',
      height: 500,
      };
      const view = 'list'; // or 'coverart'
      const theme = 'white'; // or 'white'
      return (
        <SpotifyPlayer
          uri={this.state.playlist.uri}
          size={size}
          view={view}
          theme={theme}
        />
      );
    } else if (this.props.selected && this.props.selected.length > 0) {
      return (
        <div>
          <Divider horizontal inverted>Create your playlist</Divider>
          <Container className='generate-btn'>
            <Button animated='vertical' color='teal' onClick={this.generatePlaylist}>
              <Button.Content hidden><Icon name='arrow down' /></Button.Content>
              <Button.Content visible>
                Generate Playlist
              </Button.Content>
            </Button>
          </Container>
        </div>
      )
    }
    return (<div></div>);
  }
}

export default Playlist;
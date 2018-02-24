import React, { Component } from 'react';
import { Container, Button, Icon, Segment } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import SelectedArtists from './components/SelectedArtists';
import Playlist from './components/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      authenticated: false,
      queryMessage: 'Please login with Spotify to create a playlist with artists\' top tracks!',
      artistResults: null,
      selected: [],
      generated: false,
      playlist: null
    }
    this.showArtistResults = this.showArtistResults.bind(this);
    this.addArtist = this.addArtist.bind(this);
    this.removeArtist = this.removeArtist.bind(this);
    this.updatePlaylist = this.updatePlaylist.bind(this);
    this.fetchUserAuth = this.fetchUserAuth.bind(this);
  }
  
  fetchUserAuth() {
    fetch('auth/user', { credentials: 'include' })
      .then(
        res => res.json(),
        err => console.log('Could not find a user')
      )
      .then(user => {
        if (user) {
          this.setState({
            currentUser: user,
            authenticated: true,
            queryMessage: 'Search for artists to generate a playlist.'
          });
        } else {
          this.setState({
            currentUser: user,
            authenticated: false,
            queryMessage: 'Please login with Spotify to create a playlist with artists\' top tracks!'
          });
        }
      })
      .catch(err => console.log(err));
  }

  componentWillMount() {
    this.fetchUserAuth();
  }

  resetApp() {
    this.fetchUserAuth();
    this.setState({
      selected: [],
      generated: false,
      artistResults: null
    });
  }

  showArtistResults(input) {
    this.setState({queryMessage: `Searching for ${input}...`});
    axios.get('spotify/search', {
      params: {                                                           
        q: input
      }
    }).then(
      results => {
        const artistResults = results.data;
        this.setState({artistResults})
      },
      error => {
        this.setState({ queryMessage: `Something went wrong.` });
      }
    )
  }

  addArtist(artist) {
    let newSelected = this.state.selected.slice();
    newSelected.push(artist);
    this.setState({selected: newSelected, artistResults: null, queryMessage: 'Search for more artists or generate playlist.'});
  }

  removeArtist(artistId) {
    let currentSelected = this.state.selected.slice();
    const artistMatch = _.findIndex(currentSelected, o => o.id === artistId);
    if (artistMatch !== -1) {
      currentSelected.splice(artistMatch, 1);
      this.setState({selected: currentSelected});
    }
  }

  updatePlaylist(playlist) {
    this.setState({
      selected: [],
      queryMessage: '',
      playlist
    });
  }
  
  render() {

    if (!this.state.currentUser) {
      return (
        <Container textAlign='center'>
          <div className="App">
            <Search authenticated={this.state.authenticated} queryMessage={this.state.queryMessage} showArtistResults={this.showArtistResults}/>
            <Container className='login-segment'>
              <Button inverted='true' color='teal' as='a' href='http://localhost:5000/auth/spotify' className='login-btn'>
                <Icon name='spotify' size='large' /> Login with Spotify
              </Button>
            </Container>
            <SearchResults message={this.state.queryMessage} results={this.state.artistResults} addArtist={this.addArtist} selected={this.state.selected}/>
            <SelectedArtists selected={this.state.selected} removeArtist={this.removeArtist}/>
          </div>
          <div className="footer">
            Made with <Icon name='heart' /> by <a href="http://melvin.tech">melvin.tech</a>
          </div>
        </Container>
      );
    }
    if (this.state.generated) {
      return (
        <Container className='App'>
          <Playlist selected={this.state.selected} updatePlaylist={this.updatePlaylist} />
          <div className="footer">
            Made with <Icon name='heart' /> by <a href="http://melvin.tech">melvin.tech</a>
          </div>
        </Container>
      )
    }
    return (
      <Container textAlign='center'>
        <div className="App">
          <Search authenticated={this.state.authenticated} queryMessage={this.state.queryMessage} showArtistResults={this.showArtistResults} />
          <SearchResults message={this.state.queryMessage} results={this.state.artistResults} addArtist={this.addArtist} selected={this.state.selected}/>
          <SelectedArtists selected={this.state.selected} removeArtist={this.removeArtist} />
          <Playlist selected={this.state.selected} updatePlaylist={this.updatePlaylist} />
          <br />
          <Button inverted color='grey' as='a' href='http://localhost:5000/auth/logout'>
            <Icon name='spotify' size='large' /> Logout
          </Button>
        </div>
        <div className="footer">
          Made with <Icon name='heart' /> by <a href="http://melvin.tech">melvin.tech</a>
        </div>
      </Container>
    );
  }
}

export default App;

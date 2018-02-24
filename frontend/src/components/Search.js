import React, { Component } from 'react';
import { Input, Container } from 'semantic-ui-react';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const text = this.state.text.trim();
    if (text) {
      this.props.showArtistResults(text);
      this.setState({ text: '' })
    }
  }

  handleKeyDown(e) {
    if (e.keyCode !== 13) {
      return;
    }

    e.preventDefault();
    const text = this.state.text.trim();
    if (text) {
      this.props.showArtistResults(text);
      this.setState({ text: '' })
    }
  }

  render() {
    let authenticated = this.props.authenticated;
    if (!authenticated) {
      return (<h2>{this.props.queryMessage}</h2>)
    }
    
    return (
      <div>
        <h2> {this.props.queryMessage} </h2>
        <Container className='input-container'>
          <Input
            fluid
            size='large'
            action={{ color: 'teal', labelPosition: 'left', icon: 'spotify', content: 'Search', onClick: this.handleClick}}
            actionPosition='left'
            placeholder='Search for your favorite artists.'
            value={this.state.text}
            onKeyDown={this.handleKeyDown}
            onChange={(e) => this.setState({ text: e.target.value })} />
        </Container>
      </div>
    )
  }
}

export default Search;
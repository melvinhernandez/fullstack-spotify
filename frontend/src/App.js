import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    }
  }
  
  componentDidMount() {
    fetch('auth/user', { credentials: 'include' })
      .then(
        res => res.json(),
        err => console.log('Could not find a user')
      )
      .then(user => {
        this.setState({ currentUser: user });
      })
      .catch(err => console.log(err));
  }
  
  render() {
    let user = 'Please authenticate!';
    if (this.state.currentUser) {
      user = this.state.currentUser.username;
    }
    return (
      <div className="App">
        <a href="http://localhost:5000/auth/spotify">Auth</a><br/>
        <a href="http://localhost:5000/auth/logout">Logout</a><br/>
        Hello
        <h2>
          {user}
        </h2>
      </div>
    );
  }
}

export default App;

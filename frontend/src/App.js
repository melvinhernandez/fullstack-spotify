import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { users: [] }
  
  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => {
        console.log(users);
        this.setState({ users: users });
      });
  }
  
  render() {
    return (
      <div className="App">
        <ul>
          {this.state.users.map(user => 
            <li key={user}>{user}</li>)
          }
        </ul>
      </div>
    );
  }
}

export default App;

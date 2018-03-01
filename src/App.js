import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      league: [],
      user: null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this); 
  }
  
  componentDidMount() {
    
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });

    let db = firebase.firestore(),
        fb_league = db.collection('league');

    fb_league.orderBy('points', 'desc').get().then((querySnapshot) => {

      let newState = [];

      querySnapshot.forEach(doc => {
        let newItem = doc.data();

        if (newItem.user) {
          newItem.user.get()
          .then(res => {
            newItem.user = res.data()
          })
          .catch(err => console.error(err));
        }

        newState.push(newItem)

      });
      this.setState({
        league: newState
      });
    });
  }

  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Poker Villains</h1>
              {this.state.user ?
                <button onClick={this.logout}>Log Out</button>                
                :
                <button onClick={this.login}>Log In</button>              
              }
            </div>
        </header>
      </div>
    );
  }
}
export default App;
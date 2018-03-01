import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  
  constructor( props ) {
    super( props );
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
            newState.push(newItem)
            this.setState({
              league: newState
            });
          })
          .catch(err => console.error(err));
        }

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
        <div className='league'>
          <table>
            <thead>
              <tr>
                <th>
                  Villain
                </th>
                <th>
                  First
                </th>
                <th>
                  Second
                </th>
                <th>
                  Third
                </th>
                <th>
                  First Out
                </th>
                <th>
                  Knockouts
                </th>
                <th>
                  Balance
                </th>
                <th>
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.league.map((item,index) => {
                return (
                  <tr key={index}>
                    <td>
                      <h3>{item.user.firstname}</h3>
                    </td>
                    <td>
                      <h3>{item.first}</h3>
                    </td>
                    <td>
                      <h3>{item.second}</h3>
                    </td>
                    <td>
                      <h3>{item.third}</h3>
                    </td>
                    <td>
                      <h3>{item.firstout}</h3>
                    </td>
                    <td>
                      <h3>{item.knockouts}</h3>
                    </td>
                    <td>
                      <h3>{item.balance}</h3>
                    </td>
                    <td>
                      <h3>{item.points}</h3>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default App;
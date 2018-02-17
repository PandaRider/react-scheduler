import React, { Component } from 'react';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  // ConnectedRouter,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import history from './store/configureStore'

class App extends Component {
  render() {
    return (
      // <ConnectedRouter>
        <Home events={this.props.events}/>
      // </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps)(App);


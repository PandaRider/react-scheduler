import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import Home from './components/Home';
import Login from './containers/Login';
import { history } from './store/configureStore'

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={ Home }/>
          <Route path="/login" component={ Login } />
        </div>
      </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps)(App);


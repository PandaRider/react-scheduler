import React, { Component } from 'react';
import {
  // BrowserRouter as Router,
  Route,
  // Link,
  // Switch,
  Redirect,
} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import Home from './components/Home';
import Login from './containers/Login';
import Welcome from './components/Welcome';
import Profile from './containers/Profile';
import { history } from './store/configureStore'

const PrivateRoute = ({component: Component, authenticated, ...props}) => {
  return (
      <Route
          {...props}
          render={(props) => authenticated === true
              ? <Component {...props} />
              : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
      />
  );
};

const PublicRoute = ({component: Component, authenticated, ...props}) => {
  console.log("app auth: " + authenticated);
  return (
      <Route
          {...props}
          render={(props) => authenticated === false
              ? <Component {...props} />
              : <Redirect to='/' />}
      />
  );
};

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={ Welcome }/>
          <PublicRoute authenticated={this.props.authenticated }  path="/login" component={ Login } />
          <PrivateRoute authenticated={this.props.authenticated }  path="/home" component={ Home } />
          <PrivateRoute authenticated={this.props.authenticated }  path="/profile" component={ Profile } />
        </div>
      </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(App);


/* eslint
  import/no-named-as-default: "off",
  import/no-named-as-default-member: "off",
  import/no-extraneous-dependencies: "off",
*/
import React from 'react';
import {
  // BrowserRouter as Router,
  Route,
  // Link,
  // Switch,
  Redirect,
} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import MainControl from './containers/MainControl';
import Login from './containers/Login';
import Welcome from './components/Welcome';
import Profile from './containers/Profile';
import { history } from './store/configureStore';

require('./utils/algo');

const PrivateRoute = ({ component: Component, authenticated, ...props }) => (
  <Route
    {...props}
    render={props => (authenticated === true
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
          }
  />
);

const PublicRoute = ({ component: Component, authenticated, ...props }) => {
  return (
    <Route
      {...props}
      render={props => (authenticated === false
              ? <Component {...props} />
              : <Redirect to="/main" />)
        }
    />
  );
};

class App extends React.Component {
  render() {
    return (
        <ConnectedRouter history={history}>
          <div>
            <Route exact path="/" component={Welcome} />
            <PublicRoute authenticated={this.props.authenticated} path="/login" component={Login} />
            <PrivateRoute authenticated={this.props.authenticated} path="/main" component={MainControl} />
            <PrivateRoute authenticated={this.props.authenticated} path="/profile" component={Profile} />
          </div>
        </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(App);


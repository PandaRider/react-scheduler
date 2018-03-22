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
import AdminProfile from './containers/AdminProfile';
import { history } from './store/configureStore';

const ProfRoute = ({ component: Component, authenticated, ...props }) => (
  <Route
    {...props}
    render={props => (authenticated === "Prof"
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
          }
  />
);

const PublicRoute = ({ component: Component, authenticated, ...props }) => {
  // console.log(`app auth: ${authenticated}`);
  return (
    <Route
      {...props}
      render={props => (authenticated === "Public"
              ? <Component {...props} />
              : <Redirect to="/main" />)
        }
    />
  );
};


const AdminRoute = ({ component: Component, authenticated, ...props }) => (
  <Route
    {...props}
    render={props => (authenticated === "Admin"
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
          }
  />
);

class App extends React.Component {
  render() {
    return (
        <ConnectedRouter history={history}>
          <div>
            <Route exact path="/" component={Welcome} />
            <PublicRoute authenticated={this.props.authenticated} path="/login" component={Login} />
            <ProfRoute authenticated={this.props.authenticated} path="/main" component={MainControl} />
            <ProfRoute authenticated={this.props.authenticated} path="/profile" component={Profile} />
            <AdminRoute authenticated={this.props.authenticated} path="/admin" component={AdminProfile} />
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


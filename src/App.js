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

const ProfRoute = ({ component: Component, authProf, ...props }) => (
  <Route
    {...props}
    render={props => (authProf === true
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
          }
  />
);

const PublicRoute = ({ component: Component, authAny, ...props }) => {
  // console.log(`app auth: ${authenticated}`);
  return (
    <Route
      {...props}
      render={props => (authAny === false
              ? <Component {...props} />
              : <Redirect to="/main" />)
        }
    />
  );
};


const AdminRoute = ({ component: Component, authAdmin, ...props }) => (
  <Route
    {...props}
    render={props => (authAdmin === true
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
            <PublicRoute authAny={this.props.authProf} path="/login" component={Login} />
            <ProfRoute authProf={this.props.authProf} path="/main" component={MainControl} />
            <ProfRoute authProf={this.props.authProf} path="/profile" component={Profile} />
            <AdminRoute authAdmin={this.props.authAdmin} path="/admin" component={AdminProfile} />
          </div>
        </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    // authenticated: state.auth.authenticated,
    authProf: state.auth.authProf,
    authAdmin: state.auth.authAdmin,
  };
}

export default connect(mapStateToProps)(App);


/* eslint
  import/no-named-as-default: "off",
  import/no-named-as-default-member: "off",
*/
import React from 'react';
import { connect } from 'react-redux';

import Calendar from '../components/Calendar';
import MenuAppBar from '../components/MenuAppBar';
import '../styles/styles.css';
import * as Actions from '../actions';

// This is the MainControl "Main" page after the user logs in.
class MainControl extends React.Component {
  render() {
    return (
      <div>
        <MenuAppBar signOutAction={this.props.signOutUser} />
        <div className="example">
          <Calendar events={this.props.events} />
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events: state.events,
  };
}

export default connect(mapStateToProps, Actions)(MainControl);

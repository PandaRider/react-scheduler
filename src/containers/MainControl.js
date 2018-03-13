/* eslint
  import/no-named-as-default: "off",
  import/no-named-as-default-member: "off",
*/
import React from 'react';
import { connect } from 'react-redux';

import * as Actions from '../actions';
import Calendar from '../components/Calendar';
import MenuAppBar from '../components/MenuAppBar';
import Subjects from '../components/Subjects';
import '../styles/styles.css';
import '../styles/MainControl.css';

// This is the MainControl "Main" page after the user logs in.
class MainControl extends React.Component {
  render() {
    return (
      <div class="container" id="mainContainer">
        <MenuAppBar 
          signOutAction={this.props.signOutUser} 
          handleChangeTabs={this.props.changeTab}
          value={this.props.tab} 
        />
        {this.props.tab === 0 ? 
          <div class="example">
            <Calendar events={this.props.events} />
          </div> : 
          <Subjects />
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events: state.events,
    tab: state.menu.tab
  };
}

export default connect(mapStateToProps, Actions)(MainControl);

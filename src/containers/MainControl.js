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
import { mapCoursesToEvents } from '../utils/wenbin';

// This is the MainControl "Main" page after the user logs in.
class MainControl extends React.Component {
  state = {
    events: [],
  };

  componentDidMount() {
    let { isAdmin, uid } = this.props;
    this.props.fetchCourses(null, null); // TODO - change to this.props.isAdmin - currenty is 'undefined'
  }

  _getEvents() {
    //return this.props.events;
    let events = mapCoursesToEvents(this.props.courses);
    return events;
  }

  render() {
    if (this.props.isAdmin === 'admin') {
      return (
        <div>yay admin</div>
      )
    } else {
      console.log(this.props.isAdmin);
      return (
        <div class="container" id="mainContainer">
          <MenuAppBar 
            signOutAction={this.props.signOutUser} 
            handleChangeTabs={this.props.changeTab}
            value={this.props.tab} 
          />
          {this.props.tab === 0 ? 
            <div class="example">
              <Calendar events={this._getEvents()} />
            </div> : 
            <Subjects uid={this.props.uid} />
          }
        </div>
      );
    }
  }
}


function mapStateToProps(state) {
  return {
    events: state.events,
    tab: state.menu.tab,
    uid: state.auth.uid,
    isAdmin: state.auth.isAdmin,
    courses: state.courses.courses,
    // isAdmin: state.menu.newTitle,
  };
}

export default connect(mapStateToProps, Actions)(MainControl);

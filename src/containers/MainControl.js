/* eslint
  import/no-named-as-default: "off",
  import/no-named-as-default-member: "off",
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../actions';
import Calendar from '../components/Calendar';
import MenuAppBar from '../components/MenuAppBar';
import Subjects from '../components/Subjects';
import ChatWidget from '../containers/ChatWidget';
import '../styles/styles.css';
import '../styles/MainControl.css';

const TIMETABLE = 0;
const CLASSES = 1;
const CHAT = 2;

// This is the MainControl "Main" page after the user logs in.
class MainControl extends Component {
  componentDidMount() {
    let { isAdmin, uid } = this.props;
    this.props.fetchCourses(isAdmin, null); // TODO - change to this.props.isAdmin - currently is 'undefined'
    this.props.fetchEvents();
  }

  state = {
    events: [],
  };

  _getEvents() {
    let events = this.props.events;
    if (events == null) return [];
    
    if (this.props.isAdmin === 'admin') return events;
    else return events.filter(event => event.uid === this.props.uid);
  }

  render() {
    return (
      <div class="container" id="mainContainer">
        <MenuAppBar 
          signOutAction={this.props.signOutUser} 
          handleChangeTabs={this.props.changeTab}
          value={this.props.tab} 
        />
        {
          this.props.tab === 0 ? 
            <div class="example">
              <Calendar events={this._getEvents()} />
            </div>  :
          this.props.tab === 1 ?
            <Subjects uid={this.props.uid} />  :
            <ChatWidget />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab: state.menu.tab,
    uid: state.auth.uid,
    isAdmin: state.auth.isAdmin,
    courses: state.courses.courses,
    events: state.events.events,
  };
}

export default connect(mapStateToProps, Actions)(MainControl);

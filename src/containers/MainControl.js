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

const API_KEY = 'AIzaSyDvB-l32VkXryYRO-TGurfuXVH2fAWavd4';
const CLIENT_ID = '963547975567-a502fp13jmtfdhlimrbh6qnfk9hr5eg4.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPE = "https://www.googleapis.com/auth/calendar";

const myTestEvent = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2018-04-10T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'end': {
    'dateTime': '2018-04-10T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'}
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10}
    ]
  }
};

// This is the MainControl "Main" page after the user logs in.
class MainControl extends React.Component {
  
  constructor(props){
    super(props);
    this.startGoogleCalendar = this.startGoogleCalendar.bind(this);
    this.secondFunction = this.secondFunction.bind(this);
    this.thirdFunction = this.thirdFunction.bind(this);
    this.finalFunction = this.finalFunction.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    // this.state = {
    //   GoogleAuth: null,
    // }
    this.myGoogleAuth = null;
    // this.postAuth = this.postAuth.bind(this);
  }
  componentDidMount() {
    window.gapi.load('client', this.startGoogleCalendar);
    let { isAdmin, uid } = this.props;
    this.props.fetchCourses(null, null); // TODO - change to this.props.isAdmin - currenty is 'undefined'
  }
  async startGoogleCalendar() {
    try {
      await window.gapi.client.init({
        'apiKey': API_KEY, 
        'clientId': CLIENT_ID,
        'discoveryDocs': DISCOVERY_DOCS,
        'scope': SCOPE,
      })
      await this.secondFunction();
      await this.thirdFunction();
  
    } catch(error) {
      console.log(error);
    }
  }

  async secondFunction () {
    this.myGoogleAuth = window.gapi.auth2.getAuthInstance();
    // let tempGoogleAuth = window.gapi.auth2.getAuthInstance();
    // this.setState({ GoogleAuth: tempGoogleAuth });

    // Listen for sign-in state changes.
    this.myGoogleAuth.isSignedIn.listen(() => console.log('Status: Signed in'));         // async
    // Handle initial sign-in state. (Determine if user is already signed in.)
    // let user = tempGoogleAuth.currentUser.get();
    let user = this.myGoogleAuth.currentUser.get();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    isAuthorized ? console.log('signed in and authorized') : console.log('not authorized or signed out');
  }

  async thirdFunction() {
    console.log('finished response');
  }

  async finalFunction() {
    let request = window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': myTestEvent,
    });
    request.execute((event) => {
      console.log('Event created: ' + event.htmlLink);
    });
  }

  async handleAuthClick() {
    if (this.myGoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      this.myGoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      await this.myGoogleAuth.signIn();
      this.finalFunction();
    }
  }

  // revokeAccess() {
  //   GoogleAuth.disconnect();
  // }

  state = {
    events: [],
  };


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

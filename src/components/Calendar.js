// Demo from https://github.com/intljusticemission/react-big-calendar/blob/master/examples/App.js
// and https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/timeslots.js
// and https://github.com/intljusticemission/react-big-calendar/blob/master/examples/styles.less
// Documentation from http://intljusticemission.github.io/react-big-calendar/examples/index.html

import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment'; // moment is a frequently used JavaScript library used to enable Date objects
// import events from '../reducers/events'; // events is the sample data.
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogTitle, DialogActions, DialogContentText } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // boilerplate. Required by library

// Lesson: Integrating third party components
// Task: Read and understand the props used. Which ones do you need to keep, which ones to remove?
// Suggested reference: https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/selectable.js

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


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


const styles = theme => ({
  button: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',  }
});

class CalendarWrapper extends Component {
  constructor() {
    super();
    this.startGoogleCalendar = this.startGoogleCalendar.bind(this);
    this.secondFunction = this.secondFunction.bind(this);
    // this.thirdFunction = this.thirdFunction.bind(this);
    this.insertCalendarEntry = this.insertCalendarEntry.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);

    this.state = {
      open: false,
      detailsTitle: null,
      start: null,
      end: null,
    };
    this.myGoogleAuth = null;
  }
  async componentDidMount() {
    window.gapi.load('client', this.startGoogleCalendar);
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
      // await this.thirdFunction();
    } catch(error) {
      console.log(error);
    }
  }
  // async thirdFunction() {
  //   console.log('finished response');
  // }


  async secondFunction () {
    this.myGoogleAuth = window.gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    this.myGoogleAuth.isSignedIn.listen(() => console.log('Status: Signed in'));         // async
    // Handle initial sign-in state. (Determine if user is already signed in.)
    let user = this.myGoogleAuth.currentUser.get();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    isAuthorized ? console.log('signed in and authorized') : console.log('not authorized or signed out');
  }

  async insertCalendarEntry() {
    let rsc = {
      'summary': 'Test',
      'start': {
        'dateTime': this.state.start,
        'timeZone': 'Asia/Singapore'
      },
      'end': {
        'dateTime': this.state.end,
        'timeZone': 'Asia/Singapore'
      },
    }
    let request = window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': rsc,
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
      this.insertCalendarEntry();
    }
  }

  // revokeAccess() {
  //   GoogleAuth.disconnect();
  // }

  handleOpenDialog = (selectedEvent) => {
    let { title, start, end } = selectedEvent;
    // console.log(selectedEvent.start);
    // console.log(selectedEvent.end);
    // console.log(selectedEvent.title);
    this.setState({ open: true, detailsTitle: title, start, end });
  }

  handleClose = () => {
    this.setState({ open: false });
  }
  
  render() {
    return (
      <div>
        <Dialog open={this.state.open} onClose={() => this.setState({ open: false })}>
          <DialogTitle>Subject details</DialogTitle>
          <DialogContentText>{this.state.detailsTitle}</DialogContentText>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAuthClick} color="primary">
              Add to Google calendar
            </Button>
          </DialogActions>
        </Dialog>
        <BigCalendar
          {...this.props}
          events={this.props.events}
          step={30}
          timeslots={1}
          min={new Date(2018, 0, 30, 8, 0, 0)}
          max={new Date(2018, 0, 30, 18, 0, 0)}
          defaultView="week"
          views={['week', 'day']}
          defaultDate={new Date(2018, 0, 30)}
          onSelectEvent={this.handleOpenDialog}
        />
        <Button onClick={this.props.handleAuthClick} variant="fab" color="primary" aria-label="add" className={this.props.classes.button}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}
export default withStyles(styles)(CalendarWrapper);

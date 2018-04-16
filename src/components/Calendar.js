// Demo from https://github.com/intljusticemission/react-big-calendar/blob/master/examples/App.js
// and https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/timeslots.js
// and https://github.com/intljusticemission/react-big-calendar/blob/master/examples/styles.less
// Documentation from http://intljusticemission.github.io/react-big-calendar/examples/index.html

import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment'; 
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogTitle, DialogActions, DialogContentText } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
// import CloseIcon from 'material-ui/icons/Close';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const API_KEY = 'AIzaSyDvB-l32VkXryYRO-TGurfuXVH2fAWavd4';
const CLIENT_ID = '963547975567-a502fp13jmtfdhlimrbh6qnfk9hr5eg4.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPE = "https://www.googleapis.com/auth/calendar";

const styles = theme => ({
  button: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',  },
  snackbarClose: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  }
});

class CalendarWrapper extends Component {
  constructor() {
    super();
    this.startGoogleCalendar = this.startGoogleCalendar.bind(this);
    this.secondFunction = this.secondFunction.bind(this);
    this.insertCalendarEntry = this.insertCalendarEntry.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);

    this.state = {
      open: false,
      detailsTitle: null,
      start: null,
      end: null,
      snackbarIsOpen: false,
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
    } catch(error) {
      console.log(error);
    }
  }

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
      await this.insertCalendarEntry();
      this.setState({ snackbarIsOpen: true });
    }
  }

  // revokeAccess() {
  //   GoogleAuth.disconnect();
  // }

  handleOpenDialog = (selectedEvent) => {
    let { title, start, end } = selectedEvent;
    this.setState({ open: true, detailsTitle: title, start, end });
  }

  eventStyle = (event) => {
    let backgroundColor = '#3174ad';
    if (event.uid === 'test') backgroundColor = '#4caf50';
    else if (event.uid === 'prof1') backgroundColor = '#808080';

    let borderColor = '#265985';
    if (event.uid === 'test') borderColor = '#087f23';
    else if (event.uid === 'prof1') borderColor = '#000000'

    let borderWidth = event.type === 'Lecture' ? 3 : 1;

    let style = {
      backgroundColor,
      borderColor,
      borderWidth,
    };

    return { style };
  }

  handleEvent = (selectedEvent) => {
    console.log(selectedEvent);
    this.setState({ open: true, selectedEvent });
  }

  handleClose = () => {
    this.setState({ open: false });
  }
  
  // TODO: Encapsulate Dialog, Calendar, Snackbar, Button for better readability
  render() {
    return (
      <div style={{flex: 1}}>
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
          eventPropGetter={this.eventStyle}
          step={30}
          timeslots={1}
          min={new Date(2018, 0, 30, 8, 0, 0)}
          max={new Date(2018, 0, 30, 18, 0, 0)}
          defaultView="week"
          views={['week', 'day']}
          defaultDate={new Date(2018, 0, 30)}
          onSelectEvent={this.handleOpenDialog}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarIsOpen}
          autoHideDuration={6000}
          onClose={() => this.setState({ snackbarIsOpen: false })}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Calendar entry inserted!</span>}
          action={[
            // <Button key="undo" color="secondary" size="small" onClick={() => this.setState({ snackbarIsOpen: false })}>
            //   UNDO
            // </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={this.props.classes.snackbarClose}
              onClick={() => this.setState({ snackbarIsOpen: false })}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Button onClick={this.props.handleAuthClick} variant="fab" color="primary" aria-label="add" className={this.props.classes.button}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}
export default withStyles(styles)(CalendarWrapper);

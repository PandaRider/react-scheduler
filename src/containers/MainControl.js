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

const API_KEY = 'AIzaSyDvB-l32VkXryYRO-TGurfuXVH2fAWavd4';
const CLIENT_ID = '963547975567-a502fp13jmtfdhlimrbh6qnfk9hr5eg4.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPE = "https://www.googleapis.com/auth/calendar";

// This is the MainControl "Main" page after the user logs in.
class MainControl extends React.Component {
  
  constructor(props){
    super(props);
    // this.secondFunction = this.secondFunction.bind(this);
    // this.thirdFunction = this.thirdFunction.bind(this);
    this.state = {
      GoogleAuth: null,
    }
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    // this.postAuth = this.postAuth.bind(this);
    this.startGoogleCalendar = this.startGoogleCalendar.bind(this);
  }
  componentDidMount() {
    window.gapi.load('client', this.startGoogleCalendar);
  }
  // startGoogleCalendar() {
  //   window.gapi.client.init({
  //     'apiKey': API_KEY, 
  //     'clientId': CLIENT_ID,
  //     'discoveryDocs': DISCOVERY_DOCS,
  //     'scope': SCOPES,
  //   }).then(function() {
  //     // 3. Initialize and make the API request.
  //     return window.gapi.client.request({
  //       'path': 'https://www.googleapis.com/calendar/v3/calendars/istd.scheduler@gmail.com/events',
  //     })
  //   }).then(function(response) {
  //     console.log(response.result);
  //   }, function(reason) {
  //     console.log(reason);   //???
  //   });
  // }

  // 
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
    let tempGoogleAuth = window.gapi.auth2.getAuthInstance();
    // this.setState({ GoogleAuth: tempGoogleAuth });
    // let GoogleAuth = window.gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    tempGoogleAuth.isSignedIn.listen(() => console.log('something'));         // async
    // Handle initial sign-in state. (Determine if user is already signed in.)
    let user = tempGoogleAuth.currentUser.get();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    isAuthorized ? console.log('signed in and authorized') : console.log('not authorized or signed out');
  }

  async thirdFunction() {
    console.log('response');
  }

  // handleAuthClick() {
  //   if (GoogleAuth.isSignedIn.get()) {
  //     // User is authorized and has clicked 'Sign out' button.
  //     GoogleAuth.signOut();
  //   } else {
  //     // User is not signed in. Start Google auth flow.
  //     GoogleAuth.signIn();
  //   }
  // }
  // revokeAccess() {
  //   GoogleAuth.disconnect();
  // }

  updateSigninStatus() {
    console.log('something');
    // this.setSigninStatus();
  }
  // setSigninStatus(isSignedIn) {
  //   let user = this.state.GoogleAuth.currentUser.get();
  //   let isAuthorized = user.hasGrantedScopes(SCOPE);
  //   if (isAuthorized) {
  //     console.log('You are currently signed in and have granted access to this app.');
  //   } else {
  //     console.log('You have not authorized this app or you are signed out.');
  //   }
  // }

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
              <Calendar events={this.props.events} />
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
    // isAdmin: state.menu.newTitle,
  };
}

export default connect(mapStateToProps, Actions)(MainControl);

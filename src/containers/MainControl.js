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
const CLIENT_ID = 'http://963547975567-ck1lcc823koop6c75q5lj810gva2l58i.apps.googleusercontent.com/';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar";

// This is the MainControl "Main" page after the user logs in.
class MainControl extends React.Component {
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
  startGoogleCalendar() {
    window.gapi.client.init({
      'apiKey': API_KEY, 
      'clientId': CLIENT_ID,
      'discoveryDocs': DISCOVERY_DOCS,
      'scope': SCOPES,
    }).then(function() {
      // 3. Initialize and make the API request.
      return window.gapi.client.request({
        'path': 'https://www.googleapis.com/calendar/v3/calendars/istd.scheduler@gmail.com/events',
      })
    }).then(function(response) {
      console.log(response.result);
    }, function(reason) {
      console.log(reason);   //???
    });
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

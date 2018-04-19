import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Widget, 
  addResponseMessage, // the person you are talking to
  addLinkSnippet, 
  addUserMessage      // yourself
} from 'react-chat-widget';
import _ from 'lodash';

import { setMessage, firebaseApp } from '../utils/Firebase';
import * as Actions from '../actions';

class ChatWidget extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: null,
    }
  }
  // TODO: differentiate prof and admin chat bubbles
  componentDidMount() {
    let ref = firebaseApp.database().ref('chat/').child('MhfSenYDsYh4b6G41hmsk1KKcxF2');
    let isAdmin = this.props.isAdmin;
    console.log(isAdmin);
    ref.on('child_added', (snapshot) => {
      const { userType, message } = snapshot.val();
      console.log(message);
      userType === isAdmin ? addUserMessage(message) : addResponseMessage(message);
      // TODO: call action and save all messages to redux state.
      // return element?
    });

  }

  // warning: future deprecatation
  componentWillReceiveProps(nextProps) {
    // basically, the props will return the entire message array
    // it is the props change that will invoke the addUserMessage function
    let newMessages = _.difference(nextProps.messages, this.props.messages);
    if (newMessages !== []){
      newMessages.map(msg => {
        if (msg.userType !== this.props.isAdmin) addUserMessage(msg);
        // hopefully, this.props.isAdmin can be read. If not, "this" context may be lost (undefined).
      })
    }
  }
  componentWillUnmount() {
    // clear (reset) messages from redux state?
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    setMessage(null, newMessage)
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title="Chatroom"
          subtitle="subtitle"
        />
      </div>
    );
  } 
}

function mapStateToProps(state) {
  return {
    messages: state.chat,
  };
}

export default connect(mapStateToProps, Actions)(ChatWidget);

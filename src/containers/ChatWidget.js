import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Widget, 
  addResponseMessage, 
  addLinkSnippet, 
  addUserMessage 
} from 'react-chat-widget';
import { setMessage, firebaseApp } from '../utils/Firebase';
import * as Actions from '../actions';

class ChatWidget extends Component {
  componentDidMount() {
    let ref = firebaseApp.database().ref('chat/').child('MhfSenYDsYh4b6G41hmsk1KKcxF2');
    ref.on('child_added', (snapshot) => {
      const { userType, message } = snapshot.val();
      console.log(message);
      userType === 'admin' ? addUserMessage(message) : addResponseMessage(message);
    })
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    setMessage(this.props.isAdmin, newMessage)
  }

  mapFirebaseToChat = (uid) => {
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



export default ChatWidget;
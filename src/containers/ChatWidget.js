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
    })
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

export default ChatWidget;
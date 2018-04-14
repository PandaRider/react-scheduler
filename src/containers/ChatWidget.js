import React, { Component } from 'react';
import { 
  Widget, 
  addResponseMessage, 
  addLinkSnippet, 
  addUserMessage 
} from 'react-chat-widget';
import { setMessage } from '../utils/Firebase';

class ChatWidget extends Component {
  componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    setMessage(null, newMessage)
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
import React, { Component } from 'react';
import { Widget } from 'react-chat-widget';

class ChatWidget extends Component {
  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
        />
      </div>
    );
  }
}

export default ChatWidget;
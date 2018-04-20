import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Widget,
  addResponseMessage, // the person you are talking to
  addUserMessage, // yourself
} from 'react-chat-widget';
import _ from 'lodash';

import { 
  // setMessage, 
  firebaseApp,
} from '../utils/Firebase';
import * as Actions from '../actions';

class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null,
    };
  }

  async componentDidMount() {
    const ref = firebaseApp.database().ref('chat/').child('MhfSenYDsYh4b6G41hmsk1KKcxF2');
    const isAdmin = this.props.isAdmin;
    let msgArr = [];
    // console.log(`redux "isAdmin" state is: ${isAdmin}`);
    await ref.once('value', (snapshot) => {
      let res = snapshot.val();
      msgArr = _.toArray(res); // for throwing away key
      msgArr = _.map(res, (val, key) => ({
        key,
        ...val
      }))
      this.props.initializeMessages(msgArr);
    })
    msgArr.map(m => {
      let { userType, message } = m;
      userType === isAdmin ? addUserMessage(message) : addResponseMessage(message);
    })

    ref.on('child_added', (snapshot) => {
      const { userType, message } = snapshot.val();
      console.log(snapshot.key);
      if (userType !== isAdmin) {
        if (this.props.messages.map(m => m.id).includes(snapshot.key) !== true ) addResponseMessage(message)
      }
      
      // if (this.props.messages.includes(snapshot.val()) !== true ) addResponseMessage(message);
    })

  
    // ref.on('child_added', (snapshot) => {
    //   const { userType, message } = snapshot.val();
    //   console.log(message);
    //   if (userType !== isAdmin) addResponseMessage(message);
    //   // userType === isAdmin ? addUserMessage(message) : addResponseMessage(message);
    //   // TODO: call action and save all messages to redux state.
    //   // return element?
    //   msgArr.push({ userType, message });
    // });
    // console.log(`arr size is : ${msgArr.length}`);
    // msgArr.map((m) => {
    //   console.log('here');
    //   let { userType, message } = m;
    //   userType === isAdmin ? addUserMessage(message) : addResponseMessage(message);
    // })

    // this.props.initializeMessages(msgArr); // should only execute once...  
  }

  // warning: future deprecatation
  // componentWillReceiveProps(nextProps) {
  //   // basically, the props will return the entire message array
  //   // it is the props change that will invoke the addUserMessage function
  //   console.log(`my new props is: ${nextProps.messages}`);
  //   const newMessages = _.difference(nextProps.messages, this.props.messages);
  //   console.log(``)
  //   if (newMessages !== []) {
  //     newMessages.map((msg) => {
  //       console.log(`"isAdmin" props is: ${this.props.isAdmin}`);
  //       console.log(`checking data output: ${msg}`)
  //       if (msg.userType !== this.props.isAdmin) addResponseMessage(msg.message); // wait what is this supposed to do again?
        
  //     });
  //   }
  // }
  componentWillUnmount() {
    // clear (reset) messages from redux state?
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);

    this.props.setMessage(this.props.isAdmin, newMessage);
    // setMessage(this.props.isAdmin, newMessage);
  }

  render() {
    // console.log(this.props.messages);
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title="Chatroom"
          subtitle={`${this.props.isAdmin === 'admin'? 'Prof' : 'Admin'} is online`}
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

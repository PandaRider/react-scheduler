import Firebase from 'firebase';
import { giveFirebaseHaha }from '../utils/Firebase';

import {
  SET_MESSAGE,
  FETCH_MESSAGES,
  INIT_MESSAGES,
} from './types'

const setMessage = (msg) => {
  
  return {
    type: SET_MESSAGE,
    payload: msg,
  }
}

const fetchMessages = (msgUid) => {

  return {
    type: FETCH_MESSAGES,
    
  }
}

const initializeMessages = (msgArr) => {
  return {
    type: INIT_MESSAGES,
    payload: msgArr,
  }
}

// warning: (code smell) passing firebase ref and executing firebase methods outside of file.
export const updateMessages = () => {
  return (dispatch) => {
    let firebaseChatRef = giveFirebaseHaha();
    firebaseChatRef.on('child_added',(snapshot) => {
      dispatch(setMessages(snapshot.message))
    })
  }
}



export const fetchMessages = () => {}
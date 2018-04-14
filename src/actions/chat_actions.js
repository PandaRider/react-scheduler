import Firebase from 'firebase';
import { giveFirebaseHaha }from '../utils/Firebase';

import {
  SET_MESSAGE,

} from './types'

const setMessages = (msg) => {
  return {
    type: SET_MESSAGE,
    payload: msg,
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
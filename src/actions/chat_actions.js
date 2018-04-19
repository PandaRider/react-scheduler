import Firebase from 'firebase';
import { giveFirebaseHaha } from '../utils/Firebase';

import {
  SET_MESSAGE,
  FETCH_MESSAGES,
  INIT_MESSAGES,
} from './types';

const setMessage = msg => ({
  type: SET_MESSAGE,
  payload: msg,
});

// Probably not needed?
export const fetchMessages = msgUid => ({
  type: FETCH_MESSAGES,
  
});

export const initializeMessages = msgArr => ({
  type: INIT_MESSAGES,
  payload: msgArr,
});

// warning: (code smell) passing firebase ref and executing firebase methods outside of file.
// export const updateMessages = () => (dispatch) => {
//   const firebaseChatRef = giveFirebaseHaha();
//   firebaseChatRef.on('child_added', (snapshot) => {
//     dispatch(setMessages(snapshot.message));
//   });
// };


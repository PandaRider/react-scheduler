import Firebase from 'firebase';
// import { getAuthType } from '../utils/Firebase';

export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const GET_ADMIN_TOKEN = 'GET_ADMIN_TOKEN';
export const TEST_FIREBASE = 'TEST_FIREBASE';

export * from './menu_actions';
export * from './courses';

export function authUser(uid, isAdmin) {
  return {
    type: AUTH_USER,
    uid,
    isAdmin,
  };
}


export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
}

export function signUpUser(credentials) {
  return (dispatch) => {
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch(authUser());
      })
      .catch((error) => {
        dispatch(authError(error));
      });
  };
}

export function signOutUser() {
  return (dispatch) => {
    Firebase.auth().signOut()
      .then(() => {
        dispatch({
          type: SIGN_OUT_USER,
        });
      });
  };
}

export function signInUser(credentials) {
  return (dispatch) => {
    Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((auth) => {
        Firebase.database().ref('users').child(auth.uid).child('isAdmin').once('value',
          (snapshot) => dispatch(authUser(auth.uid, snapshot.val()))
        );
      })
      .catch((error) => {
        dispatch(authError(error));
      });
  };
}

export function verifyAuth() {
  return (dispatch) => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(authUser(user.uid));
      } else {
        dispatch(signOutUser());
      }
    });
  };
}


export const setTitle = (snapshot) => ({
  type: TEST_FIREBASE,
  payload: snapshot
})

export const testFirebase = (uid) => (dispatch) => {
  // Firebase.database().ref('users').child('MhfSenYDsYh4b6G41hmsk1KKcxF2').child('name').once('value',
  Firebase.database().ref('users').child(uid).child('name').once('value',
      (snapshot) => dispatch(setTitle(snapshot.val())))
}

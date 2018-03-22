import Firebase from 'firebase';
import firebaseApp from '../utils/Firebase';

export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_PROF = 'AUTH_PROF';
export const AUTH_ADMIN = 'AUTH_ADMIN';

export * from './menu_actions';

export function authProf(uid) {
  return {
    type: AUTH_PROF,
    uid,
  };
}

export function authAdmin(uid) {
  return {
    type: AUTH_ADMIN,
    uid,
  }
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
        dispatch(authProf());
      })
      .catch((error) => {
        // console.log(error);
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
      .then(() => {
        dispatch(authProf());
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
        console.log(user.uid);
        dispatch(authProf(user.uid));
      } else {
        dispatch(signOutUser());
      }
    });
  };
}

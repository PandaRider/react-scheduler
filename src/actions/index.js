import Firebase from 'firebase';
// import { getAuthType } from '../utils/Firebase';

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
  console.log("all is fine.");
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
      .then((auth) => {
        // console.log("here");
        // console.log(auth.uid);
        // Firebase.database().ref('users').child(auth.uid).child('isAdmin').once('value').then(
        //   (snapshot) => {
        //     console.log(snapshot);
        //     snapshot ? dispatch(authAdmin()) : dispatch(authProf());
        //   }
        // )


        // console.log("Auth ID is: " + auth.uid);
        // Firebase.database().ref('users').child(auth.uid).child('isAdmin').once('value',
        //   (snapshot) => { snapshot.val() ? dispatch(authAdmin(auth.uid)) : dispatch(authProf(auth.uid))})


          // (snapshot) => { snapshot.val() ? console.log('okay'): console.log('alright')})

        dispatch(authAdmin());
        // let authType = getAuthType(auth.uid);
        // authType ? dispatch(authProf()) : dispatch(authAdmin());
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
        // let authType = getAuthType(user.uid);
        // authType ? dispatch(authProf(user.uid)) : dispatch(authAdmin(user.uid));

        // console.log(user.uid);
        dispatch(authProf(user.uid));
      } else {
        dispatch(signOutUser());
      }
    });
  };
}

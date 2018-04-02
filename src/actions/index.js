import Firebase from 'firebase';
import firebaseApp from '../utils/Firebase';

export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const GET_ADMIN_TOKEN = 'GET_ADMIN_TOKEN';

export * from './menu_actions';

export function authUser(uid) {
  return {
    type: AUTH_USER,
    uid,
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

        // console.log("Auth ID is: " + auth.uid);
        // Firebase.database().ref('users').child(auth.uid).child('isAdmin').once('value',
        //   (snapshot) => { snapshot.val() ? dispatch(authAdmin(auth.uid)) : dispatch(authProf(auth.uid))})
        Firebase.database().ref('users').child('MhfSenYDsYh4b6G41hmsk1KKcxF2').child('name').once('value',
      (snapshot) => { 
        console.log(snapshot);
        snapshot.val() === 'adminA' ? dispatch(() => ({ type: GET_ADMIN_TOKEN, payload: true })) 
                                     : dispatch(() => ({ type: GET_ADMIN_TOKEN, payload: false }))
                                    })

          // (snapshot) => { snapshot.val() ? console.log('okay'): console.log('alright')})

        // dispatch(authUser());
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
        dispatch(authUser(user.uid));
      } else {
        dispatch(signOutUser());
      }
    });
  };
}

export function getIsAdmin(uid) {
  return (dispatch) => {
    console.log("Auth ID is: " + uid);
    Firebase.database().ref('users').child('MhfSenYDsYh4b6G41hmsk1KKcxF2').child('isAdmin').once('value',
      (snapshot) => { snapshot.val() === true ? dispatch(() => ({ type: GET_ADMIN_TOKEN, payload: true })) 
                                     : dispatch(() => ({ type: GET_ADMIN_TOKEN, payload: false }))
                                    })
      // (snapshot) => { snapshot.val() ? console.log('okay'): console.log('alright')})
  }
}

import Firebase from 'firebase';
import firebaseApp from '../utils/Firebase';

export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const GET_ADMIN_TOKEN = 'GET_ADMIN_TOKEN';
export const TEST_FIREBASE = 'TEST_FIREBASE';

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
        dispatch(authUser());
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

// export function getIsAdmin(uid) {
//   return (dispatch) => {
//     console.log("Auth ID is: " + uid);
//     Firebase.database().ref('users').child('MhfSenYDsYh4b6G41hmsk1KKcxF2').child('isAdmin').once('value',
//       (snapshot) => { snapshot.val() === true ? dispatch(() => ({ type: GET_ADMIN_TOKEN, payload: true })) 
//                                      : dispatch(() => ({ type: GET_ADMIN_TOKEN, payload: false }))
//                                     })
//       // (snapshot) => { snapshot.val() ? console.log('okay'): console.log('alright')})
//   }
// }

export const setTitle = (snapshot) => ({
  type: TEST_FIREBASE,
  payload: snapshot
})

export const testFirebase = (uid) => (dispatch) => {
  // Firebase.database().ref('users').child('MhfSenYDsYh4b6G41hmsk1KKcxF2').child('name').once('value',
  Firebase.database().ref('users').child(uid).child('name').once('value',
      (snapshot) => dispatch(setTitle(snapshot.val())))
}

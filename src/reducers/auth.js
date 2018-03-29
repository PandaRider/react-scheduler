import { AUTH_PROF, AUTH_ADMIN, SIGN_OUT_USER, AUTH_ERROR } from '../actions';

const initialState = {
  authProf: false,
  authAdmin: false,
  error: null,
  uid: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_PROF:
      return {
        ...state,
        authProf: true,
        authAdmin: false,
        error: null,
        uid: action.uid,
      };
    case AUTH_ADMIN:
      return {
        ...state,
        authProf: false,
        authAdmin: true,
        error: null,
        uid: action.uid,
      }
    case SIGN_OUT_USER:
      return {
        ...state,
        authProf: false,
        authAdmin: false,
        error: null,
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload.message,
      };
    default:
      return state;
  }
}
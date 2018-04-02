import { AUTH_USER, SIGN_OUT_USER, AUTH_ERROR, GET_ADMIN_TOKEN } from '../actions';

const initialState = {
  authProf: false,
  authAdmin: false,
  error: null,
  uid: null,
  isAdmin: null,
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
        isAdmin: action.isAdmin,
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
    case GET_ADMIN_TOKEN:
      return {
        ...state,
        authenticated: true,
        error: null,
        isAdmin: action.payload,
      }
    default:
      return state;
  }
}
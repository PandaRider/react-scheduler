import { AUTH_PROF, AUTH_ADMIN, SIGN_OUT_USER, AUTH_ERROR } from '../actions';

const initialState = {
  authenticated: false,
  error: null,
  uid: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_PROF:
      return {
        ...state,
        authenticated: true,
        error: null,
        uid: action.uid,
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
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
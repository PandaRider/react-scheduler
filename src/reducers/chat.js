import { SET_MESSAGE } from '../actions/types';

const initialState = {
  message: null,
}

export default function chat(state = initialState, action) {
  switch(action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      }
    default:
      return state;
  }
}
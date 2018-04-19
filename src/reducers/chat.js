import {
  SET_MESSAGE,
  FETCH_MESSAGES,
  INIT_MESSAGES,
} from '../actions/types';

// const initialState = {
//   messages: null,
// }

export default function chat(state = [], action) {
  switch (action.type) {
    case SET_MESSAGE:
      return [
        ...state,
        action.payload,
      ];
    case FETCH_MESSAGES:
      if (state.map(m => m.id).includes(action.id)) {
        return state;
      } else {
        return [
          ...state,
          action.payload,
        ];
      }
    case INIT_MESSAGES:
      return action.payload;
    default:
      return state;
  }
}

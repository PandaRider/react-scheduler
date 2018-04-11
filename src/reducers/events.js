import { UPDATE_EVENTS } from '../actions';

const initialState = {
  events: null,
};

export default function(state = initialState, action) {
  if (action.type === UPDATE_EVENTS) {
    return {
      ...state,
      events: action.events,
    };
  }
  else return state;
}
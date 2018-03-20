import { CHANGE_MAIN_TAB, ADD_SUBJECT } from '../actions/types';

const initialState = {
    tab: 0,
}

export default function menu(state = initialState, action) {
    switch (action.type) {
      case CHANGE_MAIN_TAB:
        return {
        //   ...state,
          tab: action.payload
        };
      case ADD_SUBJECT:
        return {
          subjectName: action.payload 
        }
      default:
        return state;
    }
  }
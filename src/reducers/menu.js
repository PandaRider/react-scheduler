import { CHANGE_MAIN_TAB, ADD_SUBJECT } from '../actions/types';
import { TEST_FIREBASE } from '../actions';

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
        };
      case TEST_FIREBASE:
        return {
          newTitle: action.payload,
        };
      default:
        return state;
    }
  }
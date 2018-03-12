import { CHANGE_MAIN_TAB } from '../actions/types';

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
      default:
        return state;
    }
  }
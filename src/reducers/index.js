import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import EventsReducer from './events';

const rootReducer = combineReducers({
  events: EventsReducer,
  router: routerReducer
});

export default rootReducer;
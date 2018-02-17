import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as FormReducer } from 'redux-form';

import EventsReducer from './events';

const rootReducer = combineReducers({
  form: FormReducer,
  events: EventsReducer,
  router: routerReducer
});

export default rootReducer;
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as FormReducer } from 'redux-form';

import EventsReducer from './events';
import AuthReducer from './auth';

const rootReducer = combineReducers({
  auth: AuthReducer,
  form: FormReducer,
  events: EventsReducer,
  router: routerReducer
});

export default rootReducer;
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as FormReducer } from 'redux-form';

import EventsReducer from './events';
import AuthReducer from './auth';
import MenuReducer from './menu';
import CoursesReducer from './courses';

const rootReducer = combineReducers({
  auth: AuthReducer,
  form: FormReducer,
  events: EventsReducer,
  router: routerReducer,
  menu: MenuReducer,
  courses: CoursesReducer,
});

export default rootReducer;
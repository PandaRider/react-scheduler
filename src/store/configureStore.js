/* eslint
  import/no-named-as-default: "off",
  import/no-named-as-default-member: "off",
  import/no-extraneous-dependencies: "off",
*/
import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import rootReducer from '../reducers';
import * as Actions from '../actions';

export const history = createHistory();

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(
      reduxThunk,
      routerMiddleware(history),
    )),
  );

  store.dispatch(Actions.verifyAuth()); // only invoked when our app initially boots.

  return store;
}

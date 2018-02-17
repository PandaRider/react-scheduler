import { createStore, compose, applyMiddleware } from 'redux';
// import reduxThunk from 'redux-thunk';
import rootReducer from '../reducers';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
// import * as Actions from '../actions';

export const history = createHistory();

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(routerMiddleware(history)))
    )
    return store;
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';

// index.js is the entry point of all React apps. It's also known as the root component.
// I don't usually modify this file except for global libraries (i.e. Redux, React-Router).

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();

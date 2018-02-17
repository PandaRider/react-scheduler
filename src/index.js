import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

// index.js is the entry point of all React apps. It's also known as the root component.
// I don't usually modify this file except for global libraries (i.e. Redux, React-Router).

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();




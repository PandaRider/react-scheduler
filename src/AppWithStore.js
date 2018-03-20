import React from 'react';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

export const store = configureStore();

export default class AppWithStore extends React.Component {
    render() {
        return(
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
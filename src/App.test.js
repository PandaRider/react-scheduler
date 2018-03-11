import React from 'react';
import ReactDOM from 'react-dom';
import AppWithStore from './AppWithStore';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppWithStore />, div);
});

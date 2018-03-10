import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <div id="container">
    Welcome! Please log in to use app.
    <Link id="loginLink" to="/main">Login</Link>
  </div>
);

export default Welcome;
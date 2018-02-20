import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <div>
    Welcome! Please log in to use app.
    <Link to="/main"> Login </Link>
  </div>
);

export default Welcome;

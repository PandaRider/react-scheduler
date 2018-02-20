import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div>
            Welcome! Please log in to use app.
            <Link to="/login">
                Login
            </Link>
        </div>
    )
}

export default Welcome;
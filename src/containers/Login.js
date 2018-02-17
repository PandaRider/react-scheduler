// See example: 
// https://redux-form.com/7.2.3/examples/material-ui/

import React from 'react';
import { Field, reduxForm } from 'redux-form';

class Login extends React.Component {
    render() {
        const { handleSubmit, pristine, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <div>
                        <Field 
                            name="username" 
                            component="input"
                            type="email"
                            placeholder="Username"
                        />
                    </div>
                    <label>Password</label>
                    <div>
                        <Field 
                            name="password" 
                            component="input"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                    <button type="submit" disabled={pristine || submitting}>
                        Submit
                    </button>
                    </div>
                </div>
            </form>
        );
    }
}

export default reduxForm({ 
    form: 'login'
})(Login);
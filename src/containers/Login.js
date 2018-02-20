// See example: 
// https://redux-form.com/7.2.3/examples/material-ui/

import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import TextField from '../components/TextField';
import * as Actions from '../actions';

const validate = values => {
    const errors = {};
  
    if (!values.email) {
      errors.email = "Please enter an email.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
  
    if (!values.password) {
      errors.password = "Please enter a password.";
    }
  
    return errors;
  };

class Login extends React.Component {
    myHandleSubmit = (values) => {
        console.log(values);
        this.props.signInUser(values);
    }

    render() {
        const { handleSubmit, pristine, submitting } = this.props
        return (
            <form onSubmit={handleSubmit(this.myHandleSubmit)}>
                {/* <div> */}
                    {/* <label>Username</label> */}
                    <div>
                        <Field 
                            name="email" 
                            component={TextField}
                            placeholder="Username"
                        />
                    </div>
                    {/* <label>Password</label> */}
                    <div>
                        <Field 
                            name="password" 
                            component={TextField}
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                    <button type="submit" disabled={pristine || submitting}>
                        Submit
                    </button>
                    </div>
                {/* </div> */}
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
      authenticationError: state.auth.error
    }
  }

export default connect(mapStateToProps,Actions)(reduxForm({ 
    form: 'login',
    // validate
})(Login));
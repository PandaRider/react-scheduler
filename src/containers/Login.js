// See example:
// https://redux-form.com/7.2.3/examples/material-ui/

import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Actions from '../actions';
import CustomTextField from '../components/TextField';

import '../styles/Login.css';

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Please enter an email.';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Please enter a password.';
  }

  return errors;
};

class Login extends React.Component {
    myHandleSubmit = (values) => {
      console.log(values);
      this.props.signInUser(values);
    }

    render() {
      const { handleSubmit, pristine, submitting } = this.props;
      return (
        <div class="container">
          <form id="form" onSubmit={handleSubmit(this.myHandleSubmit)}>
            <div>
              <Field
                name="email"
                component={CustomTextField}
                placeholder="Username"
              />
            </div>
            <div>
              <Field
                name="password"
                component={CustomTextField}
                type="password"
                placeholder="Password"
              />
            </div>
            <div>
              <button id="submit" type="submit" disabled={pristine || submitting}>
                Submit
              </button>
            </div>
          </form>
          <p id="label">{this.props.authenticationError}</p>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    authenticationError: state.auth.error,
  };
}

export default connect(mapStateToProps, Actions)(reduxForm({
  form: 'login',
  validate,
})(Login));

import React from 'react';
import TextField from 'material-ui/TextField';

// const validate = values => {
//     const errors = {};
  
//     if (!values.email) {
//       errors.email = "Please enter an email.";
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//       errors.email = 'Invalid email address'
//     }
  
//     if (!values.password) {
//       errors.password = "Please enter a password.";
//     }

//     return errors;
//   };

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
)

export default renderTextField;
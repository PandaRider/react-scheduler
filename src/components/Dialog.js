import React, { Component } from 'react';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { addCourse, testAddCourse } from '../utils/Firebase';
import Course from '../utils/objects/Course';

/*
    Warning: redux refactor is not good practice (temporary).
*/

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    menu: {
      width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
  });

class DialogComponent extends Component {
    state = {
        textValue: "empty",
    }
    handleChange = (name) => {
    }
    handleSubmit = () => {
        let randomCourse = new Course(null,3,this.state.textValue,new Date(2018, 0, 29, 8, 30, 0), new Date(2018, 0, 29, 10, 0, 0));
        addCourse(randomCourse);
        // testAddCourse();
    }
    render() {
        const { handleClose, classes, ...other } = this.props;

        return (
            <Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Enter Subject info</DialogTitle>
                <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="name"
                    label="Name"
                    className={classes.textField}
                    value={this.state.textValue}
                    onChange={this.handleChange('name')}
                    margin="normal"
                />
                </form>
                <Button size="small" className={classes.button} onClick={this.handleSubmit}>Submit</Button>
            </Dialog>
        )
    }
}

export default withStyles(styles)(DialogComponent);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { withStyles } from 'material-ui/styles';
import NumberFormat from 'react-number-format';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { addCourse, updateCourse } from '../utils/Firebase';
import constants from '../utils/Constants';
var _ = require('lodash');

/*
  Warning: redux refactor is not good practice (temporary).
*/

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop: 0,
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
  expansionHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    margin: 'auto 0 auto 0',
  },
  expansionSecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expansionContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  slider: {
    marginRight: '30px',
  },
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
      allowNegative={false}
      decimalScale={0}
    />
  );
}

class DialogComponent extends Component {
  initialState = {
    subj_name: '',
    subj_code: '',
    student_count: 0,
    cbl_hours: 0.0,
    lecture_hours: 0.0,
    merged_lectures: true,

    expanded: '',
    newCourse: true,
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.initialState);
  }

  componentWillReceiveProps(nextProps) {
    let nextState = {
      expanded: '',
      newCourse: nextProps.course == null,
    };
    this.setState(Object.assign(nextState, nextProps.course || this.initialState));
  }

  handleChange = (name) => {
    return (event) => this.setState({
      [name]: event.target.value,
    });
  }
  handleExpand = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : '',
    });
  };
  handleSubmit = () => {
    let { uid } = this.props;
    let course = _.pick(this.state, constants.courses.fields);
    course.student_count = parseInt(course.student_count);

    if (this.state.newCourse) {
      console.log('add course', course);
      addCourse(uid, course);
    }
    else {
      let { key } = this.props.course;
      if (key == null) {
        console.error('Cannot update: key not found');
        return;
      }
      updateCourse(uid, key, course);
    }

    this.props.onClose();
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
            value={this.state.subj_name}
            onChange={this.handleChange('subj_name')}
            margin="normal"
          />
          <TextField
            id="code"
            label="Subject Code"
            className={classes.textField}
            value={this.state.subj_code}
            onChange={this.handleChange('subj_code')}
            margin="normal"
          />
          <TextField
            id="studentCount"
            label="Number of students"
            className={classes.textField}
            type="number"
            value={this.state.student_count}
            onChange={this.handleChange('student_count')}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
          <ExpansionPanel expanded={this.state.expanded === 'CBL'} onChange={this.handleExpand('CBL')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.expansionHeading}>CBL</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.container}>
              <div className={classes.expansionContainer}>
                <Typography className={classes.expansionHeading}>Hours</Typography>
                <Slider
                  className={classes.slider}
                  min={0}
                  max={constants.courses.maxHours}
                  step={0.5}
                  defaultValue={0}
                  value={this.state.cbl_hours}
                  onChange={value => this.setState({cbl_hours: value})}
                />
                <Typography className={classes.expansionSecondaryHeading}>{this.state.cbl_hours.toFixed(1)}</Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={this.state.expanded === 'Lecture'} onChange={this.handleExpand('Lecture')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.expansionHeading}>Lecture</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.container}>
              <div className={classes.expansionContainer}>
                <Typography className={classes.expansionHeading}>Hours</Typography>
                <Slider
                  className={classes.slider}
                  min={0}
                  max={constants.courses.maxHours}
                  step={0.5}
                  defaultValue={0}
                  value={this.state.lecture_hours}
                  onChange={value => this.setState({lecture_hours: value})}
                />
                <Typography>{this.state.lecture_hours.toFixed(1)}</Typography>
              </div>
              <div className={classes.expansionContainer}>
                <Typography className={classes.expansionHeading}>Merge</Typography>
                <Switch
                  checked={this.state.merged_lectures}
                  onChange={event => this.setState({merged_lectures: event.target.checked})}
                  color="primary"
                />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          
        </form>
        <Button size="small" className={classes.button} onClick={this.handleSubmit}>Submit</Button>
      </Dialog>
    )
  }
}

function mapStateToProps(state) {
  return {
    uid: state.auth.uid,
  };
}

export default connect(mapStateToProps, Actions)(withStyles(styles)(DialogComponent));
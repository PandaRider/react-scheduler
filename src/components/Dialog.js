import React, { Component } from 'react';
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
import { addCourse, testAddCourse } from '../utils/Firebase';
import Course from '../utils/objects/Course';
import constants from '../utils/Constants.js';

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
  state = {
    name: '',
    code: '',
    studentCount: 0,
    expanded: '',
    cblHours: 0.0,
    lectureHours: 0.0,
    mergeLectures: true,
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
    console.log(this.state);
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
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <TextField
            id="code"
            label="Subject Code"
            className={classes.textField}
            value={this.state.code}
            onChange={this.handleChange('code')}
            margin="normal"
          />
          <TextField
            id="studentCount"
            label="Number of students"
            className={classes.textField}
            type="number"
            value={this.state.studentCount}
            onChange={this.handleChange('studentCount')}
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
                  value={this.state.cblHours}
                  onChange={value => this.setState({cblHours: value})}
                />
                <Typography className={classes.expansionSecondaryHeading}>{this.state.cblHours.toFixed(1)}</Typography>
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
                  value={this.state.lectureHours}
                  onChange={value => this.setState({lectureHours: value})}
                />
                <Typography>{this.state.lectureHours.toFixed(1)}</Typography>
              </div>
              <div className={classes.expansionContainer}>
                <Typography className={classes.expansionHeading}>Merge</Typography>
                <Switch
                  checked={this.state.mergeLectures}
                  onChange={event => this.setState({mergeLectures: event.target.checked})}
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

export default withStyles(styles)(DialogComponent);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Dialog from './CourseDialog';
import CourseTableRow from './CourseTableRow';
import { generateEvents } from '../utils/wenbin';
import { algo } from '../utils/algo';
import { getEvents, setEvents } from '../utils/Firebase';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  button: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  generateButton: {
    marginTop: 20,
  },
  status: {
    margin: 8,
  },
});

class Subjects extends Component {
  state = {
    open: false,
    selectedCourse: null,
    generating: false,
    status: '',
  }

  handleClose = () => {
    this.setState({ open: false });
    this.props.fetchCourses(this.props.isAdmin, null);
  }

  handleGenerate = () => {
    this.setState({ generating: true, status: '' });
    /*
    let events = generateEvents(this.props.courses);
    setEvents(events);
    this.props.fetchEvents();
    */
    let events = algo(this.props.courses);
    setEvents(events);
    this.props.fetchEvents();
    this.setState({ generating: false, status: 'Done!' });
  }

  render() {
    const { classes } = this.props;
    return(
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} course={this.state.selectedCourse} />
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Subject name</TableCell>
                <TableCell numeric>Subject code</TableCell>
                <TableCell numeric>Class size (no. of students)</TableCell>
                <TableCell numeric>Cohort-based learning (hrs)</TableCell>
                <TableCell numeric>Lecture (hrs)</TableCell>
                <TableCell>Merged lectures</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {this._renderCourses()}
            </TableBody>
          </Table>
        </Paper>
        <div className={classes.buttonContainer}>
          {/* <Button variant="fab" color="secondary" aria-label="edit" className={classes.button}>
            <Icon>edit_icon</Icon>
          </Button> */}
          {this.props.isAdmin === 'admin' ?
            <Button onClick={this.handleGenerate} color="primary" className={classes.generateButton}>
              {this.state.generating ? "Generating..." : "Generate courses"}
            </Button>
          : null}
          <Typography className={classes.status}>{this.state.status}</Typography>
          <Button onClick={() => this.setState({ open: true, selectedCourse: null })} variant="fab" color="primary" aria-label="add" className={classes.button}>
            <AddIcon />
          </Button>
        </div>
      </div>
    );
  }
  // TODO: Minor issue with getting correct uid
  _renderCourses() {
    let { courses, uid } = this.props;
    if (courses == null) return <TableRow />;

    if (this.props.isAdmin === 'admin') return this._renderAdminCourses(courses);
    else return this._renderUserCourses(courses, uid);
  }

  _renderAdminCourses(courses) {
    let items = [];
    for (let uid in courses) {
      items.push(
        <TableRow>
          <TableCell
            style={{fontWeight: 'bold'}}
            colSpan={7} 
          >
            {uid}
          </TableCell>
        </TableRow>
      );
      items.push(...this._renderUserCourses(courses, uid));
    }
    return items;
  }

  _renderUserCourses(courses, uid) {
    let items = [];
    for (var key in courses[uid]) {
      let course = Object.assign({key}, courses[uid][key])
      items.push(<CourseTableRow course={course} onClick={this._selectCourse.bind(this)} />);
    }
    return items;
  }

  _selectCourse(selectedCourse) {
    this.setState({
      selectedCourse,
      open: true,
    });
  }
}

function mapStateToProps(state) {
  return {
    uid: state.auth.uid,
    isAdmin: state.auth.isAdmin,
    courses: state.courses.courses,
  };
}

export default connect(mapStateToProps, Actions)(withStyles(styles)(Subjects));
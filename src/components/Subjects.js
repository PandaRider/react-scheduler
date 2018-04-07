import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
// import IconButton from 'material-ui/IconButton';

import { getCourses } from '../utils/Firebase';
import CourseTableRow from './CourseTableRow';
import Dialog from './Dialog';

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
    position: 'fixed',  }
});

class Subjects extends Component {
  state = {
    open: false,
    selectedCourse: null,
  }

  async updateCourses() {
    let courses = await getCourses(this.props.uid);
    this.setState({ courses });
  }

  handleClose = () => {
    this.setState({ open: false });
    this.updateCourses();
  }

  async componentDidMount() {
    this.updateCourses();
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
              </TableRow>
            </TableHead>
            <TableBody>
              {this._renderCourses()}
            </TableBody>
          </Table>
        </Paper>
        <div>
          {/* <Button variant="fab" color="secondary" aria-label="edit" className={classes.button}>
            <Icon>edit_icon</Icon>
          </Button> */}
          <Button onClick={() => this.setState({ open: true, selectedCourse: null })} variant="fab" color="primary" aria-label="add" className={classes.button}>
            <AddIcon />
          </Button>
        </div>
      </div>
    );
  }

  _renderCourses() {
    if (this.state.courses === undefined) return <TableRow />;

    let items = [];
    for (var i in this.state.courses) {
      let course = this.state.courses[i];
      items.push(<CourseTableRow key={course.key} course={course} onClick={this._selectCourse.bind(this)} />);
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
  };
}

export default connect(mapStateToProps, Actions)(withStyles(styles)(Subjects));

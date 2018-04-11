import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { TableRow, TableCell } from 'material-ui/Table';
import Delete from 'material-ui-icons/Delete';
import { deleteCourse } from '../utils/Firebase';

class CourseTableRow extends Component {
  handleClick() {
    this.props.onClick(this.props.course);
  }

  handleDelete(event) {
    event.stopPropagation();
    let { uid, key } = this.props.course;
    deleteCourse(uid, key);
    this.props.fetchCourses();
    console.log('delete', this.props.course);
  }

  render() {
    let { course } = this.props;

    return (
      <TableRow onClick={this.handleClick.bind(this)}>
        <TableCell>{course.subj_name}</TableCell>
        <TableCell>{course.subj_code}</TableCell>
        <TableCell numeric>{course.student_count}</TableCell>
        <TableCell numeric>{course.cbl_hours}</TableCell>
        <TableCell numeric>{course.lecture_hours}</TableCell>
        <TableCell>{course.merged_lectures ? 'Yes' : 'No'}</TableCell>
        <TableCell onClick={this.handleDelete.bind(this)}><Delete /></TableCell>
      </TableRow>
    );
  }
}

function mapStateToProps(state) {}

export default connect(mapStateToProps, Actions)(CourseTableRow);
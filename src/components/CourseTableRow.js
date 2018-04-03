import React, { Component } from 'react';
import { TableCell, TableRow } from 'material-ui/Table';

export default class CourseTableRow extends Component {
	handleClick() {
    this.props.onClick(this.props.course);
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
      </TableRow>
    );
	}
}
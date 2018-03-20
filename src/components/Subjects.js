import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import AddIcon from 'material-ui-icons/Add';
// import IconButton from 'material-ui/IconButton';

import { addCourse, testAddCourse } from '../utils/Firebase';
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

let id = 0;
function createData(subject, code, hours, size, room) {
  id += 1;
  return { id, subject, code, hours, size, room };
}

const data = [
  createData('Advanced math II', 159, 6.0, 24, 4.0),
  createData('Probability and Statistics', 237, 9.0, 37, 4.3),
  createData('Machine Learning', 262, 16.0, 24, 6.0),
  createData('Cryptography (graduate)', 305, 3.7, 67, 4.3),
];

class Subjects extends Component {
  state = {
    open: false,
  }

  handleAdd = () => {

  }
  handleClose =() => {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    return(
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} />
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell numeric>Subject code</TableCell>
                <TableCell numeric>Lecture/Recitation (hrs/hrs)</TableCell>
                <TableCell numeric>Class size (no. of students)</TableCell>
                <TableCell>Room number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell>{n.subject}</TableCell>
                    <TableCell numeric>{n.code}</TableCell>
                    <TableCell numeric>{n.hours}</TableCell>
                    <TableCell numeric>{n.size}</TableCell>
                    <TableCell numeric>{n.room}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        <div>
          {/* <Button variant="fab" color="secondary" aria-label="edit" className={classes.button}>
            <Icon>edit_icon</Icon>
          </Button> */}
          <Button onClick={() => this.setState({ open: true })} variant="fab" color="primary" aria-label="add" className={classes.button}>
            <AddIcon />
          </Button>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Subjects);

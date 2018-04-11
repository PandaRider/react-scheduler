import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  container: {

  },
  header: {

  },
});

class DialogComponent extends Component {
  render() {
    return (
      <Dialog onClose={this.props.onClose}>
        <DialogTitle>Event</DialogTitle>
        <div className={styles.container}>
          <Typography className={styles.header}>
            Title
          </Typography>
          <Typography>
            Yes
          </Typography>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogComponent);
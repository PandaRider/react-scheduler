// Demo from https://github.com/intljusticemission/react-big-calendar/blob/master/examples/App.js
// and https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/timeslots.js
// and https://github.com/intljusticemission/react-big-calendar/blob/master/examples/styles.less
// Documentation from http://intljusticemission.github.io/react-big-calendar/examples/index.html

import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment'; // moment is a frequently used JavaScript library used to enable Date objects
// import events from '../reducers/events'; // events is the sample data.
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // boilerplate. Required by library

// Lesson: Integrating third party components
// Task: Read and understand the props used. Which ones do you need to keep, which ones to remove?
// Suggested reference: https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/selectable.js

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class CalendarWrapper extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      slotInfo: null,
    };
    // this.handleAddCalendar = this.handleAddCalendar.bind(this);
  }
  handleSlot = (slotInfo) => {
    console.log(this.state.open);
    this.setState({ open: true, slotInfo });
  }
  // handleAddCalendar = () => {
  //   console.log('logging in...');
  // }
  render() {
    return (
      <div>
        <Dialog open={this.state.open} onClose={() => this.setState({ open: false })}>
          <DialogTitle>Testing</DialogTitle>
          {this.state.slotInfo}
        </Dialog>
        <BigCalendar
          {...this.props}
          events={this.props.events}
          step={30}
          timeslots={1}
          min={new Date(2018, 0, 30, 8, 0, 0)}
          max={new Date(2018, 0, 30, 18, 0, 0)}
          defaultView="week"
          views={['week', 'day']}
          defaultDate={new Date(2018, 0, 30)}
          // onSelectEvent={slotInfo => this.handleSlot(slotInfo)}
          onSelectEvent={() => alert("Any")}
        />
        <Button onClick={this.props.handleAuthClick} variant="fab" color="primary" aria-label="add" >
          <AddIcon />
        </Button>
      </div>
    );
  }
}
export default CalendarWrapper;
// const Timeslots = props => (
//   <BigCalendar
//     {...props}
//     events={props.events}
//     step={30}
//     timeslots={1}
//     min={new Date(2018, 0, 30, 8, 0, 0)}
//     max={new Date(2018, 0, 30, 18, 0, 0)}
//     defaultView="week"
//     views={['week', 'day']}
//     defaultDate={new Date(2018, 0, 30)}
//     onSelectEvent={slotInfo => ()}
//   />
// );

// export default Timeslots;

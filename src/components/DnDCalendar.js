import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class DnDCalendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: this.props.events,
    }
    this.moveEvent = this.moveEvent.bind(this)
  }
  moveEvent({ event, start, end }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    const updatedEvent = { ...event, start, end }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    alert(`${event.title} was dropped onto ${event.start}`)
  }
  render() {
    return(
      <DragAndDropCalendar
        selectable
        events={this.state.events}
        onEventDrop={this.moveEvent}
        resizable
        step={30}
        timeslots={1}
        min={new Date(2018, 0, 30, 8, 0, 0)}
        max={new Date(2018, 0, 30, 18, 0, 0)}
        defaultView="week"
        views={['week', 'day']}
        onEventResize={this.resizeEvent}
        defaultDate={new Date(2018, 0, 30)}
        />   
    )
  }
}

export default DragDropContext(HTML5Backend)(DnDCalendar);
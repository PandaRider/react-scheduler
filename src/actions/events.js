import { getEvents } from '../utils/Firebase';

export const UPDATE_EVENTS = 'UPDATE_EVENTS';

export function updateEvents(events) {
  return {
    type: UPDATE_EVENTS,
    events,
  };
}

export function fetchEvents() {
  return (dispatch) => {
    getEvents().then(events => {
      dispatch(updateEvents(events));
    });
  }
}
/* eslint
  import/no-named-as-default: "off",
  import/no-named-as-default-member: "off",
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import Calendar from '../components/Calendar';
import MenuAppBar from '../components/MenuAppBar';
import Subjects from '../components/Subjects';
import ChatWidget from '../containers/ChatWidget';
import DnDCalendar from '../components/DnDCalendar';
import '../styles/styles.css';
import '../styles/MainControl.css';

require('../utils/TestAlgo');

// const TIMETABLE = 0;
// const CLASSES = 1;
// const CHAT = 2;

// This is the MainControl "Main" page after the user logs in.
class MainControl extends Component {
  state = {
    uids: {},
    types: {},
    locations: {},
  };

  componentDidMount() {
    let { 
      isAdmin, 
      // uid
    } = this.props;
    this.props.fetchCourses(isAdmin, null); // TODO - change to this.props.isAdmin - currently is 'undefined'
    this.props.fetchEvents();
  }

  _getEvents() {
    let events = this.props.events;
    if (events == null) return [];

    if (this.props.isAdmin === 'admin') return this._filterEvents(events);
    else return events.filter(event => event.uid === this.props.uid);
  }

  _filterEvents(events) {
    let filtered = events.slice();
    let { uids, types, locations } = this.state;

    for (let uid in uids) {
      filtered = filtered.filter(event => event.uid !== uid || uids[uid]);
    }
    for (let _type in types) {
      filtered = filtered.filter(event => event.type !== _type || types[_type]);
    }
    for (let location in locations) {
      filtered = filtered.filter(event => event.location !== location || locations[location]);
    }

    return filtered;
  }

  render() {
    return (
      <div class="container" id="mainContainer">
        <MenuAppBar 
          signOutAction={this.props.signOutUser} 
          handleChangeTabs={this.props.changeTab}
          value={this.props.tab} 
        />
        {
          this.props.tab === 0 ? 
            <div class="example">
              <Calendar events={this._getEvents()} />
              <div>{this._renderFilters()}</div>
            </div>  :
          this.props.tab === 1 ?
            <Subjects uid={this.props.uid} />  :
            <div class="example">
              <DnDCalendar events={this._getEvents()}/>
              <ChatWidget isAdmin={this.props.isAdmin}/>
            </div>
        }
      </div>
    );
  }

  _renderFilters() {
    if (this.props.isAdmin !== 'admin') return <div />;
    let events = this.props.events;
    if (events === null) return <div />;

    // filter: uid, type, location
    let uids = new Set(events.map(event => event.uid));
    let types = new Set(events.map(event => event.type));
    let locations = new Set(events.map(event => event.location));

    let renderCheckboxes = (set, _type) => {
      let items = [];
      set.forEach(item => {
        if (this.state[_type][item] === undefined) {
          this.setState({
            [_type]: Object.assign(this.state[_type], {[item]: true})
          });
        }

        let onChange = (event, checked) => {
          this.setState({
            [_type]: Object.assign(this.state[_type], {[item]: checked})
          });
        };

        items.push(<CustomCheckbox checked={this.state[_type][item]} onChange={onChange} label={item} />);
      });
      return items;
    }

    return (
      <div>
        {renderCheckboxes(uids, 'uids')}
        <Divider />
        {renderCheckboxes(types, 'types')}
        <Divider />
        {renderCheckboxes(locations, 'locations')}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab: state.menu.tab,
    uid: state.auth.uid,
    isAdmin: state.auth.isAdmin,
    courses: state.courses.courses,
    events: state.events.events,
  };
}

export default connect(mapStateToProps, Actions)(MainControl);

class CustomCheckbox extends Component {
  render() {
    return (
      <div style={{display: 'flex'}}>
        <Checkbox
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <p>{this.props.label}</p>
      </div>
    );
  }
}
import React from 'react';
import { connect } from 'react-redux';

import Timeslots from './TestCalendar';
import MenuAppBar from './MenuAppBar';
import '../styles/styles.css';

// This is the Home page after the user logs in. 
class Home extends React.Component {
    render() {
        return (
            <div>
                <MenuAppBar />
                <div className="example">
                    <Timeslots events={this.props.events}/>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
      events: state.events
    };
}
  
export default connect(mapStateToProps)(Home);

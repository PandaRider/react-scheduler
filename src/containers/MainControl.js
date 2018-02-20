import React from 'react';
import { connect } from 'react-redux';

import Calendar from '../components/Calendar';
import MenuAppBar from '../components/MenuAppBar';
import '../styles/styles.css';

// This is the MainControl "Home" page after the user logs in. 
class MainControl extends React.Component {
    render() {
        return (
            <div>
                <MenuAppBar />
                <div className="example">
                    <Calendar events={this.props.events}/>
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
  
export default connect(mapStateToProps)(MainControl);

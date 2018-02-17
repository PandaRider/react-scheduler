import React from 'react';
import Timeslots from './TestCalendar';
import MenuAppBar from './MenuAppBar';
import '../styles/styles.css';

// This is the Home page after the user logs in. 

// TODO: might need to change to Class based component
const Home = (props) => (
    <div>
        <MenuAppBar />
        <div className="example">
            <Timeslots events={props.events}/>
        </div>
    </div>
)


function mapStateToProps(state) {
    return {
      events: state.events
    };
}
  
// export default connect(mapStateToProps)(Home);
  

export default Home;
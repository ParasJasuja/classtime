import '../styles/App.css';



import HomeIcon from '@material-ui/icons/Home';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


import Home from "../pages/Home";
import Timetable from "../pages/Timetable";
import More from "../pages/More";
import Admin from "../pages/Admin";
import { useState } from 'react';
import AddLec from './AddLec';
import Feedback from "../pages/Feedback";



function App() {

  const [timeTable, setTimeTable] = useState({
    class: "0",
    semester: "0",
    group: "0"
  });
  const getTimetable = (data)=>{
    setTimeTable(data);
  }

  return (
    <div className="App">
      <Router>
        <div className="navigator">
          <div className="nav-links" >
            <Link to="/" title="Home"><HomeIcon id="home" className="icon" style={{fontSize: 25}} data-page="0" /></Link>
            <Link to="/Timetable" title="Timetable"><CalendarTodayIcon id="timetable" className="icon"  style={{fontSize: 18}} data-page="1"/></Link>
            <Link to="/More" title="More"><MoreVertIcon id="more" className="icon" style={{fontSize: 25}} data-page="2" /></Link>
          </div>
        </div>
        <div className="main-content">
          
            <Switch>
              <Route exact path="/" >
                <Home timeTable={timeTable} getTimetable = {getTimetable} />
              </Route>
              <Route exact path="/Timetable" >
                <Timetable timeTable = {timeTable} />
              </Route>
              <Route exact path="/More" >
                <More />
              </Route>
              <Route exact path="/admin/edit">
                <Admin />
              </Route>
              <Route exact path="/admin/edit/add">
                <AddLec />
              </Route>
              <Route exact path="/More/feedback">
                <Feedback />
              </Route>
            </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;

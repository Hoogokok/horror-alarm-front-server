import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React from 'react';
import {AlarmPermissionSwitch} from "./messaging";
import {UpcomingMovie} from "./upcomingMovie";
import {StreamingExpired} from "./streamingExpired";

function App() {

  return (
      <Router>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs>
            <Tab label="개봉예정" component={Link} to="/upcoming"/>
            <Tab label="알람 설정" component={Link} to="/alarm"/>
            <Tab label="스트리밍 종료예정일" component={Link} to="/streamingExpired"/>
          </Tabs>
        </Box>
        <Routes>
          <Route path="/upcoming" element={<UpcomingMovie/>}/>
          <Route path="/alarm" element={<AlarmPermissionSwitch/>}/>
          <Route path="/streamingExpired" element={<StreamingExpired/>}/>
        </Routes>
      </Router>
  );
}

export default App;

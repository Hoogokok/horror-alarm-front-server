import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {AlarmPermissionSwitch} from "./messaging";
import {UpcomingMovie} from "./upcomingMovie";
import {StreamingExpired} from "./streamingExpired";
import Detail from "./movieDetail";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background:#FFFFFF;
  }
`;
function App() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Router>
        <GlobalStyle/>
        <Container>
          <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              centered
          >
            <Tab label="개봉 예정 영화" value="one" component={Link} to="/upcoming"/>
            <Tab label="알람 설정" value="two" component={Link} to="/alarm"/>
            <Tab label="스트리밍 종료 예정일" value="three" component={Link} to="/streamingexpired"/>
          </Tabs>
        </Container>
        <Routes>
          <Route path="/" element={<UpcomingMovie/>}/>
          <Route path="/movie/:id" element={<Detail/>}/>
          <Route path="/upcoming" element={<UpcomingMovie/>}/>
          <Route path="/alarm" element={<AlarmPermissionSwitch/>}/>
          <Route path="/streamingexpired" element={<StreamingExpired/>}/>
        </Routes>
      </Router>
  );
}

export default App;

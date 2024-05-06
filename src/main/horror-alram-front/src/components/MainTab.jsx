import {
  Route,
  Link,
  useLocation,
  Routes,
} from 'react-router-dom'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {PermissionSwitch} from  "./PermissionSwitch"
import {UpcomingMovieList} from "./UpcomingMovieList"
import {StreamingTimeline} from "./StreamingTimeline"
import Detail from "./MovieDetail"
import {useEffect, useState} from "react";

function getTabValue(path) {
  if (path === 'upcoming') {
    return 'upcoming';
  } else if (path === 'alarm') {
    return 'alarm';
  } else if (path === 'streamingexpired') {
    return 'streamingexpired';
  } else {
    return 'upcoming';
  }
}

function getTabPath(value) {
  if (value === 'upcoming') {
    return 'upcoming';
  } else if (value === 'alarm') {
    return 'alarm';
  } else if (value === 'streamingexpired') {
    return 'streamingexpired';
  } else {
    return 'upcoming';
  }
}

export default function MainTabs() {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'upcoming';
  const [value, setValue] = useState(getTabValue(path));

  useEffect(() => {
    window.history.replaceState(null, '', `/${getTabPath(value)}`);
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Container>
        <Tabs
            value={value} onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            centered
        >
          <Tab label="개봉 예정" value="upcoming" component={Link} to="/upcoming"/>
          <Tab label="알람 설정" value="alarm" component={Link} to="/alarm"/>
          <Tab label="스트리밍 종료 예정" value="streamingexpired" component={Link} to="/streamingexpired"/>
        </Tabs>
        <Routes>
          <Route path="upcoming" element={<UpcomingMovieList/>}/>
          <Route path="alarm" element={<PermissionSwitch/>}/>
          <Route path="streamingexpired" element={<StreamingTimeline/>}/>
          <Route path="movie/:id" element={<Detail/>}/>
        </Routes>
      </Container>
  );
}
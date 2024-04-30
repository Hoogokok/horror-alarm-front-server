import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import axios from 'axios';
import {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';

function StreamingExpired() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('/streaming/expired')
    .then((response) => {
      console.log(response);
      setMovies(response.data.expiredMovies);
    });
  }, []);

  return (
      <Timeline position="alternate">
        {movies.map((movie) => (
            <TimelineItem key={movie.id}>
              <TimelineSeparator>
                <TimelineDot color="primary"/>
                <TimelineConnector/>
              </TimelineSeparator>
              <TimelineContent>
                <Typography>{movie.title}</Typography>
                <Typography>{movie.expiredDate}</Typography>
              </TimelineContent>
            </TimelineItem>
        ))}
      </Timeline>
  );
}

export {StreamingExpired}
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
import {Link} from 'react-router-dom';

function StreamingExpired() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('/streaming/expired')
    .then((response) => {
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
                <Link to={`/movie/${movie.id}`}
                      style={{textDecoration: 'none', color: 'black'}}
                >
                  <Typography>{movie.title}</Typography>
                </Link>
                <Typography>{movie.expiredDate}</Typography>
              </TimelineContent>
            </TimelineItem>
        ))}
      </Timeline>
  );
}

export {StreamingExpired}
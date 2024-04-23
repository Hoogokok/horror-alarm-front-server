import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


async function getUpcomingMovies() {
  const response = await axios.get('/upcoming');
  return response.data;
}

function UpcomingMovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getUpcomingMovies().then((data) => setMovies(data));
  }, []);

  return (
      <Paper>
        <Grid container spacing={3}>
          {movies.map((movie) => (
              <Grid item key={movie.id}>
                <UpcomingCard movie={movie}/>
              </Grid>
          ))}
        </Grid>
      </Paper>
  );
}

function UpcomingCard({movie}) {
  return (
      <Card sx={{maxWidth: 345}}>
        <CardMedia
            component="img"
            image={"https://image.tmdb.org/t/p/w185" + movie.posterPath}
            alt={movie.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {movie.releaseDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.overview}
          </Typography>
        </CardContent>
      </Card>
  );
}

function UpcomingMovie() {
  return (
      <div>
        <UpcomingMovieList/>
      </div>
  );
}

export {UpcomingMovie}
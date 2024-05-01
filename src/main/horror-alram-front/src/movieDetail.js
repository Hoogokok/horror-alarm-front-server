import axios from 'axios';
import {useEffect, useState,} from "react";
import {useParams} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Detail() {
  const [movie, setMovie] = useState({});
  const {id} = useParams();

  useEffect(() => {
    axios.get(`/streaming/expired/detail/${id}`)
    .then((response) => {
      setMovie(response.data);
    });
  }, [id]);

  return (
      <Paper sx={
        {
          p:2,
          margin: 'auto',
          marginTop: 10,
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor (theme) {
            return theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[800];
          }
        }
      }>
        <Grid container spacing={2}>
          <Grid item>
            <Img src={"https://image.tmdb.org/t/p/w185" + movie.posterPath} alt={movie.title}/>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5">
                  {movie.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{cursor: 'pointer'}}>
                  {movie.overview}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
  );
}


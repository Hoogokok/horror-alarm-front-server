import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
    <div>
      <h1> 개봉 예정 호러 영화</h1>
      {movies.map((movie) => (
        <div key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.releaseDate}</p>
          <img src={"https://image.tmdb.org/t/p/w185" + movie.poster_path}/>
        </div>
      ))}
    </div>
  );
}

function UpcomingMovie() {
  return (
    <div>
      <UpcomingMovieList />
    </div>
  );
}

export{ UpcomingMovie}
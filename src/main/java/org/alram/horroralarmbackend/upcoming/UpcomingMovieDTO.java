package org.alram.horroralarmbackend.upcoming;

public record UpcomingMovieDTO(Long id,String title, String releaseDate, String poster_path, String overview) {
}

package org.alram.horroralarmbackend.upcoming;

public record UpcomingMovieRequest(Long id, String title, String releaseDate, String posterPath, String overview) {
}

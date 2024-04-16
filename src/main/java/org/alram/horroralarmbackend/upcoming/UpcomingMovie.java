package org.alram.horroralarmbackend.upcoming;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NonNull;

@Table(name = "upcoming_movie")
@Entity
@Getter
public class UpcomingMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    private String title;
    @NonNull
    private String releaseDate;
    @NonNull
    private String poster_path;
    private String overview;

    public UpcomingMovie() {
    }

    public UpcomingMovie(String title, String releaseDate, String poster_path, String overview) {
        this.title = title;
        this.releaseDate = releaseDate;
        this.poster_path = poster_path;
        this.overview = overview;
    }
}

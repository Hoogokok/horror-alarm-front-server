package org.alram.horroralarmbackend.streaming;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Getter
@Entity
public class NetflixHorrorKr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private Long theMovieDbId;
    private String overview;
    private String posterPath;

    public NetflixHorrorKr() {
    }

    public NetflixHorrorKr(String title, Long theMovieDbId, String overview, String posterPath) {
        this.title = title;
        this.theMovieDbId = theMovieDbId;
        this.overview = overview;
        this.posterPath = posterPath;
    }
}

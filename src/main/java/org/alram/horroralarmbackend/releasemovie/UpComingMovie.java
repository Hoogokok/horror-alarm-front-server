package org.alram.horroralarmbackend.releasemovie;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Table(name = "upcoming_movie")
@Entity
@Getter
public class UpComingMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String releaseDate;

    public UpComingMovie() {
    }

    public UpComingMovie(String title, String releaseDate) {
        this.title = title;
        this.releaseDate = releaseDate;
    }
}

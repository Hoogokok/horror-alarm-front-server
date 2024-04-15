package org.alram.horroralarmbackend.releasemovie;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Table(name = "movie")
@Entity
@Getter
public class ReleaseMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String releaseDate;

    public ReleaseMovie() {
    }

    public ReleaseMovie(String title, String releaseDate) {
        this.title = title;
        this.releaseDate = releaseDate;
    }
}

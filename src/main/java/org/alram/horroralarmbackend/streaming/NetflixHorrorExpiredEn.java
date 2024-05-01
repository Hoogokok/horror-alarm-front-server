package org.alram.horroralarmbackend.streaming;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import lombok.Getter;

@Getter
@Entity(name = "netflix_horror_expired")
public class NetflixHorrorExpiredEn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate expiredDate;
    private Long theMovieDbId;

    public NetflixHorrorExpiredEn() {
    }

    public NetflixHorrorExpiredEn(LocalDate expiredDate, Long theMovieDbId) {
        this.expiredDate = expiredDate;
        this.theMovieDbId = theMovieDbId;
    }
}

package org.alram.horroralarmbackend.releasemovie;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ReleaseMovieService {
    private final ReleaseMovieRepository releaseMovieRepository;

    public ReleaseMovieService(ReleaseMovieRepository releaseMovieRepository) {
        this.releaseMovieRepository = releaseMovieRepository;
    }

    public List<ReleaseMovie> findBeforeReleaseDate(String releaseDate) {
        return releaseMovieRepository.findByReleaseDateBefore(releaseDate);
    }
}

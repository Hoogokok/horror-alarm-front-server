package org.alram.horroralarmbackend.releasemovie;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UpComingMovieService {
    private final UpComingMovieRepository upComingMovieRepository;

    public UpComingMovieService(UpComingMovieRepository upComingMovieRepository) {
        this.upComingMovieRepository = upComingMovieRepository;
    }

    public List<UpComingMovie> findUpcomingMovieByDate() {
        String today = LocalDate.now().toString();
        return upComingMovieRepository.findByReleaseDateAfter(today);
    }
}

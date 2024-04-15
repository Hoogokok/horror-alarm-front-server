package org.alram.horroralarmbackend.upcoming;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UpcomingMovieService {
    private final UpcomingMovieRepository upComingMovieRepository;

    public UpcomingMovieService(UpcomingMovieRepository upComingMovieRepository) {
        this.upComingMovieRepository = upComingMovieRepository;
    }

    public List<UpcomingMovieDTO> findUpcomingMovieByDate() {
        String today = LocalDate.now().toString();
        List<UpcomingMovie> upcomingMovies = upComingMovieRepository.findByReleaseDateAfter(today);
        return upcomingMovies.stream().map(upcomingMovie ->
            new UpcomingMovieDTO(
                upcomingMovie.getId(),
                upcomingMovie.getTitle(),
                upcomingMovie.getReleaseDate(),
                upcomingMovie.getPoster_path(),
                upcomingMovie.getOverview()))
            .toList();
    }
}

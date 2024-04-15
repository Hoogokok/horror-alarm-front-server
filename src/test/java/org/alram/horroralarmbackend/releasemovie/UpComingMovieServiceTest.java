package org.alram.horroralarmbackend.releasemovie;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.transaction.Transactional;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
class UpComingMovieServiceTest {

    @Autowired
    private UpComingMovieService upComingMovieService;

    @Test
    void findUpcomingMovieByDate() {

        // when
        List<UpComingMovie> beforeReleaseDate = upComingMovieService.findUpcomingMovieByDate();

        // then
        assertThat(beforeReleaseDate).hasSize(2);
    }
}
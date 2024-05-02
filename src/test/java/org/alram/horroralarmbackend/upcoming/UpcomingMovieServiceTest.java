package org.alram.horroralarmbackend.upcoming;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.transaction.Transactional;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
class UpcomingMovieServiceTest {

    @Autowired
    private UpcomingMovieService upComingMovieService;

    @Autowired
    private UpcomingMovieRepository upComingMovieRepository;

    @Test
    void findUpcomingMovieByDate() {
        // given
        UpcomingMovie upcomingMovie1 = new UpcomingMovie("title1", "2024-05-12", "poster1", "overview1");
        UpcomingMovie upcomingMovie2 = new UpcomingMovie("title2", "2024-05-13", "poster2", "overview2");

        upComingMovieRepository.save(upcomingMovie1);
        upComingMovieRepository.save(upcomingMovie2);

        // when
        List<UpcomingMovieRequest> beforeReleaseDate = upComingMovieService.findUpcomingMovieByDate();

        // then
        assertThat(beforeReleaseDate).hasSize(2);
    }

    @DisplayName("다음주 개봉하는 영화 목록을 가져온다.")
    @Test
    void getUpcomingMoviesForTheWeek() {
          // given
          UpcomingMovie upcomingMovie1 = new UpcomingMovie("title1", "2024-05-03", "poster1", "overview1");
          UpcomingMovie upcomingMovie2 = new UpcomingMovie("title2", "2024-05-08", "poster2", "overview2");

          upComingMovieRepository.save(upcomingMovie1);
          upComingMovieRepository.save(upcomingMovie2);

          // when
          List<MessageRequest> upcomingMoviesForTheWeek = upComingMovieService.getUpcomingMoviesForTheWeek();

          // then
          assertThat(upcomingMoviesForTheWeek).hasSize(2);
          assertThat(upcomingMoviesForTheWeek.get(0).title()).isEqualTo("title1");
          assertThat(upcomingMoviesForTheWeek.get(1).title()).isEqualTo("title2");
    }
}
package org.alram.horroralarmbackend.streaming;

import static org.assertj.core.api.Assertions.*;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Transactional
@SpringBootTest
class NetflixExpiredServiceTest {

    @Autowired
    private NetflixExpiredService netflixExpiredService;
    @Autowired
    private NetflixHorrorExpiredEnRepository netflixHorrorExpiredEnRepository;
    @Autowired
    private NetflixHorrorKrRepository netflixHorrorKrRepository;

    @DisplayName("스트리밍 종료 예정인 넷플릭스 영화 목록을 가져온다.")
    @Test
    void getNetflixExpiredResponse() {
        // given
        netflixHorrorExpiredEnRepository.save(
            new NetflixHorrorExpiredEn(LocalDate.of(2021, 10, 1), 1L));
        netflixHorrorExpiredEnRepository.save(
            new NetflixHorrorExpiredEn(LocalDate.of(2021, 10, 2), 2L));
        netflixHorrorKrRepository.save(
            new NetflixHorrorKr("title1", 1L, "overview1", "posterPath1"));
        netflixHorrorKrRepository.save(
            new NetflixHorrorKr("title2", 2L, "overview2", "posterPath2"));

        // when
        var netflixExpiredResponse = netflixExpiredService.getNetflixExpiredResponse();

        // then
        assertThat(netflixExpiredResponse.expiredMovies()).hasSize(2);
    }

    @DisplayName("다음주 스트리밍 종료 예정인 영화를 가져온다.")
    @Test
    void getNetflixExpiredMoviesForTheWeek() {
        // given
        netflixHorrorExpiredEnRepository.save(
            new NetflixHorrorExpiredEn(LocalDate.now().plusWeeks(1), 1L));
        netflixHorrorExpiredEnRepository.save(
            new NetflixHorrorExpiredEn(LocalDate.now().plusWeeks(1), 2L));
        netflixHorrorKrRepository.save(
            new NetflixHorrorKr("title1", 1L, "overview1", "posterPath1"));
        netflixHorrorKrRepository.save(
            new NetflixHorrorKr("title2", 2L, "overview2", "posterPath2"));

        // when
        var netflixExpiredMoviesForTheWeek = netflixExpiredService.getNetflixExpiredMoviesForTheWeek();

        // then
        assertThat(netflixExpiredMoviesForTheWeek).hasSize(2);
        assertThat(netflixExpiredMoviesForTheWeek.get(0).title()).isEqualTo("title1");
        assertThat(netflixExpiredMoviesForTheWeek.get(1).title()).isEqualTo("title2");
    }
}
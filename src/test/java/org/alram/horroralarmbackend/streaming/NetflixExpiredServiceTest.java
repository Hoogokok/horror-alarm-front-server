package org.alram.horroralarmbackend.streaming;

import static org.junit.jupiter.api.Assertions.*;

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
        assertEquals(2, netflixExpiredResponse.size());
        assertEquals("title1", netflixExpiredResponse.get(0).getTitle());
        assertEquals("overview1", netflixExpiredResponse.get(0).getOverview());
        assertEquals("posterPath1", netflixExpiredResponse.get(0).getPosterPath());
        assertEquals("2021-10-01", netflixExpiredResponse.get(0).getExpiredDate());
        assertEquals("title2", netflixExpiredResponse.get(1).getTitle());
        assertEquals("overview2", netflixExpiredResponse.get(1).getOverview());
        assertEquals("posterPath2", netflixExpiredResponse.get(1).getPosterPath());
        assertEquals("2021-10-02", netflixExpiredResponse.get(1).getExpiredDate());
    }
}
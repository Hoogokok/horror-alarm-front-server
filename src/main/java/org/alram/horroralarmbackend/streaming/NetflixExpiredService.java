package org.alram.horroralarmbackend.streaming;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
public class NetflixExpiredService {

    private final NetflixHorrorExpiredEnRepository netflixHorrorExpiredEnRepository;
    private final NetflixHorrorKrRepository netflixHorrorKrRepository;

    public NetflixExpiredService(NetflixHorrorExpiredEnRepository netflixHorrorExpiredEnRepository,
        NetflixHorrorKrRepository netflixHorrorKrRepository) {
        this.netflixHorrorExpiredEnRepository = netflixHorrorExpiredEnRepository;
        this.netflixHorrorKrRepository = netflixHorrorKrRepository;
    }

    public ExpiredResponse getNetflixExpiredResponse() {
        LocalDate today = LocalDate.now();
        List<NetflixHorrorExpiredEn> expiredDateAsc = netflixHorrorExpiredEnRepository.findFromToday(today);
        List<Long> expiredTheMovieIds = expiredDateAsc.stream()
            .map(NetflixHorrorExpiredEn::getTheMovieDbId)
            .toList();
        List<NetflixHorrorKr> netflixHorrorKrs = netflixHorrorKrRepository.findAllByTheMovieDbIdIn(
            expiredTheMovieIds);

        return new ExpiredResponse(getNetflixExpiredResponses(expiredDateAsc, netflixHorrorKrs));
    }

    private List<ExpiredMovie> getNetflixExpiredResponses(
        List<NetflixHorrorExpiredEn> expiredDateAsc, List<NetflixHorrorKr> netflixHorrorKrs) {
        return expiredDateAsc.stream()
            .map(expired -> {
                NetflixHorrorKr netflixHorrorKr = netflixHorrorKrs.stream()
                    .filter(kr -> kr.getTheMovieDbId().equals(expired.getTheMovieDbId()))
                    .findFirst()
                    .orElseThrow();
                return new ExpiredMovie(
                    netflixHorrorKr.getId(),
                    netflixHorrorKr.getTitle(),
                    netflixHorrorKr.getPosterPath(),
                    expired.getExpiredDate().toString()
                );
            })
            .toList();
    }

    public ExpiredDetailResponse getNetflixExpiredDetailResponse(Long id) {
        Optional<NetflixHorrorKr> byId = netflixHorrorKrRepository.findById(id);
        if (byId.isEmpty()) {
            throw new IllegalArgumentException("해당 영화가 없습니다.");
        }
        NetflixHorrorKr netflixHorrorKr = byId.get();
        return new ExpiredDetailResponse(
            netflixHorrorKr.getTitle(),
            netflixHorrorKr.getPosterPath(),
            netflixHorrorKr.getOverview()
        );
    }
}

package org.alram.horroralarmbackend.streaming;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NetflixExpiredService {

    private final NetflixHorrorExpiredEnRepository netflixHorrorExpiredEnRepository;
    private final NetflixHorrorKrRepository netflixHorrorKrRepository;

    public NetflixExpiredService(NetflixHorrorExpiredEnRepository netflixHorrorExpiredEnRepository,
        NetflixHorrorKrRepository netflixHorrorKrRepository) {
        this.netflixHorrorExpiredEnRepository = netflixHorrorExpiredEnRepository;
        this.netflixHorrorKrRepository = netflixHorrorKrRepository;
    }

    public List<NetflixExpiredResponse> getNetflixExpiredResponse() {
        List<NetflixHorrorExpiredEn> expiredDateAsc = netflixHorrorExpiredEnRepository.findAllByOrderByExpiredDateAsc();
        List<Long> expiredTheMovieIds = expiredDateAsc.stream()
            .map(NetflixHorrorExpiredEn::getTheMovieDbId)
            .toList();
        List<NetflixHorrorKr> netflixHorrorKrs = netflixHorrorKrRepository.findAllByTheMovieDbIdIn(
            expiredTheMovieIds);

        return getNetflixExpiredResponses(expiredDateAsc, netflixHorrorKrs);
    }

    private List<NetflixExpiredResponse> getNetflixExpiredResponses(List<NetflixHorrorExpiredEn> expiredDateAsc, List<NetflixHorrorKr> netflixHorrorKrs) {
        return expiredDateAsc.stream()
            .map(expired -> {
                NetflixHorrorKr netflixHorrorKr = netflixHorrorKrs.stream()
                    .filter(kr -> kr.getTheMovieDbId().equals(expired.getTheMovieDbId()))
                    .findFirst()
                    .orElseThrow();
                return new NetflixExpiredResponse(
                    netflixHorrorKr.getTitle(),
                    netflixHorrorKr.getOverview(),
                    netflixHorrorKr.getPosterPath(),
                    expired.getExpiredDate().toString()
                );
            })
            .toList();
    }
}

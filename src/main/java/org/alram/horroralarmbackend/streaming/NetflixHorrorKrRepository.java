package org.alram.horroralarmbackend.streaming;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetflixHorrorKrRepository extends JpaRepository<NetflixHorrorKr, Long> {

    List<NetflixHorrorKr> findAllByTheMovieDbIdIn(List<Long> expiredTheMovieIds);
}

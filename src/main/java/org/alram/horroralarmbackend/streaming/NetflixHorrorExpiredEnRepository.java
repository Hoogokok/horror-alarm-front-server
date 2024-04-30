package org.alram.horroralarmbackend.streaming;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetflixHorrorExpiredEnRepository extends JpaRepository<NetflixHorrorExpiredEn, Long>{

    List<NetflixHorrorExpiredEn> findAllByOrderByExpiredDateAsc();
}

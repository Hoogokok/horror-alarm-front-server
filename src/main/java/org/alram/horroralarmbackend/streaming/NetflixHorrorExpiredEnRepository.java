package org.alram.horroralarmbackend.streaming;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface NetflixHorrorExpiredEnRepository extends
    JpaRepository<NetflixHorrorExpiredEn, Long> {

    @Query("SELECT n FROM netflix_horror_expired n WHERE n.expiredDate >= :today ORDER BY n.expiredDate ASC")
    List<NetflixHorrorExpiredEn> findFromToday(@Param("today") LocalDate today);

    List<NetflixHorrorExpiredEn> findByExpiredDateBetween(LocalDate today, LocalDate nextWeek);
}

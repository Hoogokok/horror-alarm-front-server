package org.alram.horroralarmbackend.releasemovie;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReleaseMovieRepository extends JpaRepository<ReleaseMovie, Long> {

    @Query("SELECT m FROM ReleaseMovie m WHERE DATE(m.releaseDate) < :releaseDate")
    List<ReleaseMovie> findByReleaseDateBefore(@Param("releaseDate") String releaseDate);
}

package org.alram.horroralarmbackend.releasemovie;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UpComingMovieRepository extends JpaRepository<UpComingMovie, Long> {

    @Query("SELECT u FROM UpComingMovie u WHERE u.releaseDate > :today")
    List<UpComingMovie> findByReleaseDateAfter(@Param("today") String today);
}

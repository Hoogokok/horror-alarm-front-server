package org.alram.horroralarmbackend.upcoming;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UpcomingMovieRepository extends JpaRepository<UpcomingMovie, Long> {

    @Query("SELECT u FROM UpcomingMovie u WHERE u.releaseDate > :today")
    List<UpcomingMovie> findByReleaseDateAfter(@Param("today") String today);

    List<UpcomingMovie> findByReleaseDateBetween(String today, String nextWeek);
}

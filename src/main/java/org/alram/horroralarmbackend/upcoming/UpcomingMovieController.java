package org.alram.horroralarmbackend.upcoming;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UpcomingMovieController {

    private final UpcomingMovieService upComingMovieService;

    public UpcomingMovieController(UpcomingMovieService upComingMovieService) {
        this.upComingMovieService = upComingMovieService;
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<UpcomingMovieRequest>> upcoming() {
        return ResponseEntity.ok(upComingMovieService.findUpcomingMovieByDate());
    }
}

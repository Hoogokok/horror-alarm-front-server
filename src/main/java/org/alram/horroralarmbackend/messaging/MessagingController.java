package org.alram.horroralarmbackend.messaging;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.upcoming.UpcomingMovieRequest;
import org.alram.horroralarmbackend.upcoming.UpcomingMovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class MessagingController {

    private final HorrorReleaseMessageBuilder horrorReleaseMessageBuilder;
    private final UpcomingMovieService upComingMovieService;

    public MessagingController(HorrorReleaseMessageBuilder horrorReleaseMessageBuilder,
        UpcomingMovieService upComingMovieService) {
        this.horrorReleaseMessageBuilder = horrorReleaseMessageBuilder;
        this.upComingMovieService = upComingMovieService;
    }

    @GetMapping("/alarm/horror/send-release-message")
    public ResponseEntity<String> sendHorrorReleaseMessage() {
        log.info("공포영화 개봉 알림 메시지 전송을 시작합니다.");
        List<UpcomingMovieRequest> upcomingMovies = upComingMovieService.findUpcomingMovieByDate();
        MessageDTO messageDTO = horrorReleaseMessageBuilder.buildMessage("horror-release", upcomingMovies);
        FirebaseMessagingService.send(messageDTO);
        return ResponseEntity.ok("메시지 전송이 완료되었습니다.");
    }
}

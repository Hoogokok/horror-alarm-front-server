package org.alram.horroralarmbackend.messaging;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.alarm.TopicContent;
import org.alram.horroralarmbackend.upcoming.UpcomingMessageRequest;
import org.alram.horroralarmbackend.upcoming.UpcomingMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MessageScheduledTasks {

    @Autowired
    private final HorrorReleaseMessageBuilder horrorReleaseMessageBuilder;
    @Autowired
    private final UpcomingMovieService upcomingMovieService;

    public MessageScheduledTasks(HorrorReleaseMessageBuilder horrorReleaseMessageBuilder,
        UpcomingMovieService upcomingMovieService) {
        this.horrorReleaseMessageBuilder = horrorReleaseMessageBuilder;
        this.upcomingMovieService = upcomingMovieService;
    }

    @Scheduled(cron = "0 0 10 ? * SUN", zone = "Asia/Seoul")
    public void sendHorrorReleaseMessage() {
        log.info("공포영화 개봉 예정 메시지 전송을 시작합니다.");
        List<UpcomingMessageRequest> upcomingMovies = upcomingMovieService.getUpcomingMoviesForTheWeek();
        if (!upcomingMovies.isEmpty()) {
            MessageDTO messageDTO = horrorReleaseMessageBuilder.buildMessage(TopicContent.UPCOMING_MOVIE.name(), upcomingMovies);
            sendFireBase(messageDTO);
        }
    }

    private void sendFireBase(MessageDTO messageDTO) {
        try {
            Message message = Message.builder()
                .putData("title", messageDTO.getTitle())
                .putData("body", messageDTO.getBody())
                .setTopic(messageDTO.getTopic())
                .build();
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 전송에 실패했습니다.", e);
        }
    }
}

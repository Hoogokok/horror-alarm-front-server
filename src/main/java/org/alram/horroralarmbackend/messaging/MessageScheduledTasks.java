package org.alram.horroralarmbackend.messaging;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.alarm.TopicContent;
import org.alram.horroralarmbackend.streaming.NetflixExpiredService;
import org.alram.horroralarmbackend.upcoming.MessageRequest;
import org.alram.horroralarmbackend.upcoming.UpcomingMovieService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MessageScheduledTasks {

    private final MessageBuilder messageBuilder;
    private final UpcomingMovieService upcomingMovieService;
    private final NetflixExpiredService netflixExpiredService;

    public MessageScheduledTasks(MessageBuilder messageBuilder,
        UpcomingMovieService upcomingMovieService, NetflixExpiredService netflixExpiredService) {
        this.messageBuilder = messageBuilder;
        this.upcomingMovieService = upcomingMovieService;
        this.netflixExpiredService = netflixExpiredService;
    }

    @Scheduled(cron = "0 0 10 ? * SUN", zone = "Asia/Seoul")
    public void sendHorrorReleaseMessage() {
        log.info("공포영화 개봉 예정 메시지 전송을 시작합니다.");
        List<MessageRequest> upcomingMovies = upcomingMovieService.getUpcomingMoviesForTheWeek();
        if (!upcomingMovies.isEmpty()) {
            MessageDTO messageDTO = messageBuilder.buildMessage(
                TopicContent.UPCOMING_MOVIE.getContent(), upcomingMovies, "개봉하는 영화 목록");
            sendFireBase(messageDTO);
        }
    }

    @Scheduled(cron = "0 0 10 ? * SUN", zone = "Asia/Seoul")
    public void sendNetflixExpiredMessage() {
        log.info("넷플릭스 만료 예정 메시지 전송을 시작합니다.");
        List<MessageRequest> netflixExpiredMovies = netflixExpiredService.getNetflixExpiredMoviesForTheWeek();
        if (!netflixExpiredMovies.isEmpty()) {
            MessageDTO messageDTO = messageBuilder.buildMessage(
                TopicContent.NETFLIX_EXPIRED.getContent(), netflixExpiredMovies, "만료되는 넷플릭스 영화 목록");
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

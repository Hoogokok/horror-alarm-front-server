package org.alram.horroralarmbackend.messaging;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import org.alram.horroralarmbackend.alarm.TopicContent;
import org.alram.horroralarmbackend.streaming.NetflixExpiredService;
import org.alram.horroralarmbackend.upcoming.MessageRequest;
import org.alram.horroralarmbackend.upcoming.UpcomingMovieService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MessageScheduledTasksTest {

    @Mock
    private MessageBuilder messageBuilder;
    @Mock
    private UpcomingMovieService upcomingMovieService;
    @Mock
    private NetflixExpiredService netflixExpiredService;

    @InjectMocks
    private MessageScheduledTasks messageScheduledTasks;

    @DisplayName("공포영화 개봉 예정 메시지를 전송한다.")
    @Test
    void sendHorrorReleaseMessage() {
        // given
        MessageRequest upcomingMovie1 = new MessageRequest("title1", "2024-05-12");
        MessageRequest upcomingMovie2 = new MessageRequest("title2", "2024-05-13");
        when(upcomingMovieService.getUpcomingMoviesForTheWeek()).thenReturn(
            Arrays.asList(upcomingMovie1, upcomingMovie2));
        when(messageBuilder.buildMessage(TopicContent.UPCOMING_MOVIE.getContent(),
            Arrays.asList(upcomingMovie1, upcomingMovie2), "개봉하는 영화 목록")).thenReturn(
            new MessageDTO("개봉하는 영화 목록", "title1 : 2024-05-12\ntitle2 : 2024-05-13\n",
                TopicContent.UPCOMING_MOVIE.getContent()));

        // when
        messageScheduledTasks.sendHorrorReleaseMessage();

        // then
        verify(messageBuilder, times(1)).buildMessage("upcoming_movie",
            Arrays.asList(upcomingMovie1, upcomingMovie2), "개봉하는 영화 목록");
    }

    @DisplayName("넷플릭스 만료 예정 메시지를 전송한다.")
    @Test
    void sendNetflixExpiredMessage() {
        // given
        MessageRequest netflixExpiredMovie1 = new MessageRequest("title1", "2024-05-07");
        MessageRequest netflixExpiredMovie2 = new MessageRequest("title2", "2024-05-08");
        when(netflixExpiredService.getNetflixExpiredMoviesForTheWeek()).thenReturn(
            Arrays.asList(netflixExpiredMovie1, netflixExpiredMovie2));
        when(messageBuilder.buildMessage(TopicContent.NETFLIX_EXPIRED.getContent(),
            Arrays.asList(netflixExpiredMovie1, netflixExpiredMovie2),
            "만료되는 넷플릭스 영화 목록")).thenReturn(
            new MessageDTO("만료되는 넷플릭스 영화 목록", "title1 : 2024-05-12\ntitle2 : 2024-05-13\n",
                TopicContent.NETFLIX_EXPIRED.getContent()));

        // when
        messageScheduledTasks.sendNetflixExpiredMessage();

        // then
        verify(messageBuilder, times(1)).buildMessage("netflix_expired",
            Arrays.asList(netflixExpiredMovie1, netflixExpiredMovie2), "만료되는 넷플릭스 영화 목록");
    }
}
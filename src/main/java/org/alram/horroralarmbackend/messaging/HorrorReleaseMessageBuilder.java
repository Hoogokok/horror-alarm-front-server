package org.alram.horroralarmbackend.messaging;

import java.util.List;
import org.alram.horroralarmbackend.upcoming.UpcomingMovieDTO;
import org.springframework.stereotype.Service;

@Service
public class HorrorReleaseMessageBuilder {

    public MessageDTO buildMessage(String topic, List<UpcomingMovieDTO> upcomingMovies) {
        StringBuilder messageBuilder = new StringBuilder("개봉하는 공포영화 목록입니다.\n");
        upcomingMovies.forEach(upcomingMovie -> {
            messageBuilder.append(upcomingMovie.title())
                .append(" : ")
                .append(upcomingMovie.releaseDate())
                .append("\n");
        });
        return new MessageDTO("개봉하는 공포영화 목록", messageBuilder.toString(),topic);
    }
}
